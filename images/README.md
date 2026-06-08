# Empyrean Spirits — Image Assets

Drop your product and lifestyle images here. Each file name maps directly to a reference in `index.html`.

## Hero scroll sequence

### Desktop (`sequences/intro/`)

- `frame_00001.jpg` through `frame_00596.jpg` (596 frames)
- Scrubbed via GSAP ScrollTrigger as you scroll the pinned hero section

### Mobile (`sequences/mobile/`)

- Source: `watermark-removed-make_this_in_also.mp4` (720×1280, 10s)
- Extracted at **60fps** → `frame_00001.jpg` through `frame_00600.jpg` (600 frames)
- Used automatically on viewports ≤900px wide
- Regenerate frames:

```bash
ffmpeg -i images/watermark-removed-make_this_in_also.mp4 -vf fps=60 -q:v 3 images/sequences/mobile/frame_%05d.jpg
```

## Transparent bottle assets (Curator's Pick)

| File | Product |
|------|---------|
| `velevetcrownnobg.png` | Velvet Crown |
| `liquidvelvetnobg.png` | Liquid Velvet |
| `gildedgrainnobg.png` | The Gilded Grain |
| `copperridgenobg.png` | Copper Ridge |

## Required images

| File | Used in | Recommended size |
|------|---------|------------------|
| `hero-decanter.png` | Hero banner (center decanter) | 800×1000px, transparent PNG |
| `velvet-crown.png` | Curator's Pick, Collection, Reserve, Gallery | 600×900px, transparent PNG |
| `liquid-velvet.png` | Curator's Pick, Collection | 600×900px, transparent PNG |
| `gilded-grain.png` | Curator's Pick, Collection, Gallery | 600×900px, transparent PNG |
| `copper-ridge.png` | Curator's Pick, Collection, Gallery | 600×900px, transparent PNG |
| `distillery.png` | Distillery section background | 1920×1080px |
| `pouring.png` | Cocktails CTA section | 800×1000px |
| `ingredients.png` | Philosophy section | 800×1000px |
| `hero-cocktail.png` | Philosophy float image | 600×600px |
| `copper-cocktail.png` | Gallery tile | 600×600px |
| `cocktail-lifestyle.png` | Gallery tile | 600×600px |

## Tips

- Bottle images work best as transparent PNGs on the cream background.
- The hero decanter should have a warm amber tone to blend with the gradient.
- Until images are added, CSS gradient placeholders display automatically.
