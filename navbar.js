/**
 * OM & PRIYANKA — ROYAL INDIAN MINIATURE ART ATELIER
 * Master Interactive Controller
 * Exact Reference Match:
 * - Top curator bar currency switcher
 * - Dynamic "Art Forms" dropdown with live school previews & quotes
 * - Hero carousel slider (01, 02, 03, <, >)
 * - "Explore by Art Form" interactive card navigation
 * - Gallery filtering & full-screen lightbox inspection
 * - Collector Bag (Inquiry Cart) with currency conversion (INR, USD, EUR, GBP)
 * - Live search, commission, workshop & user profile modals
 */

(function () {
  'use strict';

  // --- Currency Conversion Matrix ---
  const CURRENCY_RATES = {
    INR: { symbol: '₹', rate: 1, label: 'INR' },
    USD: { symbol: '$', rate: 0.012, label: 'USD' },
    EUR: { symbol: '€', rate: 0.011, label: 'EUR' },
    GBP: { symbol: '£', rate: 0.0095, label: 'GBP' }
  };
  let currentCurrency = 'INR';

  // --- Collector Bag Items (Inquiry List) ---
  const collectorBag = [
    {
      id: 'art-01',
      title: 'Princess with Pink Lotus',
      school: 'Kishangarh & Mewar School',
      details: 'Hand-painted on antique Wasli with 24K pure Hilkari gold & emerald green pigments',
      priceINR: 195000,
      image: 'images/dropdown_art.jpg'
    },
    {
      id: 'art-02',
      title: 'The Court of Maharaja Ranjit Singh',
      school: 'Sikh Durbar Heritage',
      details: 'Monumental royal darbar with 24K Hilkari gold & natural mineral colors',
      priceINR: 320000,
      image: 'images/image7.jpeg'
    }
  ];

  // --- Art Forms Dropdown Preview Content Map ---
  const SCHOOL_PREVIEWS = {
    rajasthani: {
      img: 'images/dropdown_art.jpg',
      quote: '"Each style tells a different story, all rooted in India’s rich artistic heritage."'
    },
    mughal: {
      img: 'images/school_mughal.jpg',
      quote: '"Imperial durbar realism, single-hair squirrel brushwork, and 24K gold illumination."'
    },
    pahari: {
      img: 'images/school_pahari.jpg',
      quote: '"Radha-Krishna devotion, Kangra poetics, and gentle Himalayan monsoons."'
    },
    deccani: {
      img: 'images/school_deccani.jpg',
      quote: '"Opulent lapis lazuli skies, Persian synthesis, and Golconda royal splendor."'
    },
    sikh: {
      img: 'images/image7.jpeg',
      quote: '"The grand durbar of Maharaja Ranjit Singh, martial dignity and golden canopies."'
    },
    malwa: {
      img: 'images/image6.jpeg',
      quote: '"Archaic rhythmic vigor, deep mineral ochres, and sacred epic narratives."'
    },
    all: {
      img: 'images/dropdown_art.jpg',
      quote: '"Each style tells a different story, all rooted in India’s rich artistic heritage."'
    }
  };

  // --- Hero Slides Data (Featuring User Uploaded Images) ---
  const HERO_SLIDES = [
    {
      index: 1,
      kicker: 'MINIATURE ART',
      headline: 'Timeless<br>Masterpieces',
      summary: 'Explore the world of miniature art — a celebration of culture, detail and stories that live forever.',
      image: 'images/image7.jpeg'
    },
    {
      index: 2,
      kicker: 'ROYAL DURBAR HERITAGE',
      headline: 'The Grand<br>Royal Courts',
      summary: 'Centuries of regal legacy brought alive in single-hair squirrel brushwork and 24K pure gold illumination.',
      image: 'images/image4.jpeg'
    },
    {
      index: 3,
      kicker: 'SACRED DEVOTION & POETRY',
      headline: 'Lyrical Songs<br>of the Hills',
      summary: 'Pahari poetics, monsoon romance, and sacred epics hand-painted with patience on antique Wasli paper.',
      image: 'images/image6.jpeg'
    }
  ];
  let currentHeroSlide = 1;
  let heroInterval = null;

  function initApp() {
    initHeaderScroll();
    initCurrencySwitcher();
    initArtFormsDropdown();
    initHeroCarousel();
    initGalleryFilters();
    initLightbox();
    initCollectorDrawer();
    initSearchModal();
    initModals();
    initMobileNavigation();
    updatePrices();
  }

  // --- Sticky Header Scroll Effect ---
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header?.classList.add('is-scrolled');
      } else {
        header?.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  // --- Currency Conversion ---
  function initCurrencySwitcher() {
    const currencySelect = document.getElementById('currency-selector');
    if (currencySelect) {
      currencySelect.addEventListener('change', (e) => {
        currentCurrency = e.target.value;
        updatePrices();
      });
    }
  }

  function formatPrice(inrAmount) {
    const conf = CURRENCY_RATES[currentCurrency] || CURRENCY_RATES.INR;
    const converted = Math.round(inrAmount * conf.rate);
    return conf.symbol + ' ' + converted.toLocaleString();
  }

  function updatePrices() {
    document.querySelectorAll('[data-price-inr]').forEach((el) => {
      const inr = parseFloat(el.getAttribute('data-price-inr'));
      if (!isNaN(inr)) {
        el.textContent = formatPrice(inr);
      }
    });
    renderCollectorBag();
  }

  // --- "Art Forms" Dropdown Dynamic Previews ---
  function initArtFormsDropdown() {
    const links = document.querySelectorAll('.dropdown-school-link');
    const previewImg = document.getElementById('dropdown-preview-img');
    const previewQuote = document.getElementById('dropdown-preview-quote');

    links.forEach((link) => {
      const schoolKey = link.getAttribute('data-school');
      link.addEventListener('mouseenter', () => {
        links.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');

        if (SCHOOL_PREVIEWS[schoolKey] && previewImg && previewQuote) {
          previewImg.style.opacity = '0.4';
          previewQuote.style.opacity = '0.4';
          setTimeout(() => {
            previewImg.src = SCHOOL_PREVIEWS[schoolKey].img;
            previewQuote.textContent = SCHOOL_PREVIEWS[schoolKey].quote;
            previewImg.style.opacity = '1';
            previewQuote.style.opacity = '1';
          }, 150);
        }
      });
    });
  }

  // --- Hero Section Carousel (01, 02, 03, <, >) ---
  function initHeroCarousel() {
    const slideNumbers = document.querySelectorAll('.slide-num');
    const prevBtn = document.querySelector('.slide-arrow.prev');
    const nextBtn = document.querySelector('.slide-arrow.next');
    const heroSlides = document.querySelectorAll('.hero-slide');

    function goToSlide(targetIndex) {
      if (targetIndex < 1) targetIndex = HERO_SLIDES.length;
      if (targetIndex > HERO_SLIDES.length) targetIndex = 1;
      currentHeroSlide = targetIndex;

      heroSlides.forEach((slide) => {
        const idx = parseInt(slide.getAttribute('data-slide-index'), 10);
        if (idx === targetIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      slideNumbers.forEach((num) => {
        const target = parseInt(num.getAttribute('data-slide-target'), 10);
        if (target === targetIndex) {
          num.classList.add('active');
        } else {
          num.classList.remove('active');
        }
      });
    }

    slideNumbers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = parseInt(btn.getAttribute('data-slide-target'), 10);
        goToSlide(target);
        resetHeroAutoplay();
      });
    });

    prevBtn?.addEventListener('click', () => {
      goToSlide(currentHeroSlide - 1);
      resetHeroAutoplay();
    });

    nextBtn?.addEventListener('click', () => {
      goToSlide(currentHeroSlide + 1);
      resetHeroAutoplay();
    });

    function startHeroAutoplay() {
      heroInterval = setInterval(() => {
        goToSlide(currentHeroSlide + 1);
      }, 7000);
    }

    function resetHeroAutoplay() {
      if (heroInterval) clearInterval(heroInterval);
      startHeroAutoplay();
    }

    startHeroAutoplay();
  }

  // --- Curated Gallery Filtering ---
  function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const cards = document.querySelectorAll('.gallery-card');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        cards.forEach((card) => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = 'flex';
            setTimeout(() => (card.style.opacity = '1'), 50);
          } else {
            card.style.opacity = '0';
            setTimeout(() => (card.style.display = 'none'), 200);
          }
        });
      });
    });
  }

  // --- Lightbox Preview ---
  function initLightbox() {
    const lightbox = document.getElementById('artwork-lightbox');
    const lightboxImg = lightbox?.querySelector('img');
    const closeBtn = lightbox?.querySelector('.lightbox-close-btn');

    document.querySelectorAll('[data-full-image]').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const fullSrc = trigger.getAttribute('data-full-image');
        const altText = trigger.getAttribute('data-image-alt') || 'Indian Miniature Painting';
        if (lightbox && lightboxImg) {
          lightboxImg.src = fullSrc;
          lightboxImg.alt = altText;
          lightbox.showModal();
        }
      });
    });

    closeBtn?.addEventListener('click', () => lightbox?.close());
    lightbox?.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.close();
    });
  }

  // --- Collector Bag (Inquiry Cart) ---
  function initCollectorDrawer() {
    const bagTriggers = document.querySelectorAll('[data-action="toggle-bag"]');
    const bagBackdrop = document.getElementById('collector-drawer-backdrop');
    const closeBtn = document.getElementById('drawer-close-btn');

    bagTriggers.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        renderCollectorBag();
        bagBackdrop?.classList.add('is-open');
      });
    });

    closeBtn?.addEventListener('click', () => {
      bagBackdrop?.classList.remove('is-open');
    });

    bagBackdrop?.addEventListener('click', (e) => {
      if (e.target === bagBackdrop) {
        bagBackdrop.classList.remove('is-open');
      }
    });

    // Add to bag handlers
    document.querySelectorAll('[data-action="add-to-bag"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-art-id');
        const title = btn.getAttribute('data-art-title');
        const school = btn.getAttribute('data-art-school');
        const price = parseFloat(btn.getAttribute('data-art-price')) || 180000;
        const img = btn.getAttribute('data-art-img');

        // Check if exists
        const exists = collectorBag.some((item) => item.id === id);
        if (!exists) {
          collectorBag.push({
            id,
            title,
            school,
            priceINR: price,
            image: img
          });
        }
        renderCollectorBag();
        bagBackdrop?.classList.add('is-open');
      });
    });
  }

  function renderCollectorBag() {
    const listContainer = document.getElementById('drawer-items-list');
    const bagBadges = document.querySelectorAll('.bag-counter-badge');
    const totalEl = document.getElementById('drawer-subtotal-price');

    bagBadges.forEach((badge) => {
      badge.textContent = collectorBag.length;
    });

    if (!listContainer) return;

    if (collectorBag.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--ink-soft);">
          <div style="font-size: 2.2rem; color: var(--gold); margin-bottom: 0.5rem;">◈</div>
          <h4 style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--ink-rich);">Your Collector Bag is Empty</h4>
          <p style="font-size: 0.78rem; margin: 0.5rem 0 1.2rem;">Explore the six classical schools or request a bespoke commission.</p>
          <a href="#art-forms" class="btn-hero-explore" style="display: inline-flex;" onclick="document.getElementById('collector-drawer-backdrop').classList.remove('is-open')">Browse Art Forms</a>
        </div>
      `;
      if (totalEl) totalEl.textContent = formatPrice(0);
      return;
    }

    let subtotal = 0;
    let html = '';

    collectorBag.forEach((item, index) => {
      subtotal += item.priceINR;
      html += `
        <div class="inquiry-art-card">
          <div class="inquiry-art-thumb">
            <img src="${item.image}" alt="${item.title}">
          </div>
          <div class="inquiry-art-meta">
            <h4>${item.title}</h4>
            <p>${item.school}</p>
            <div class="inquiry-price">${formatPrice(item.priceINR)}</div>
          </div>
          <button type="button" aria-label="Remove item" data-remove-index="${index}" style="position: absolute; top: 8px; right: 8px; font-size: 1.2rem; color: var(--ink-muted); cursor: pointer;">&times;</button>
        </div>
      `;
    });

    listContainer.innerHTML = html;
    if (totalEl) totalEl.textContent = formatPrice(subtotal);

    listContainer.querySelectorAll('[data-remove-index]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-remove-index'), 10);
        collectorBag.splice(idx, 1);
        renderCollectorBag();
      });
    });
  }

  // --- Search Modal & Live Filtering ---
  function initSearchModal() {
    const searchTriggers = document.querySelectorAll('[data-action="open-search-modal"]');
    const searchModal = document.getElementById('search-modal-backdrop');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    const searchPills = document.querySelectorAll('.search-tag-pill');

    searchTriggers.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        searchModal?.classList.add('is-open');
        setTimeout(() => searchInput?.focus(), 100);
      });
    });

    searchPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const tag = pill.getAttribute('data-tag') || pill.textContent.trim();
        if (searchInput) {
          searchInput.value = tag;
          performLiveSearch(tag);
        }
      });
    });

    searchInput?.addEventListener('input', (e) => {
      performLiveSearch(e.target.value);
    });

    function performLiveSearch(term) {
      if (!resultsContainer) return;
      const q = term.toLowerCase().trim();

      if (!q) {
        resultsContainer.innerHTML = '';
        return;
      }

      const searchableArt = [
        { title: 'Princess with Pink Lotus (Kishangarh)', type: 'Original Painting', desc: 'Hand-painted Wasli with pure 24K Hilkari gold & emerald green pigments', link: '#gallery' },
        { title: 'The Court of Maharaja Ranjit Singh', type: 'Durbar Heritage', desc: 'Monumental Sikh durbar featuring gold canopies and historic courtiers', link: '#gallery' },
        { title: 'Mughal Durbar Realism', type: 'Imperial Court Art', desc: 'Shah Jahan era assembly with single squirrel-hair realism', link: '#gallery' },
        { title: 'Radha Krishna in Monsoons (Kangra)', type: 'Pahari Poetics', desc: 'Lyrical devotional scene in lush Himalayan landscape', link: '#gallery' },
        { title: 'Prince on Royal Steed (Deccani)', type: 'Golconda Splendor', desc: 'Persian synthesis and luminous lapis lazuli starlight', link: '#gallery' },
        { title: 'Bespoke Royal Heritage Commission', type: 'Custom Atelier Work', desc: 'Custom family or heritage portraiture on antique Wasli', link: '#', action: 'open-commission-modal' },
        { title: 'Jaipur Atelier Masterclass 2026', type: 'Workshops & Mentorship', desc: 'Traditional Guru-Shishya training in Jaipur with Master Om Prakash Kumawat', link: '#', action: 'open-workshop-modal' }
      ];

      const matches = searchableArt.filter(
        (item) => item.title.toLowerCase().includes(q) || item.type.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        resultsContainer.innerHTML = `
          <div style="padding: 1.5rem; text-align: center; color: var(--ink-muted); font-size: 0.85rem;">
            No miniature paintings, workshops or collections found for "${term}".
          </div>
        `;
        return;
      }

      let resHtml = '<div style="display: flex; flex-direction: column; gap: 0.75rem;">';
      matches.forEach((item) => {
        const actionAttr = item.action ? `data-action="${item.action}"` : '';
        resHtml += `
          <a href="${item.link}" ${actionAttr} class="dropdown-school-link" style="padding: 0.85rem; border: 1px solid var(--line); border-radius: 6px;">
            <div>
              <div style="font-weight: 600; font-size: 0.88rem; color: var(--ink-rich); margin-bottom: 0.15rem;">
                ${item.title} <span style="font-size: 0.65rem; color: var(--rust); font-weight: 600; margin-left: 0.5rem; text-transform: uppercase;">${item.type}</span>
              </div>
              <div style="font-size: 0.75rem; color: var(--ink-soft);">${item.desc}</div>
            </div>
            <span style="color: var(--gold-dark); font-size: 1.1rem;">&rarr;</span>
          </a>
        `;
      });
      resHtml += '</div>';
      resultsContainer.innerHTML = resHtml;

      resultsContainer.querySelectorAll('[data-action]').forEach((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          searchModal?.classList.remove('is-open');
          const act = el.getAttribute('data-action');
          if (act === 'open-commission-modal') document.getElementById('commission-modal-backdrop')?.classList.add('is-open');
          if (act === 'open-workshop-modal') document.getElementById('workshop-modal-backdrop')?.classList.add('is-open');
        });
      });
    }
  }

  // --- Modal Helpers & Setup ---
  function initModals() {
    setupModalGeneric('commission-modal-backdrop', '[data-action="open-commission-modal"]');
    setupModalGeneric('workshop-modal-backdrop', '[data-action="open-workshop-modal"]');
    setupModalGeneric('user-modal-backdrop', '[data-action="open-user-modal"]');
    setupModalGeneric('contact-modal-backdrop', '[data-action="open-contact-modal"]');

    // Forms submission feedback
    const formConfigs = [
      { id: 'commission-form', modalId: 'commission-modal-backdrop', msg: 'Thank you for your bespoke royal commission inquiry. Senior Artist Om Prakash Kumawat’s atelier will contact you with initial sketches and portfolio details.' },
      { id: 'workshop-form', modalId: 'workshop-modal-backdrop', msg: 'Thank you for enrolling in the Traditional Atelier Masterclass. Our curator will send the full syllabus and schedule to your email.' },
      { id: 'user-form', modalId: 'user-modal-backdrop', msg: 'Welcome to the OM & PRIYANKA Collector Circle. Your profile has been created.' },
      { id: 'contact-form', modalId: 'contact-modal-backdrop', msg: 'Thank you for reaching out. Our atelier concierge will respond within 24 hours.' }
    ];

    formConfigs.forEach((cfg) => {
      const formEl = document.getElementById(cfg.id);
      formEl?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert(cfg.msg);
        formEl.reset();
        document.getElementById(cfg.modalId)?.classList.remove('is-open');
      });
    });
  }

  function setupModalGeneric(modalId, triggerSelector) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    document.querySelectorAll(triggerSelector).forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('collector-drawer-backdrop')?.classList.remove('is-open');
        modal.classList.add('is-open');
      });
    });

    modal.querySelectorAll('.modal-close-btn').forEach((btn) => {
      btn.addEventListener('click', () => modal.classList.remove('is-open'));
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('is-open');
    });
  }

  // --- Mobile Navigation Drawer ---
  function initMobileNavigation() {
    const mobileBtn = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer-backdrop');
    const mobileClose = document.getElementById('mobile-drawer-close');

    mobileBtn?.addEventListener('click', () => {
      mobileDrawer?.classList.add('is-open');
    });

    mobileClose?.addEventListener('click', () => {
      mobileDrawer?.classList.remove('is-open');
    });

    mobileDrawer?.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) mobileDrawer.classList.remove('is-open');
    });

    document.querySelectorAll('.mobile-drawer-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer?.classList.remove('is-open');
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
