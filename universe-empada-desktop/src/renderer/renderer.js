// Router de páginas
const pages = {
  dashboard: 'pages/dashboard/index.html',
  produtos: 'pages/produtos/index.html',
  producao: 'pages/producao/index.html',
  vendas: 'pages/vendas/index.html',
  estoque: 'pages/estoque/index.html',
  relatorios: 'pages/relatorios/index.html'
};

document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();
  checkBackendStatus();
  loadDashboardData();
});

function initNavigation() {
  document.querySelectorAll('.menu li').forEach(li => {
    li.addEventListener('click', () => {
      switchPage(li.dataset.page);
    });
  });
}

async function switchPage(pageName) {
  // Update active menu item
  document.querySelector('.menu li.active')?.classList.remove('active');
  document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

  document.getElementById('page-title').textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  try {
    const response = await fetch(`/api/${pageName}`);
    const data = await response.json();
    renderPage(pageName, data);
  } catch (error) {
    showError('Erro ao carregar página');
  }
}

function renderPage(pageName, data) {
  const content = document.getElementById('page-content');
  content.innerHTML = `
    <iframe src="pages/${pageName}/index.html" 
            style="width:100%; height:100%; border:none;" 
            onload="this.contentWindow.postMessage({data}, '*')">
    </iframe>
  `;
}

async function checkBackendStatus() {
  try {
    const status = await window.electronAPI.backendStatus();
    const dot = document.getElementById('status-dot');
    const button = document.getElementById('backend-status');

    if (status) {
      dot.className = 'status-dot online';
      button.title = 'Backend online';
    } else {
      dot.className = 'status-dot offline';
      button.title = 'Backend offline';
    }
  } catch {
    document.getElementById('status-dot').className = 'status-dot offline';
  }
}

async function loadDashboardData() {
  try {
    const response = await fetch('/api/dashboard');
    const data = await response.json();

    document.getElementById('vendas-hoje').textContent = data.vendasHoje || 0;
    document.getElementById('producao-hoje').textContent = data.producaoHoje || 0;
    document.getElementById('estoque-total').textContent = data.estoqueTotal || 0;
  } catch (error) {
    console.error('Erro dashboard:', error);
  }
}

function showError(message) {
  // Implementar toast notification
  console.error(message);
}

// Auto-refresh status every 5s
setInterval(checkBackendStatus, 5000);
