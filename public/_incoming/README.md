# public/_incoming/

Raw source assets go here. Everything in this folder **except this README** is git-ignored.
Build scripts read from here and write optimized copies into `public/videos/`, `public/sequence/` and `public/images/`.

| File | Source | Used in | Status |
|---|---|---|---|
| `supportrag-demo.mp4` | Google Drive (downloaded by hand) | Phase 3: SupportRAG demo video | ✅ present (29.3 MB) |
| `frames/AboutSection_00000…00027.jpg` | existing frames | Phase 5: scroll sequence | ✅ present → `public/sequence/` |
| `portrait-generated.jpg` | existing generated portrait | Phase 5: portrait reveal | ✅ present → `public/sequence/portrait.webp` |
| `portrait-subject.png` | rembg / Photopea (background removed) | Phase 5: parallax layer | ⚠️ rembg result incomplete; layer off (docs/SEQUENCE.md) |
| `portrait-depth.png` | Depth Anything V2 (HF Space) | Phase 5: depth parallax (stretch) | skipped |
| `portrait-anime.png` | generated with PHASES.md Appendix A prompt | Phase 6 About card, Phase 7 contact | ✅ present → `public/images/portrait-anime*.webp` |
| `resume.pdf` | latest résumé | Phases 1 & 8: `/resume.pdf` | ⏳ |
