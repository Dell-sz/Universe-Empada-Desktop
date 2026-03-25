const authModel = require('../models/auth.model');

class AuthController {
    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const ip = req.ip || req.connection.remoteAddress;
            const userAgent = req.headers['user-agent'];
            
            if (!email || !senha) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }
            
            const result = await authModel.login(email, senha, ip, userAgent);
            
            if (!result.success) {
                return res.status(401).json({ error: result.error });
            }
            
            res.json(result);
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    
    async logout(req, res) {
        try {
            await authModel.logout(req.token, req.usuario.id, 'logout');
            res.json({ success: true, message: 'Logout realizado com sucesso' });
        } catch (error) {
            console.error('Erro no logout:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    
    async me(req, res) {
        res.json({ usuario: req.usuario });
    }
    
    async verificarPermissao(req, res) {
        try {
            const { recurso, acao } = req.params;
            const temPermissao = await authModel.verificarPermissao(req.usuario.id, recurso, acao);
            res.json({ temPermissao });
        } catch (error) {
            console.error('Erro ao verificar permissão:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new AuthController();

