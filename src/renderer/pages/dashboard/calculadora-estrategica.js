// Calculadora Estratégica de Ganhos - Universe da Empada
// Adaptada para estratégia de entregas vs fixo

class CalculadoraEstrategica {
  constructor() {
    this.init();
  }

  init() {
    const btn = document.getElementById('abrir-calculadora');
    if (btn) {
      btn.addEventListener('click', () => this.openModal());
    }
    const closeBtns = document.querySelectorAll('.close-modal, .fechar-calculadora');
    closeBtns.forEach(btn => btn.addEventListener('click', () => this.closeModal()));
    const calcBtn = document.getElementById('calcular');
    if (calcBtn) {
      calcBtn.addEventListener('click', () => this.calcular());
    }
    const resetBtn = document.getElementById('resetar');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetar());
    }
    document.getElementById('modal-calculadora').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeModal();
    });
  }

  openModal() {
    document.getElementById('modal-calculadora').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    document.getElementById('modal-calculadora').style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  calcular() {
    const entregas = parseInt(document.getElementById('entregas').value) || 0;
    const diasSemana = parseInt(document.getElementById('dias-semana').value) || 4;
    const custoComida = parseFloat(document.getElementById('custo-comida').value) || 15;
    const divida = parseFloat(document.getElementById('divida-meta').value) || 0;

    // Opção 1: R$60 fixo + comida (~R$80-90 valor real)
    const opt1Noite = 85; // Média real

    // Opção 2: R$90 fixo + R$1/entrega - comida
    const opt2Noite = 90 + (entregas * 1) - custoComida;

    // Projeções
    const opt1Semana = opt1Noite * diasSemana;
    const opt2Semana = opt2Noite * diasSemana;
    const opt1Mes = opt1Semana * 4;
    const opt2Mes = opt2Semana * 4;

    const diasDividaOpt1 = divida > 0 ? Math.ceil(divida / opt1Semana * 7) : 0;
    const diasDividaOpt2 = divida > 0 ? Math.ceil(divida / opt2Semana * 7) : 0;

    // Recomendação
    const diffSemana = opt2Semana - opt1Semana;
    const melhor = opt2Semana > opt1Semana ? '🛵 R$90 + entregas (leve comida de casa!)' : '🍔 R$60 + comida';
    const dica = opt2Noite > opt1Noite ? '💥 Escala com esforço!' : '😌 Mais leve.';

    // Atualizar tabela
    document.getElementById('opt1-noite').textContent = `R$ ${opt1Noite.toFixed(0)}`;
    document.getElementById('opt2-noite').textContent = `R$ ${opt2Noite.toFixed(0)}`;
    document.getElementById('opt1-semana').textContent = `R$ ${opt1Semana.toFixed(0)}`;
    document.getElementById('opt2-semana').textContent = `R$ ${opt2Semana.toFixed(0)}`;
    document.getElementById('opt1-mes').textContent = `R$ ${opt1Mes.toFixed(0)}`;
    document.getElementById('opt2-mes').textContent = `R$ ${opt2Mes.toFixed(0)}`;

    document.getElementById('dias-divida-opt1').textContent = `${diasDividaOpt1} dias`;
    document.getElementById('dias-divida-opt2').textContent = `${diasDividaOpt2} dias`;

    document.getElementById('recomendacao').innerHTML = `<strong>${melhor}</strong><br><small>${dica}<br>+R$ ${diffSemana.toFixed(0)}/semana de diferença</small>`;

    // Gráfico simples
    this.renderChart(opt1Semana, opt2Semana);

    // Mostrar resultados
    document.getElementById('resultados').style.display = 'block';
  }

  resetar() {
    document.getElementById('calculadora-form').reset();
    document.getElementById('resultados').style.display = 'none';
  }

  renderChart(opt1Semana, opt2Semana) {
    const canvas = document.getElementById('grafico-comparacao');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxValue = Math.max(opt1Semana, opt2Semana) * 1.1;
    const barWidth = 120;
    const barHeight = (opt1Semana / maxValue) * 200;
    const barHeight2 = (opt2Semana / maxValue) * 200;

    // Opt1
    ctx.fillStyle = '#ed8936';
    ctx.fillRect(20, 300 - barHeight, barWidth, barHeight);
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`R$ ${opt1Semana.toFixed(0)}`, 80, 290);

    // Opt2
    ctx.fillStyle = '#48bb78';
    ctx.fillRect(170, 300 - barHeight2, barWidth, barHeight2);
    ctx.fillStyle = '#333';
    ctx.fillText(`R$ ${opt2Semana.toFixed(0)}`, 230, 290);
  }
}

// Inicializar quando DOM carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CalculadoraEstrategica());
} else {
  new CalculadoraEstrategica();
}

