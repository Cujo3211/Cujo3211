# Halo MCC Tracker Asset Placement

Created: 2026-05-30T10:15:10Z

## What has been placed

- Original uploaded screenshot folders copied to `_source/screenshots_raw/campaign-times/`.
- Renamed full screenshot copies created under `_source/screenshots_renamed/campaign-times/`.
- Mission artwork/loading-screen crops created under `public/assets/images/loading-screens/`.
- Manifest written to `tools/asset_placement_manifest.csv` and `public/data/asset_placement_manifest.json`.
- Mission catalog image paths written to `public/data/mission_catalog.json`.

## Folder rule

Only files inside `public/` are meant to be published by Netlify. The `_source/` folders are project storage/reference only.

## Important parsing rule

For MCC campaign timing screenshots, the selected mission is identified by the campaign loading/artwork card in the top-left, not necessarily by the highlighted list row.

## Needs review

1 uploaded image(s) were not treated as mission screenshots. They were copied to `_source/screenshots_renamed/campaign-times/_needs_review/`.

## Banners, logos, covers, and icons

Those folders are ready but still mostly placeholders until the actual assets are added. Put them here:

- `public/assets/images/logos/`
- `public/assets/images/icons/`
- `public/assets/images/banners/`
- `public/assets/images/covers/`
