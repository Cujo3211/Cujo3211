# Halo MCC Tracker Changelog

## v142 - Hide matching wort.gg pull results
Date: 2026-06-05

### Changed
- Updated the wort.gg pull/compare flow.
- If a pulled wort.gg time already matches the mission's current Solo or Co-op time, it is hidden from the review table.
- The review table now only shows unmatched pulled times that need attention.
- Updated empty-result/status wording to explain that matching times are hidden.

## v141 - Remove non-playable wort.gg entries
Date: 2026-06-05

### Changed
- Updated `data/campaign_times.json` using uploaded `campaign_times(3).json`.
- Removed non-playable entries pulled from wort.gg:
  - ODST → Prepare To Drop
  - ODST → Mombasa Streets
  - Reach → Noble Actual
- Normalized short `mm:ss` times to `0:mm:ss`.
- Added a small ignore/filter guard so these non-playable entries do not stay in tracker data if pulled again.

## v140 - Campaign card bar percent scaling
Date: 2026-06-05

### Changed
- Fixed dashboard campaign cover mini-bars.
- Campaigns over 3 hours now fill as `100 - overage percentage`.
- Campaigns under 3 hours now fill as the amount they are under 3 hours.
- Example: `+33.1%` fills `66.9%`; `-12.4%` fills `12.4%`.

## v139 - Cloudflare Worker proxy support for wort.gg pulls
Date: 2026-06-05

### Changed
- Added Proxy URL support to the Database → Pull from wort.gg panel.
- Pull button now tries Cloudflare Worker proxy first, then direct wort.gg, then manual paste fallback.
- Added Cloudflare Worker source code at `cloudflare-worker/wort-proxy-worker.js`.
- Added setup guide at `docs/CLOUDFLARE_WORKER_WORT_PROXY.md`.

### Kept
- GitHub Pages static hosting structure.
- `data/campaign_times.json` as the only active campaign-times JSON.
- Preview/apply flow before times are changed.
