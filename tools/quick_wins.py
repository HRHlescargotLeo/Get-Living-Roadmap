#!/usr/bin/env python3
"""Writes the quick-win pages into src/quick-wins/ and the list of quick wins
into src/js/quick-wins.js (JSON data only).

Run from the project root, then build as usual:
    python3 tools/quick_wins.py && node build-includes.js && node validate.js

Each quick win is shown on its own, against the current getliving.com, with a
"Today / With this change" switch. No estimates appear anywhere in the pages.
"""
import json
import os
from html import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'src', 'quick-wins')

THEMES = [
    ('search', 'Finding a home'),
    ('home', 'The property page'),
    ('trust', 'Proposition and trust'),
    ('hoods', 'Neighbourhoods'),
    ('content', 'Content and search visibility'),
    ('residents', 'Residents'),
    ('look', 'Look and feel'),
]

# Photos (paths under getliving.com/wp-content/uploads/), matched to sample homes
P = {
    'clay': 'property-images/CLAY0402/A---713-Potters-P2-Sofa-Armchair-Kitchen.jpeg',
    'sadl': 'property-images/SADL0307/202_guild_armchair_kitchen_living(1).jpg',
    'coop': 'property-images/COOP0604/B---103_printers_prints_living_room(8).jpeg',
    'mitt': 'property-images/MITT0801/408_sadlers_area_living_kitchen(2).jpg',
    'prin': 'property-images/PRIN0706/308_printers_counter_kitchen_living.jpeg',
    'prin2': 'property-images/PRIN0306/308_printers_living_kitchen_dining(6).jpeg',
    'clay2': 'property-images/CLAY1015/902_hearth_prints_sofa_table(2).jpeg',
    'clay3': 'property-images/CLAY1018/A--914-Hearth-P2-Living-Area-Manchester-Skyline-View(3).jpeg',
    'fran': 'property-images/FRAN0011/18_carter_house_dining_kitchen_living(15).jpeg',
    'cart': 'property-images/CART0040/120_carter_house_living_dining_balcony(18).jpeg',
    'oak': '2024/09/the-oakgate-pink-bedroom-prints-1400x1400-1.jpeg',
    'ev': '2023/07/EV-Decorated-Living-Room-1600x1400-1-1400x1225.jpg',
    'hero': '2024/04/EV-Victory-Parade-Signorelli-People-Waiting-by-Frank-Da-Silva-1920x1080-1-1400x788.jpeg',
    'dog': '2025/05/one_maidenhead_woman_hug_dog_1720x1280-1400x1042.jpeg',
    'dogwalk': '2025/02/the-oakgate-dog-walk-1920x1280-1-1400x933.jpeg',
    'pond': '2025/05/east-village-aerial-pond-1920x1100-1.jpeg',
    'fete': '2023/07/EV-Summer-Fete-23-People-Grass-520x680-1.jpg',
    'cycle': '2025/12/east-village-cycling-couple-1980x1320-1-1400x934.jpg',
    'sqbike': '2025/02/sherlock_quarter_woman_bike_520x680.jpg',
    'cowork': 'property-images/PRIN0706/sherlock_quarter_coworking_pod(2).jpeg',
    'gym': '2024/12/sherlock_quarter_gym_1000x600.jpg',
    'coffee': '2024/11/getliving-birmingham-coffee-shop-1400x1400-1.jpeg',
    'edit1': '2025/06/elephant-central-shard-view-520x680-1.jpg',
    'edit2': '2025/06/new-maker-yards-canalside-520x680-1.jpg',
    'edit3': '2024/04/one_maidenhead_dining_outdoors_780x1020.jpg',
}
WASH = 'linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6))'


def img(key, label, ratio='ratio-4-3', overlay=None):
    o = f' data-overlay="{overlay}"' if overlay else ''
    return f'<div class="wf-placeholder {ratio}" data-img="{escape(P[key])}"{o}>{escape(label)}</div>'


def card_now(key, badge, price, beds, addr, desc):
    """A listing card as it appears on getliving.com today."""
    return f'''<article class="gl-card">
  <div class="media">{img(key, 'Listing photo')}<span class="badge solid">{badge}</span></div>
  <div class="body">
    <div class="price">{price} <small>pcm</small></div>
    <strong>{beds}</strong>
    <span class="muted">{addr}</span>
    <p class="caps">{desc}</p>
    <div><span class="btn btn-secondary btn-sm">View this home</span></div>
  </div>
</article>'''


def card_new(key, badges, price, title, addr, facts, line=''):
    b = ''.join(f'<span class="badge{" solid" if i == 0 else ""}">{x}</span>' for i, x in enumerate(badges))
    f = ''.join(f'<div><b>{v}</b>{k}</div>' for v, k in facts)
    l = f'<p class="caps">{line}</p>' if line else ''
    return f'''<article class="home-card">
  <div class="media">{img(key, 'Listing photo')}<div class="badges">{b}</div><span class="save-btn" aria-hidden="true">Save</span></div>
  <div class="body">
    <div class="price">{price} <small>pcm</small></div>
    <h3>{title}</h3>
    <p class="addr">{addr}</p>
    <div class="facts">{f}</div>
    {l}
    <div class="actions"><span class="btn btn-sm">View this home</span></div>
  </div>
</article>'''


def mini(key, price, beds, place, extra=False):
    hid = ' data-extra hidden' if extra else ''
    return f'<div class="mini-card"{hid}>{img(key, "Photo", "ratio-16-9")}<div class="body"><b>{price} pcm</b>{beds} · {place}</div></div>'


CAPS_1 = ('Premium 1 BEDROOM FULLY FURNISHED apartment at Sherlock Quarter in Birmingham City Centre with '
          'open-plan living, dining and kitchen space. Enjoy a spacious bedroom and bathroom, with integrated '
          'STORAGE, alongside a GYM, CO-WORKING SPACES, LOUNGE &amp; courtyard GARDENS for PET-FRIENDLY living.')
CAPS_2 = 'MOVE IN NOW! Modern home walkable to Castlefield and Spinningfields. Co-working space, Wi-Fi and maintenance all included.'

MINIS = [('clay', '£1,295', '1 bed', 'Clay'), ('sadl', '£1,300', '1 bed', 'Sadlers Place'), ('coop', '£1,310', '1 bed', 'Cooper House'),
         ('mitt', '£1,345', '2 bed', 'Mitton House'), ('clay2', '£1,350', '1 bed', 'Clay'), ('prin2', '£1,415', '2 bed', 'Mitton House'),
         ('prin', '£1,450', '2 bed', 'Printers Place'), ('cart', '£1,495', '1 bed', 'Francis House'), ('clay3', '£1,625', '2 bed', 'Clay'),
         ('oak', '£1,625', '1 bed', 'The Oakgate'), ('ev', '£1,895', 'Studio', 'Victory Plaza'), ('fran', '£1,899', '2 bed', 'Francis House'),
         ('cart', '£2,150', '2 bed', 'The Oakgate'), ('ev', '£2,195', '1 bed', 'Elephant Central'), ('prin', '£2,250', '1 bed', 'Portlands Place'),
         ('fran', '£2,600', '3 bed', 'Francis House'), ('mitt', '£2,875', '2 bed', 'Elephant Central'), ('clay3', '£2,995', '2 bed', 'Portlands Place')]

QW = []


def qw(**k):
    QW.append(k)


# ---------------------------------------------------------------------------
# Finding a home
# ---------------------------------------------------------------------------
qw(slug='card-facts', theme='search', title='Show the facts renters compare on every card',
   summary='Size, floor, bathrooms and furnished status on every search result, in place of a paragraph of capitals.',
   url='getliving.com/find-a-home/', also='Also part of prototype 1, Find a home.',
   why="People compare homes on a handful of facts: how big, which floor, how many bathrooms, furnished or not. Today's cards lead with a paragraph of description that leaves most of those out, so the renter has to open each home to find them. Putting four facts on the card is a template change, and the data almost certainly exists already in the letting system.",
   before_cap='The card leads with a paragraph of description. Floor area, floor and bathrooms are missing.',
   after_cap='Four facts in a row on every card; the description moves to the property page.',
   before=f'<div class="mini-grid">{card_now("sadl", "Available now", "£1,300", "1 bedroom", "Sadlers Place, Birmingham, B5 6EG", CAPS_1)}{card_now("clay", "Available now", "£1,295", "1 bedroom", "Clay, Manchester, M5 4RE", CAPS_2)}</div>',
   after=f'<div class="mini-grid">{card_new("sadl", ["Available now"], "£1,300", "1 bedroom, Sadlers Place", "Sherlock Quarter · B5 6EG", [("527", "sq ft"), ("2", "floor"), ("1", "bath"), ("Yes", "furnished")])}{card_new("clay", ["Available now"], "£1,295", "1 bedroom, Clay", "New Maker Yards · M5 4RE", [("538", "sq ft"), ("3", "floor"), ("1", "bath"), ("No", "furnished")])}</div>')

before_minis = ''.join(mini(*m) for m in MINIS[:6])
after_minis = ''.join(mini(*m) for m in MINIS[:12]) + ''.join(mini(*m, extra=True) for m in MINIS[12:])
qw(slug='more-results', theme='search', title='Show more results per page',
   summary='Twelve homes at a time with a "Load more" button, instead of six per page with numbered pages.',
   url='getliving.com/find-a-home/', also='Also part of prototype 1, Find a home.',
   why="Search results currently arrive six at a time, with numbered pages underneath. Every page turn is one more step between the renter and the home they are looking for. Showing twelve and loading more in place keeps people browsing, and it is a setting and a small piece of front-end work rather than a new feature.",
   before_cap='Six homes per page, then numbered pages.',
   after_cap='Twelve homes, then "Load more" adds the next set in place. Try it.',
   before=f'<div class="mini-grid">{before_minis}</div><div class="pager-mock"><span class="on">1</span><span>2</span><span>3</span><span>…</span><span>9</span><span>»</span></div><p class="pager-mock">Results per page: <span class="on">6</span><span>9</span><span>12</span><span>15</span></p>',
   after=f'<div class="mini-grid" id="lm-grid">{after_minis}</div><p class="load-more"><button type="button" class="btn btn-secondary" data-loadmore="lm-grid" data-remaining="67">Load more homes (67 more)</button></p>')

qw(slug='offer-badges', theme='search', title='Show offers on the card',
   summary='One consistent offer badge on the photo, instead of offers written into the description in capitals.',
   url='getliving.com/find-a-home/', also='',
   why='Incentives are currently written into the listing text ("MOVE IN NOW!", "MOVE IN OCTOBER!"), which makes them easy to miss and impossible to filter. A badge driven from a field in the CMS can be switched on and off by the leasing team, and the same field can power an "Offers" filter later.',
   before_cap='The offer is part of the description.',
   after_cap='The offer is a badge on the photo, set from one field and easy to switch off.',
   before=f'<div class="mini-grid">{card_now("clay", "Available now", "£1,295", "1 bedroom", "Clay, Manchester, M5 4RE", CAPS_2)}</div>',
   after=f'<div class="mini-grid">{card_new("clay", ["Available now", "4 weeks rent free"], "£1,295", "1 bedroom, Clay", "New Maker Yards · M5 4RE", [("538", "sq ft"), ("3", "floor"), ("1", "bath"), ("No", "furnished")], "Modern home walkable to Castlefield and Spinningfields. Offer applies to tenancies starting by 31 October.")}</div><p class="wf-meta" style="margin-top:1rem">The offer shown is an example.</p>')

qw(slug='co-living', theme='search', title='Make co-living easy to find',
   summary='Co-living gets its own entry in the Homes menu and a short landing page, rather than living only inside the search filter.',
   url='getliving.com/find-a-home/', also='',
   why='Get Living offers co-living, but the only place we found it is the "I would like a" option at the top of the search filters. Anyone who might want it has to know it exists first. A menu entry and a short page explaining how it differs from renting a whole home costs very little and makes a product the business already runs visible.',
   before_cap='Co-living appears only as an option inside the search filter.',
   after_cap='"Co-living" sits in the Homes menu, with a one-line explanation. Open the menu.',
   before='''<div class="filter panel"><div class="field"><label for="qw-type">I would like a</label><select id="qw-type"><option>Rental</option><option>Co-Living</option></select></div><div class="field"><label for="qw-loc">Location</label><select id="qw-loc"><option>Please select...</option></select></div></div>''',
   after='''<div class="gl-bar qw-black"><span class="qw-wordmark">getliving</span><div class="gl-bar-links"><span>Locations</span>
<div class="mock-menu"><button type="button" class="mock-menu-trigger" aria-expanded="false">Homes ▾</button>
<div class="mock-menu-panel"><div><h4>Rent a home</h4><ul><li>Find a home</li><li>Homes by neighbourhood</li><li>Saved homes</li></ul></div>
<div><h4>Co-living <span class="badge">New</span></h4><p class="wf-meta">[One line describing Get Living's co-living offer.]</p><p><span class="btn btn-sm">Explore co-living</span></p></div></div></div>
<span>Lifestyle</span><span>The Edit</span></div></div>''')

# ---------------------------------------------------------------------------
# The property page
# ---------------------------------------------------------------------------
FINE = '''<h4>The fine print:</h4><p>Photos are for illustrative purposes only – layouts and features may vary. A Security Deposit equal to five weeks' rent, or taking a deposit alternative product from our partner, Reposit, is required. Reposit is offered as an alternative to a traditional cash deposit and is subject to successfully passing referencing with HomeLet. Get Living will receive a commission where Reposit is selected. The deposit will be held by the Tenancy Deposit Scheme. Pet friendly: all applicants with a pet must sign our pet policy agreement. Council tax band: C, D or E (Birmingham City Council to confirm at point of move-in).</p><h4>Utilities:</h4><p>Glide Wi-Fi is included in the rent. All other utilities including electricity to be paid separately by the resident(s) directly to the provider. Sherlock Quarter homes are heated by electricity and charged by household usage…</p>'''
qw(slug='key-facts', theme='home', title='A key facts panel at the top of every home',
   summary='Rent, size, floor, EPC, council tax band, furnished, availability and pets in one panel beside the photos.',
   url='getliving.com/find-a-home/sherlock-quarter/2/prin0706/', also='Also part of prototype 2, Property page.',
   why="The facts a renter needs before booking a viewing are on the page today, but most of them sit in 'The fine print' at the bottom, in paragraphs. Pulling them into one panel next to the photos uses information that is already there.",
   before_cap='Price, bedrooms and address at the top; everything else is in "The fine print" further down.',
   after_cap='The same facts, pulled into one panel beside the photos.',
   before=f'''<div class="split"><div>{img("prin", "Listing photo", "ratio-16-9")}</div><div class="stack"><div class="price" style="font-size:1.75rem;font-weight:700">£1,450 pcm</div><strong>2 bedrooms</strong><span>Printers Place, Birmingham, B5 6EE</span><div class="row"><span class="btn btn-secondary btn-sm">Request a Viewing</span><span class="btn btn-sm">Make an Enquiry</span></div></div></div><div class="fineprint" style="margin-top:1.5rem">{FINE}</div>''',
   after=f'''<div class="split"><div>{img("prin", "Listing photo", "ratio-16-9")}</div><aside class="panel facts-panel" style="position:static"><div class="price">£1,450 <small>pcm</small></div><dl class="kv"><dt>Bedrooms</dt><dd>2</dd><dt>Bathrooms</dt><dd>2</dd><dt>Size</dt><dd>732 sq ft (68 m²)</dd><dt>Floor</dt><dd>7</dd><dt>Furnished</dt><dd>Furnished</dd><dt>Available</dt><dd>15 Oct 2026</dd><dt>EPC rating</dt><dd>B</dd><dt>Council tax</dt><dd>Band C–E</dd><dt>Pets</dt><dd>Welcome, no extra cost</dd></dl><span class="btn btn-block">Book a viewing</span></aside></div>''')

qw(slug='move-in-costs', theme='home', title='Break down the cost of moving in',
   summary='A short table of what is paid, and when, before moving in.',
   url='getliving.com/find-a-home/sherlock-quarter/2/prin0706/', also='Also part of prototype 2, Property page.',
   why="Deposit options, the reservation payment and when the first month's rent is due are all explained somewhere, across the listing and the FAQs. A renter working out whether they can afford to move has to assemble the figures themselves. A small table on each home, calculated from the rent, answers it in one place.",
   before_cap='Deposit and payment terms are described in a paragraph.',
   after_cap='The amounts, and when each is due, in one table.',
   before='<div class="fineprint"><h4>The fine print:</h4><p>A Security Deposit equal to five weeks\' rent, or taking a deposit alternative product from our partner, Reposit, is required. Reposit is offered as an alternative to a traditional cash deposit and is subject to successfully passing referencing with HomeLet. Get Living will receive a commission where Reposit is selected. The deposit will be held by the Tenancy Deposit Scheme.</p></div>',
   after='''<h3 style="margin-bottom:1rem">What you pay to move in</h3><table class="cost-table"><tbody>
<tr><th scope="row">Reservation payment<span class="sub">Due when you reserve. Comes off your first month's rent.</span></th><td>£334.62</td></tr>
<tr><th scope="row">Security deposit (5 weeks)<span class="sub">Held by the Tenancy Deposit Scheme. Or choose Reposit, one week's rent, not returned.</span></th><td>£1,673.08</td></tr>
<tr><th scope="row">First month's rent, less your reservation<span class="sub">Due once you've signed, before you collect your keys.</span></th><td>£1,115.38</td></tr>
</tbody><tfoot><tr><th scope="row">Total before you move in</th><td>£3,123.08</td></tr></tfoot></table><p class="wf-meta" style="margin-top:0.75rem">Figures for a home at £1,450 pcm. Wording to be confirmed by Get Living.</p>''')

qw(slug='listing-copy', theme='home', title='Rewrite listing copy to a house style',
   summary='Short, plain descriptions with amenities as a list, instead of capitals for emphasis.',
   url='getliving.com/find-a-home/', also='',
   why='Many listings use capitals to pick out features ("2 BEDROOM FULLY FURNISHED", "GYM"), and the same paragraph repeats across homes in a building. It reads as shouting and makes every home sound alike. A one-page copy guide for the leasing team and a one-off clean-up of live listings is mostly writing, not development.',
   before_cap='Capitals for emphasis; the same paragraph on every home in the building.',
   after_cap='One plain sentence about the home, then amenities as a list.',
   before=f'<p class="caps" style="max-width:70ch">{CAPS_1}</p>',
   after='<div style="max-width:70ch"><p class="lead">A furnished one-bedroom with open-plan living and plenty of built-in storage, a short walk from New Street.</p><div class="chips-row"><span class="tag-chip">Gym</span><span class="tag-chip">Co-working</span><span class="tag-chip">Resident lounge</span><span class="tag-chip">Courtyard gardens</span><span class="tag-chip">Pet-friendly</span></div></div>')

qw(slug='getting-around', theme='home', title='Put journey times on the home, not just the neighbourhood',
   summary='Walk times to stations and landmarks, and a commute checker, on every property page.',
   url='getliving.com/find-a-home/sherlock-quarter/2/prin0706/', also='Also part of prototype 2, Property page.',
   why="Each listing has a 'Your location' paragraph, and East Village's neighbourhood page has a commute calculator, but the property pages have neither a map nor a way to check a journey. Commute is one of the first things a renter checks. The calculator already exists on the site; reusing it on property pages is a small change.",
   before_cap='Location is a paragraph of text.',
   after_cap='Walk times as a list, a map, and a commute check. Try entering a destination.',
   before='<h4 class="fineprint" style="color:inherit">YOUR LOCATION</h4><p style="max-width:70ch">Within walking distance of the Bullring and key public transport routes, Sherlock Quarter is here to put you front and centre. Living in the heart of the Birmingham City Centre and just a 14-minute walk from New Street Station, Sherlock Quarter provides you with easy access to Wolverhampton, Coventry, Leicester, London, and beyond.</p>',
   after='''<div class="split"><div class="map-canvas" style="min-height:300px"><div class="wf-placeholder">Map · Printers Place and nearby stations</div><span class="poi home" style="left:52%;top:58%">Printers Place</span><span class="poi" style="left:36%;top:30%">New Street</span><span class="poi" style="left:66%;top:34%">Moor Street</span></div>
<div><ul class="walk-list"><li><span>New Street station</span><span>14 min walk</span></li><li><span>Bullring and Grand Central</span><span>9 min walk</span></li><li><span>Moor Street station</span><span>12 min walk</span></li></ul><p class="wf-meta">Walk times other than New Street are illustrative.</p>
<form data-commute novalidate style="margin-top:1rem"><div class="field"><label for="qw-commute">Where do you travel to?</label><input type="text" id="qw-commute" placeholder="Office, university or postcode" required><p class="field-error" hidden>Enter a place or postcode</p></div><div class="field"><label for="qw-mode">How</label><select id="qw-mode"><option value="transit">Public transport</option><option value="cycle">Cycling</option><option value="walk">Walking</option></select></div><button type="submit" class="btn btn-secondary">Check journey time</button></form><div class="commute-result" hidden></div></div></div>''')

qw(slug='similar-homes', theme='home', title='Show similar homes, and the rest of the building',
   summary='The block at the foot of each home shows genuinely similar homes and links to everything else in the same building.',
   url='getliving.com/find-a-home/sherlock-quarter/2/prin0706/', also='Also part of prototype 2, Property page.',
   why="The foot of each property page currently shows 'our latest properties to rent' in the neighbourhood. Matching on bedrooms and price, and adding a link to every home in the same building, gives a renter who likes the building but not this flat somewhere to go next.",
   before_cap='"Our latest properties to rent", with no link to the rest of the building.',
   after_cap='Similar homes by size and price, and a link to every home in Printers Place.',
   before=f'<h3 style="margin-bottom:1rem">Explore our latest properties to rent</h3><div class="mini-grid">{mini("mitt", "£1,345", "2 bed", "Mitton House")}{mini("prin2", "£1,350", "2 bed", "Printers Place")}{mini("prin2", "£1,415", "2 bed", "Mitton House")}</div>',
   after=f'<div class="row between" style="margin-bottom:1rem"><h3 style="margin:0">Similar homes</h3><a href="#">See all 6 homes in Printers Place</a></div><div class="mini-grid">{mini("mitt", "£1,345", "2 bed", "Mitton House · same size")}{mini("fran", "£1,899", "2 bed", "Francis House · Maidenhead")}{mini("clay3", "£1,625", "2 bed", "Clay · Manchester")}</div>')

# ---------------------------------------------------------------------------
# Proposition and trust
# ---------------------------------------------------------------------------
qw(slug='tenancy-copy', theme='trust', title="Update tenancy copy for the Renters' Rights Act",
   summary='Replace the three-year tenancy wording with copy that reflects rolling tenancies.',
   url='getliving.com/living-with-us/', also='Also part of prototype 4, Renting with us.',
   why="'Living with us' still says tenancies are 'offered at three-years standard' with a break clause. New tenancies in England have been periodic since 1 May 2026, so the line is out of date whatever else the site does. This is a copy change, to be checked by Get Living's legal team.",
   before_cap="Today's wording on Living with us.",
   after_cap='Draft replacement copy, for Get Living\'s legal team to check.',
   before='<blockquote class="wf-quote qw-plain"><p>"When it comes to tenancies we believe in transparency and keeping things simple. Our tenancy contracts are offered at three-years standard to give you security with the flexibility of a break clause*."</p></blockquote>',
   after='<blockquote class="wf-quote qw-plain"><p>"Your tenancy rolls on month by month, with no fixed end date, so you can stay for as long as you like. If you decide to move on, give us two months\' notice at any time. Rent is reviewed no more than once a year, with two months\' notice of any change."</p></blockquote>')

qw(slug='renters-rights', theme='trust', title="Explain the Renters' Rights Act in plain English",
   summary='A short explainer of what the new rules mean for a Get Living resident, linked from search and property pages.',
   url='getliving.com/faqs/', also='Also part of prototype 4, Renting with us.',
   why="The FAQs point to a separate set of questions on 'Renters Reform', but nothing on the main journey explains what the change means for someone renting with Get Living. Most of what the Act asks of landlords is how Get Living already works, which makes it a reason to rent here rather than a compliance note.",
   before_cap='A link from the FAQs to a separate set of questions.',
   after_cap='Five plain questions and answers, shown where renters are deciding.',
   before='<p style="max-width:70ch">Do you have any questions or concerns about the government Renters Rights Act? <a href="#">Read our dedicated FAQs on Renters Reform</a></p>',
   after='''<h3 style="margin-bottom:1rem">The new renting rules, and what they mean for you</h3><div class="accordion" data-single>
<div class="accordion-item open"><button type="button" class="accordion-title">How long is my tenancy?<span class="accordion-icon">&#9662;</span></button><div class="accordion-content"><p>It rolls on month by month, with no fixed end date.</p></div></div>
<div class="accordion-item"><button type="button" class="accordion-title">How do I leave?<span class="accordion-icon">&#9662;</span></button><div class="accordion-content"><p>Give us two months' notice in writing, at any time.</p></div></div>
<div class="accordion-item"><button type="button" class="accordion-title">Can my rent go up?<span class="accordion-icon">&#9662;</span></button><div class="accordion-content"><p>No more than once a year, with two months' written notice.</p></div></div>
<div class="accordion-item"><button type="button" class="accordion-title">Can I have a pet?<span class="accordion-icon">&#9662;</span></button><div class="accordion-content"><p>Yes. Pets have always been welcome at Get Living, at no extra cost.</p></div></div>
</div><p class="wf-meta" style="margin-top:0.75rem">Draft wording for Get Living's legal team to check.</p>''')

qw(slug='verified-reviews', theme='trust', title='Show verified reviews',
   summary='An independent review score and recent verified reviews from HomeViews, alongside the testimonials Get Living has chosen.',
   url='getliving.com/', also='Also part of prototypes 4 and 5.',
   why="Get Living has 1,357 verified reviews on HomeViews with an average of 4.42, but the site shows three testimonials in a carousel. Renters tend to trust an independent score more than a quote the company chose. This is mostly a matter of placing the score and a few recent reviews on the right pages.",
   before_cap='Three testimonials in a carousel.',
   after_cap='An independent score, with the number of reviews behind it.',
   before='<div class="qw-sagedk"><h3 class="qw-display" style="text-align:center">our residents say...</h3><p style="text-align:center;max-width:60ch;margin:0 auto">[Resident testimonial from the current homepage]</p><p style="text-align:center;font-weight:700;margin-top:0.75rem">Resident name, Neighbourhood</p></div>',
   after='''<div class="grid grid-2"><div class="panel"><div class="review-score"><div><div class="big">4.42</div><div class="wf-meta">out of 5 · 1,357 verified reviews</div><div class="wf-placeholder logo" style="margin-top:0.5rem">HomeViews</div></div>
<div class="bars"><div class="bar"><span>Location</span><i><span style="width:92%"></span></i><b>4.6</b></div><div class="bar"><span>Experience</span><i><span style="width:90%"></span></i><b>4.5</b></div><div class="bar"><span>Design</span><i><span style="width:90%"></span></i><b>4.5</b></div></div></div></div>
<blockquote class="wf-quote"><p>[Most recent verified review, 30–60 words.]</p><cite>Resident · East Village · HomeViews</cite></blockquote></div>''')

qw(slug='compare-landlord', theme='trust', title='Compare renting with Get Living and a typical private let',
   summary='A simple comparison table alongside the existing "10 reasons to rent" list.',
   url='getliving.com/living-with-us/', also='Also part of prototype 4, Renting with us.',
   why="'10 reasons to rent with Get Living' is a list of features, and the comparison with renting privately is left to the reader. A table makes the difference obvious at a glance. It is a content block using information already on the page.",
   before_cap='A list of reasons.',
   after_cap='The same reasons set against a typical private let.',
   before='<h3 style="margin-bottom:1rem">10 reasons to rent with Get Living</h3><ol style="padding-left:1.25rem;display:grid;gap:0.35rem;max-width:60ch"><li>Fully furnished, new-build homes</li><li>Wi-Fi included in the rent</li><li>Pets welcome at no extra cost</li><li>No hidden fees</li><li>Friendly on-site teams</li><li>Resident app for bills and repairs</li><li>Resident events</li><li>Green spaces on your doorstep</li><li>Bike storage</li><li>No middlemen</li></ol>',
   after='''<div class="table-wrap"><table class="cmp-table"><thead><tr><th scope="col">What you get</th><th scope="col">Get Living</th><th scope="col">Typical private let</th></tr></thead><tbody>
<tr><th scope="row">Who you deal with</th><td class="yes">Get Living, directly</td><td class="no">Landlord, often through an agent</td></tr>
<tr><th scope="row">Repairs</th><td class="yes">On-site maintenance team</td><td class="no">Varies</td></tr>
<tr><th scope="row">Wi-Fi</th><td class="yes">Included</td><td class="no">You set up and pay</td></tr>
<tr><th scope="row">Pets</th><td class="yes">Welcome, no extra cost</td><td class="no">Must be considered</td></tr>
<tr><th scope="row">Shared spaces and events</th><td class="yes">Gyms, lounges, co-working, events</td><td class="no">Rarely</td></tr>
</tbody></table></div>''')

qw(slug='survey-figures', theme='trust', title='Back up the service claims with resident survey figures',
   summary='Two or three headline figures from Get Living\'s own resident survey.',
   url='getliving.com/living-with-us/', also='',
   why="The site describes friendly teams and dedicated maintenance, but gives no figures to support it. If Get Living runs a resident survey, two or three headline results turn a claim into evidence. The figures shown here are placeholders until we know what the survey covers.",
   before_cap='Service described in words.',
   after_cap='The same claim, with figures from the resident survey (placeholders).',
   before='<p class="lead" style="max-width:60ch">Our friendly resident teams, dedicated maintenance and on-site security make everyday life a breeze.</p>',
   after='<div class="statistics"><div class="stat-item"><div class="stat-value">[xx]%</div><div class="stat-title">would recommend us</div><div class="stat-description">Resident survey, [year]</div></div><div class="stat-item"><div class="stat-value">[xx]%</div><div class="stat-title">of repairs fixed first time</div><div class="stat-description">Last 12 months</div></div><div class="stat-item"><div class="stat-value">[xx]%</div><div class="stat-title">renewed their stay</div><div class="stat-description">Last 12 months</div></div></div>')

qw(slug='accreditations', theme='trust', title='Show accreditations where money changes hands',
   summary='Deposit and client money protection logos next to the deposit information, not only in the footer.',
   url='getliving.com/find-a-home/sherlock-quarter/2/prin0706/', also='Also part of prototype 2, Property page.',
   why="Get Living's accreditations sit in the footer of every page, which is where nobody looks at the moment they are being asked for a deposit. Repeating the relevant two or three next to the deposit information reassures at the point of decision, using logos the site already has.",
   before_cap='Accreditation logos in the footer.',
   after_cap='The relevant logos beside the deposit and payment details.',
   before='<div class="qw-black" style="padding:1.5rem"><p style="font-weight:700;margin-bottom:0.75rem">Awards &amp; Accreditations</p><div class="trust-row"><div class="wf-placeholder">EG Awards</div><div class="wf-placeholder">ARL</div><div class="wf-placeholder">GRESB</div><div class="wf-placeholder">TPO</div><div class="wf-placeholder">CTSI</div><div class="wf-placeholder">Propertymark CMP</div></div></div>',
   after='<div class="split"><div><table class="cost-table"><tbody><tr><th scope="row">Security deposit (5 weeks)<span class="sub">Held by the Tenancy Deposit Scheme</span></th><td>£1,673.08</td></tr></tbody></table></div><div class="panel"><p style="font-weight:700">Your money is protected</p><div class="trust-row"><div class="wf-placeholder">Tenancy Deposit Scheme</div><div class="wf-placeholder">Propertymark CMP</div><div class="wf-placeholder">The Property Ombudsman</div></div></div></div>')

# ---------------------------------------------------------------------------
# Neighbourhoods
# ---------------------------------------------------------------------------
SIZES = [('studio', 'A cosy studio in East Village with pockets of space for dining and relaxing.', '£1,895', 1),
         ('1 bedroom', 'One bedroom flats with open plan dining and living area.', '£2,250', 1),
         ('2 bedrooms', 'Modern two bedroom flats with plenty of hidden storage.', '£2,995', 2),
         ('3 bedrooms', 'Three bedroom flats with Zone 2 connectivity.', '£3,595', 1),
         ('4 bedrooms', 'Four bedroom townhouses and apartments with space for social and family life.', '£4,695', 1)]
before_sizes = ''.join(f'<div class="perk"><b class="qw-display">{n}</b><p class="wf-meta">{d}</p><span class="btn btn-secondary btn-sm">Find a home</span></div>' for n, d, p, c in SIZES)
after_sizes = ''.join(f'<a class="size-card" href="#"><span>{n[0].upper() + n[1:]}</span><b>From {p} pcm</b><span class="count">{c} available</span></a>' for n, d, p, c in SIZES)
qw(slug='from-prices', theme='hoods', title='"From" prices by home size on neighbourhood pages',
   summary='Each home size on a neighbourhood page shows its lowest live rent and how many are available.',
   url='getliving.com/our-neighbourhoods/east-village/', also='Also part of prototype 5, Neighbourhoods.',
   why="Neighbourhood pages describe each home size but not what it costs, so a renter has to leave the page and search to find out. The prices and counts already exist in the listings feed; showing the lowest rent and the number available for each size is a small template change that stays current by itself.",
   before_cap='Home sizes described, with no prices.',
   after_cap='Lowest live rent and number available for each size (sample figures).',
   before=f'<h3 class="qw-display" style="margin-bottom:1rem">apartments for rent at east village</h3><div class="perk-grid">{before_sizes}</div>',
   after=f'<h3 class="qw-display" style="margin-bottom:1rem">apartments for rent at east village</h3><div class="size-cards">{after_sizes}</div>')

qw(slug='commute-everywhere', theme='hoods', title='The commute calculator on every neighbourhood',
   summary='The commute checker East Village already has, on every neighbourhood page.',
   url='getliving.com/our-neighbourhoods/sherlock-quarter/', also='Also part of prototype 5, Neighbourhoods.',
   why="East Village's page has a 'Calculate your commute' tool; the other neighbourhood pages we looked at describe transport in prose. Commute is one of the first questions a renter asks of a place, and the tool already exists on the site.",
   before_cap='Transport described in a paragraph.',
   after_cap='The same commute checker East Village has. Try a destination.',
   before='<p class="lead" style="max-width:70ch">Within walking distance of the Bullring and key public transport routes, Sherlock Quarter is here to put you front and centre, just a 14-minute walk from New Street Station.</p>',
   after='''<div class="panel" style="max-width:640px"><h3>Your commute time</h3><form data-commute novalidate><div class="form-grid"><div class="field"><label for="qw-c2">Destination</label><input type="text" id="qw-c2" placeholder="Office, university or postcode" required><p class="field-error" hidden>Enter a place or postcode</p></div><div class="field"><label for="qw-c2m">Travel type</label><select id="qw-c2m"><option value="transit">Public transport</option><option value="cycle">Cycling</option><option value="walk">Walking</option><option value="drive">Driving</option></select></div></div><button type="submit" class="btn">Check journey time</button></form><div class="commute-result" hidden></div></div>''')

qw(slug='neighbourhood-faqs', theme='hoods', title='Questions and answers for each neighbourhood',
   summary='Eight to ten FAQs per neighbourhood, written from what is already in the listings.',
   url='getliving.com/our-neighbourhoods/sherlock-quarter/', also='Also part of prototype 5, Neighbourhoods.',
   why="Questions specific to a neighbourhood – parking, heating, council tax band, pets – are answered today in individual listings or in the general FAQs. Gathering them on the neighbourhood page helps renters, and marked up as FAQs they give search engines and AI search tools something specific to quote.",
   before_cap='Neighbourhood questions are scattered across listings and the general FAQs.',
   after_cap='The questions renters ask about this neighbourhood, in one place.',
   before='<p style="max-width:70ch">[End of neighbourhood page content]</p><p class="wf-meta">Questions? See <a href="#">FAQs</a> in the footer.</p>',
   after='''<h3 class="qw-display" style="margin-bottom:1rem">questions about sherlock quarter</h3><div class="accordion">
<div class="accordion-item"><button type="button" class="accordion-title">Is there parking?<span class="accordion-icon">&#9662;</span></button><div class="accordion-content"><p>Parking is available to rent, subject to availability. Bike storage is free.</p></div></div>
<div class="accordion-item"><button type="button" class="accordion-title">How are the homes heated?<span class="accordion-icon">&#9662;</span></button><div class="accordion-content"><p>By electricity, charged by what you use. Hot water is billed through Homebox.</p></div></div>
<div class="accordion-item"><button type="button" class="accordion-title">Which council tax band are the homes in?<span class="accordion-icon">&#9662;</span></button><div class="accordion-content"><p>Bands C, D or E, confirmed by Birmingham City Council when you move in.</p></div></div>
<div class="accordion-item"><button type="button" class="accordion-title">Can I bring my dog?<span class="accordion-icon">&#9662;</span></button><div class="accordion-content"><p>Yes, at no extra cost.</p></div></div></div>''')

# ---------------------------------------------------------------------------
# Content and search visibility
# ---------------------------------------------------------------------------
EDIT_CARDS = f'<div class="mini-grid"><div class="mini-card">{img("edit1", "Article photo", "ratio-16-9")}<div class="body">Celebrating Elephant and Castle\'s Latin American heritage</div></div><div class="mini-card">{img("edit2", "Article photo", "ratio-16-9")}<div class="body">Moving to Manchester guide</div></div><div class="mini-card">{img("edit3", "Article photo", "ratio-16-9")}<div class="body">Living in Maidenhead: your complete area guide</div></div></div>'
qw(slug='newsletter', theme='content', title='A newsletter and "new homes first" sign-up',
   summary='A light email sign-up on The Edit, neighbourhood pages and empty search results.',
   url='getliving.com/the-edit/', also='',
   why="Apart from the enquiry form, the site has no way to keep in touch with someone who isn't ready to move yet. A two-field sign-up captures people months before they are ready, and Get Living already uses HubSpot, which can send them.",
   before_cap='The Edit ends without any way to sign up.',
   after_cap='A two-field sign-up under the articles. Try it.',
   before=EDIT_CARDS,
   after=EDIT_CARDS + '''<div class="panel qw-signup" style="margin-top:1.5rem"><h3>Be first to hear about new homes</h3><p>New homes, neighbourhood guides and open events, once a month.</p>
<form data-qw-form="nl-done" novalidate><div class="form-grid"><div class="field"><label for="nl-name">First name</label><input type="text" id="nl-name" required><p class="field-error" hidden>Enter your first name</p></div><div class="field"><label for="nl-email">Email</label><input type="email" id="nl-email" required><p class="field-error" hidden>Enter an email address like name@example.com</p></div></div><button class="btn" type="submit">Sign up</button></form>
<p id="nl-done" hidden><strong>Thanks, you're signed up.</strong> The next email arrives at the start of next month.</p></div>''')

qw(slug='structured-data', theme='content', title='Structured data for homes, reviews and FAQs',
   summary='Behind-the-scenes markup that makes pages eligible for richer results in search engines and AI tools.',
   url='Search results', also='',
   why="Get Living's enquiry form lists 'AI search, e.g. ChatGPT, Gemini' as a source, so some renters are already finding it that way. Standard schema.org markup for listings, FAQs and reviews tells search engines and AI tools exactly what each page contains. Whether a richer result appears is up to the search engine; the markup makes the page eligible. Nothing changes visually on the site itself.",
   before_cap='A plain search result (illustrative).',
   after_cap='The same page with review and FAQ markup, as a search engine may show it (illustrative).',
   before='<div class="serp"><div class="url">www.getliving.com › our-neighbourhoods › east-village</div><div class="title">Apartments to Rent in East London | Get Living</div><p class="desc">Discover apartments to rent in East Village, with a range of studios and 1-4 bedrooms to choose from…</p></div>',
   after='<div class="serp"><div class="url">www.getliving.com › our-neighbourhoods › east-village</div><div class="title">Apartments to Rent in East London | Get Living</div><div class="stars">★★★★☆ Rating: 4.4 · 849 reviews · From £1,895 per month</div><p class="desc">Discover apartments to rent in East Village, with a range of studios and 1-4 bedrooms to choose from…</p><div class="serp-faq"><div>Is Wi-Fi included in the rent? <span>⌄</span></div><div>Are pets allowed at East Village? <span>⌄</span></div></div></div>')

qw(slug='pet-hub', theme='content', title='A page for pet owners',
   summary='One page on renting with a pet: the policy in plain English, dog-friendly spaces and pet events.',
   url='getliving.com/living-with-us/pets/', also='',
   why="'Pets at no extra cost' is one of Get Living's clearest differences, and pet-friendly is one of the fastest-growing features renters mention. Today it is a line in each neighbourhood's amenity list. A single page brings it together and gives Get Living something to point pet owners to from search and social.",
   before_cap='"Pet friendly" is one item in a list of amenities.',
   after_cap='A page for pet owners, built from content Get Living already has.',
   before='<ul class="amenity-list"><li>Wi-Fi Included</li><li>Zone 2 Location</li><li>On-site Maintenance</li><li>24 Hour On-Site Security</li><li>Pet Friendly</li><li>Courtyard Gardens</li><li>Resident Events</li><li>Secure Bike Storage</li></ul>',
   after=f'''<div class="gl-hero-split"><div class="panel-side qw-sage"><h3 class="qw-display" style="font-size:2.25rem;margin:0">renting with your pet</h3><p>Pets live with you at no extra cost, in every Get Living neighbourhood. Here's how it works.</p><span class="btn">Read our pet policy</span></div>{img("dog", "Resident with her dog", "ratio-4-3")}</div>
<div class="perk-grid" style="margin-top:1rem"><div class="perk"><b>No pet rent</b>And no extra deposit.</div><div class="perk"><b>Dog-friendly spaces</b>Parks and courtyards in every neighbourhood.</div><div class="perk"><b>Pet events</b>Including puppy yoga.</div></div>''')

qw(slug='sustainability', theme='content', title='A page on energy and sustainability',
   summary='One page on energy performance, what it saves residents, EV charging and bike storage.',
   url='getliving.com/living-with-us/', also='',
   why="Energy efficiency is mentioned across the site – over 90% of East Village homes are rated B on EPC – but always as a footnote. With energy bills a real concern for renters, a single page that explains what it means for their bills is worth having, and the facts are already on the site.",
   before_cap='Energy efficiency appears as a line and a footnote.',
   after_cap='The same facts, as a short section of their own.',
   before='<p style="max-width:70ch">Our homes are highly energy-efficient, with over 90% of East Village homes rated B on EPC*, helping you lower your energy usage to benefit your bills and the planet.</p><p class="wf-meta">*Energy Performance Certification</p>',
   after=f'''<div class="gl-hero-split"><div>{img("pond", "East Village from above", "ratio-4-3")}</div><div class="panel-side"><h3 class="qw-display" style="font-size:2.25rem;margin:0">lower bills, lighter footprint</h3><div class="statistics"><div class="stat-item"><div class="stat-value">90%+</div><div class="stat-title">of East Village homes rated EPC B</div></div><div class="stat-item"><div class="stat-value">Free</div><div class="stat-title">secure bike storage</div></div></div><p>What an EPC B rating means for your energy use, and where to charge an electric car.</p></div></div>''')

# ---------------------------------------------------------------------------
# Residents
# ---------------------------------------------------------------------------
qw(slug='shareable-referrals', theme='residents', title='Make referrals easy to share',
   summary='Move the referral offer from a banner on every page to a personal share link for residents.',
   url='getliving.com/residents/', also='',
   why="The 'Refer a Friend' banner sits above every page, so most of the people who see it are prospective renters it doesn't apply to. Residents, who can use it, have to go looking. A personal link in the resident area or app, ready to copy or send, puts the £100 offer in front of the right people.",
   before_cap='A banner shown to every visitor, resident or not.',
   after_cap='A personal link for residents, ready to copy. Try the button.',
   before='<div class="gl-ribbon">⌄ Refer A Friend &amp; Get Rewarded!</div><div class="gl-bar qw-black"><span class="qw-wordmark">getliving</span><div class="gl-bar-links"><span>Locations</span><span>Homes</span><span>Lifestyle</span><span>The Edit</span></div></div>',
   after='''<div class="panel" style="max-width:640px"><h3>Refer a friend, you both get £100</h3><p>Share your link. When your friend moves in, you each get £100 of Amazon.co.uk vouchers.</p><div class="copy-row"><input type="text" id="ref-link" value="getliving.com/refer/sam-t-4821" readonly aria-label="Your referral link"><button type="button" class="btn" data-copy="https://www.getliving.com/refer/sam-t-4821">Copy link</button></div><p class="wf-meta" style="margin-top:0.75rem">Example link. 2 friends referred so far.</p></div>''')

qw(slug='resident-perks', theme='residents', title='Show prospective renters what residents get',
   summary='A short "What residents get" section with partner offers and events, on the pages prospective renters see.',
   url='getliving.com/living-with-us/', also='',
   why="Resident offers and events are in the app, so the people deciding whether to rent never see them. A short section on the proposition pages, using offers Get Living already has, adds to the case for renting at little cost.",
   before_cap='Perks are mentioned only as part of the app.',
   after_cap='A few perks, shown to people deciding whether to rent (examples).',
   before='<p style="max-width:70ch">Get Living offers a dedicated resident app, available on iPhone and Android. Submit maintenance requests, pay bills, access your home guides and unlock exclusive offers.</p>',
   after=f'''<h3 class="qw-display" style="margin-bottom:1rem">what residents get</h3><div class="perk-grid"><div class="perk"><b>Weekly fitness classes</b>In the neighbourhood, free for residents.</div><div class="perk"><b>Local partner offers</b>Discounts at shops and cafés nearby.</div><div class="perk"><b>Resident events</b>From supper clubs to summer fêtes.</div><div class="perk"><b>£100 for referrals</b>For you and a friend who moves in.</div></div><p class="wf-meta" style="margin-top:0.75rem">Examples; the real list would come from Get Living's partners.</p>''')

# ---------------------------------------------------------------------------
# Look and feel
# ---------------------------------------------------------------------------
HERO_H = '<h2 class="qw-display">live in neighbourhoods where everyone can connect and thrive</h2>'
qw(slug='hero-search', theme='look', title='Search in the homepage hero',
   summary='A compact search under the homepage headline, so renters can start looking straight away.',
   url='getliving.com/', also='',
   why="The homepage opens with the headline and a single 'Rent a home' button, which leads to the search page. Putting three search fields in the hero saves a click for the most common task on the site, and the search page already handles the query.",
   before_cap='One button that leads to the search page.',
   after_cap='Where, bedrooms and move-in date, straight from the homepage.',
   before=f'<div class="gl-hero">{img("hero", "Homepage hero photo", "ratio-16-9", WASH)}{HERO_H}<div><span class="btn btn-secondary">Rent a home</span></div></div>',
   after=f'''<div class="gl-hero">{img("hero", "Homepage hero photo", "ratio-16-9", WASH)}{HERO_H}<form class="hero-search" onsubmit="return false" aria-label="Search homes"><div class="field"><label for="hs-where">Where</label><select id="hs-where"><option>All neighbourhoods</option><option>London</option><option>Birmingham</option><option>Manchester</option></select></div><div class="field"><label for="hs-beds">Bedrooms</label><select id="hs-beds"><option>Any</option><option>Studio</option><option>1</option><option>2</option><option>3+</option></select></div><div class="field"><label for="hs-when">Move in by</label><input type="date" id="hs-when"></div><button class="btn" type="submit">Search</button></form></div>''')

qw(slug='hero-imagery', theme='look', title='Sharper hero imagery',
   summary='Let the photography run at full strength, with the headline on a solid panel instead of a white wash over the photo.',
   url='getliving.com/', also='',
   why="To keep the black headline readable, the homepage and neighbourhood heroes lay a heavy white wash over the photo, which flattens some of Get Living's best photography. Setting the headline on a solid sage panel beside the image keeps it readable and lets the photo do its job. It is a template and CSS change.",
   before_cap='The photo sits behind a white wash so the headline can be read.',
   after_cap='The photo at full strength, with the headline on a sage panel.',
   before=f'<div class="gl-hero">{img("hero", "Homepage hero photo", "ratio-16-9", WASH)}{HERO_H}<div><span class="btn btn-secondary">Rent a home</span></div></div>',
   after=f'<div class="gl-hero-split"><div class="panel-side qw-sage">{HERO_H}<div><span class="btn">Rent a home</span></div></div>{img("hero", "Homepage hero photo", "ratio-4-3")}</div>')

qw(slug='mobile-menu', theme='look', title='A more useful mobile menu',
   summary='Search and the six neighbourhoods at the top level of the mobile menu.',
   url='getliving.com on a phone', also='',
   why="On a phone, the menu shows four headings and three shortcuts, and the neighbourhoods are two taps away under 'Locations'. Someone opening the menu on a phone is most likely looking for a home in a particular place, so putting search and the neighbourhood list at the top level shortens the most common journey.",
   before_cap="Today's mobile menu: four headings, neighbourhoods two taps away.",
   after_cap='Search and neighbourhoods at the top level.',
   before='''<div class="phone"><div class="phone-screen qw-black" style="padding:1rem 1.25rem"><div class="row between"><span class="qw-wordmark" style="font-size:1.4rem">getliving</span><span>✕</span></div>
<ul class="qw-menu"><li>Locations <span>›</span></li><li>Homes <span>›</span></li><li>Lifestyle <span>›</span></li><li>The Edit</li></ul>
<div style="margin-top:auto"><span class="btn btn-secondary btn-block qw-white-btn">Make an Enquiry</span><div class="row between" style="margin-top:1rem;font-size:0.75rem"><span>Call Us Free</span><span>For Residents</span><span>Accessibility</span></div></div></div></div>''',
   after='''<div class="phone"><div class="phone-screen qw-black" style="padding:1rem 1.25rem"><div class="row between"><span class="qw-wordmark" style="font-size:1.4rem">getliving</span><span>✕</span></div>
<div class="qw-phone-search">Search homes, e.g. "2 bed Birmingham"</div>
<p class="qw-menu-h">Neighbourhoods</p><ul class="qw-menu compact"><li>East Village, Stratford</li><li>Elephant Central</li><li>Sherlock Quarter, Birmingham</li><li>New Maker Yards, Salford</li><li>One Maidenhead</li><li>The Oakgate, Leatherhead</li></ul>
<ul class="qw-menu compact" style="margin-top:0.5rem"><li>Homes <span>›</span></li><li>Lifestyle <span>›</span></li><li>The Edit</li></ul>
<div style="margin-top:auto"><span class="btn btn-secondary btn-block qw-white-btn">Make an Enquiry</span></div></div></div>''')

MOTION_CARDS = ''.join(f'<div class="mini-card reveal lift">{img(k, "Photo", "ratio-16-9")}<div class="body"><b>{t}</b>{s}</div></div>' for k, t, s in [('fete', 'East Village', 'Stratford, London'), ('sqbike', 'Sherlock Quarter', 'Birmingham'), ('cycle', 'Elephant Central', 'London')])
qw(slug='motion', theme='look', title='Motion with restraint',
   summary='A few deliberate moments of movement: cards that rise into place and lift when you point at them.',
   url='getliving.com/', also='',
   why="Apart from the carousels, the site is largely still. A small amount of considered motion – content easing into place, cards lifting on hover – makes it feel more current without getting in the way, and it respects visitors who have asked their device to reduce motion.",
   before_cap='Static cards.',
   after_cap='Cards rise into place and lift on hover. Press Replay to see it again.',
   before=f'<div class="mini-grid">{MOTION_CARDS.replace(" reveal lift", "")}</div>',
   after=f'<div class="mini-grid" data-motion>{MOTION_CARDS}</div><p style="margin-top:1rem"><button type="button" class="btn btn-secondary btn-sm" data-replay>Replay</button></p>')


# ---------------------------------------------------------------------------
# Writers
# ---------------------------------------------------------------------------
HEAD = '''<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} — Get Living quick wins</title>
  <link rel="stylesheet" href="~/css/base.css">
  <link rel="stylesheet" href="~/css/components.css">
  <link rel="stylesheet" href="~/css/theme.css">
</head>
'''
FOOT = '''  <!-- @@include footer.html -->
  <script src="~/js/data.js"></script>
  <script src="~/js/quick-wins.js"></script>
  <script src="~/js/wireframe.js"></script>
  <script src="~/js/photos.js"></script>
</body>
</html>
'''


def write_page(i, q):
    n = i + 1
    theme_name = dict(THEMES)[q['theme']]
    also = f'<p class="qw-where">{escape(q["also"])}</p>' if q.get('also') else ''
    html = HEAD.format(title=escape(q['title'])) + f'''<body data-qw-theme="{q['theme']}">
  <!-- @@include header.html -->

  <main id="main" class="flush">
    <!-- What we're proposing and why (shown when Notes are on) -->
    <aside class="proposal" aria-label="About this quick win">
      <div class="container">
        <p class="proposal-eyebrow">Quick win {n} of {len(QW)} · {escape(theme_name)}</p>
        <div class="proposal-grid">
          <div><h2>What we're proposing</h2><p>{escape(q['summary'])}</p></div>
          <div><h2>Why</h2><p>{escape(q['why'])}</p></div>
        </div>
      </div>
    </aside>

    <!-- Quick win {n}: {escape(q['title'])} -->
    <div class="container qw-head">
      <p class="qw-num">Quick win {n} · {escape(theme_name)}</p>
      <h1>{escape(q['title'])}</h1>
      <p class="lead">{escape(q['summary'])}</p>
      {also}
    </div>

    <div data-ba>
      <div class="ba-bar">
        <div class="container">
          <div class="ba-switch" role="group" aria-label="Compare">
            <button type="button" data-ba-show="before" aria-pressed="true">Today</button>
            <button type="button" data-ba-show="after" aria-pressed="false">With this change</button>
          </div>
          <span class="ba-hint">Switch between the current site and the change. Arrow keys work too.</span>
        </div>
      </div>
      <div class="container ba-stage">
        <div class="ba-before">
          <p class="ba-caption"><b>Today</b><span>{escape(q['before_cap'])}</span></p>
          <div class="ba-frame"><div class="ba-frame-bar"><i></i><i></i><i></i><span>{escape(q['url'])}</span></div>
            <div class="ba-frame-body">
{q['before']}
            </div>
          </div>
        </div>
        <div class="ba-after" hidden>
          <p class="ba-caption"><b>With this change</b><span>{escape(q['after_cap'])}</span></p>
          <div class="ba-frame"><div class="ba-frame-bar"><i></i><i></i><i></i><span>{escape(q['url'])}</span></div>
            <div class="ba-frame-body">
{q['after']}
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

''' + FOOT
    with open(os.path.join(OUT, q['slug'] + '.html'), 'w') as fh:
        fh.write(html)


def write_index():
    sections = ''
    for key, name in THEMES:
        items = [(i, q) for i, q in enumerate(QW) if q['theme'] == key]
        cards = ''.join(f'''
          <li><a class="qw-card" href="{q['slug']}.html"><span class="qw-n">Quick win {i + 1}</span><h3>{escape(q['title'])}</h3><p>{escape(q['summary'])}</p>{f'<span class="qw-also">{escape(q["also"])}</span>' if q.get('also') else ''}</a></li>''' for i, q in items)
        sections += f'''
      <section class="qw-theme" id="{key}" aria-labelledby="t-{key}">
        <h2 class="section-title" id="t-{key}">{escape(name)}</h2>
        <ul class="qw-grid">{cards}
        </ul>
      </section>
'''
    html = HEAD.format(title='All quick wins').replace(' — Get Living quick wins', ' — Get Living prototypes') + f'''<body class="qw-index">
  <!-- @@include header.html -->

  <main id="main" class="flush">
    <div class="page-head">
      <div class="container">
        <h1>Quick wins</h1>
        <p class="lead">{len(QW)} smaller changes to getliving.com, each shown on its own against the site as it is today. Any of them can be made independently of the five major improvements, and of each other.</p>
        <p style="margin-top:1rem">Open one, then use <strong>Today</strong> and <strong>With this change</strong> to compare. Switch <strong>Notes on</strong> to see why we suggest it.</p>
      </div>
    </div>
    <div class="container" style="padding-top:2.5rem">
{sections}
    </div>
  </main>

''' + FOOT
    with open(os.path.join(OUT, 'index.html'), 'w') as fh:
        fh.write(html)


def write_data():
    data = [{'slug': q['slug'], 'title': q['title'], 'theme': q['theme']} for q in QW]
    with open(os.path.join(ROOT, 'src', 'js', 'quick-wins.js'), 'w') as fh:
        fh.write('/* Generated by tools/quick_wins.py: the ordered list of quick wins, used for previous/next links. */\n')
        fh.write('window.GL_QUICK_WINS = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    order = [k for k, _ in THEMES]
    QW.sort(key=lambda q: order.index(q['theme']))
    for i, q in enumerate(QW):
        write_page(i, q)
    write_index()
    write_data()
    print(f'Wrote {len(QW)} quick wins and the index to src/quick-wins/')
