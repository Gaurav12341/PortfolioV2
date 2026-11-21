# public/_incoming/

Raw source assets go here. Everything in this folder **except this README** is git-ignored.
Build scripts read from here and write optimized copies into `public/videos/`, `public/sequence/` and `public/images/`.

| File | Source | Used in | Status |
|---|---|---|---|
| `supportrag-demo.mp4` | Google Drive (downloaded by hand) | Phase 3: SupportRAG demo video | ✅ present (29.3 MB) |
| `frames/AboutSection_00001…00027.jpg` | existing frames (also in `public/about-sequence/`) | Phase 5: scroll sequence | ⏳ |
| `portrait-generated.png` | existing generated portrait | Phase 5: portrait reveal | ⏳ |
| `portrait-subject.png` | rembg / Photopea (background removed) | Phase 5: parallax layer | ⏳ |
| `portrait-depth.png` | Depth Anything V2 (HF Space) | Phase 5: depth parallax | ⏳ |
| `portrait-anime.png` | generated with PHASES.md Appendix A prompt | Phase 7: contact section | ⏳ |
| `resume.pdf` | latest résumé | Phases 1 & 8: `/resume.pdf` | ⏳ |
