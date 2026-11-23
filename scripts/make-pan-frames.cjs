/**
 * Generates the pan-in transition frames for the About scroll sequence
 * (see docs/SEQUENCE.md). Starting from the last illustrated frame, the camera
 * keeps panning right and eases to a stop on the portrait; horizontal motion
 * blur follows the pan speed and fades out as it settles.
 *
 * Reads (git-ignored sources):
 *   public/_incoming/frames/AboutSection_<FROM>.jpg   last illustrated frame
 *   public/_incoming/portrait-generated.jpg           the final image
 * Writes:
 *   public/_incoming/frames/AboutSection_<FROM+1 … TO>.jpg  (TO is the portrait itself)
 *
 * Usage: node scripts/make-pan-frames.cjs
 */
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const FRAMES = path.join(ROOT, "public/_incoming/frames");
const PORTRAIT = path.join(ROOT, "public/_incoming/portrait-generated.jpg");

const W = 1920;
const H = 1080;
const FROM = 27; // last illustrated frame
const TO = 46; // last frame = the portrait
const STEPS = TO - FROM;
/** Portrait x-offset at FROM: its doorway sits at ~71% of the width there. */
const START_OFF = 0.48 * W;
/** Soft left edge of the portrait where it meets the previous scene. */
const FEATHER = 160;
/** Streak length (px) per px/frame of pan speed, and its cap. */
const BLUR_PER_PX = 1.1;
const MAX_BLUR = 140;

/** Quadratic ease-out: fast whip-in, long gentle settle. */
const offAt = (k) => START_OFF * Math.pow(1 - k / STEPS, 2);
const name = (i) => path.join(FRAMES, `AboutSection_${String(i).padStart(5, "0")}.jpg`);

(async () => {
  const last = await sharp(name(FROM)).resize(W, H).toBuffer();
  const portrait = await sharp(PORTRAIT).resize(W, H).ensureAlpha().raw().toBuffer();
  for (let y = 0; y < H; y++)
    for (let x = 0; x < FEATHER; x++) portrait[(y * W + x) * 4 + 3] = Math.round((255 * x) / FEATHER);
  const feathered = await sharp(portrait, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();

  for (let k = 1; k <= STEPS; k++) {
    const out = name(FROM + k);
    if (k === STEPS) {
      await sharp(PORTRAIT).resize(W, H).jpeg({ quality: 92 }).toFile(out);
      console.log(path.basename(out), "(portrait)");
      continue;
    }
    const off = Math.round(offAt(k));
    const pan = Math.round(START_OFF) - off; // how far the previous scene has slid left
    const blur = Math.round(Math.min(MAX_BLUR, (offAt(k - 1) - offAt(k)) * BLUR_PER_PX));

    const bg = await sharp(last)
      .extract({ left: pan, top: 0, width: W - pan, height: H })
      .extend({ right: pan, background: "#000" })
      .toBuffer();
    const fg = await sharp(feathered).extract({ left: 0, top: 0, width: W - off, height: H }).toBuffer();
    let img = sharp(await sharp(bg).composite([{ input: fg, left: off, top: 0 }]).removeAlpha().toBuffer());
    if (blur >= 3) {
      const kw = blur | 1; // odd width; sharp needs a ≥3-row kernel, so blur only the middle row
      img = sharp(
        await img
          .convolve({ width: kw, height: 3, kernel: [...Array(kw).fill(0), ...Array(kw).fill(1), ...Array(kw).fill(0)], scale: kw })
          .toBuffer(),
      );
    }
    await img.jpeg({ quality: 92 }).toFile(out);
    console.log(path.basename(out), `off ${off}px blur ${blur}px`);
  }
})();
