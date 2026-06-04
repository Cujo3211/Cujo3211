# Halo MCC Tracker Changelog

## v138 - GitHub Pages static wort.gg pull
Date: 2026-06-04

### Changed
- Converted the tracker package to GitHub Pages static-root structure.
- Removed the Netlify Function dependency for wort.gg pulling.
- The Database page now tries direct browser fetch from wort.gg first.
- Added manual paste fallback for wort.gg JSON if CORS/browser blocking prevents direct fetch.
- Active data remains `data/campaign_times.json`.

### GitHub Pages
- Publish from the repository root.
- Includes `.nojekyll` so GitHub Pages serves files normally.

