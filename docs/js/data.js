/* ==========================================================================
   data.js — SAMPLE listing data for the prototypes.
   Neighbourhood and building names and rent levels follow getliving.com on
   28 Sep 2026. Sizes, floors, dates and offers are invented so the layouts
   can be tested against realistic content. Not real availability.
   ========================================================================== */

window.GL_NEIGHBOURHOODS = {
  'east-village':     { name: 'East Village', area: 'Stratford, London E20', city: 'London' },
  'elephant-central': { name: 'Elephant Central', area: 'Elephant & Castle, London SE1', city: 'London' },
  'new-maker-yards':  { name: 'New Maker Yards', area: 'Salford, Manchester M5', city: 'Manchester' },
  'sherlock-quarter': { name: 'Sherlock Quarter', area: 'Birmingham B5', city: 'Birmingham' },
  'one-maidenhead':   { name: 'One Maidenhead', area: 'Maidenhead, Berkshire SL6', city: 'Maidenhead' },
  'the-oakgate':      { name: 'The Oakgate', area: 'Leatherhead, Surrey KT22', city: 'Surrey' }
};

/* beds: 0 = studio. available: 'now' or ISO date. x/y: position on the
   prototype map placeholder, in percent. */
window.GL_HOMES = [
  { id: 'prin0706', hood: 'sherlock-quarter', building: 'Printers Place', postcode: 'B5 6EE', beds: 2, baths: 2, sqft: 732, floor: 7,  furnished: true,  rent: 1450, available: '2026-10-15', pets: true, balcony: false, parking: true,  accessible: false, type: 'rental', offer: null, x: 58, y: 62 },
  { id: 'mitt0412', hood: 'sherlock-quarter', building: 'Mitton House',   postcode: 'B5 6EH', beds: 2, baths: 1, sqft: 689, floor: 4,  furnished: true,  rent: 1345, available: '2026-10-20', pets: true, balcony: false, parking: true,  accessible: false, type: 'rental', offer: 'First month half price', x: 60, y: 60 },
  { id: 'mitt1903', hood: 'sherlock-quarter', building: 'Mitton House',   postcode: 'B5 6EH', beds: 2, baths: 2, sqft: 761, floor: 19, furnished: true,  rent: 1415, available: 'now',        pets: true, balcony: true,  parking: true,  accessible: false, type: 'rental', offer: null, x: 60, y: 60 },
  { id: 'sadl0208', hood: 'sherlock-quarter', building: 'Sadlers Place',  postcode: 'B5 6EG', beds: 1, baths: 1, sqft: 527, floor: 2,  furnished: true,  rent: 1300, available: '2026-11-02', pets: true, balcony: false, parking: false, accessible: true,  type: 'rental', offer: null, x: 56, y: 64 },
  { id: 'coop1104', hood: 'sherlock-quarter', building: 'Cooper House',   postcode: 'B5 6EF', beds: 1, baths: 1, sqft: 541, floor: 11, furnished: true,  rent: 1310, available: '2026-10-08', pets: true, balcony: false, parking: false, accessible: false, type: 'rental', offer: null, x: 57, y: 61 },
  { id: 'coop2201', hood: 'sherlock-quarter', building: 'Cooper House',   postcode: 'B5 6EF', beds: 3, baths: 2, sqft: 1012, floor: 22, furnished: true, rent: 2150, available: '2026-12-01', pets: true, balcony: true,  parking: true,  accessible: false, type: 'rental', offer: null, x: 57, y: 61 },
  { id: 'clay0310', hood: 'new-maker-yards',  building: 'Clay',           postcode: 'M5 4RE', beds: 1, baths: 1, sqft: 538, floor: 3,  furnished: false, rent: 1295, available: 'now',        pets: true, balcony: true,  parking: false, accessible: false, type: 'rental', offer: '4 weeks rent free', x: 44, y: 30 },
  { id: 'clay0614', hood: 'new-maker-yards',  building: 'Clay',           postcode: 'M5 4RE', beds: 1, baths: 1, sqft: 552, floor: 6,  furnished: true,  rent: 1350, available: '2026-10-12', pets: true, balcony: false, parking: false, accessible: false, type: 'rental', offer: null, x: 44, y: 30 },
  { id: 'clay0902', hood: 'new-maker-yards',  building: 'Clay',           postcode: 'M5 4RE', beds: 2, baths: 2, sqft: 774, floor: 9,  furnished: false, rent: 1625, available: '2026-11-15', pets: true, balcony: true,  parking: true,  accessible: true,  type: 'rental', offer: null, x: 45, y: 31 },
  { id: 'nmy-cl01', hood: 'new-maker-yards',  building: 'Clay',           postcode: 'M5 4RE', beds: 1, baths: 1, sqft: 398, floor: 5,  furnished: true,  rent: 1150, available: 'now',        pets: false, balcony: false, parking: false, accessible: false, type: 'co-living', offer: null, x: 45, y: 29 },
  { id: 'port1508', hood: 'east-village',     building: 'Portlands Place', postcode: 'E20 1BF', beds: 1, baths: 1, sqft: 560, floor: 15, furnished: true, rent: 2250, available: '2026-10-05', pets: true, balcony: true,  parking: false, accessible: false, type: 'rental', offer: null, x: 80, y: 78 },
  { id: 'port2204', hood: 'east-village',     building: 'Portlands Place', postcode: 'E20 1BF', beds: 2, baths: 2, sqft: 812, floor: 22, furnished: true, rent: 2995, available: '2026-11-20', pets: true, balcony: true,  parking: true,  accessible: false, type: 'rental', offer: null, x: 80, y: 78 },
  { id: 'vict0906', hood: 'east-village',     building: 'Victory Plaza',  postcode: 'E20 1AS', beds: 0, baths: 1, sqft: 431, floor: 9,  furnished: true,  rent: 1895, available: 'now',        pets: true, balcony: false, parking: false, accessible: false, type: 'rental', offer: null, x: 82, y: 80 },
  { id: 'vict1402', hood: 'east-village',     building: 'Victory Plaza',  postcode: 'E20 1AS', beds: 2, baths: 2, sqft: 845, floor: 14, furnished: true,  rent: 3050, available: '2026-10-28', pets: true, balcony: true,  parking: true,  accessible: true,  type: 'rental', offer: null, x: 82, y: 80 },
  { id: 'evil0301', hood: 'east-village',     building: 'East Village townhouses', postcode: 'E20 1DB', beds: 4, baths: 3, sqft: 1480, floor: 0, furnished: false, rent: 4695, available: '2027-01-10', pets: true, balcony: false, parking: true, accessible: false, type: 'rental', offer: null, x: 79, y: 76 },
  { id: 'evil0712', hood: 'east-village',     building: 'East Village',   postcode: 'E20 1AB', beds: 3, baths: 2, sqft: 1030, floor: 7,  furnished: false, rent: 3595, available: '2026-12-05', pets: true, balcony: true,  parking: true,  accessible: false, type: 'rental', offer: null, x: 81, y: 77 },
  { id: 'elep0511', hood: 'elephant-central', building: 'Elephant Central', postcode: 'SE1 6FD', beds: 1, baths: 1, sqft: 548, floor: 5, furnished: true, rent: 2195, available: 'now',        pets: true, balcony: true,  parking: false, accessible: false, type: 'rental', offer: null, x: 74, y: 84 },
  { id: 'elep1702', hood: 'elephant-central', building: 'Elephant Central', postcode: 'SE1 6FD', beds: 2, baths: 2, sqft: 790, floor: 17, furnished: true, rent: 2875, available: '2026-11-01', pets: true, balcony: true,  parking: false, accessible: false, type: 'rental', offer: '2 weeks rent free', x: 74, y: 84 },
  { id: 'elep2803', hood: 'elephant-central', building: 'Elephant Central', postcode: 'SE1 6FD', beds: 3, baths: 2, sqft: 1044, floor: 28, furnished: false, rent: 3895, available: '2027-01-15', pets: true, balcony: true, parking: false, accessible: true, type: 'rental', offer: null, x: 74, y: 84 },
  { id: 'fran0011', hood: 'one-maidenhead',   building: 'Francis House',  postcode: 'SL6 1FG', beds: 2, baths: 2, sqft: 748, floor: 3,  furnished: true,  rent: 1899, available: 'now',        pets: true, balcony: true,  parking: true,  accessible: false, type: 'rental', offer: null, x: 66, y: 83 },
  { id: 'fran0027', hood: 'one-maidenhead',   building: 'Francis House',  postcode: 'SL6 1FG', beds: 3, baths: 2, sqft: 1005, floor: 5, furnished: true,  rent: 2600, available: '2026-10-30', pets: true, balcony: true,  parking: true,  accessible: false, type: 'rental', offer: null, x: 66, y: 83 },
  { id: 'fran0103', hood: 'one-maidenhead',   building: 'Francis House',  postcode: 'SL6 1FG', beds: 1, baths: 1, sqft: 522, floor: 1,  furnished: false, rent: 1495, available: '2026-11-10', pets: true, balcony: false, parking: true,  accessible: true,  type: 'rental', offer: null, x: 66, y: 83 },
  { id: 'oak-0204', hood: 'the-oakgate',      building: 'The Oakgate',    postcode: 'KT22 7AF', beds: 2, baths: 2, sqft: 781, floor: 2,  furnished: false, rent: 2150, available: '2026-10-18', pets: true, balcony: true,  parking: true,  accessible: false, type: 'rental', offer: null, x: 72, y: 90 },
  { id: 'oak-0401', hood: 'the-oakgate',      building: 'The Oakgate',    postcode: 'KT22 7AF', beds: 1, baths: 1, sqft: 534, floor: 4,  furnished: false, rent: 1625, available: 'now',        pets: true, balcony: true,  parking: true,  accessible: false, type: 'rental', offer: null, x: 72, y: 90 }
];

window.GL_BED_LABEL = function (b) { return b === 0 ? 'Studio' : b + ' bedroom' + (b > 1 ? 's' : ''); };
window.GL_AVAIL_LABEL = function (a) {
  if (a === 'now') return 'Available now';
  var d = new Date(a + 'T00:00:00');
  return 'Available ' + d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
window.GL_MONEY = function (n) { return '£' + n.toLocaleString('en-GB', { maximumFractionDigits: 0 }); };
window.GL_MONEY2 = function (n) { return '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
