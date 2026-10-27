(() => {
  'use strict';
  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    }));
  }

  // Project cards: reveal a short summary on hover/focus and allow tap-to-expand on touch screens.
  document.querySelectorAll('.project-details-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.project-card');
      if (!card) return;
      const expanded = card.classList.toggle('is-expanded');
      button.setAttribute('aria-expanded', String(expanded));
      const label = button.querySelector('.project-details-toggle-label');
      const icon = button.querySelector('.project-details-toggle-icon');
      if (label) label.textContent = expanded ? 'Ocultar resumo' : 'Ver resumo do projeto';
      if (icon) icon.textContent = expanded ? 'expand_less' : 'expand_more';
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Easter egg da área Cybersecurity: os controles só mostram o glitch.
  // Para abrir a área técnica, o visitante precisa digitar o caminho na URL.
  let cyberGlitchActive = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function runCybersecurityGlitch() {
    if (cyberGlitchActive) return;
    cyberGlitchActive = true;

    const overlay = document.createElement('div');
    overlay.className = 'cyber-glitch-transition';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.setAttribute('aria-label', 'Efeito visual: sinal interrompido');
    overlay.innerHTML = `
      <div class="glitch-scanlines" aria-hidden="true"></div>
      <div class="glitch-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="glitch-terminal" aria-hidden="true">
        <span class="glitch-terminal-kicker">ACCESS LAYER // 02</span>
        <strong data-glitch-text="SINAL INTERROMPIDO">SINAL INTERROMPIDO</strong>
        <span class="glitch-terminal-status"><i></i> ROTA MANUAL NECESSÁRIA</span>
      </div>`;
    document.body.appendChild(overlay);
    document.documentElement.classList.add('cyber-transition-active');
    document.body.classList.add('cyber-transition-active');

    // O efeito termina sozinho; nunca altera a URL nem abre a área técnica.
    window.setTimeout(() => {
      overlay.remove();
      document.documentElement.classList.remove('cyber-transition-active');
      document.body.classList.remove('cyber-transition-active');
      cyberGlitchActive = false;
    }, reducedMotion ? 220 : 540);
  }

  // Todos os controles marcados fazem apenas o glitch, inclusive Ctrl/Cmd-click.
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-cyber-glitch]');
    if (!trigger) return;
    event.preventDefault();
    runCybersecurityGlitch();
  });

})();
