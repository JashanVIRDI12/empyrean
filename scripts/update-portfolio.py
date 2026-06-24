#!/usr/bin/env python3
"""Update MNG Spirits portfolio: 4 whiskeys + 1 rum with premium copy."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PRODUCTS = {
    "velvet-crown": {
        "file": "velvet-crown.html",
        "name": "Velvet Crown",
        "type": "Single Malt Whiskey",
        "marquee": "Single Malt",
        "title": "Velvet Crown 18-Year Single Malt | Premium Whiskey | MNG Spirits",
        "meta_desc": "Velvet Crown — 18-year single malt whiskey aged in charred sherry casks. Smoked honey, dried fig, and toasted vanilla. The flagship whiskey of MNG Spirits.",
        "og_title": "Velvet Crown | Premium Single Malt Whiskey | MNG Spirits",
        "og_desc": "18-year single malt whiskey — sherry cask maturation, smoked honey, Highland provenance.",
        "alt": "Velvet Crown 18-Year Single Malt Whiskey",
        "hero_desc": "Aged 18 years in charred sherry casks. Smoked honey, dried fig, and toasted vanilla converge in the signature whiskey of MNG Spirits — a single malt shaped by patience, Highland air, and uncompromising cask selection.",
        "tags": ("18 Years", "Sherry Cask", "Highland"),
        "notes": '<div class="product-notes__item"><p class="product-notes__label">Nose</p><p class="product-notes__value">Smoked honey, dried fig, sherry spice</p></div><div class="product-notes__item"><p class="product-notes__label">Palate</p><p class="product-notes__value">Toasted vanilla, orchard fruit, charred oak</p></div><div class="product-notes__item"><p class="product-notes__label">Finish</p><p class="product-notes__value">Warm, long, unmistakably MNG</p></div><div class="product-notes__item"><p class="product-notes__label">Age</p><p class="product-notes__value">18 Years</p></div><div class="product-notes__item"><p class="product-notes__label">Cask</p><p class="product-notes__value">Sherry Oak</p></div><div class="product-notes__item"><p class="product-notes__label">Origin</p><p class="product-notes__value">Highland, Scotland</p></div>',
        "short": "Aged 18 years in charred sherry casks. Smoked honey, dried fig, and toasted vanilla — the signature whiskey of MNG Spirits.",
        "short_card": "Aged 18 years in charred sherry casks. Smoked honey, dried fig, toasted vanilla.",
        "aria": "Velvet Crown Whiskey",
    },
    "liquid-velvet": {
        "file": "liquid-velvet.html",
        "name": "Liquid Velvet",
        "type": "Premium Rum",
        "marquee": "Premium Rum",
        "title": "Liquid Velvet | Ultra-Premium Caribbean Rum | MNG Spirits",
        "meta_desc": "Liquid Velvet — barrel-polished Caribbean rum with silk-smooth character. Warm spice, molasses, and vanilla. The sole rum expression in the MNG Spirits portfolio.",
        "og_title": "Liquid Velvet | Premium Caribbean Rum | MNG Spirits",
        "og_desc": "Ultra-premium rum — barrel-polished, molasses-rich, silk finish, Caribbean provenance.",
        "alt": "Liquid Velvet Premium Caribbean Rum",
        "hero_desc": "Barrel-polished Caribbean rum with remarkable silk and depth. Warm spice rises on the nose; molasses, vanilla, and toasted oak unfold on the palate — the portfolio's only rum, crafted for unhurried evenings and confident pours.",
        "tags": ("Barrel-Aged", "Caribbean Cane", "Ultra-Premium"),
        "notes": '<div class="product-notes__item"><p class="product-notes__label">Nose</p><p class="product-notes__value">Warm spice, molasses, soft citrus</p></div><div class="product-notes__item"><p class="product-notes__label">Palate</p><p class="product-notes__value">Silk texture, vanilla, cane sweetness</p></div><div class="product-notes__item"><p class="product-notes__label">Finish</p><p class="product-notes__value">Smooth, seamless, lingering warmth</p></div><div class="product-notes__item"><p class="product-notes__label">Aging</p><p class="product-notes__value">Barrel-Polished</p></div><div class="product-notes__item"><p class="product-notes__label">Base</p><p class="product-notes__value">Premium Cane</p></div><div class="product-notes__item"><p class="product-notes__label">Origin</p><p class="product-notes__value">Caribbean</p></div>',
        "short": "Barrel-polished Caribbean rum. Warm spice, molasses, and vanilla — silk-smooth precision in every pour.",
        "short_card": "Barrel-polished Caribbean rum. Warm spice, molasses, vanilla, silk finish.",
        "aria": "Liquid Velvet Rum",
    },
    "gilded-grain": {
        "file": "gilded-grain.html",
        "name": "The Gilded Grain",
        "type": "Aged Grain Whiskey",
        "marquee": "Grain Whiskey",
        "title": "The Gilded Grain | Aged Grain Whiskey | MNG Spirits",
        "meta_desc": "The Gilded Grain — aged grain whiskey with honeyed malt, toasted oak, and golden spice. A rich, approachable expression from MNG Spirits.",
        "og_title": "The Gilded Grain | Premium Grain Whiskey | MNG Spirits",
        "og_desc": "Aged grain whiskey — honeyed malt, toasted oak, golden spice, long warm finish.",
        "alt": "The Gilded Grain Aged Grain Whiskey",
        "hero_desc": "Distilled from select grains and matured in toasted American oak. Honeyed malt, golden spice, and a thread of caramel weave through every sip — a whiskey built for fireside conversation and slow revelation.",
        "tags": ("Grain Whiskey", "Toasted Oak", "12 Years"),
        "notes": '<div class="product-notes__item"><p class="product-notes__label">Nose</p><p class="product-notes__value">Honeyed malt, golden spice, toasted oak</p></div><div class="product-notes__item"><p class="product-notes__label">Palate</p><p class="product-notes__value">Caramel, vanilla cream, gentle pepper</p></div><div class="product-notes__item"><p class="product-notes__label">Finish</p><p class="product-notes__value">Warm, rounded, gracefully long</p></div><div class="product-notes__item"><p class="product-notes__label">Age</p><p class="product-notes__value">12 Years</p></div><div class="product-notes__item"><p class="product-notes__label">Cask</p><p class="product-notes__value">American Oak</p></div><div class="product-notes__item"><p class="product-notes__label">Origin</p><p class="product-notes__value">Kentucky, USA</p></div>',
        "short": "Aged grain whiskey matured in toasted American oak. Honeyed malt, golden spice, and caramel depth.",
        "short_card": "Honeyed malt, golden spice, and toasted oak — aged grain whiskey.",
        "aria": "The Gilded Grain Whiskey",
    },
    "copper-ridge": {
        "file": "copper-ridge.html",
        "name": "Copper Ridge",
        "type": "Blended Whiskey",
        "marquee": "Blended Whiskey",
        "title": "Copper Ridge | Premium Blended Whiskey | MNG Spirits",
        "meta_desc": "Copper Ridge — premium blended whiskey with black cherry, cedar, and dark chocolate notes. Rich, structured, and built for the long table.",
        "og_title": "Copper Ridge | Premium Blended Whiskey | MNG Spirits",
        "og_desc": "Premium blended whiskey — black cherry, cedar, dark chocolate, copper-rich depth.",
        "alt": "Copper Ridge Premium Blended Whiskey",
        "hero_desc": "A masterful blend of mature whiskeys finished in charred oak. Black cherry and cedar meet a thread of dark chocolate — structured, generous, and crafted for evenings that deserve a slower pace.",
        "tags": ("Blended", "Charred Oak", "Small Batch"),
        "notes": '<div class="product-notes__item"><p class="product-notes__label">Nose</p><p class="product-notes__value">Black cherry, cedar, dark chocolate</p></div><div class="product-notes__item"><p class="product-notes__label">Palate</p><p class="product-notes__value">Rich malt, oak spice, dried plum</p></div><div class="product-notes__item"><p class="product-notes__label">Finish</p><p class="product-notes__value">Silky, persistent, copper warmth</p></div><div class="product-notes__item"><p class="product-notes__label">Style</p><p class="product-notes__value">Premium Blend</p></div><div class="product-notes__item"><p class="product-notes__label">Cask</p><p class="product-notes__value">Charred Oak</p></div><div class="product-notes__item"><p class="product-notes__label">Origin</p><p class="product-notes__value">Scotland &amp; Ireland</p></div>',
        "short": "Premium blended whiskey. Black cherry, cedar, and dark chocolate — rich, structured, unforgettable.",
        "short_card": "Black cherry, cedar, and dark chocolate — premium blended whiskey.",
        "aria": "Copper Ridge Whiskey",
    },
    "bhaarat-field": {
        "file": "bhaarat-field.html",
        "name": "Bhaarat Field",
        "type": "Premium Indian Whisky",
        "marquee": "Indian Whisky",
        "title": "Bhaarat Field | Premium Indian Whisky | MNG Spirits",
        "meta_desc": "Bhaarat Field — premium Indian whisky from sun-ripened barley. Warm spice, golden malt, and a luminous finish. Heritage whisky from MNG Spirits.",
        "og_title": "Bhaarat Field | Premium Indian Whisky | MNG Spirits",
        "og_desc": "Premium Indian whisky — sun-ripened barley, warm spice, golden malt, long finish.",
        "alt": "Bhaarat Field Premium Indian Whisky",
        "hero_desc": "Distilled from sun-ripened barley drawn across open heartland fields. Warm spice, golden malt, and a finish that lingers like late harvest light — India's landscape translated into a whiskey of quiet authority.",
        "tags": ("Indian Barley", "Heritage Craft", "Sun-Ripened"),
        "notes": '<div class="product-notes__item"><p class="product-notes__label">Nose</p><p class="product-notes__value">Golden malt, warm spice, field honey</p></div><div class="product-notes__item"><p class="product-notes__label">Palate</p><p class="product-notes__value">Ripe barley, saffron thread, gentle oak</p></div><div class="product-notes__item"><p class="product-notes__label">Finish</p><p class="product-notes__value">Long, luminous, harvest warmth</p></div><div class="product-notes__item"><p class="product-notes__label">Grain</p><p class="product-notes__value">Sun-Ripened Barley</p></div><div class="product-notes__item"><p class="product-notes__label">Craft</p><p class="product-notes__value">Indian Heartland</p></div><div class="product-notes__item"><p class="product-notes__label">Origin</p><p class="product-notes__value">India</p></div>',
        "short": "Sun-ripened barley from open heartland fields. Warm spice, golden malt, and a finish that lingers like late harvest light.",
        "short_card": "Sun-ripened barley, warm spice, golden malt — premium Indian whisky.",
        "aria": "Bhaarat Field Whisky",
    },
}

ORDER = ["velvet-crown", "liquid-velvet", "gilded-grain", "copper-ridge", "bhaarat-field"]
TYPE_BY_FILE = {PRODUCTS[k]["file"]: PRODUCTS[k]["type"] for k in ORDER}


def set_meta(text, name, value):
    pattern = rf'(<meta name="{name}" content=")[^"]*(")'
    return re.sub(pattern, lambda m: m.group(1) + value + m.group(2), text, count=1)


def set_og(text, prop, value):
    pattern = rf'(<meta property="{prop}" content=")[^"]*(")'
    return re.sub(pattern, lambda m: m.group(1) + value + m.group(2), text, count=1)


def patch_product_page(slug):
    p = PRODUCTS[slug]
    path = ROOT / p["file"]
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"<title>[^<]*</title>", f"<title>{p['title']}</title>", text)
    text = set_meta(text, "description", p["meta_desc"])
    text = set_og(text, "og:title", p["og_title"])
    text = set_og(text, "og:description", p["og_desc"])
    text = re.sub(
        r'(<img src="images/[^"]+" alt=")[^"]+(" loading="eager")',
        rf"\1{p['alt']}\2",
        text,
        count=1,
    )
    text = re.sub(
        r'<p class="product-hero__type">[^<]+</p>',
        f'<p class="product-hero__type">{p["type"]}</p>',
        text,
        count=1,
    )
    text = re.sub(
        r'<p class="product-hero__desc">[^<]+</p>',
        f'<p class="product-hero__desc">{p["hero_desc"]}</p>',
        text,
        count=1,
    )
    tags_html = "".join(f'<span class="product-hero__tag">{t}</span>' for t in p["tags"])
    text = re.sub(
        r'<div class="product-hero__tags">.*?</div>',
        f'<div class="product-hero__tags">{tags_html}</div>',
        text,
        flags=re.S,
        count=1,
    )
    text = re.sub(
        r'(<div class="product-notes__grid">\n).*?(\n      </div>)',
        rf"\1{p['notes']}\2",
        text,
        flags=re.S,
        count=1,
    )
    # Related cards types
    def related_repl(m):
        href = m.group(1)
        fname = href.split("/")[-1] if "/" in href else href
        return f'{m.group(0).split("<p class=")[0]}<p class="product-related__type">{TYPE_BY_FILE.get(fname, "")}</p>'

    text = re.sub(
        r'<a href="([^"]+\.html)" class="product-related__card">.*?<p class="product-related__type">[^<]+</p>',
        lambda m: re.sub(
            r'<p class="product-related__type">[^<]+</p>',
            f'<p class="product-related__type">{TYPE_BY_FILE.get(m.group(1), "")}</p>',
            m.group(0),
            count=1,
        ),
        text,
        flags=re.S,
    )
    path.write_text(text, encoding="utf-8")
    print("product", p["file"])


def patch_index():
    path = ROOT / "index.html"
    text = path.read_text(encoding="utf-8")
    text = set_meta(
        text,
        "description",
        "MNG Spirits — a premium whiskey and rum showcase featuring 18-year single malt, aged grain whiskey, blended whiskey, Indian whisky, and Caribbean rum. Explore artisan distillation and barrel-aged craftsmanship.",
    )
    text = set_meta(
        text,
        "keywords",
        "premium whiskey portfolio, single malt whiskey, blended whiskey, Indian whisky, aged grain whiskey, premium rum, Caribbean rum, artisan distillery, barrel-aged spirits, MNG Spirits",
    )
    text = set_og(
        text,
        "og:description",
        "Five flagship expressions — luxury single malt, grain whiskey, blended whiskey, Indian whisky, and Caribbean rum. A premium spirits showcase.",
    )
    text = re.sub(
        r'"description": "[^"]+"',
        '"description": "Premium whiskey and rum portfolio — single malt, grain whiskey, blended whiskey, Indian whisky, and Caribbean rum from MNG Spirits."',
        text,
        count=1,
    )
    # Marquee — replace both groups
    marquee_block = '        <div class="hp-marquee__group">\n'
    for slug in ORDER:
        p = PRODUCTS[slug]
        marquee_block += f'          <span class="hp-marquee__cat">{p["marquee"]}</span><em class="hp-marquee__name">{p["name"]}</em><span class="hp-marquee__gem">✦</span>\n'
    marquee_block += '        </div>\n        <div class="hp-marquee__group" aria-hidden="true">\n'
    for slug in ORDER:
        p = PRODUCTS[slug]
        marquee_block += f'          <span class="hp-marquee__cat">{p["marquee"]}</span><em class="hp-marquee__name">{p["name"]}</em><span class="hp-marquee__gem">✦</span>\n'
    marquee_block += '        </div>'
    text = re.sub(
        r'<div class="hp-marquee__track">\n.*?</div>\n      </div>',
        f'<div class="hp-marquee__track">\n{marquee_block}\n      </div>',
        text,
        flags=re.S,
        count=1,
    )
    # Spotlight slides by data-index
    for i, slug in enumerate(ORDER):
        p = PRODUCTS[slug]
        text = re.sub(
            rf'(<article class="spotlight__slide[^"]*" data-index="{i}"[^>]*>.*?<img class="spotlight__bottle" src="images/[^"]+" alt=")[^"]+(")',
            rf"\1{p['alt']}\2",
            text,
            flags=re.S,
            count=1,
        )
        text = re.sub(
            rf'(<article class="spotlight__slide[^"]*" data-index="{i}"[^>]*>.*?<p class="spotlight__type">)[^<]+(</p>)',
            rf"\1{p['type']}\2",
            text,
            flags=re.S,
            count=1,
        )
        text = re.sub(
            rf'(<article class="spotlight__slide[^"]*" data-index="{i}"[^>]*>.*?<p class="spotlight__desc">)[^<]+(</p>)',
            rf"\1{p['short']}\2",
            text,
            flags=re.S,
            count=1,
        )
    # Collection cards - by collection__num 01-05
    nums = ["01", "02", "03", "04", "05"]
    for num, slug in zip(nums, ORDER):
        p = PRODUCTS[slug]
        text = re.sub(
            rf'(<span class="collection__num" aria-hidden="true">{num}</span>.*?<img src="images/[^"]+" alt=")[^"]+(")',
            rf"\1{p['alt']}\2",
            text,
            flags=re.S,
            count=1,
        )
        text = re.sub(
            rf'(<span class="collection__num" aria-hidden="true">{num}</span>.*?<p class="collection__type">)[^<]+(</p>)',
            rf"\1{p['type']}\2",
            text,
            flags=re.S,
            count=1,
        )
        text = re.sub(
            rf'(<span class="collection__num" aria-hidden="true">{num}</span>.*?<p class="collection__desc">)[^<]+(</p>)',
            rf"\1{p['short_card']}\2",
            text,
            flags=re.S,
            count=1,
        )
    text = text.replace(
        'alt="Rum being poured over a single ice sphere"',
        'alt="Whiskey being poured over a single ice sphere"',
    )
    text = re.sub(
        r'<p class="philosophy__body"[^>]*>[^<]+</p>',
        '<p class="philosophy__body" data-reveal="delay-2">MNG Spirits began with a single cask and an uncompromising standard. Our portfolio spans single malt whiskey, aged grain whiskey, blended whiskey, premium Indian whisky, and one exceptional Caribbean rum — each expression a showcase of patience, provenance, and craft.</p>',
        text,
        count=1,
    )
    text = re.sub(
        r'<p class="craft__body">[^<]+</p>',
        '<p class="craft__body">Our barrel houses span three continents — each cask maturing on its own timeline, guided by master distillers who believe great whiskey and rum are never rushed. This is the craft behind the MNG Spirits showcase.</p>',
        text,
        count=1,
    )
    text = re.sub(
        r'<p class="footer__brand-desc">[^<]+</p>',
        '<p class="footer__brand-desc">Four whiskeys, one rum, one philosophy: honour the grain, respect the barrel, reward the wait.</p>',
        text,
        count=1,
    )
    text = re.sub(
        r'<nav class="categories__list" aria-label="Spirit categories">.*?</nav>',
        '''<nav class="categories__list" aria-label="Spirit categories">
        <a href="collection.html" class="categories__item categories__item--accent">Whisky</a>
        <a href="collection.html" class="categories__item">Rum</a>
        <a href="collection.html" class="categories__item">Grain &amp; Blend</a>
      </nav>''',
        text,
        flags=re.S,
        count=1,
    )
    path.write_text(text, encoding="utf-8")
    print("index.html")


def patch_collection():
    path = ROOT / "collection.html"
    text = path.read_text(encoding="utf-8")
    text = re.sub(
        r"<title>[^<]*</title>",
        "<title>Premium Whiskey &amp; Rum Collection | MNG Spirits</title>",
        text,
    )
    text = set_meta(
        text,
        "description",
        "Browse the MNG Spirits portfolio — Velvet Crown single malt, Liquid Velvet rum, Gilded Grain whiskey, Copper Ridge blend, and Bhaarat Field Indian whisky.",
    )
    text = set_og(
        text,
        "og:title",
        "Premium Whiskey &amp; Rum Collection | MNG Spirits",
    )
    text = set_og(
        text,
        "og:description",
        "Five flagship expressions — single malt, grain whiskey, blended whiskey, Indian whisky, and Caribbean rum.",
    )
    text = re.sub(
        r'<p class="coll-hero__sub">[^<]+</p>',
        '<p class="coll-hero__sub">Five flagship expressions — single malt whiskey, Caribbean rum, aged grain whiskey, blended whiskey, and premium Indian whisky. Each born from one obsession: that greatness is waited for, never forced.</p>',
        text,
        count=1,
    )
    spirit_ids = ["spirit-01", "spirit-02", "spirit-03", "spirit-04", "spirit-05"]
    for sid, slug in zip(spirit_ids, ORDER):
        p = PRODUCTS[slug]
        text = re.sub(
            rf'(<article class="coll-panel[^"]*" id="{sid}"[^>]*aria-label=")[^"]+(")',
            rf'\1{p["name"]} {p["type"]}\2',
            text,
            count=1,
        )
        text = re.sub(
            rf'(<article class="coll-panel[^"]*" id="{sid}"[^>]*>.*?<span class="coll-panel__category">)[^<]+(</span>)',
            rf"\1{p['type']}\2",
            text,
            flags=re.S,
            count=1,
        )
        text = re.sub(
            rf'(<article class="coll-panel[^"]*" id="{sid}"[^>]*>.*?<img class="coll-panel__bottle" src="images/[^"]+" alt=")[^"]+(")',
            rf"\1{p['alt']}\2",
            text,
            flags=re.S,
            count=1,
        )
    text = re.sub(
        r'<p class="footer__brand-desc">[^<]+</p>',
        '<p class="footer__brand-desc">Four whiskeys, one rum, one philosophy: honour the grain, respect the barrel, reward the wait.</p>',
        text,
        count=1,
    )
    path.write_text(text, encoding="utf-8")
    print("collection.html")


def patch_footers():
    footer_desc = '<p class="footer__brand-desc">Four whiskeys, one rum, one philosophy: honour the grain, respect the barrel, reward the wait.</p>'
    craft_meta = set_meta(
        open(ROOT / "craft.html", encoding="utf-8").read(),
        "description",
        "How MNG Spirits is made — grain sourcing, slow distillation, and barrel aging. Discover the craft behind our premium whiskey and Caribbean rum.",
    )
    (ROOT / "craft.html").write_text(craft_meta, encoding="utf-8")
    for fname in ["craft.html", "connect.html", "copper-ridge.html", "bhaarat-field.html",
                  "gilded-grain.html", "liquid-velvet.html", "velvet-crown.html"]:
        path = ROOT / fname
        text = path.read_text(encoding="utf-8")
        text = re.sub(r'<p class="footer__brand-desc">[^<]+</p>', footer_desc, text)
        path.write_text(text, encoding="utf-8")


def main():
    for slug in ORDER:
        patch_product_page(slug)
    patch_index()
    patch_collection()
    patch_footers()
    # bump cache
    for html in ROOT.glob("*.html"):
        text = html.read_text(encoding="utf-8")
        text = re.sub(r"\?v=\d+", "?v=35", text)
        html.write_text(text, encoding="utf-8")
    print("cache v=35")


if __name__ == "__main__":
    main()
