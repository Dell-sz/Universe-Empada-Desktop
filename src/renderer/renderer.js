// API Helper
const api = window.electronAPI.api;

// Estado da aplicação
let currentPage = 'dashboard';
let charts = {};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    loadPage('dashboard');
});

// Navegação
function setupNavigation() {
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const page = link.getAttribute('href').substring(1);
            
            // Atualizar UI
            document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            // Carregar página
            await loadPage(page);
        });
    });
}

// Carregar página
async function loadPage(page) {
    currentPage = page;
    const pageTitle = page.charAt(0).toUpperCase() + page.slice(1);
    document.getElementById('page-title').textContent = pageTitle;
    
    const contentDiv = document.getElementById('page-content');
    contentDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando...</p></div>';
    
    try {
        switch(page) {
            case 'dashboard':
                await renderDashboard(contentDiv);
                break;
            case 'produtos':
                await renderProdutos(contentDiv);
                break;
            case 'producao':
                await renderProducao(contentDiv);
                break;
            case 'vendas':
                await renderVendas(contentDiv);
                break;
            case 'estoque':
                await renderEstoque(contentDiv);
                break;
            case 'relatorios':
                await renderRelatorios(contentDiv);
                break;
            default:
                await renderDashboard(contentDiv);
        }
    } catch (error) {
        console.error('Erro ao carregar página:', error);
        contentDiv.innerHTML = '<div class="alert alert-danger">Erro ao carregar página. Tente novamente.</div>';
    }
}

// Dashboard
async function renderDashboard(container) {
    // Buscar dados
    const [produtos, lowStock, producaoHoje, vendasHoje] = await Promise.all([
        api.get('/api/produtos'),
        api.get('/api/produtos/low-stock'),
        api.get('/api/producao/today'),
        api.get('/api/vendas/today')
    ]);
    
    const html = `
        <div class="dashboard-cards">
            <div class="card">
                <div class="card-icon">📦</div>
                <h3>Total de Produtos</h3>
                <div class="card-value">${produtos.length}</div>
            </div>
            <div class="card">
                <div class="card-icon">⚠️</div>
                <h3>Estoque Baixo</h3>
                <div class="card-value ${lowStock.length > 0 ? 'small' : ''}">
                    ${lowStock.length > 0 ? lowStock.map(p => p.nome).join(', ') : 'Nenhum'}
                </div>
            </div>
            <div class="card">
                <div class="card-icon">🏭</div>
                <h3>Produção Hoje</h3>
                <div class="card-value">${producaoHoje.total || 0} unidades</div>
            </div>
            <div class="card">
                <div class="card-icon">💰</div>
                <h3>Vendas Hoje</h3>
                <div class="card-value">R$ ${(vendasHoje.total || 0).toFixed(2)}</div>
            </div>
        </div>
        
        <div class="quick-actions">
            <button class="btn btn-primary" onclick="showProduçãoModal()">+ Registrar Produção</button>
            <button class="btn btn-success" onclick="showVendaModal()">+ Registrar Venda</button>
        </div>
        
        <div class="charts-container">
            <div class="chart-card">
                <h3>Produção vs Vendas (Últimos 7 dias)</h3>
                <canvas id="chart-producao-vendas"></canvas>
            </div>
            <div class="chart-card">
                <h3>Produtos Mais Vendidos</h3>
                <canvas id="chart-mais-vendidos"></canvas>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Carregar gráficos
    await loadCharts();
}

// Produtos
async function renderProdutos(container) {
    const produtos = await api.get('/api/produtos');
    
    const html = `
        <div style="margin-bottom: 20px;">
            <button class="btn btn-primary" onclick="showProdutoModal()">+ Novo Produto</button>
        </div>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Estoque Mínimo</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${produtos.map(p => `
                    <tr>
                        <td>${p.id}</td>
                        <td>${p.nome}</td>
                        <td>${p.categoria}</td>
                        <td>R$ ${parseFloat(p.preco_venda).toFixed(2)}</td>
                        <td>${p.estoque_minimo}</td>
                        <td>
                            <button class="btn-small" onclick="editarProduto(${p.id})">✏️</button>
                            <button class="btn-small btn-danger" onclick="excluirProduto(${p.id})">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// Produção
async function renderProducao(container) {
    const [produtos, producao] = await Promise.all([
        api.get('/api/produtos'),
        api.get('/api/producao?days=7')
    ]);
    
    const html = `
        <div style="margin-bottom: 20px;">
            <button class="btn btn-primary" onclick="showProduçãoModal()">+ Registrar Produção</button>
        </div>
        
        <div class="chart-card" style="margin-bottom: 20px;">
            <h3>Produção Últimos 7 Dias</h3>
            <canvas id="chart-producao-semana"></canvas>
        </div>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Funcionário</th>
                    <th>Observações</th>
                </tr>
            </thead>
            <tbody>
                ${producao.map(p => `
                    <tr>
                        <td>${new Date(p.data_producao).toLocaleDateString()}</td>
                        <td>${p.produto_nome}</td>
                        <td>${p.quantidade}</td>
                        <td>${p.funcionario}</td>
                        <td>${p.observacoes || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
    
    // Carregar gráfico
    loadProducaoChart();
}

// Vendas
async function renderVendas(container) {
    const vendas = await api.get('/api/vendas?days=7');
    
    const html = `
        <div style="margin-bottom: 20px;">
            <button class="btn btn-success" onclick="showVendaModal()">+ Registrar Venda</button>
        </div>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Valor Total</th>
                    <th>Forma de Pagamento</th>
                    <th>Itens</th>
                </tr>
            </thead>
            <tbody>
                ${vendas.map(v => `
                    <tr>
                        <td>${new Date(v.data_venda).toLocaleString()}</td>
                        <td>R$ ${parseFloat(v.valor_total).toFixed(2)}</td>
                        <td>${v.forma_pagamento}</td>
                        <td>${v.itens || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// Estoque
async function renderEstoque(container) {
    const [produtos, lowStock] = await Promise.all([
        api.get('/api/produtos'),
        api.get('/api/produtos/low-stock')
    ]);
    
    // Calcular estoque atual (simplificado)
    const estoque = await Promise.all(produtos.map(async p => {
        const producao = await api.get(`/api/producao/produto/${p.id}`);
        const vendas = await api.get(`/api/vendas/produto/${p.id}`);
        const perdas = await api.get(`/api/perdas/produto/${p.id}`);
        
        const totalProducao = producao.reduce((sum, item) => sum + item.quantidade, 0);
        const totalVendas = vendas.reduce((sum, item) => sum + item.quantidade, 0);
        const totalPerdas = perdas.reduce((sum, item) => sum + item.quantidade, 0);
        
        const estoqueAtual = totalProducao - totalVendas - totalPerdas;
        
        return {
            ...p,
            estoque_atual: estoqueAtual,
            status: estoqueAtual < p.estoque_minimo ? 'Baixo' : 'Normal'
        };
    }));
    
    const html = `
        ${lowStock.length > 0 ? `
            <div class="alert alert-warning">
                ⚠️ Atenção! ${lowStock.length} produto(s) com estoque baixo:
                ${lowStock.map(p => p.nome).join(', ')}
            </div>
        ` : ''}
        
        <div style="margin-bottom: 20px;">
            <button class="btn btn-warning" onclick="showPerdaModal()">+ Registrar Perda</button>
        </div>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Estoque Atual</th>
                    <th>Estoque Mínimo</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${estoque.map(e => `
                    <tr style="${e.status === 'Baixo' ? 'background: #fff5f5' : ''}">
                        <td>${e.nome}</td>
                        <td><strong>${e.estoque_atual}</strong></td>
                        <td>${e.estoque_minimo}</td>
                        <td>
                            <span class="status-badge status-${e.status === 'Baixo' ? 'danger' : 'success'}">
                                ${e.status}
                            </span>
                        </td>
                        <td>
                            <button onclick="registrarPerda(${e.id})">Registrar Perda</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// Relatórios
async function renderRelatorios(container) {
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    const [relatorioDiario, relatorioMensal] = await Promise.all([
        api.get(`/api/relatorios/diario?data=${hoje.toISOString().split('T')[0]}`),
        api.get(`/api/relatorios/mensal?data=${primeiroDiaMes.toISOString().split('T')[0]}`)
    ]);
    
    const html = `
        <div class="form-container" style="margin-bottom: 30px;">
            <h3>Gerar Relatório Personalizado</h3>
            <div class="form-group">
                <label>Data Início</label>
                <input type="date" id="relatorio-inicio">
            </div>
            <div class="form-group">
                <label>Data Fim</label>
                <input type="date" id="relatorio-fim">
            </div>
            <button class="btn btn-primary" onclick="gerarRelatorio()">Gerar Relatório</button>
            <button class="btn btn-success" onclick="exportarRelatorio()">Exportar PDF</button>
        </div>
        
        <div class="chart-card">
            <h3>Relatório Diário - ${hoje.toLocaleDateString()}</h3>
            <p><strong>Total Produção:</strong> ${relatorioDiario.total_producao || 0} unidades</p>
            <p><strong>Total Vendas:</strong> R$ ${(relatorioDiario.total_vendas || 0).toFixed(2)}</p>
            <p><strong>Total Perdas:</strong> ${relatorioDiario.total_perdas || 0} unidades</p>
        </div>
        
        <div class="chart-card">
            <h3>Relatório Mensal - ${hoje.toLocaleString('pt-BR', { month: 'long' })}</h3>
            <p><strong>Total Produção:</strong> ${relatorioMensal.total_producao || 0} unidades</p>
            <p><strong>Total Vendas:</strong> R$ ${(relatorioMensal.total_vendas || 0).toFixed(2)}</p>
            <p><strong>Total Perdas:</strong> ${relatorioMensal.total_perdas || 0} unidades</p>
            <p><strong>Lucro Estimado:</strong> R$ ${((relatorioMensal.total_vendas || 0) - (relatorioMensal.custo_producao || 0)).toFixed(2)}</p>
        </div>
        
        <div class="chart-card">
            <h3>Produtos Mais Vendidos no Mês</h3>
            <canvas id="chart-top-produtos"></canvas>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Carregar gráfico
    loadTopProdutosChart();
}

// Gráficos
async function loadCharts() {
    // Carregar Chart.js se não estiver carregado
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => createCharts();
        document.head.appendChild(script);
    } else {
        createCharts();
    }
}

async function createCharts() {
    const dados = await api.get('/api/relatorios/producao-vendas-semana');
    
    const ctx1 = document.getElementById('chart-producao-vendas');
    if (ctx1) {
        charts.producaoVendas = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: dados.map(d => d.dia),
                datasets: [
                    {
                        label: 'Produção',
                        data: dados.map(d => d.producao),
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Vendas',
                        data: dados.map(d => d.vendas),
                        borderColor: '#48bb78',
                        backgroundColor: 'rgba(72, 187, 120, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
    
    const ctx2 = document.getElementById('chart-mais-vendidos');
    if (ctx2) {
        const topProdutos = await api.get('/api/relatorios/produtos-mais-vendidos');
        charts.maisVendidos = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: topProdutos.map(p => p.nome),
                datasets: [{
                    label: 'Quantidade Vendida',
                    data: topProdutos.map(p => p.quantidade),
                    backgroundColor: '#667eea'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
}

// Modals e ações
window.showProdutoModal = () => {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Novo Produto</h3>
                <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Nome do Produto</label>
                    <input type="text" id="produto-nome" placeholder="Ex: Coxinha de Frango">
                </div>
                <div class="form-group">
                    <label>Categoria</label>
                    <select id="produto-categoria">
                        <option value="frito">Frito</option>
                        <option value="assado">Assado</option>
                        <option value="empada">Empada</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Preço de Venda (R$)</label>
                    <input type="number" step="0.01" id="produto-preco" placeholder="0,00">
                </div>
                <div class="form-group">
                    <label>Estoque Mínimo</label>
                    <input type="number" id="produto-estoque-min" value="5">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn" onclick="this.closest('.modal').remove()">Cancelar</button>
                <button class="btn btn-primary" onclick="salvarProduto()">Salvar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

window.salvarProduto = async () => {
    const produto = {
        nome: document.getElementById('produto-nome').value,
        categoria: document.getElementById('produto-categoria').value,
        preco_venda: parseFloat(document.getElementById('produto-preco').value),
        estoque_minimo: parseInt(document.getElementById('produto-estoque-min').value)
    };
    
    try {
        await api.post('/api/produtos', produto);
        alert('Produto cadastrado com sucesso!');
        document.querySelector('.modal').remove();
        loadPage(currentPage);
    } catch (error) {
        alert('Erro ao cadastrar produto: ' + error.message);
    }
};

window.showProduçãoModal = () => {
    // Implementar modal de produção
    alert('Funcionalidade em desenvolvimento');
};

window.showVendaModal = () => {
    // Implementar modal de venda
    alert('Funcionalidade em desenvolvimento');
};

window.showPerdaModal = () => {
    // Implementar modal de perda
    alert('Funcionalidade em desenvolvimento');
};

window.editarProduto = async (id) => {
    const produto = await api.get(`/api/produtos/${id}`);
    // Implementar edição
    alert('Edição em desenvolvimento');
};

window.excluirProduto = async (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        await api.delete(`/api/produtos/${id}`);
        alert('Produto excluído com sucesso!');
        loadPage(currentPage);
    }
};

window.gerarRelatorio = () => {
    alert('Funcionalidade em desenvolvimento');
};

window.exportarRelatorio = () => {
    alert('Funcionalidade em desenvolvimento');
};

// Funções auxiliares
function loadProducaoChart() {
    // Implementar gráfico de produção
}

function loadTopProdutosChart() {
    // Implementar gráfico de top produtos
}

