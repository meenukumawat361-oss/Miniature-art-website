/**
 * OM & PRIYANKA — ROYAL INDIAN MINIATURE ART ATELIER
 * Master Navigation & Interactive Controller
 * Handles Selling Inquiries, Classes Enrollment, Exhibition VIP RSVP, & Currency
 */

(function () {
  'use strict';

  // --- Currency Conversion Data ---
  const CURRENCY_RATES = {
    INR: { symbol: '₹', rate: 1, label: 'INR' },
    USD: { symbol: '$', rate: 0.012, label: 'USD' },
    EUR: { symbol: '€', rate: 0.011, label: 'EUR' },
    GBP: { symbol: '£', rate: 0.0095, label: 'GBP' }
  };
  let currentCurrency = 'INR';

  // --- Sample Inquired Works in Collector Bag ---
  const collectorBag = [
    {
      id: 'art-01',
      title: 'Palace Stories (Royal Darbar)',
      school: 'Mewar & Jaipur School',
      details: 'Hand-painted on antique Wasli with 24K pure Hilkari gold & Lapis Lazuli',
      priceINR: 185000,
      image: 'images/image4.jpeg'
    },
    {
      id: 'art-04',
      title: 'The Royal Gathering',
      school: 'Mughal Imperial Realism',
      details: 'Single-hair squirrel brushwork with natural cinnabar & malachite',
      priceINR: 240000,
      image: 'images/image7.jpeg'
    }
  ];

  // --- DOM Elements Initialization ---
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const currencySelect = document.getElementById('currency-selector');
    const bagToggleBtns = document.querySelectorAll('[data-action="toggle-bag"]');
    const bagBackdrop = document.getElementById('collector-drawer-backdrop');
    const bagCloseBtn = document.getElementById('drawer-close-btn');
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
    const mobileCloseBtn = document.getElementById('mobile-drawer-close');

    // Commission modal triggers
    const commissionTriggers = document.querySelectorAll('[data-action="open-commission-modal"]');
    const commissionModal = document.getElementById('commission-modal-backdrop');

    // Workshop modal triggers
    const workshopTriggers = document.querySelectorAll('[data-action="open-workshop-modal"]');
    const workshopModal = document.getElementById('workshop-modal-backdrop');

    // Exhibition modal triggers
    const exhibitionTriggers = document.querySelectorAll('[data-action="open-exhibition-modal"]');
    const exhibitionModal = document.getElementById('exhibition-modal-backdrop');

    // Search modal triggers
    const searchTriggers = document.querySelectorAll('[data-action="open-search-modal"]');
    const searchModal = document.getElementById('search-modal-backdrop');
    const searchInput = document.getElementById('search-input');
    const searchQuickPills = document.querySelectorAll('.search-tag-pill');

    // --- Header Scroll Effect ---
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header?.classList.add('is-scrolled');
      } else {
        header?.classList.remove('is-scrolled');
      }
    }, { passive: true });

    // --- Top Announcement Ticker ---
    const tickerItems = [
      '✦ Hand-painted on antique Wasli with 24K pure Hilkari gold & natural mineral pigments',
      '❖ Rashtrapati Bhavan & Prime Minister’s Office featured living heritage atelier • Est. 1986',
      '◈ Worldwide museum-insured courier delivery • Bespoke royal commissions open for 2026',
      '✦ Masterclasses & Mentorship in Jaipur: Next cohort begins November 2026'
    ];
    let tickerIndex = 0;
    const tickerEl = document.getElementById('curator-ticker-text');
    if (tickerEl) {
      setInterval(() => {
        tickerIndex = (tickerIndex + 1) % tickerItems.length;
        tickerEl.style.opacity = '0';
        setTimeout(() => {
          tickerEl.innerHTML = tickerItems[tickerIndex];
          tickerEl.style.opacity = '1';
        }, 300);
      }, 5000);
    }

    // --- Currency Switching ---
    if (currencySelect) {
      currencySelect.addEventListener('change', (e) => {
        currentCurrency = e.target.value;
        updatePrices();
      });
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

    // --- Collector Drawer (Selling Inquiries) ---
    function renderCollectorBag() {
      const container = document.getElementById('drawer-items-list');
      const counterBadges = document.querySelectorAll('.bag-counter-badge');
      if (!container) return;

      counterBadges.forEach(badge => {
        badge.textContent = collectorBag.length;
      });

      if (collectorBag.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 2.5rem 1rem; color: var(--nav-ink-soft);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--nav-gold);">◈</div>
            <h4 style="font-family: var(--font-nav-serif); font-size: 1rem; color: var(--nav-ink);">Your Collector Bag is Empty</h4>
            <p style="font-size: 0.75rem; margin-top: 0.5rem;">Explore our curated miniature collection or request a bespoke royal commission.</p>
            <a href="#collection" class="preview-action-btn" style="margin-top: 1rem; display: inline-flex;" onclick="document.getElementById('collector-drawer-backdrop').classList.remove('is-open')">Browse Artworks</a>
          </div>
        `;
        return;
      }

      let html = '';
      collectorBag.forEach((item, index) => {
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
            <button type="button" aria-label="Remove item" data-remove-index="${index}" style="position: absolute; top: 8px; right: 8px; background: transparent; border: none; font-size: 1.1rem; color: var(--nav-ink-muted); cursor: pointer;">&times;</button>
          </div>
        `;
      });
      container.innerHTML = html;

      // Attach remove handlers
      container.querySelectorAll('[data-remove-index]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.getAttribute('data-remove-index'), 10);
          collectorBag.splice(idx, 1);
          renderCollectorBag();
        });
      });
    }

    bagToggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        renderCollectorBag();
        bagBackdrop?.classList.add('is-open');
      });
    });

    bagCloseBtn?.addEventListener('click', () => {
      bagBackdrop?.classList.remove('is-open');
    });

    bagBackdrop?.addEventListener('click', (e) => {
      if (e.target === bagBackdrop) {
        bagBackdrop.classList.remove('is-open');
      }
    });

    // --- Mobile Menu Drawer & Accordions ---
    mobileMenuBtn?.addEventListener('click', () => {
      mobileBackdrop?.classList.add('is-open');
    });

    mobileCloseBtn?.addEventListener('click', () => {
      mobileBackdrop?.classList.remove('is-open');
    });

    mobileBackdrop?.addEventListener('click', (e) => {
      if (e.target === mobileBackdrop) {
        mobileBackdrop.classList.remove('is-open');
      }
    });

    document.querySelectorAll('.mobile-accordion-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.mobile-accordion-item');
        item?.classList.toggle('is-expanded');
      });
    });

    // Auto close mobile drawer on sub-link click
    document.querySelectorAll('.mobile-sub-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileBackdrop?.classList.remove('is-open');
      });
    });

    // --- Modal Helpers ---
    function setupModal(backdrop, openTriggers) {
      if (!backdrop) return;
      openTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          // Close mobile menu or drawer if open
          mobileBackdrop?.classList.remove('is-open');
          bagBackdrop?.classList.remove('is-open');
          backdrop.classList.add('is-open');
        });
      });

      backdrop.querySelectorAll('.modal-close-btn').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => backdrop.classList.remove('is-open'));
      });

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.classList.remove('is-open');
      });
    }

    setupModal(commissionModal, commissionTriggers);
    setupModal(workshopModal, workshopTriggers);
    setupModal(exhibitionModal, exhibitionTriggers);
    setupModal(searchModal, searchTriggers);

    // --- Search Modal Quick Tags & Filter ---
    searchQuickPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const query = pill.getAttribute('data-tag') || pill.textContent.trim();
        if (searchInput) {
          searchInput.value = query;
          performSearch(query);
        }
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
      });
    }

    function performSearch(term) {
      const resultsContainer = document.getElementById('search-results');
      if (!resultsContainer) return;
      const q = term.toLowerCase().trim();

      if (!q) {
        resultsContainer.innerHTML = '';
        return;
      }

      const searchableItems = [
        { title: 'The Court of Maharaja Ranjit Singh', type: 'Painting (Monumental)', desc: 'Lahore durbar with 24K gold & lapis lazuli', url: 'index.html#collection' },
        { title: 'Palace Stories', type: 'Painting (Original)', desc: 'Ornate royal durbar on antique Wasli', url: 'index.html#collection' },
        { title: 'Colour, Gathered & Natural Pigments', type: 'Studio Alchemy', desc: 'Seashell grinding of lapis, malachite, cinnabar', url: 'story.html#alchemy' },
        { title: 'Jaipur Atelier Masterclass 2026', type: 'Classes / Workshop', desc: 'Traditional Guru-Shishya mentorship in Jaipur with Master Om Prakash', url: '#', action: 'open-workshop-modal' },
        { title: 'Bespoke Royal Heritage Commission', type: 'Selling / Commission', desc: 'Commission custom family or royal heritage portraits', url: '#', action: 'open-commission-modal' },
        { title: 'Rashtrapati Bhavan Permanent Collection', type: 'Exhibitions & Provenance', desc: 'Installed at Presidential Palace, New Delhi', url: 'story.html#provenance' },
        { title: 'Prime Minister’s Office (PMO) Collection', type: 'Exhibitions & Provenance', desc: 'Diplomatic state gift miniature collection', url: 'story.html#provenance' },
        { title: 'The Breath of Lineage Exhibition', type: 'Upcoming Exhibition', desc: 'Curated by Padma Shri Vijay Sharma - VIP Preview', url: '#', action: 'open-exhibition-modal' },
        { title: 'Kangra School (Pahari Poetics)', type: 'Classical School', desc: 'Radha Krishna lyrics & verdant Himalayan landscapes', url: 'story.html#schools' },
        { title: 'Mewar & Bundi School', type: 'Classical School', desc: 'Bold emotional vigor and monsoon skies', url: 'story.html#schools' }
      ];

      const matches = searchableItems.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        resultsContainer.innerHTML = `<div style="padding: 1.2rem; text-align: center; color: var(--nav-ink-muted); font-size: 0.8rem;">No matching paintings, workshops, or exhibitions found for "${term}".</div>`;
        return;
      }

      let resHtml = '<div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.6rem;">';
      matches.forEach(item => {
        const actionAttr = item.action ? `data-action="${item.action}"` : '';
        resHtml += `
          <a href="${item.url}" ${actionAttr} class="mega-link-item" style="border: 1px solid var(--nav-line); background: #fdfbf7;">
            <div class="mega-item-icon">✦</div>
            <div class="mega-item-content">
              <h4>${item.title} <span class="nav-pill-badge pill-class" style="font-size: 0.55rem; margin-left: 0.4rem;">${item.type}</span></h4>
              <p>${item.desc}</p>
            </div>
          </a>
        `;
      });
      resHtml += '</div>';
      resultsContainer.innerHTML = resHtml;

      // Wire any modal triggers in results
      resultsContainer.querySelectorAll('[data-action]').forEach(el => {
        const act = el.getAttribute('data-action');
        el.addEventListener('click', (e) => {
          e.preventDefault();
          searchModal?.classList.remove('is-open');
          if (act === 'open-commission-modal') commissionModal?.classList.add('is-open');
          if (act === 'open-workshop-modal') workshopModal?.classList.add('is-open');
          if (act === 'open-exhibition-modal') exhibitionModal?.classList.add('is-open');
        });
      });
    }

    // --- Form Submission Demonstrations ---
    const forms = [
      { id: 'commission-form', modal: commissionModal, msg: 'Thank you for your bespoke commission inquiry. Master Om Prakash Kumawat’s atelier will contact you with initial sketches and portfolio details.' },
      { id: 'workshop-form', modal: workshopModal, msg: 'Thank you for enrolling in the Miniature Art Masterclass. Our curator will send the syllabus and confirmation details to your email.' },
      { id: 'exhibition-form', modal: exhibitionModal, msg: 'Your VIP Exhibition Pass request has been received. Your personalized invitation card and schedule have been reserved.' }
    ];

    forms.forEach(f => {
      const formEl = document.getElementById(f.id);
      formEl?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert(f.msg);
        formEl.reset();
        f.modal?.classList.remove('is-open');
      });
    });

    // Initial render
    renderCollectorBag();
    updatePrices();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
