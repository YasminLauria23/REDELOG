/**
 * REDELOG - Navigation Module
 * Gerencia menu mobile, dropdowns e acessibilidade por teclado
 */

(function () {
  'use strict';

  function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const mobileSubmenuToggles = document.querySelectorAll('.mobile-submenu-toggle');
    const desktopDropdowns = document.querySelectorAll('.desktop-nav .has-dropdown');

    // 1. Abrir Menu Mobile
    if (mobileMenuBtn && mobileNavDrawer) {
      mobileMenuBtn.addEventListener('click', function () {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        mobileNavDrawer.classList.toggle('is-open');
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
      });

      // Fechar Menu Mobile
      if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', closeMobileNav);
      }

      // Fechar ao clicar no backdrop escuro
      mobileNavDrawer.addEventListener('click', function (e) {
        if (e.target === mobileNavDrawer) {
          closeMobileNav();
        }
      });
    }

    function closeMobileNav() {
      if (!mobileNavDrawer) return;
      mobileNavDrawer.classList.remove('is-open');
      if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }

    // 2. Acordeão de Submenus no Mobile
    mobileSubmenuToggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        const parentItem = toggle.closest('.mobile-nav-item');
        if (parentItem) {
          const isOpen = parentItem.classList.contains('open');
          parentItem.classList.toggle('open');
          toggle.setAttribute('aria-expanded', !isOpen);
        }
      });
    });

    // 3. Acessibilidade por Teclado no Desktop
    desktopDropdowns.forEach(function (item) {
      const trigger = item.querySelector('.nav-link');
      const menu = item.querySelector('.dropdown-menu');

      if (!trigger || !menu) return;

      // Abrir ao focar
      trigger.addEventListener('focus', function () {
        item.classList.add('dropdown-open');
        trigger.setAttribute('aria-expanded', 'true');
      });

      // Fechar quando perder o foco de todo o item e dropdown
      item.addEventListener('focusout', function (e) {
        if (!item.contains(e.relatedTarget)) {
          item.classList.remove('dropdown-open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Fechar com tecla Escape
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          item.classList.remove('dropdown-open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });
    });

    // Fechar menu mobile com tecla Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
        closeMobileNav();
      }
    });

    // Fechar gaveta ao redimensionar para desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 991 && mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
        closeMobileNav();
      }
    });
  }

  // Auto inicialização se o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }

  window.RedelogNav = { init: initNavigation };
})();
