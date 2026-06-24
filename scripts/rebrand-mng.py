#!/usr/bin/env python3
"""Rebrand Empyrean → MNG Spirits and refresh SEO copy."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

GLOBAL_REPLACEMENTS = [
    ("empyrean_age", "mng_age"),
    ("Empyrean Spirits Private", "MNG Spirits"),
    ("Empyrean Spirits — Private Collection", "MNG Spirits — Premium Portfolio"),
    ("Empyrean Spirits", "MNG Spirits"),
    ("Empyrean private collection", "MNG spirits portfolio"),
    ("site-header__wordmark-main\">Empyrean", "site-header__wordmark-main\">MNG"),
    ('footer__ghost" aria-hidden="true">Empyrean', 'footer__ghost" aria-hidden="true">MNG'),
    ('site-header__monogram" aria-hidden="true">E', 'site-header__monogram" aria-hidden="true">M'),
    ("Private Collection", "Spirit Showcase"),
    ("Private Release", "Flagship Expression"),
    ("Request Allocation", "Get in Touch"),
    ("unmistakably Empyrean", "unmistakably MNG"),
    ("Empyrean atelier", "MNG atelier"),
    ("Empyrean<br>Spirits", "MNG<br>Spirits"),
    (
        "Online Wine &amp; Spirits — where rarity meets ritual.",
        "Premium Spirits Portfolio — craft heritage, barrel-aged excellence.",
    ),
    ("Follow Empyrean Spirits", "Follow MNG Spirits"),
    (
        "Five spirits, one philosophy: honour the grain, respect the barrel, reward the wait.",
        "A heritage spirits showcase — premium whiskey, vodka, rum, wine, and whisky crafted with patience.",
    ),
    (
        "MNG Spirits began with a single cask and a refusal to compromise. Today, our five expressions span continents, from Highland barley to Indian spice, but the principle remains unchanged: source obsessively, distill slowly, age honestly.",
        "MNG Spirits began with a single cask and an uncompromising standard. Our portfolio spans single malt whiskey, craft vodka, small-batch rum, fine Bordeaux wine, and premium Indian whisky — each expression a showcase of artisan distillation and barrel-aged patience.",
    ),
    (
        "Each expression born from a single obsession: that great spirits are not made — they are waited for.",
        "Five flagship expressions in our premium spirits portfolio — barrel-aged whiskey, ultra-premium vodka, Caribbean rum, Bordeaux wine, and Indian whisky.",
    ),
    (
        "Five Spirits,<br>One Legacy",
        "Premium Spirits<br>Portfolio",
    ),
    (
        "Five Spirits, One Legacy",
        "Premium Spirits Portfolio",
    ),
    (
        "MNG Spirits maintains a small, deliberate circle. We respond to every message personally — usually within two working days.",
        "MNG Spirits is a showcase of heritage craft spirits. Reach out for distillery visits, partnerships, or press — we respond personally within two working days.",
    ),
    (
        "Private visits, trade partnerships, and press enquiries — each handled with the same care we give the cask.",
        "Distillery visits, trade partnerships, and press enquiries — each handled with the care we bring to every cask.",
    ),
    (
        "Discover how MNG Spirits is made — from grain selection and slow distillation to barrel aging across three continents.",
        "Discover artisan distillation at MNG Spirits — grain sourcing, slow distillation, and barrel aging across three continents.",
    ),
    (
        "Barrel-aged patience. Discover the distillation, aging, and release philosophy behind MNG Spirits.",
        "Barrel-aged patience and craft distillation — explore how MNG Spirits shapes whiskey, vodka, rum, and wine.",
    ),
    (
        "Contact MNG Spirits — book a distillery visit, enquire about trade partnerships, or reach our press team.",
        "Contact MNG Spirits — book a distillery visit, trade partnership, or press enquiry for our premium spirits portfolio.",
    ),
    (
        "Book a private visit, trade enquiry, or press request with MNG Spirits.",
        "Book a distillery visit or send a trade or press enquiry to MNG Spirits.",
    ),
    (
        "Explore the full MNG Spirits collection: Velvet Crown Whiskey, Liquid Velvet Vodka, The Gilded Grain Rum, Copper Ridge Wine, and Bhaarat Field Premium Indian Whisky.",
        "Explore the MNG Spirits portfolio — 18-year single malt whiskey, craft vodka, small-batch rum, Bordeaux red wine, and premium Indian whisky.",
    ),
    (
        "Five spirits, one legacy. Explore every expression in the MNG private collection.",
        "Premium spirits portfolio — explore single malt whiskey, vodka, rum, wine, and Indian whisky from MNG Spirits.",
    ),
]

PAGE_HEAD = {
    "index.html": {
        "title": "MNG Spirits | Premium Spirits Portfolio &amp; Craft Distillery Showcase",
        "description": "MNG Spirits — a premium spirits showcase featuring barrel-aged single malt whiskey, craft vodka, small-batch rum, Bordeaux wine, and Indian whisky. Explore artisan distillation and heritage craftsmanship.",
        "og_title": "MNG Spirits | Premium Spirits Portfolio",
        "og_description": "Discover five flagship expressions — luxury whiskey, ultra-premium vodka, aged rum, fine wine, and Indian whisky. A heritage spirits showcase.",
        "keywords": "premium spirits portfolio, luxury whiskey, craft vodka, small-batch rum, Bordeaux wine, Indian whisky, artisan distillery, barrel-aged spirits, heritage spirits brand, spirits showcase",
    },
    "collection.html": {
        "title": "Premium Spirits Collection | Whiskey, Vodka, Rum &amp; Wine | MNG Spirits",
        "description": "Browse the full MNG Spirits portfolio — Velvet Crown single malt, Liquid Velvet vodka, Gilded Grain rum, Copper Ridge Bordeaux, and Bhaarat Field Indian whisky.",
        "og_title": "Premium Spirits Collection | MNG Spirits",
        "og_description": "Five flagship expressions. Explore our luxury whiskey, craft vodka, aged rum, fine wine, and premium Indian whisky portfolio.",
    },
    "craft.html": {
        "title": "Artisan Distillation &amp; Barrel Aging | The Craft | MNG Spirits",
        "description": "How MNG Spirits is made — grain sourcing, slow distillation, and barrel aging. Discover the craft behind our premium whiskey, vodka, rum, and wine.",
        "og_title": "Artisan Distillation | MNG Spirits",
        "og_description": "Barrel-aged patience and craft distillation — the philosophy behind MNG Spirits premium portfolio.",
    },
    "connect.html": {
        "title": "Contact MNG Spirits | Distillery Visits &amp; Enquiries",
        "description": "Contact MNG Spirits for distillery visits, trade partnerships, and press enquiries. A premium spirits showcase — by appointment.",
        "og_title": "Contact MNG Spirits",
        "og_description": "Book a distillery visit or reach our team for partnerships and press about the MNG Spirits portfolio.",
    },
    "velvet-crown.html": {
        "title": "Velvet Crown 18-Year Single Malt | Premium Scotch Whisky | MNG Spirits",
        "description": "Velvet Crown — 18-year single malt whiskey aged in charred sherry casks. Smoked honey, dried fig, toasted vanilla. A flagship expression from MNG Spirits.",
        "og_title": "Velvet Crown | Premium Single Malt Whisky | MNG Spirits",
        "og_description": "Barrel-aged 18-year single malt whiskey — smoked honey, sherry cask maturation, Highland provenance.",
    },
    "liquid-velvet.html": {
        "title": "Liquid Velvet | Ultra-Premium Craft Vodka | MNG Spirits",
        "description": "Liquid Velvet — five-times distilled craft vodka from winter wheat. Crystal clarity, silk finish, white pepper. Premium vodka from MNG Spirits.",
        "og_title": "Liquid Velvet | Premium Craft Vodka | MNG Spirits",
        "og_description": "Ultra-premium vodka — five-times distilled, winter wheat, crystal clarity and silk finish.",
    },
    "gilded-grain.html": {
        "title": "The Gilded Grain | Small-Batch Aged Rum | MNG Spirits",
        "description": "The Gilded Grain — small-batch Caribbean rum with dark molasses, star anise, and orange zest. Fine aged rum from MNG Spirits.",
        "og_title": "The Gilded Grain | Premium Aged Rum | MNG Spirits",
        "og_description": "Small-batch Caribbean rum — dark molasses, star anise, barrel-aged character.",
    },
    "copper-ridge.html": {
        "title": "Copper Ridge | Fine Bordeaux Red Wine | MNG Spirits",
        "description": "Copper Ridge — deep ruby Bordeaux red wine with black cherry, cedar, and dark chocolate notes. Fine wine from MNG Spirits.",
        "og_title": "Copper Ridge | Bordeaux Red Wine | MNG Spirits",
        "og_description": "Premium Bordeaux red wine — black cherry, cedar, dark chocolate, crafted for the long table.",
    },
    "bhaarat-field.html": {
        "title": "Bhaarat Field | Premium Indian Whisky | MNG Spirits",
        "description": "Bhaarat Field — premium Indian whisky from sun-ripened barley. Warm spice, golden malt, long finish. Heritage whisky from MNG Spirits.",
        "og_title": "Bhaarat Field | Premium Indian Whisky | MNG Spirits",
        "og_description": "Premium Indian whisky — sun-ripened barley, warm spice, golden malt finish.",
    },
}

PRODUCT_DESC = {
    "velvet-crown.html": (
        "Aged 18 years in charred sherry casks. Smoked honey, dried fig, and toasted vanilla converge in the signature single malt of MNG Spirits — shaped by Highland air, sherry oak, and uncompromising patience.",
        "signature expression of MNG Spirits — a single malt shaped by patience, Highland air, and uncompromising cask selection.",
    ),
}


def replace_meta(content: str, name: str, value: str) -> str:
    import re
    pattern = rf'(<meta name="{name}" content=")[^"]*(")'
    if re.search(pattern, content):
        return re.sub(pattern, rf"\1{value}\2", content, count=1)
    return content


def replace_title(content: str, title: str) -> str:
    import re
    return re.sub(r"<title>[^<]*</title>", f"<title>{title}</title>", content, count=1)


def replace_og(content: str, prop: str, value: str) -> str:
    import re
    pattern = rf'(<meta property="{prop}" content=")[^"]*(")'
    return re.sub(pattern, rf"\1{value}\2", content, count=1)


def main():
    files = list(ROOT.glob("*.html")) + [ROOT / "script.js"]
    for path in files:
        if path.name not in PAGE_HEAD and path.suffix != ".js":
            if path.suffix == ".html" and path.name not in [
                "index.html", "collection.html", "craft.html", "connect.html",
                "velvet-crown.html", "liquid-velvet.html", "gilded-grain.html",
                "copper-ridge.html", "bhaarat-field.html",
            ]:
                continue
        text = path.read_text(encoding="utf-8")
        for old, new in GLOBAL_REPLACEMENTS:
            text = text.replace(old, new)
        if path.name in PAGE_HEAD:
            meta = PAGE_HEAD[path.name]
            text = replace_title(text, meta["title"])
            text = replace_meta(text, "description", meta["description"])
            text = replace_og(text, "og:title", meta["og_title"])
            text = replace_og(text, "og:description", meta["og_description"])
            if "keywords" in meta:
                if 'name="keywords"' not in text:
                    text = text.replace(
                        f'<meta name="description" content="{meta["description"]}">',
                        f'<meta name="description" content="{meta["description"]}">\n  <meta name="keywords" content="{meta["keywords"]}">',
                    )
                else:
                    text = replace_meta(text, "keywords", meta["keywords"])
        if path.suffix == ".js":
            text = text.replace("title: 'MNG Spirits'", "title: 'MNG Spirits | Premium Spirits Portfolio'")
        path.write_text(text, encoding="utf-8")
        print("updated", path.name)


if __name__ == "__main__":
    main()
