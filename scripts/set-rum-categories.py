#!/usr/bin/env python3
"""Set Velvet Crown, Liquid Velvet, and all whiskey expressions to rum."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
HTML = list(ROOT.glob("*.html"))

# Product-specific type labels
REPLACEMENTS = [
    # Velvet Crown
    ("Velvet Crown 18-Year Single Malt Whiskey", "Velvet Crown Fine Aged Rum"),
    ("Velvet Crown Whiskey", "Velvet Crown Rum"),
    ("Single Malt Whiskey", "Fine Aged Rum"),
    ("Single Malt Whisky", "Fine Aged Rum"),
    ("Velvet Crown 18-Year Single Malt | Premium Scotch Whisky", "Velvet Crown | Fine Aged Rum"),
    ("Velvet Crown | Premium Single Malt Whisky", "Velvet Crown | Fine Aged Rum"),
    ("18-year single malt whiskey aged in charred sherry casks", "fine aged rum matured in charred oak casks"),
    ("Barrel-aged 18-year single malt whiskey", "Barrel-aged fine rum"),
    ("a single malt shaped by patience", "a rum shaped by patience"),
    ("signature expression of MNG Spirits — a single malt", "signature rum of MNG Spirits — an expression"),
    ("Velvet Crown single malt", "Velvet Crown rum"),
    # Liquid Velvet
    ("Liquid Velvet Premium Vodka", "Liquid Velvet Premium Rum"),
    ("Liquid Velvet Vodka", "Liquid Velvet Rum"),
    ("Premium Vodka", "Premium Rum"),
    ("Liquid Velvet | Ultra-Premium Craft Vodka", "Liquid Velvet | Premium Rum"),
    ("Liquid Velvet | Premium Craft Vodka", "Liquid Velvet | Premium Rum"),
    ("five-times distilled craft vodka from winter wheat", "small-batch premium rum with a silk-smooth profile"),
    ("Ultra-premium vodka — five-times distilled, winter wheat", "Premium rum — smooth, balanced, barrel-polished"),
    ("Five-times distilled from winter wheat for crystal clarity and a silk finish. White pepper on the nose, mineral precision on the palate — a vodka engineered for the quiet confidence of the long pour.", "Barrel-polished premium rum with crystal clarity and a silk finish. Warm spice on the nose, molasses and vanilla on the palate — crafted for the quiet confidence of the long pour."),
    ("Five-times distilled from winter wheat. Crystal clarity, silk finish, and white pepper", "Barrel-polished and silk-smooth. Warm spice, molasses, and vanilla"),
    ("Five-times distilled from winter wheat. Crystal clarity, silk finish, white pepper.", "Barrel-polished premium rum. Silk finish, warm spice, molasses."),
    ("Liquid Velvet vodka", "Liquid Velvet rum"),
    # Bhaarat Field (whisky → rum)
    ("Bhaarat Field Premium Indian Whisky", "Bhaarat Field Fine Aged Rum"),
    ("Bhaarat Field Indian Whisky", "Bhaarat Field Rum"),
    ("Premium Indian Whisky", "Fine Aged Rum"),
    ("Bhaarat Field | Premium Indian Whisky", "Bhaarat Field | Fine Aged Rum"),
    ("premium Indian whisky from sun-ripened barley", "fine aged rum from sun-ripened molasses and spice"),
    ("Premium Indian whisky — sun-ripened barley", "Fine aged rum — warm spice and golden character"),
    ("Distilled from sun-ripened barley drawn across open heartland fields. Warm spice, golden malt, and a finish that lingers like late harvest light — India's landscape translated into glass.", "Aged where open heartland fields meet the coast. Warm spice, golden molasses, and a finish that lingers like late harvest light — character translated into glass."),
    ("Sun-ripened barley from open heartland fields. Warm spice, golden malt", "Sun-ripened cane and open heartland spice. Warm molasses, golden vanilla"),
    ("Indian Whisky", "Aged Rum"),
    ("Indian whisky", "fine aged rum"),
    # Marquee
    ("<span class=\"hp-marquee__cat\">Single Malt</span>", "<span class=\"hp-marquee__cat\">Aged Rum</span>"),
    # Portfolio / SEO summaries
    ("barrel-aged single malt whiskey, craft vodka, small-batch rum, Bordeaux wine, and Indian whisky", "fine aged rum, premium rum, small-batch rum, Bordeaux wine, and heritage rum expressions"),
    ("luxury whiskey, craft vodka, small-batch rum, Bordeaux wine, and Indian whisky", "luxury aged rum, premium rum, small-batch rum, fine wine, and heritage rum"),
    ("premium whiskey, vodka, rum, wine, and whisky crafted with patience", "premium rum, fine wine, and aged spirits crafted with patience"),
    ("premium whiskey, vodka, rum, and wine", "premium rum and fine wine"),
    ("single malt whiskey, craft vodka, small-batch rum, fine Bordeaux wine, and premium Indian whisky", "fine aged rum, premium rum, small-batch rum, fine Bordeaux wine, and heritage rum expressions"),
    ("barrel-aged whiskey, ultra-premium vodka, Caribbean rum, Bordeaux wine, and Indian whisky", "fine aged rum, premium rum, Caribbean rum, Bordeaux wine, and heritage rum"),
    ("luxury whiskey, craft vodka, aged rum, fine wine, and premium Indian whisky portfolio", "luxury aged rum, premium rum, fine wine, and heritage rum portfolio"),
    ("Velvet Crown single malt, Liquid Velvet vodka, Gilded Grain rum", "Velvet Crown rum, Liquid Velvet rum, Gilded Grain rum"),
    ("Premium Spirits Collection | Whiskey, Vodka, Rum &amp; Wine", "Premium Spirits Collection | Rum &amp; Wine"),
    ("luxury whiskey, craft vodka, small-batch rum, Bordeaux wine, Indian whisky", "luxury aged rum, premium rum, small-batch rum, Bordeaux wine"),
    ("Whiskey being poured over a single ice sphere", "Rum being poured over a single ice sphere"),
    ("<a href=\"collection.html\" class=\"categories__item\">Whisky</a>", "<a href=\"collection.html\" class=\"categories__item\">Rum</a>"),
    ("<a href=\"collection.html\" class=\"categories__item\">Vodka &amp; Rum</a>", "<a href=\"collection.html\" class=\"categories__item\">Aged Rum</a>"),
]

def main():
    for path in HTML:
        text = path.read_text(encoding="utf-8")
        for old, new in REPLACEMENTS:
            text = text.replace(old, new)
        path.write_text(text, encoding="utf-8")
        print("updated", path.name)

if __name__ == "__main__":
    main()
