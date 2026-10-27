(() => {
  'use strict';
  // O conteúdo interativo de detalhes usa apenas HTML nativo para funcionar sem dependências.
  document.querySelectorAll('.lab-card details').forEach(details => {
    details.addEventListener('toggle', () => {
      const summary = details.querySelector('summary');
      if (summary) summary.setAttribute('aria-expanded', String(details.open));
    });
  });
})();
