/**
 * REDELOG - Interactive Components Module
 * Gerencia Accordions, Tabs, Barra de Acessibilidade e Busca/Filtro
 */

(function () {
  'use strict';

  function initAccordions() {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger, button.accordion-header, .accordion-header button');

    accordionTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const item = trigger.closest('.accordion-item');
        if (!item) return;

        const isCurrentlyOpen = item.classList.contains('is-open');

        // Fecha outros itens se pertencer a um acordeão exclusivo
        const parentAccordion = item.closest('.accordion[data-exclusive="true"]');
        if (parentAccordion) {
          parentAccordion.querySelectorAll('.accordion-item').forEach(function (otherItem) {
            if (otherItem !== item) {
              otherItem.classList.remove('is-open');
              const otherTrigger = otherItem.querySelector('.accordion-trigger, button.accordion-header, .accordion-header button');
              if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            }
          });
        }

        // Alterna o estado atual
        item.classList.toggle('is-open', !isCurrentlyOpen);
        trigger.setAttribute('aria-expanded', !isCurrentlyOpen);
      });
    });
  }

  function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs-container');

    tabContainers.forEach(function (container) {
      const tabButtons = container.querySelectorAll('.tab-btn');
      const tabPanes = container.querySelectorAll('.tab-pane');

      tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const targetId = btn.getAttribute('data-tab');

          // Desativa todas
          tabButtons.forEach(function (b) { b.classList.remove('is-active'); });
          tabPanes.forEach(function (p) { p.classList.remove('is-active'); });

          // Ativa a selecionada
          btn.classList.add('is-active');
          const targetPane = container.querySelector('#' + targetId);
          if (targetPane) {
            targetPane.classList.add('is-active');
          }
        });
      });
    });
  }

  function initFilterSearch() {
    const searchInputs = document.querySelectorAll('[data-filter-input]');

    searchInputs.forEach(function (input) {
      const targetSelector = input.getAttribute('data-filter-target');
      const items = document.querySelectorAll(targetSelector);

      input.addEventListener('input', function () {
        const query = input.value.toLowerCase().trim();

        items.forEach(function (item) {
          const text = item.textContent.toLowerCase();
          if (text.includes(query)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  function initAccessibility() {
    const btnContrast = document.getElementById('toggle-contrast');
    const btnFontIncrease = document.getElementById('font-increase');
    const btnFontDecrease = document.getElementById('font-decrease');
    const btnFontReset = document.getElementById('font-reset');

    // Recupera preferências salvas
    const savedContrast = localStorage.getItem('redelog-contrast');
    const savedFontSize = localStorage.getItem('redelog-font-size');

    if (savedContrast === 'high') {
      document.documentElement.setAttribute('data-contrast', 'high');
    }

    if (savedFontSize) {
      document.documentElement.setAttribute('data-font-size', savedFontSize);
    }

    // Toggle Contraste
    if (btnContrast) {
      btnContrast.addEventListener('click', function () {
        const isHigh = document.documentElement.getAttribute('data-contrast') === 'high';
        if (isHigh) {
          document.documentElement.removeAttribute('data-contrast');
          localStorage.removeItem('redelog-contrast');
        } else {
          document.documentElement.setAttribute('data-contrast', 'high');
          localStorage.setItem('redelog-contrast', 'high');
        }
      });
    }

    // Aumentar Fonte
    if (btnFontIncrease) {
      btnFontIncrease.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-font-size');
        if (!current) {
          document.documentElement.setAttribute('data-font-size', 'large');
          localStorage.setItem('redelog-font-size', 'large');
        } else if (current === 'large') {
          document.documentElement.setAttribute('data-font-size', 'xlarge');
          localStorage.setItem('redelog-font-size', 'xlarge');
        }
      });
    }

    // Diminuir Fonte
    if (btnFontDecrease) {
      btnFontDecrease.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-font-size');
        if (current === 'xlarge') {
          document.documentElement.setAttribute('data-font-size', 'large');
          localStorage.setItem('redelog-font-size', 'large');
        } else if (current === 'large') {
          document.documentElement.removeAttribute('data-font-size');
          localStorage.removeItem('redelog-font-size');
        }
      });
    }

    // Redefinir Fonte
    if (btnFontReset) {
      btnFontReset.addEventListener('click', function () {
        document.documentElement.removeAttribute('data-font-size');
        localStorage.removeItem('redelog-font-size');
      });
    }
  }

  // ============================================================
  // CARROSSEL INSTITUCIONAL HERO (LADO ESQUERDO)
  // ============================================================
  function initHeroCarousel() {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayTimer = null;
    const autoplayDelay = 5000;

    function updateCarousel(index) {
      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === currentIndex);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      updateCarousel(currentIndex + 1);
    }

    function prevSlide() {
      updateCarousel(currentIndex - 1);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        nextSlide();
        resetAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        prevSlide();
        resetAutoplay();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(targetIndex)) {
          updateCarousel(targetIndex);
          resetAutoplay();
        }
      });
    });

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Suporte a swipe em telas touch
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        nextSlide();
      } else if (touchEndX - touchStartX > 40) {
        prevSlide();
      }
      startAutoplay();
    }, { passive: true });

    // Inicia autoplay
    startAutoplay();
  }

  function initStructureToggles() {
    const structureTriggers = document.querySelectorAll('.structure-trigger');
    structureTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const item = trigger.closest('.structure-item');
        if (!item) return;
        const isOpen = item.classList.contains('is-open');
        item.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen);
      });
    });

    const expandAllBtn = document.getElementById('expandAllStructure');
    const collapseAllBtn = document.getElementById('collapseAllStructure');

    if (expandAllBtn) {
      expandAllBtn.addEventListener('click', function () {
        document.querySelectorAll('.structure-item').forEach(function (item) {
          item.classList.add('is-open');
          const trigger = item.querySelector('.structure-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'true');
        });
      });
    }

    if (collapseAllBtn) {
      collapseAllBtn.addEventListener('click', function () {
        document.querySelectorAll('.structure-item').forEach(function (item) {
          item.classList.remove('is-open');
          const trigger = item.querySelector('.structure-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  function initComponents() {
    initAccordions();
    initTabs();
    initFilterSearch();
    initAccessibility();
    initHeroCarousel();
    initStructureToggles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents();
  }

  window.RedelogComponents = { init: initComponents };
})();
