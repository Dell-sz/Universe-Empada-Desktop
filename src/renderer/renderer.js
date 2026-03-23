// Função para carregar dados do dashboard
async function loadDashboard() {
    try {
        // Buscar produtos
        const produtos = await window.electronAPI.api.get('/api/produtos');
        document.getElementById('total-produtos').textContent = produtos.length;
        
        // Buscar produtos com estoque baixo
        const lowStock = await window.electronAPI.api.get('/api/produtos/low-stock');
        document.getElementById('estoque-baixo').textContent = lowStock.length;
        
        // Aqui você pode adicionar mais chamadas para produção e vendas
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        alert('Erro ao carregar dados do dashboard');
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    
    // Navegação
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('href').substring(1);
            
            // Atualizar título
            document.getElementById('page-title').textContent = 
                page.charAt(0).toUpperCase() + page.slice(1);
            
            // Marcar link como ativo
            document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            // Aqui você carregaria o conteúdo da página
            console.log(`Navegando para: ${page}`);
        });
    });
});

// Exemplo de funções
async function loadProdutos() {
    try {
        const produtos = await window.electronAPI.api.get('/api/produtos');
        console.log('Produtos:', produtos);
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function registrarProducao() {
    try {
        const novaProducao = {
            produto_id: 1,
            quantidade: 100,
            funcionario: 'João Silva',
            data_producao: '2024-01-15'
        };
        const result = await window.electronAPI.api.post('/api/producao', novaProducao);
        console.log('Produção registrada:', result);
    } catch (error) {
        console.error('Erro:', error);
    }
}

