const { pool } = require('./database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class AuthModel {
    // Gerar token
    gerarToken() {
        return crypto.randomBytes(64).toString('hex');
    }
    
    // Login
    async login(email, senha, ip, userAgent) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Buscar usuário
            const [users] = await connection.query(
                'SELECT * FROM usuarios WHERE email = ? AND ativo = true',
                [email]
            );
            
            if (users.length === 0) {
                await this.registrarLogAcesso(null, email, ip, userAgent, 'falha', 'Usuário não encontrado');
                return { success: false, error: 'Usuário não encontrado' };
            }
            
            const usuario = users[0];
            
            // Verificar senha
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                await this.registrarLogAcesso(usuario.id, email, ip, userAgent, 'falha', 'Senha incorreta');
                return { success: false, error: 'Senha incorreta' };
            }
            
            // Gerar token
            const token = this.gerarToken();
            const dataExpiracao = new Date();
            dataExpiracao.setHours(dataExpiracao.getHours() + 8); // 8 horas
            
            // Salvar sessão
            await connection.query(
                `INSERT INTO sessoes_ativas (usuario_id, token, ip_address, user_agent, data_login, data_expiracao)
                 VALUES (?, ?, ?, ?, NOW(), ?)`,
                [usuario.id, token, ip, userAgent, dataExpiracao]
            );
            
            // Atualizar último acesso
            await connection.query(
                'UPDATE usuarios SET ultimo_acesso = NOW() WHERE id = ?',
                [usuario.id]
            );
            
            // Buscar permissões do usuário
            const permissoes = await this.getPermissoesUsuario(usuario.id, connection);
            
            await this.registrarLogAcesso(usuario.id, email, ip, userAgent, 'sucesso', 'Login realizado');
            
            await connection.commit();
            
            return {
                success: true,
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    permissoes
                },
                expira_em: dataExpiracao
            };
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    
    // Buscar permissões do usuário
    async getPermissoesUsuario(usuarioId, connection = pool) {
        const [rows] = await connection.query(`
            SELECT DISTINCT p.recurso, p.acao, p.nome
            FROM usuarios u
            JOIN usuarios_roles ur ON u.id = ur.usuario_id
            JOIN roles_permissoes rp ON ur.role_id = rp.role_id
            JOIN permissoes p ON rp.permissao_id = p.id
            WHERE u.id = ?
        `, [usuarioId]);
        
        // Agrupar por recurso
        const permissoes = {};
        rows.forEach(row => {
            if (!permissoes[row.recurso]) {
                permissoes[row.recurso] = [];
            }
            permissoes[row.recurso].push(row.acao);
        });
        
        return permissoes;
    }
    
    // Validar token
    async validarToken(token, ip, userAgent) {
        // Verificar blacklist
        const [revogados] = await pool.query(
            'SELECT COUNT(*) as revogado FROM tokens_revogados WHERE token = ?',
            [token]
        );
        
        if (revogados[0].revogado > 0) {
            return { valid: false, error: 'Token revogado' };
        }
        
        // Verificar sessão ativa
        const [sessoes] = await pool.query(`
            SELECT s.*, u.nome, u.email 
            FROM sessoes_ativas s
            JOIN usuarios u ON s.usuario_id = u.id
            WHERE s.token = ? AND s.data_expiracao > NOW()
        `, [token]);
        
        if (sessoes.length === 0) {
            return { valid: false, error: 'Sessão expirada ou inválida' };
        }
        
        const sessao = sessoes[0];
        
        // Buscar permissões
        const permissoes = await this.getPermissoesUsuario(sessao.usuario_id);
        
        return {
            valid: true,
            usuario: {
                id: sessao.usuario_id,
                nome: sessao.nome,
                email: sessao.email,
                permissoes
            }
        };
    }
    
    // Logout
    async logout(token, usuarioId, motivo = 'logout') {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Mover para blacklist
            await connection.query(
                `INSERT INTO tokens_revogados (token, usuario_id, motivo, data_revogacao)
                 VALUES (?, ?, ?, NOW())`,
                [token, usuarioId, motivo]
            );
            
            // Remover da whitelist
            await connection.query(
                'DELETE FROM sessoes_ativas WHERE token = ?',
                [token]
            );
            
            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    
    // Verificar permissão
    async verificarPermissao(usuarioId, recurso, acao) {
        const [rows] = await pool.query(`
            SELECT COUNT(*) as tem_permissao
            FROM usuarios u
            JOIN usuarios_roles ur ON u.id = ur.usuario_id
            JOIN roles_permissoes rp ON ur.role_id = rp.role_id
            JOIN permissoes p ON rp.permissao_id = p.id
            WHERE u.id = ? AND p.recurso = ? AND p.acao = ?
        `, [usuarioId, recurso, acao]);
        
        return rows[0].tem_permissao > 0;
    }
    
    // Registrar log de acesso
    async registrarLogAcesso(usuarioId, email, ip, userAgent, status, motivo) {
        await pool.query(
            `INSERT INTO logs_acesso (usuario_id, email, ip_address, user_agent, status, motivo)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [usuarioId, email, ip, userAgent, status, motivo]
        );
    }
    
    // Middleware de autenticação
    async authenticate(req, res, next) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }
        
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        
        const result = await this.validarToken(token, ip, userAgent);
        
        if (!result.valid) {
            return res.status(401).json({ error: result.error });
        }
        
        req.usuario = result.usuario;
        req.token = token;
        next();
    }
    
    // Middleware de autorização
    authorize(recurso, acao) {
        return async (req, res, next) => {
            if (!req.usuario) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }
            
            const temPermissao = await this.verificarPermissao(req.usuario.id, recurso, acao);
            
            if (!temPermissao) {
                await this.registrarLogAcesso(
                    req.usuario.id,
                    req.usuario.email,
                    req.ip,
                    req.headers['user-agent'],
                    'bloqueado',
                    `Tentativa de acesso sem permissão: ${recurso}/${acao}`
                );
                return res.status(403).json({ error: 'Acesso negado' });
            }
            
            next();
        };
    }
}

module.exports = new AuthModel();

