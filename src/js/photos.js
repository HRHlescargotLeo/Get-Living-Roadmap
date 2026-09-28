/* ==========================================================================
   photos.js — Get Living photography for the design layer (V2.1)

   Swaps the illustrated placeholders for Get Living's own photography,
   loaded directly from getliving.com. Each image is only applied once it has
   loaded, so anywhere the images can't be reached the illustrated
   placeholder stays in place. Photography © Get Living, used here to show
   how the proposals would look on the live site.
   ========================================================================== */

(function () {
  'use strict';

  var BASE = 'https://www.getliving.com/wp-content/uploads/';
  function u(path) { return BASE + path; }

  /* One lead photo per sample home, chosen from that neighbourhood's
     listings on getliving.com. */
  var HOME = {
    prin0706: u('property-images/PRIN0706/308_printers_counter_kitchen_living.jpeg'),
    mitt0412: u('property-images/MITT0801/408_sadlers_area_living_kitchen(2).jpg'),
    mitt1903: u('property-images/MITT0801/408_sadlers_dining_kitchen(2).jpg'),
    sadl0208: u('property-images/SADL0307/202_guild_armchair_kitchen_living(1).jpg'),
    coop1104: u('property-images/COOP0604/B---103_printers_prints_living_room(8).jpeg'),
    coop2201: u('property-images/PRIN0306/308_printers_living_kitchen_dining(6).jpeg'),
    clay0310: u('property-images/CLAY0402/A---713-Potters-P2-Sofa-Armchair-Kitchen.jpeg'),
    clay0614: u('property-images/CLAY1015/902_hearth_prints_sofa_table(2).jpeg'),
    clay0902: u('property-images/CLAY1018/A--914-Hearth-P2-Living-Area-Manchester-Skyline-View(3).jpeg'),
    'nmy-cl01': u('2026/01/nmy-sofa-dining-kitchen-1920x1280-1-1400x933.jpg'),
    port1508: u('2025/12/portlands-place-bedroom-desk-1400x1000-1.jpg'),
    port2204: u('2023/07/EV-Decorated-Living-Room-1600x1400-1-1400x1225.jpg'),
    vict0906: u('2025/02/the-filigree-reading-1000x600-1.jpg'),
    vict1402: u('2025/05/the-filigree-home-flower-arranging-1920x1280-1-1400x933.jpeg'),
    evil0301: u('2025/05/east-village-aerial-pond-1920x1100-1.jpeg'),
    evil0712: u('2025/12/east-village-cycling-couple-1980x1320-1-1400x934.jpg'),
    elep0511: u('2025/06/elephant-central-remote-working-1000x500-1.jpg'),
    elep1702: u('2025/06/elephant-central-courtyard-skyline-view-1400x1396.jpeg'),
    elep2803: u('2025/06/elephant-central-castle-square-greenery-1920x1280-1.jpeg'),
    fran0011: u('property-images/FRAN0011/18_carter_house_dining_kitchen_living(15).jpeg'),
    fran0027: u('property-images/FRAN0027/67_carter_kitchen_balcony(4).jpeg'),
    fran0103: u('property-images/CART0040/120_carter_house_living_dining_balcony(18).jpeg'),
    'oak-0204': u('2024/09/the-oakgate-pink-bedroom-prints-1400x1400-1.jpeg'),
    'oak-0401': u('2020/07/the-oakgate-work-from-home-1100x1000-1-508x462.jpg')
  };

  /* Printers Place has its own full set of listing photos. */
  var GALLERY = {
    prin0706: [
      u('property-images/PRIN0706/308_printers_counter_kitchen_living.jpeg'),
      u('property-images/PRIN0706/308_printers_cushions_bedroom(1).jpeg'),
      u('property-images/PRIN0706/308_printers_mirror_window_bedroom(2).jpeg'),
      u('property-images/PRIN0706/308_printers_tiled_bathroom_bath(7).jpeg'),
      u('property-images/PRIN0706/308_printers_sofa_tv_stand(3).jpeg'),
      u('property-images/PRIN0706/sherlock_quarter_amenity_seating_6(3).jpeg')
    ]
  };

  /* Shared spaces by neighbourhood, used to fill out other homes' galleries. */
  var SHARED = {
    'sherlock-quarter': [u('property-images/PRIN0706/sherlock_quarter_coworking_pod(2).jpeg'), u('2024/12/sherlock_quarter_gym_1000x600.jpg'), u('property-images/PRIN0706/sherlock_quarter_realm_courtyard_10(2).jpeg')],
    'new-maker-yards': [u('property-images/CLAY0907/NMY-The-Lock-Entrance-Sofas(10).jpeg'), u('property-images/CLAY0907/NMY-The-Lock-Coworking-Bank-and-Booths(9).jpeg'), u('property-images/CLAY0907/NMY-Dog-Canalside(10).jpeg')],
    'east-village': [u('2025/12/portlands-place-workout-1400x1000-1.jpg'), u('2025/02/victory-plaza-concierge-1000x600-1.jpg'), u('2025/05/east-village-aerial-pond-1920x1100-1.jpeg')],
    'elephant-central': [u('2025/06/elephant-central-courtyard-skyline-view-1400x1396.jpeg'), u('2025/06/elephant-central-castle-square-greenery-1920x1280-1.jpeg'), u('2023/08/EC-Road-Buses-1400x1400-1.jpg')],
    'one-maidenhead': [u('property-images/FRAN0027/amenities-coworking-wall-window-one-maidenhead(10).jpeg'), u('2024/07/one-maidenhead-gym-1000x800-1.jpg'), u('2024/04/one_maidenhead_paddleboarding_friends_1920x1280-1400x933.jpeg')],
    'the-oakgate': [u('2024/12/the-oakgate-coworking-1000x600-1.jpg'), u('2024/12/the-oakgate-gym-1000x600-1.jpg'), u('2025/02/the-oakgate-dog-walk-1920x1280-1-1400x933.jpeg')]
  };

  /* Static placeholders, matched on their label text. */
  var LABEL = {
    'find a home': u('2026/01/nmy-sofa-dining-kitchen-1920x1280-1-1400x933.jpg'),
    'property page': u('property-images/PRIN0306/308_printers_living_kitchen_dining(6).jpeg'),
    'book a viewing': u('2025/02/victory-plaza-concierge-1000x600-1.jpg'),
    'renting with us': u('2025/05/one_maidenhead_woman_hug_dog_1720x1280-1400x1042.jpeg'),
    'neighbourhood': u('2024/11/getliving-birmingham-coffee-shop-1400x1400-1.jpeg'),
    'video or photo · the neighbourhood': u('2025/02/sherlock_quarter_woman_bike_520x680.jpg'),
    'photo · sky lounge': u('property-images/PRIN0706/sherlock_quarter_amenity_seating_6(3).jpeg'),
    'photo · gym': u('2024/12/sherlock_quarter_gym_1000x600.jpg'),
    'photo · co-working': u('property-images/PRIN0706/sherlock_quarter_coworking_pod(2).jpeg')
  };
  var RESIDENTS = [
    u('2023/07/EV-Summer-Fete-23-People-Grass-520x680-1.jpg'),
    u('2020/07/sherlock-quarter-couple-sofa-1100X1000-508x462.jpg'),
    u('2025/02/the_oakgate_couple_riverside_walk_520x680.jpg')
  ];

  function hoodOf(id) {
    var list = window.GL_HOMES || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i].hood;
    return 'sherlock-quarter';
  }
  function currentHome() {
    return window.GL_CURRENT_HOME || 'prin0706';
  }

  /* Apply a photo once it has loaded; leave the illustration if it fails. */
  function apply(el, src, opts) {
    if (!el || !src || el.getAttribute('data-photo') === src) return;
    el.setAttribute('data-photo', src);
    var img = new Image();
    img.onload = function () {
      el.style.backgroundImage = (opts && opts.overlay ? opts.overlay + ', ' : '') + 'url("' + src + '")';
      el.classList.add(opts && opts.cls ? opts.cls : 'has-photo');
      if (!el.hasAttribute('role')) {
        el.setAttribute('role', 'img');
        el.setAttribute('aria-label', (el.textContent || 'Photo').trim());
      }
    };
    img.src = src;
  }

  function label(el) { return (el.textContent || '').trim().toLowerCase(); }

  function applyAll(root) {
    root = root || document;

    // Home cards (search results, similar homes, map list, module library)
    root.querySelectorAll('.home-card .media .wf-placeholder').forEach(function (el) {
      var card = el.closest('.home-card');
      var id = card && card.getAttribute('data-id');
      apply(el, HOME[id] || HOME.clay0310);
    });

    // Property gallery
    var gallery = root.querySelectorAll('.gallery .carousel-item .wf-placeholder');
    if (gallery.length) {
      var id = currentHome();
      var set = GALLERY[id] || [HOME[id]].concat(SHARED[hoodOf(id)] || []);
      gallery.forEach(function (el, i) { apply(el, set[i % set.length]); });
    }

    // Booking summary
    root.querySelectorAll('.summary-card .wf-placeholder').forEach(function (el) {
      apply(el, HOME[currentHome()]);
    });

    // Virtual tour: photo behind the play button
    root.querySelectorAll('#tab-tour .wf-placeholder, #tour-modal .wf-placeholder').forEach(function (el) {
      var id = currentHome();
      apply(el, (GALLERY[id] || [HOME[id]])[0], { overlay: 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45))', cls: 'has-photo-tour' });
    });

    // Resident photos in the reviews carousel
    root.querySelectorAll('.carousel-item > .wf-placeholder').forEach(function (el, i) {
      if (label(el) === 'resident photo') apply(el, RESIDENTS[i % RESIDENTS.length]);
    });

    // Everything else matched on its label
    root.querySelectorAll('.wf-placeholder').forEach(function (el) {
      var src = LABEL[label(el)];
      if (src) apply(el, src);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyAll(document);
    // Cards are re-rendered as filters change, so watch for new ones.
    if ('MutationObserver' in window) {
      var pending = false;
      new MutationObserver(function () {
        if (pending) return;
        pending = true;
        window.requestAnimationFrame(function () { pending = false; applyAll(document); });
      }).observe(document.body, { childList: true, subtree: true });
    }
  });
})();
