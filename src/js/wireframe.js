/* ==========================================================================
   wireframe.js — shared interaction behaviour for lo-fi wireframes.

   Everything here is driven by data attributes and classes, so pages stay
   declarative and no page needs its own inline script. Keep it that way: a
   wireframe pack with five slightly different accordion implementations is
   how nav bugs get reported in a client review.

   All patterns are keyboard-operable and dismissible with Escape, because
   accessibility is cheaper to design in at wireframe stage than to retrofit.
   ========================================================================== */

(function () {
  'use strict';

  /* --- Navigation flyouts ------------------------------------------------
     Opened on hover AND focus. Hover alone would make the whole navigation
     unusable by keyboard, which is the single most common wireframe defect
     that survives into build. */
  function initNav() {
    var backdrop = document.querySelector('.flyout-backdrop');
    var items = document.querySelectorAll('.nav-item');

    function closeAll() {
      document.querySelectorAll('.nav-item.open').forEach(function (i) {
        i.classList.remove('open');
      });
      if (backdrop) backdrop.classList.remove('active');
    }

    items.forEach(function (item) {
      var flyout = item.querySelector('.nav-flyout');
      if (!flyout) return;

      var trigger = item.querySelector('.nav-link');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'true');
      }

      function open() {
        closeAll();
        item.classList.add('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.classList.add('active');
      }

      function close() {
        item.classList.remove('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.classList.remove('active');
      }

      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);
      item.addEventListener('focusin', open);
      item.addEventListener('focusout', function () {
        window.setTimeout(function () {
          if (!item.contains(document.activeElement)) close();
        }, 10);
      });

      if (trigger) {
        trigger.addEventListener('click', function (ev) {
          if (trigger.getAttribute('href') === '#') {
            ev.preventDefault();
            item.classList.contains('open') ? close() : open();
          }
        });
      }
    });

    if (backdrop) backdrop.addEventListener('click', closeAll);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
  }

  /* --- Accordions --------------------------------------------------------
     Markup: <div class="accordion-item"><button class="accordion-title">…
     Multiple panels may be open at once unless the .accordion carries
     data-single. */
  function initAccordions() {
    document.querySelectorAll('.accordion-title').forEach(function (title) {
      var startOpen = title.closest('.accordion-item').classList.contains('open');
      title.setAttribute('aria-expanded', startOpen ? 'true' : 'false');
      title.addEventListener('click', function () {
        var item = title.closest('.accordion-item');
        var group = title.closest('.accordion');
        var willOpen = !item.classList.contains('open');

        if (group && group.hasAttribute('data-single')) {
          group.querySelectorAll('.accordion-item.open').forEach(function (o) {
            o.classList.remove('open');
            var t = o.querySelector('.accordion-title');
            if (t) t.setAttribute('aria-expanded', 'false');
          });
        }

        item.classList.toggle('open', willOpen);
        title.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
  }

  /* --- Tabs --------------------------------------------------------------
     Markup: <button class="tab" data-tab="panel-id"> and
             <div class="tab-panel" id="panel-id"> */
  function initTabs() {
    document.querySelectorAll('.tabs').forEach(function (group) {
      var tabs = group.querySelectorAll('.tab');
      tabs.forEach(function (tab) {
        tab.setAttribute('role', 'tab');
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          var target = document.getElementById(tab.getAttribute('data-tab'));
          if (!target) return;
          var container = target.parentElement;
          container.querySelectorAll('.tab-panel').forEach(function (p) {
            p.classList.remove('active');
          });
          target.classList.add('active');
        });
      });
    });
  }

  /* --- Carousels ---------------------------------------------------------
     Markup: <div class="carousel" data-autoplay="6000"> containing
             .carousel-track > .carousel-item, .carousel-arrow[data-dir],
             and an empty .carousel-indicators which is populated here. */
  function initCarousels() {
    document.querySelectorAll('.carousel').forEach(function (carousel) {
      var track = carousel.querySelector('.carousel-track');
      if (!track) return;
      var items = track.querySelectorAll('.carousel-item');
      var dotsHost = carousel.querySelector('.carousel-indicators');
      var index = 0;
      var timer = null;

      function render() {
        track.style.transform = 'translateX(-' + index * 100 + '%)';
        if (!dotsHost) return;
        dotsHost.querySelectorAll('.carousel-dot').forEach(function (d, i) {
          d.classList.toggle('active', i === index);
          d.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
      }

      function go(n) {
        index = (n + items.length) % items.length;
        render();
      }

      if (dotsHost) {
        items.forEach(function (_, i) {
          var dot = document.createElement('button');
          dot.className = 'carousel-dot';
          dot.type = 'button';
          dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
          dot.addEventListener('click', function () { go(i); });
          dotsHost.appendChild(dot);
        });
      }

      carousel.querySelectorAll('.carousel-arrow').forEach(function (arrow) {
        arrow.addEventListener('click', function () {
          go(index + (arrow.getAttribute('data-dir') === 'prev' ? -1 : 1));
        });
      });

      var interval = parseInt(carousel.getAttribute('data-autoplay'), 10);
      if (interval > 0) {
        var start = function () { timer = window.setInterval(function () { go(index + 1); }, interval); };
        var stop = function () { window.clearInterval(timer); };
        start();
        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('focusin', stop);
        carousel.addEventListener('mouseleave', start);
      }

      render();
    });
  }

  /* --- Modals ------------------------------------------------------------
     Markup: any element with data-modal-open="modal-id", and
             <div class="wf-modal" id="modal-id"> */
  function initModals() {
    function close(modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-modal-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function (ev) {
        ev.preventDefault();
        var modal = document.getElementById(trigger.getAttribute('data-modal-open'));
        if (!modal) return;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        var panel = modal.querySelector('.wf-modal-panel');
        if (panel) {
          panel.setAttribute('tabindex', '-1');
          panel.focus();
        }
      });
    });

    document.querySelectorAll('.wf-modal').forEach(function (modal) {
      modal.addEventListener('click', function (ev) {
        if (ev.target === modal || ev.target.classList.contains('wf-modal-close')) close(modal);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.wf-modal.open').forEach(close);
    });
  }

  /* --- Annotation toggle -------------------------------------------------
     Injects the floating control only when the page actually has notes, and
     remembers the choice for the session so a reviewer clicking through ten
     pages does not have to hide notes ten times. */
  function initNotes() {
    if (!document.querySelector('.wf-note')) return;

    var hidden = false;
    try { hidden = window.sessionStorage.getItem('wf-notes-hidden') === '1'; } catch (e) { /* private mode */ }

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'wf-notes-toggle';

    function apply() {
      document.body.classList.toggle('wf-notes-hidden', hidden);
      button.textContent = hidden ? 'Show annotations' : 'Hide annotations';
      button.setAttribute('aria-pressed', hidden ? 'true' : 'false');
    }

    button.addEventListener('click', function () {
      hidden = !hidden;
      try { window.sessionStorage.setItem('wf-notes-hidden', hidden ? '1' : '0'); } catch (e) { /* private mode */ }
      apply();
    });

    document.body.appendChild(button);
    apply();
  }

  /* ======================================================================
     Get Living prototype behaviour (V1)
     Everything below is driven by ids and data attributes on the pages.
     Listing data comes from data.js (sample data only).
     ====================================================================== */

  var HOMES = window.GL_HOMES || [];
  var HOODS = window.GL_NEIGHBOURHOODS || {};
  var money = window.GL_MONEY || function (n) { return '£' + n; };
  var money2 = window.GL_MONEY2 || money;
  var bedLabel = window.GL_BED_LABEL || function (b) { return b + ' bed'; };
  var availLabel = window.GL_AVAIL_LABEL || function (a) { return a; };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function byId(id) { for (var i = 0; i < HOMES.length; i++) { if (HOMES[i].id === id) return HOMES[i]; } return null; }
  /* Query parameters (?home=, ?hood=) carry context between prototype pages.
     Some hosts strip the query string when a page is opened, so the last
     clicked link's query is also kept for the page it points to. */
  function currentFile() { return (window.location.pathname.split('/').pop() || 'index.html'); }
  function param(name) {
    var v = null;
    try { v = new URLSearchParams(window.location.search).get(name); } catch (e) { v = null; }
    if (v) return v;
    try {
      var saved = JSON.parse(window.sessionStorage.getItem('gl-q') || 'null');
      if (saved && saved.file === currentFile()) return new URLSearchParams(saved.q).get(name);
    } catch (e) { /* private mode */ }
    return null;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    try {
      if (href.indexOf('?') !== -1) window.sessionStorage.setItem('gl-q', JSON.stringify({ file: href.split('?')[0].split('/').pop(), q: href.split('?')[1].split('#')[0] }));
      else if (href.charAt(0) !== '#') window.sessionStorage.removeItem('gl-q');
    } catch (err) { /* private mode */ }
  }, true);

  /* --- Toast ------------------------------------------------------------ */
  var toastTimer = null;
  function toast(msg) {
    var t = $('#wf-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'wf-toast';
      t.className = 'toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { t.hidden = true; }, 2600);
  }

  /* --- Header height, used by sticky filter bars and in-page nav -------- */
  function initHeaderHeight() {
    var header = $('.site-header');
    if (!header) return;
    function set() { document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px'); }
    set();
    window.addEventListener('resize', set);
  }

  /* --- Mobile navigation toggle (R02) ----------------------------------- */
  function initMobileNav() {
    var btn = $('.nav-toggle');
    var menu = $('#primary-menu');
    if (!btn || !menu) return;
    function set(open) {
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
      initHeaderHeightNow();
    }
    btn.addEventListener('click', function () { set(!menu.classList.contains('open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) { set(false); btn.focus(); } });
  }
  function initHeaderHeightNow() {
    var header = $('.site-header');
    if (header) document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }

  /* --- Saved homes (R04, R14) -------------------------------------------
     Stored for the browser session so saves carry between prototype pages. */
  function getSaved() {
    try { return JSON.parse(window.sessionStorage.getItem('gl-saved') || '[]'); } catch (e) { return window.__glSaved || []; }
  }
  function setSaved(list) {
    window.__glSaved = list;
    try { window.sessionStorage.setItem('gl-saved', JSON.stringify(list)); } catch (e) { /* private mode */ }
    $all('[data-saved-count]').forEach(function (el) { el.textContent = list.length; });
  }
  function isSaved(id) { return getSaved().indexOf(id) !== -1; }
  function toggleSaved(id) {
    var list = getSaved();
    var i = list.indexOf(id);
    if (i === -1) { list.push(id); toast('Saved to your homes'); } else { list.splice(i, 1); toast('Removed from saved homes'); }
    setSaved(list);
    syncSaveButtons();
    document.dispatchEvent(new CustomEvent('gl:saved'));
  }
  function syncSaveButtons() {
    $all('[data-save-id]').forEach(function (b) {
      var on = isSaved(b.getAttribute('data-save-id'));
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.textContent = on ? 'Saved' : 'Save';
    });
  }
  function initSaved() {
    setSaved(getSaved());
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-save-id]');
      if (!b) return;
      e.preventDefault();
      toggleSaved(b.getAttribute('data-save-id'));
    });
    syncSaveButtons();
  }

  /* --- Drawers ------------------------------------------------------------
     Markup: trigger [data-drawer-open="id"], <div class="drawer" id="id">.
     Escape or a click on the dimmed area closes; focus returns to trigger. */
  var lastDrawerTrigger = null;
  function openDrawer(id, trigger) {
    var d = document.getElementById(id);
    if (!d) return;
    lastDrawerTrigger = trigger || null;
    d.classList.add('open');
    document.body.style.overflow = 'hidden';
    var panel = $('.drawer-panel', d);
    if (panel) { panel.setAttribute('tabindex', '-1'); panel.focus(); }
  }
  function closeDrawer(d) {
    d.classList.remove('open');
    document.body.style.overflow = '';
    if (lastDrawerTrigger) lastDrawerTrigger.focus();
  }
  function initDrawers() {
    $all('[data-drawer-open]').forEach(function (t) {
      t.addEventListener('click', function (e) { e.preventDefault(); openDrawer(t.getAttribute('data-drawer-open'), t); });
    });
    $all('.drawer').forEach(function (d) {
      d.addEventListener('click', function (e) {
        if (e.target === d || e.target.closest('.drawer-close') || e.target.closest('[data-drawer-close]')) closeDrawer(d);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      $all('.drawer.open').forEach(closeDrawer);
    });
  }

  /* --- Home card markup (R13, R17) -------------------------------------- */
  function cardHTML(h, opts) {
    opts = opts || {};
    var hood = HOODS[h.hood] || { name: h.hood };
    var badges = '<span class="badge solid">' + (h.available === 'now' ? 'Available now' : availLabel(h.available).replace('Available ', 'From ')) + '</span>';
    if (h.offer) badges += '<span class="badge">' + h.offer + '</span>';
    if (h.type === 'co-living') badges += '<span class="badge">Co-living</span>';
    var sqm = Math.round(h.sqft * 0.0929);
    return '' +
      '<article class="home-card" data-id="' + h.id + '">' +
        '<div class="media">' +
          '<div class="wf-placeholder ratio-4-3">Photo carousel 4:3</div>' +
          '<div class="badges">' + badges + '</div>' +
          '<button type="button" class="save-btn" data-save-id="' + h.id + '" aria-pressed="false" aria-label="Save ' + h.building + ' ' + bedLabel(h.beds) + '">Save</button>' +
        '</div>' +
        '<div class="body">' +
          '<div class="price">' + money(h.rent) + ' <small>pcm</small></div>' +
          '<h3>' + bedLabel(h.beds) + ', ' + h.building + '</h3>' +
          '<p class="addr">' + hood.name + ' · ' + h.postcode + '</p>' +
          '<div class="facts">' +
            '<div><b>' + h.sqft + '</b>sq ft (' + sqm + ' m²)</div>' +
            '<div><b>' + (h.floor === 0 ? 'G' : h.floor) + '</b>floor</div>' +
            '<div><b>' + h.baths + '</b>bath' + (h.baths > 1 ? 's' : '') + '</div>' +
            '<div><b>' + (h.furnished ? 'Yes' : 'No') + '</b>furnished</div>' +
          '</div>' +
          '<div class="actions">' +
            '<a class="btn btn-sm" href="' + (opts.base || '') + 'home.html?home=' + h.id + '">View this home</a>' +
            (opts.compare === false ? '' : '<label class="check"><input type="checkbox" data-compare-id="' + h.id + '"> Compare</label>') +
          '</div>' +
        '</div>' +
      '</article>';
  }

  /* --- Prototype 1: Find a home (R10–R17) -------------------------------- */
  function initSearch() {
    var app = $('#search-app');
    if (!app) return;

    var PAGE = 12;
    var state = {
      hood: param('hood') || 'any', beds: param('beds') || 'any', max: 'any', movein: '',
      type: 'rental', furnished: 'any', pets: false, balcony: false, parking: false, accessible: false, offers: false,
      sort: 'price-asc', view: 'list', shown: PAGE, savedOnly: window.location.hash === '#saved', pin: null
    };
    var compare = [];

    var els = {
      grid: $('#results-grid'), count: $('#result-count'), more: $('#load-more'), empty: $('#empty-state'),
      list: $('#list-view'), map: $('#map-view'), mapList: $('#map-list'), pins: $('#map-pins'),
      chips: $('#active-filters'), tray: $('#compare-tray'), slots: $('#compare-slots'), cmpBtn: $('#compare-go'),
      savedToggle: $('#saved-only'), mobileCount: $('[data-filter-count]')
    };

    /* Two filter UIs (desktop bar + mobile/more drawer) bound to one state. */
    function bindControl(name, prop, kind) {
      $all('[name="' + name + '"]').forEach(function (el) {
        if (kind === 'check') el.checked = !!state[prop]; else el.value = state[prop];
        el.addEventListener('change', function () {
          state[prop] = kind === 'check' ? el.checked : el.value;
          $all('[name="' + name + '"]').forEach(function (o) { if (o !== el) { if (kind === 'check') o.checked = el.checked; else o.value = el.value; } });
          state.shown = PAGE; state.pin = null;
          render();
        });
      });
    }
    bindControl('f-hood', 'hood'); bindControl('f-beds', 'beds'); bindControl('f-max', 'max'); bindControl('f-movein', 'movein');
    bindControl('f-type', 'type'); bindControl('f-furnished', 'furnished');
    bindControl('f-pets', 'pets', 'check'); bindControl('f-balcony', 'balcony', 'check'); bindControl('f-parking', 'parking', 'check');
    bindControl('f-accessible', 'accessible', 'check'); bindControl('f-offers', 'offers', 'check');
    bindControl('f-sort', 'sort');

    function matches(h) {
      if (state.savedOnly && !isSaved(h.id)) return false;
      if (state.type !== 'any' && h.type !== state.type) return false;
      if (state.hood !== 'any') {
        if (state.hood.indexOf('city:') === 0) { if ((HOODS[h.hood] || {}).city !== state.hood.slice(5)) return false; }
        else if (h.hood !== state.hood) return false;
      }
      if (state.beds !== 'any' && String(h.beds) !== state.beds && !(state.beds === '3' && h.beds >= 3)) return false;
      if (state.max !== 'any' && h.rent > parseInt(state.max, 10)) return false;
      if (state.movein) {
        if (h.available !== 'now' && h.available > state.movein) return false;
      }
      if (state.furnished === 'yes' && !h.furnished) return false;
      if (state.furnished === 'no' && h.furnished) return false;
      if (state.pets && !h.pets) return false;
      if (state.balcony && !h.balcony) return false;
      if (state.parking && !h.parking) return false;
      if (state.accessible && !h.accessible) return false;
      if (state.offers && !h.offer) return false;
      if (state.pin && h.hood !== state.pin) return false;
      return true;
    }
    function sorted(list) {
      var l = list.slice();
      if (state.sort === 'price-asc') l.sort(function (a, b) { return a.rent - b.rent; });
      if (state.sort === 'price-desc') l.sort(function (a, b) { return b.rent - a.rent; });
      if (state.sort === 'available') l.sort(function (a, b) { return (a.available === 'now' ? '0' : a.available) < (b.available === 'now' ? '0' : b.available) ? -1 : 1; });
      if (state.sort === 'size') l.sort(function (a, b) { return b.sqft - a.sqft; });
      return l;
    }

    function activeChips() {
      var out = [];
      function add(label, reset) { out.push({ label: label, reset: reset }); }
      if (state.hood !== 'any') add(state.hood.indexOf('city:') === 0 ? state.hood.slice(5) : (HOODS[state.hood] || {}).name, function () { state.hood = 'any'; });
      if (state.beds !== 'any') add(state.beds === '0' ? 'Studio' : state.beds === '3' ? '3+ bedrooms' : state.beds + ' bedroom' + (state.beds === '1' ? '' : 's'), function () { state.beds = 'any'; });
      if (state.max !== 'any') add('Up to ' + money(parseInt(state.max, 10)) + ' pcm', function () { state.max = 'any'; });
      if (state.movein) add('Move in by ' + new Date(state.movein + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), function () { state.movein = ''; });
      if (state.type !== 'rental') add(state.type === 'co-living' ? 'Co-living' : 'Rental and co-living', function () { state.type = 'rental'; });
      if (state.furnished !== 'any') add(state.furnished === 'yes' ? 'Furnished' : 'Unfurnished', function () { state.furnished = 'any'; });
      if (state.pets) add('Pet-friendly', function () { state.pets = false; });
      if (state.balcony) add('Balcony', function () { state.balcony = false; });
      if (state.parking) add('Parking', function () { state.parking = false; });
      if (state.accessible) add('Accessible home', function () { state.accessible = false; });
      if (state.offers) add('Offers only', function () { state.offers = false; });
      if (state.savedOnly) add('Saved homes only', function () { state.savedOnly = false; });
      return out;
    }
    function syncControls() {
      ['hood', 'beds', 'max', 'movein', 'type', 'furnished', 'sort'].forEach(function (p) {
        $all('[name="f-' + p + '"]').forEach(function (el) { el.value = state[p]; });
      });
      ['pets', 'balcony', 'parking', 'accessible', 'offers'].forEach(function (p) {
        $all('[name="f-' + p + '"]').forEach(function (el) { el.checked = !!state[p]; });
      });
      if (els.savedToggle) els.savedToggle.setAttribute('aria-pressed', state.savedOnly ? 'true' : 'false');
    }

    function render() {
      var results = sorted(HOMES.filter(matches));
      var chips = activeChips();
      syncControls();

      els.chips.innerHTML = '';
      chips.forEach(function (c) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'chip';
        b.setAttribute('aria-label', 'Remove filter: ' + c.label);
        b.textContent = c.label + '  ×';
        b.addEventListener('click', function () { c.reset(); state.shown = PAGE; render(); });
        els.chips.appendChild(b);
      });
      if (chips.length) {
        var clr = document.createElement('button');
        clr.type = 'button'; clr.className = 'btn-link'; clr.textContent = 'Clear all';
        clr.addEventListener('click', function () {
          state.hood = 'any'; state.beds = 'any'; state.max = 'any'; state.movein = ''; state.type = 'rental'; state.furnished = 'any';
          state.pets = state.balcony = state.parking = state.accessible = state.offers = state.savedOnly = false; state.pin = null;
          render();
        });
        els.chips.appendChild(clr);
      }
      if (els.mobileCount) els.mobileCount.textContent = chips.length ? ' (' + chips.length + ')' : '';

      var hoodNote = state.pin ? ' in ' + HOODS[state.pin].name : '';
      els.count.textContent = results.length + ' home' + (results.length === 1 ? '' : 's') + ' match' + (results.length === 1 ? 'es' : '') + hoodNote;

      var none = results.length === 0;
      els.empty.hidden = !none;
      els.list.hidden = none || state.view !== 'list';
      els.map.hidden = none || state.view !== 'map';

      // List view
      els.grid.innerHTML = results.slice(0, state.shown).map(function (h) { return cardHTML(h); }).join('');
      els.more.hidden = results.length <= state.shown;
      var moreBtn = $('button', els.more);
      if (moreBtn) moreBtn.textContent = 'Load more homes (' + (results.length - state.shown) + ' more)';

      // Map view: one pin per neighbourhood with the count of matching homes
      var counts = {};
      HOMES.filter(function (h) { var p = state.pin; state.pin = null; var m = matches(h); state.pin = p; return m; })
        .forEach(function (h) { counts[h.hood] = counts[h.hood] || { n: 0, x: h.x, y: h.y }; counts[h.hood].n += 1; });
      els.pins.innerHTML = '';
      Object.keys(counts).forEach(function (k) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'map-pin';
        b.style.left = counts[k].x + '%'; b.style.top = counts[k].y + '%';
        b.textContent = HOODS[k].name + ' · ' + counts[k].n;
        b.setAttribute('aria-pressed', state.pin === k ? 'true' : 'false');
        b.addEventListener('click', function () { state.pin = state.pin === k ? null : k; render(); });
        els.pins.appendChild(b);
      });
      els.mapList.innerHTML = results.map(function (h) { return cardHTML(h); }).join('');

      syncSaveButtons();
      syncCompareChecks();
    }

    // View toggle
    $all('[data-view]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.view = b.getAttribute('data-view');
        $all('[data-view]').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        render();
      });
    });
    els.more.addEventListener('click', function () { state.shown += PAGE; render(); });
    if (els.savedToggle) els.savedToggle.addEventListener('click', function () { state.savedOnly = !state.savedOnly; state.shown = PAGE; render(); });
    document.addEventListener('gl:saved', function () { if (state.savedOnly) render(); });
    $all('[data-apply-filters]').forEach(function (b) { b.addEventListener('click', function () { toast('Filters applied'); }); });

    // Compare (max 3)
    function syncCompareChecks() {
      $all('[data-compare-id]').forEach(function (c) {
        var id = c.getAttribute('data-compare-id');
        c.checked = compare.indexOf(id) !== -1;
        c.disabled = !c.checked && compare.length >= 3;
      });
      els.tray.hidden = compare.length === 0;
      document.body.classList.toggle('has-tray', compare.length > 0);
      var html = '';
      for (var i = 0; i < 3; i++) {
        var h = byId(compare[i]);
        html += h ? '<span class="compare-slot filled">' + bedLabel(h.beds) + ', ' + h.building + '</span>' : '<span class="compare-slot">Add a home</span>';
      }
      els.slots.innerHTML = html;
      els.cmpBtn.disabled = compare.length < 2;
      els.cmpBtn.textContent = 'Compare ' + compare.length + ' homes';
    }
    app.addEventListener('change', function (e) {
      var c = e.target.closest('[data-compare-id]');
      if (!c) return;
      var id = c.getAttribute('data-compare-id');
      var i = compare.indexOf(id);
      if (c.checked && i === -1 && compare.length < 3) compare.push(id);
      if (!c.checked && i !== -1) compare.splice(i, 1);
      syncCompareChecks();
    });
    $('#compare-clear').addEventListener('click', function () { compare = []; syncCompareChecks(); });
    els.cmpBtn.addEventListener('click', function () {
      var rows = [
        ['Rent', function (h) { return money(h.rent) + ' pcm'; }],
        ['Neighbourhood', function (h) { return HOODS[h.hood].name; }],
        ['Bedrooms', function (h) { return bedLabel(h.beds); }],
        ['Bathrooms', function (h) { return h.baths; }],
        ['Size', function (h) { return h.sqft + ' sq ft'; }],
        ['Rent per sq ft', function (h) { return money2(h.rent / h.sqft); }],
        ['Floor', function (h) { return h.floor === 0 ? 'Ground' : h.floor; }],
        ['Furnished', function (h) { return h.furnished ? 'Yes' : 'No'; }],
        ['Available', function (h) { return availLabel(h.available).replace('Available ', ''); }],
        ['Balcony', function (h) { return h.balcony ? 'Yes' : 'No'; }],
        ['Parking', function (h) { return h.parking ? 'Available to rent' : 'No'; }],
        ['Offer', function (h) { return h.offer || '—'; }]
      ];
      var hs = compare.map(byId);
      var t = '<table class="cmp-table"><thead><tr><th scope="col"><span class="wf-meta">Compare</span></th>' +
        hs.map(function (h) { return '<th scope="col">' + bedLabel(h.beds) + ', ' + h.building + '</th>'; }).join('') + '</tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><th scope="row">' + r[0] + '</th>' + hs.map(function (h) { return '<td>' + r[1](h) + '</td>'; }).join('') + '</tr>'; }).join('') +
        '<tr><th scope="row"></th>' + hs.map(function (h) { return '<td><a href="home.html?home=' + h.id + '">View this home</a></td>'; }).join('') + '</tr>' +
        '</tbody></table>';
      $('#compare-table').innerHTML = t;
      var m = $('#compare-modal');
      m.classList.add('open'); document.body.style.overflow = 'hidden';
      var p = $('.wf-modal-panel', m); p.setAttribute('tabindex', '-1'); p.focus();
    });

    // Save search / alerts and waitlist forms (R15)
    $all('form[data-alert-form]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = $('input[type="email"]', f);
        var field = email.closest('.field');
        var err = $('.field-error', field);
        var ok = /.+@.+\..+/.test(email.value);
        field.classList.toggle('has-error', !ok);
        if (err) err.hidden = ok;
        if (!ok) { email.focus(); return; }
        var modal = f.closest('.wf-modal');
        if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
        toast('Alert set. We’ll email ' + email.value + ' when a match comes up.');
        f.reset();
      });
    });
    var summary = $('#alert-summary');
    $all('[data-modal-open="alert-modal"]').forEach(function (b) {
      b.addEventListener('click', function () {
        var c = activeChips().map(function (x) { return x.label; });
        summary.textContent = c.length ? c.join(' · ') : 'All homes, any neighbourhood';
      });
    });

    render();
  }

  /* --- Prototype 2: Property page (R20–R27) ------------------------------ */
  function initProperty() {
    var app = $('#property-app');
    if (!app) return;
    var h = byId(param('home') || '') || byId('prin0706');
    var hood = HOODS[h.hood];
    var weekly = h.rent * 12 / 52;

    // Fill every [data-home] slot from the chosen home
    var map = {
      price: money(h.rent), title: (h.beds === 0 ? 'Studio' : h.beds + ' bedroom') + ' apartment, ' + h.building,
      address: h.building + ', ' + hood.name + ', ' + (hood.city === 'London' ? 'London ' : hood.city + ' ') + h.postcode, hood: hood.name, area: hood.area,
      beds: bedLabel(h.beds), baths: h.baths, size: h.sqft + ' sq ft (' + Math.round(h.sqft * 0.0929) + ' m²)',
      floor: h.floor === 0 ? 'Ground' : h.floor, furnished: h.furnished ? 'Furnished' : 'Unfurnished',
      available: availLabel(h.available).replace('Available ', ''), pets: h.pets ? 'Welcome, no extra cost' : 'Not in this building',
      parking: h.parking ? 'Available to rent' : 'Not available', weekly: money2(weekly)
    };
    $all('[data-home]').forEach(function (el) { var k = el.getAttribute('data-home'); if (map[k] !== undefined) el.textContent = map[k]; });
    $all('[data-save-id="current"]').forEach(function (b) { b.setAttribute('data-save-id', h.id); });
    $all('[data-book-link]').forEach(function (a) { a.setAttribute('href', 'book-a-viewing.html?home=' + h.id); });
    $all('[data-enq-link]').forEach(function (a) { a.setAttribute('href', 'enquiry.html?home=' + h.id); });
    document.title = map.title + ' — Get Living prototype';
    syncSaveButtons();

    // Monthly cost estimate (R21). Figures are illustrative placeholders.
    var occ = $('#est-occupants'), occOut = $('#est-occupants-out'), park = $('#est-parking'), store = $('#est-storage');
    function estimate() {
      var n = parseInt(occ.value, 10);
      occOut.textContent = n + (n === 1 ? ' person' : ' people');
      var elec = 38 + 14 * n, hot = 14 + 9 * n, water = 18 + 9 * n;
      var ctax = 165 * (n === 1 ? 0.75 : 1);
      var rows = [
        ['Rent', 'Paid monthly to Get Living', h.rent],
        ['Wi-Fi', 'Included in your rent', 0],
        ['Pets', 'No extra charge', 0],
        ['Electricity', 'Estimate, billed by usage', elec],
        ['Hot water', 'Estimate, billed by Homebox', hot],
        ['Water', 'Estimate, metered supply', water],
        ['Council tax', 'Estimate for band ' + (h.hood === 'sherlock-quarter' ? 'C–E' : 'C') + (n === 1 ? ', with 25% single person discount' : ''), ctax]
      ];
      if (park.checked) rows.push(['Parking space', 'Optional, subject to availability', 150]);
      if (store.checked) rows.push(['Storage pod', 'Optional', 95]);
      var total = 0;
      $('#est-body').innerHTML = rows.map(function (r) {
        total += r[2];
        return '<tr><th scope="row">' + r[0] + '<span class="sub">' + r[1] + '</span></th><td>' + (r[2] === 0 ? 'Included' : money(Math.round(r[2]))) + '</td></tr>';
      }).join('');
      $('#est-total').textContent = money(Math.round(total));
      $('#est-perperson').textContent = money(Math.round(total / n)) + ' per person';
    }
    [occ, park, store].forEach(function (el) { el.addEventListener('input', estimate); el.addEventListener('change', estimate); });
    estimate();

    // Move-in costs (R22)
    var depRadios = $all('[name="deposit-type"]');
    function moveIn() {
      var reposit = $('[name="deposit-type"]:checked').value === 'reposit';
      var reserve = weekly;
      var deposit = reposit ? weekly : weekly * 5;
      var first = h.rent - reserve;
      $('#mi-reserve').textContent = money2(reserve);
      $('#mi-deposit-label').textContent = reposit ? 'Deposit alternative (Reposit)' : 'Security deposit (5 weeks)';
      $('#mi-deposit-sub').textContent = reposit ? 'One week’s rent, non-refundable, plus Reposit’s own fees. Subject to referencing.' : 'Protected by the Tenancy Deposit Scheme and returned at the end of your tenancy.';
      $('#mi-deposit').textContent = money2(deposit);
      $('#mi-first').textContent = money2(first);
      $('#mi-total').textContent = money2(reserve + deposit + first);
    }
    depRadios.forEach(function (r) { r.addEventListener('change', moveIn); });
    moveIn();

    // Similar homes (R26)
    var similar = HOMES.filter(function (x) { return x.id !== h.id && x.type === 'rental' && Math.abs(x.beds - h.beds) <= 0 && Math.abs(x.rent - h.rent) <= 600; })
      .sort(function (a, b) { return (a.hood === h.hood ? 0 : 1) - (b.hood === h.hood ? 0 : 1) || Math.abs(a.rent - h.rent) - Math.abs(b.rent - h.rent); }).slice(0, 3);
    $('#similar-grid').innerHTML = similar.map(function (x) { return cardHTML(x, { compare: false }); }).join('') || '<p class="muted">No similar homes available right now.</p>';
    var inBuilding = HOMES.filter(function (x) { return x.building === h.building; }).length;
    $('#building-link').textContent = 'See all ' + inBuilding + ' homes available in ' + h.building;
    $('#building-link').setAttribute('href', 'find-a-home.html?hood=' + h.hood);
    syncSaveButtons();

    // Share
    $all('[data-share]').forEach(function (b) {
      b.addEventListener('click', function () {
        var url = window.location.href;
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast('Link copied'); }, function () { toast('Copy the link from the address bar'); });
        else toast('Copy the link from the address bar');
      });
    });
    document.body.classList.add('has-prop-sticky');
  }

  /* --- Commute checker (R25, R53). Returns sample journey times. -------- */
  function initCommute() {
    $all('form[data-commute]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var dest = $('input', f).value.trim();
        var mode = $('select', f);
        var out = $('.commute-result', f.parentElement) || $('.commute-result');
        var field = $('input', f).closest('.field');
        if (!dest) { field.classList.add('has-error'); $('.field-error', field).hidden = false; $('input', f).focus(); return; }
        field.classList.remove('has-error'); $('.field-error', field).hidden = true;
        var base = 12 + (dest.length * 7) % 31;
        var factor = { transit: 1, cycle: 0.9, walk: 2.6, drive: 0.8 }[mode.value] || 1;
        var mins = Math.round(base * factor);
        out.hidden = false;
        out.innerHTML = '<strong>About ' + mins + ' minutes</strong> to ' + dest.replace(/</g, '') + ' by ' + mode.options[mode.selectedIndex].text.toLowerCase() + ' at 8:30am on a weekday. <span class="wf-meta">(Sample result — live data from a journey planner API.)</span>';
      });
    });
  }

  /* --- Prototype 3: Book a viewing (R30–R32) ----------------------------- */
  function initBooking() {
    var app = $('#booking-app');
    if (!app) return;
    var h = byId(param('home') || '') || byId('prin0706');
    var hood = HOODS[h.hood];
    $all('[data-bk]').forEach(function (el) {
      var k = el.getAttribute('data-bk');
      el.textContent = { title: bedLabel(h.beds) + ', ' + h.building, sub: hood.name + ' · ' + money(h.rent) + ' pcm · ' + availLabel(h.available), hood: hood.name }[k] || '';
    });

    var step = 1, choice = { type: null, date: null, slot: null };
    var panels = $all('.step-panel', app), steps = $all('.stepper li', app);
    function show(n) {
      step = n;
      panels.forEach(function (p) { p.hidden = parseInt(p.getAttribute('data-step'), 10) !== n; });
      steps.forEach(function (s, i) {
        s.classList.toggle('current', i + 1 === n);
        s.classList.toggle('done', i + 1 < n);
        if (i + 1 === n) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current');
      });
      var heading = $('.step-panel[data-step="' + n + '"] h2', app);
      if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus(); }
    }

    // Step 1: viewing type
    $all('[name="vtype"]', app).forEach(function (r) {
      r.addEventListener('change', function () {
        choice.type = r.value;
        $('#vtype-error').hidden = true;
        buildDates();
      });
    });

    // Step 2: dates and slots. Group tours run Wed 6pm and Sat 11am only.
    var dateHost = $('#date-strip'), slotHost = $('#slot-grid');
    var start = new Date(2026, 8, 29); // Tue 29 Sep 2026, the day after this prototype was made
    function buildDates() {
      dateHost.innerHTML = '';
      choice.date = null; choice.slot = null;
      slotHost.innerHTML = '<p class="muted">Choose a day to see times.</p>';
      for (var i = 0; i < 14; i++) {
        var d = new Date(start.getTime() + i * 86400000);
        var dow = d.getDay();
        var closed = dow === 0 || (choice.type === 'group' && dow !== 3 && dow !== 6);
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'date-btn';
        b.innerHTML = d.toLocaleDateString('en-GB', { weekday: 'short' }) + '<b>' + d.getDate() + '</b>' + d.toLocaleDateString('en-GB', { month: 'short' });
        b.setAttribute('aria-pressed', 'false');
        b.setAttribute('aria-label', d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + (closed ? ', no viewings' : ''));
        b.disabled = closed;
        (function (day, btn) {
          btn.addEventListener('click', function () {
            choice.date = day; choice.slot = null;
            $all('.date-btn', dateHost).forEach(function (o) { o.setAttribute('aria-pressed', o === btn ? 'true' : 'false'); });
            buildSlots(day);
          });
        })(d, b);
        dateHost.appendChild(b);
      }
    }
    function buildSlots(d) {
      var dow = d.getDay();
      var times = choice.type === 'group' ? (dow === 3 ? ['18:00'] : ['11:00'])
        : dow === 6 ? ['10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '13:30', '14:00']
        : ['09:30', '10:00', '11:00', '12:30', '13:00', '14:30', '15:00', '16:00', '17:00', '17:30', '18:00'];
      slotHost.innerHTML = '';
      times.forEach(function (t, i) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'slot-btn'; b.textContent = t;
        b.setAttribute('aria-pressed', 'false');
        b.disabled = choice.type !== 'group' && (i * 3 + d.getDate()) % 5 === 0; // some slots already taken
        if (b.disabled) b.setAttribute('aria-label', t + ', booked');
        b.addEventListener('click', function () {
          choice.slot = t;
          $('#slot-error').hidden = true;
          $all('.slot-btn', slotHost).forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        });
        slotHost.appendChild(b);
      });
    }

    function typeLabel() { return { inperson: 'In-person viewing', video: 'Video call viewing', group: 'Live group video tour' }[choice.type]; }
    function when() {
      return choice.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ' at ' + choice.slot;
    }

    $all('[data-next]', app).forEach(function (b) {
      b.addEventListener('click', function () {
        if (step === 1) {
          if (!choice.type) { $('#vtype-error').hidden = false; $('[name="vtype"]', app).focus(); return; }
          show(2); return;
        }
        if (step === 2) {
          if (!choice.date || !choice.slot) { $('#slot-error').hidden = false; return; }
          $('#chosen-summary').textContent = typeLabel() + ' · ' + when();
          show(3); return;
        }
      });
    });
    $all('[data-back]', app).forEach(function (b) { b.addEventListener('click', function () { show(step - 1); }); });

    $('#booking-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(this)) return;
      $('#confirm-when').textContent = typeLabel() + ', ' + when();
      $('#confirm-email').textContent = $('#bk-email').value;
      $('#confirm-where').textContent = choice.type === 'inperson'
        ? 'Meet the team at the ' + hood.name + ' leasing suite. Bring photo ID.'
        : 'We’ll email a video link 30 minutes before. You can join from a phone or laptop.';
      panels.forEach(function (p) { p.hidden = p.getAttribute('data-step') !== 'done'; });
      $('.stepper', app).hidden = true;
      var hd = $('.step-panel[data-step="done"] h2', app); hd.setAttribute('tabindex', '-1'); hd.focus();
    });
    $all('[data-restart]', app).forEach(function (b) { b.addEventListener('click', function () { window.location.reload(); }); });

    buildDates();
    show(1);
    window.scrollTo(0, 0);
  }

  /* --- Shared form validation (R30, R33) -------------------------------- */
  function validateForm(form) {
    var first = null;
    $all('[required]', form).forEach(function (input) {
      var field = input.closest('.field') || input.closest('fieldset');
      var ok = input.type === 'email' ? /.+@.+\..+/.test(input.value)
        : input.type === 'checkbox' ? input.checked
        : input.type === 'radio' ? !!$('[name="' + input.name + '"]:checked', form)
        : input.value.trim() !== '';
      if (field) {
        field.classList.toggle('has-error', !ok);
        var err = $('.field-error', field);
        if (err) err.hidden = ok;
      }
      if (!ok && !first) first = input;
    });
    if (first) { first.focus(); return false; }
    return true;
  }
  function initEnquiry() {
    var f = $('#enquiry-form');
    if (!f) return;
    var h = byId(param('home') || '');
    if (h) {
      var sel = $('#enq-hood'); if (sel) sel.value = h.hood;
      var ctx = $('#enq-context'); if (ctx) { ctx.hidden = false; $('span', ctx).textContent = bedLabel(h.beds) + ', ' + h.building + ' (' + money(h.rent) + ' pcm)'; }
    }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(f)) return;
      f.hidden = true;
      var done = $('#enquiry-done'); done.hidden = false;
      $('#enq-done-name').textContent = $('#enq-first').value;
      var hd = $('h2', done); hd.setAttribute('tabindex', '-1'); hd.focus();
    });
  }

  /* --- Prototype 5: Neighbourhood (R50–R56) ------------------------------ */
  function initNeighbourhood() {
    var app = $('#hood-app');
    if (!app) return;
    var key = app.getAttribute('data-hood');
    var homes = HOMES.filter(function (h) { return h.hood === key && h.type === 'rental'; });

    // Key strip and size cards from live (sample) data
    var from = Math.min.apply(null, homes.map(function (h) { return h.rent; }));
    $all('[data-hood-count]').forEach(function (el) { el.textContent = homes.length; });
    $all('[data-hood-from]').forEach(function (el) { el.textContent = money(from); });
    $all('.size-card[data-beds]').forEach(function (card) {
      var b = card.getAttribute('data-beds');
      var set = homes.filter(function (h) { return b === '3' ? h.beds >= 3 : String(h.beds) === b; });
      var price = $('b', card), cnt = $('.count', card);
      if (!set.length) {
        card.classList.add('none');
        price.textContent = 'None right now';
        cnt.textContent = 'Get an alert';
        card.setAttribute('href', 'find-a-home.html?hood=' + key);
      } else {
        price.textContent = 'From ' + money(Math.min.apply(null, set.map(function (h) { return h.rent; }))) + ' pcm';
        cnt.textContent = set.length + ' available';
        card.setAttribute('href', 'find-a-home.html?hood=' + key + '&beds=' + b);
      }
    });

    // Map layers
    $all('[data-layer]', app).forEach(function (chip) {
      chip.addEventListener('click', function () {
        var on = chip.getAttribute('aria-pressed') !== 'true';
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
        $all('.poi[data-cat="' + chip.getAttribute('data-layer') + '"]', app).forEach(function (p) { p.hidden = !on; });
      });
    });

    // In-page nav highlights the section in view
    var links = $all('.inpage-nav a', app);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      links.forEach(function (a) { var s = document.getElementById(a.getAttribute('href').slice(1)); if (s) io.observe(s); });
    }
  }

  /* --- Hub: carry the notes toggle default ------------------------------
     Annotations start hidden (house preference for concept packs) unless the
     reviewer has chosen to show them this session. */
  (function defaultNotesHidden() {
    try { if (window.sessionStorage.getItem('wf-notes-hidden') === null) window.sessionStorage.setItem('wf-notes-hidden', '1'); } catch (e) { /* private mode */ }
  })();

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initAccordions();
    initTabs();
    initCarousels();
    initModals();
    initNotes();
    initHeaderHeight();
    initMobileNav();
    initSaved();
    initDrawers();
    initSearch();
    initProperty();
    initCommute();
    initBooking();
    initEnquiry();
    initNeighbourhood();
  });
})();
