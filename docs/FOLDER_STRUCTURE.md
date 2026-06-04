# Recommended Folder Tree

```text
halo-mcc-tracker/
├─ netlify.toml
├─ README.md
├─ public/
│  ├─ index.html
│  ├─ _redirects
│  ├─ assets/
│  │  ├─ css/
│  │  │  └─ tracker.css
│  │  ├─ js/
│  │  │  └─ tracker.js
│  │  └─ images/
│  │     ├─ logos/
│  │     ├─ icons/
│  │     │  ├─ difficulty/
│  │     │  └─ games/
│  │     ├─ banners/
│  │     │  ├─ reach/
│  │     │  ├─ ce/
│  │     │  ├─ h2/
│  │     │  ├─ h3/
│  │     │  ├─ odst/
│  │     │  └─ h4/
│  │     ├─ covers/
│  │     │  ├─ reach/
│  │     │  ├─ ce/
│  │     │  ├─ h2/
│  │     │  ├─ h3/
│  │     │  ├─ odst/
│  │     │  └─ h4/
│  │     └─ loading-screens/
│  │        ├─ reach/
│  │        ├─ ce/
│  │        ├─ h2/
│  │        ├─ h3/
│  │        ├─ odst/
│  │        └─ h4/
│  └─ data/
│     ├─ campaign_times.json
│     ├─ campaign_times.csv
│     └─ mission_catalog.json
├─ _source/
│  ├─ uploads/
│  ├─ screenshots_raw/
│  │  └─ campaign-times/
│  │     ├─ halo_reach/solo/
│  │     ├─ halo_reach/co-op/
│  │     ├─ halo_ce/solo/
│  │     ├─ halo_ce/co-op/
│  │     ├─ halo_2/solo/
│  │     ├─ halo_2/co-op/
│  │     ├─ halo_3/solo/
│  │     ├─ halo_3/co-op/
│  │     ├─ halo_3_odst/solo/
│  │     ├─ halo_3_odst/co-op/
│  │     ├─ halo_4/solo/
│  │     └─ halo_4/co-op/
│  └─ screenshots_renamed/
│     └─ campaign-times/
├─ tools/
│  └─ rename_manifest_template.csv
└─ docs/
   └─ FOLDER_STRUCTURE.md
```

## Why raw screenshots stay outside `public/`

The tracker only needs the cleaned table data and selected display assets. The raw screenshots are source material. Keeping them outside `public/` means Netlify does not deploy them to the live website when the publish directory is set to `public`.
