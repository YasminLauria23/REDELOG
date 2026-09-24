/**
 * REDELOG - Main Entrypoint
 * Inicialização global e utilitários
 */

(function () {
  'use strict';

  function initApp() {
    // 1. Atualiza ano corrente no rodapé
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Garante rel="noopener noreferrer" em links externos
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(function (link) {
      if (!link.getAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // 3. Marcação do item ativo de navegação com base na URL
    highlightActiveNavLink();
  }

  function highlightActiveNavLink() {
    const currentPath = window.location.pathname.replace(/\/$/, "");
    const navLinks = document.querySelectorAll('.desktop-nav .dropdown-item, .desktop-nav .nav-link:not(.dropdown-toggle)');

    navLinks.forEach(function (link) {
      const linkPath = link.getAttribute('href');
      if (linkPath && currentPath.endsWith(linkPath.replace(/\/$/, ""))) {
        link.classList.add('active');
        const parentNavItem = link.closest('.nav-item');
        if (parentNavItem) {
          parentNavItem.classList.add('active');
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
