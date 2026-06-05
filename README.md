# Halo MCC Tracker v1

GitHub Pages tracker for Halo MCC Legendary campaign times.

## GitHub Pages structure

This repo publishes from the repo root.

Required live-site files:

```text
index.html
assets/
data/campaign_times.json
.nojekyll
```

## Automated MCC time update

The GitHub Action pulls Halo Waypoint MCC API campaign records and updates:

```text
data/campaign_times.json
```

Workflow:

```text
.github/workflows/update-mcc-times.yml
```

Updater script:

```text
scripts/update-mcc-times.js
```

Required GitHub Actions secret:

```text
MCC_API_SPARTAN_TOKEN
```

Run it from:

```text
GitHub → Actions → Update MCC Campaign Times → Run workflow
```

Use `false` for “Run without committing changes” when you want it to update and commit `data/campaign_times.json`.

## Notes

The Database tab’s automated MCC update instructions point to GitHub Actions. Browser-based MCC API pulls return 401 because the browser cannot access the private GitHub secret.
