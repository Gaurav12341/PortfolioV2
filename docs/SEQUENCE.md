# Scroll sequence: how to rebuild the assets

The About intro (`src/components/sections/about/about-scroll-section.tsx`) scrubs
illustrated frames on a canvas, then reveals the portrait with a clip-path circle.
All tunables live in `src/content/sequence.ts`.

Sources stay in `public/_incoming/` (git-ignored). Outputs go to `public/sequence/`.
ffmpeg comes from the `ffmpeg-static` dev dependency, so nothing global is needed.

```bash
FF=node_modules/ffmpeg-static/ffmpeg.exe   # macOS/Linux: node_modules/ffmpeg-static/ffmpeg

# Frames: desktop (1600px) + mobile (900px). Input numbering starts at 00000.
$FF -y -start_number 0 -i public/_incoming/frames/AboutSection_%05d.jpg -frames:v 28 \
  -vf "scale=1600:-2" -c:v libwebp -quality 78 -start_number 0 public/sequence/f_%03d.webp
$FF -y -start_number 0 -i public/_incoming/frames/AboutSection_%05d.jpg -frames:v 28 \
  -vf "scale=900:-2"  -c:v libwebp -quality 74 -start_number 0 public/sequence/m/f_%03d.webp

# Portrait revealed after the last frame
$FF -y -i public/_incoming/portrait-generated.jpg -vf "scale=1600:-2" -c:v libwebp -quality 82 public/sequence/portrait.webp
$FF -y -i public/_incoming/portrait-generated.jpg -vf "scale=900:-2"  -c:v libwebp -quality 80 public/sequence/m/portrait.webp
```

## Using a reshoot

1. Put the new frames in `public/_incoming/frames/` as `AboutSection_00000.jpg …`.
2. Change `-frames:v 28` above to the new count and rerun both frame commands.
3. Set `frameCount` in `src/content/sequence.ts` to the same number.
4. If the last frame no longer lines up with the portrait, adjust `align` (px offset and
   scale) and `face` (where the reveal circle starts, as 0–1 fractions).

## Two-layer depth parallax (currently off)

The component supports a separate subject layer: set `portrait.subject` to
`{ desktop, mobile }` paths. Leave it `null` until there is a clean cut-out.

The rembg cut-out (`isnet-anime` model, Nov 2026) lost the legs and left a floating knee
fragment, so it would tear at the waist when the layers move apart. To try again, make a
full-body cut-out in Photopea and save it as `public/_incoming/portrait-subject.png` at the
same 1920×1080 size as the portrait. Then:

```bash
$FF -y -i public/_incoming/portrait-subject.png -vf "scale=1600:-2" -c:v libwebp -pix_fmt yuva420p -quality 82 public/sequence/portrait-subject.webp
$FF -y -i public/_incoming/portrait-subject.png -vf "scale=900:-2"  -c:v libwebp -pix_fmt yuva420p -quality 80 public/sequence/m/portrait-subject.webp
```

With the mouse at each corner of the section, check the edges for a double outline. If you
see one, lower `bgDepth` in `sequence.ts`.

## Other portraits

```bash
# Anime portrait (contact section until the laptop image arrives), from PHASES.md Appendix A
$FF -y -i public/_incoming/portrait-anime.png -vf "scale=-2:1200:flags=lanczos" -c:v libwebp -quality 80 public/images/portrait-anime.webp
$FF -y -i public/_incoming/portrait-anime.png -vf "scale=-2:750:flags=lanczos"  -c:v libwebp -quality 78 public/images/portrait-anime-sm.webp

# Full-body cut-out (About opener). The source has a plain background, so rembg is clean.
# Cut-out: .venv-tools (rembg, isnet-anime) -> public/_incoming/portrait-full-subject.png
$FF -y -i public/_incoming/portrait-full-subject.png -vf "scale=-2:1400:flags=lanczos" -c:v libwebp -pix_fmt yuva420p -quality 85 public/images/portrait-full.webp
$FF -y -i public/_incoming/portrait-full-subject.png -vf "scale=-2:960:flags=lanczos"  -c:v libwebp -pix_fmt yuva420p -quality 82 public/images/portrait-full-sm.webp
```
