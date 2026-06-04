# Halo MCC Tracker - GitHub Pages Setup

This ZIP is structured for GitHub Pages static hosting.

## Upload to GitHub

1. Create a new GitHub repository.
2. Upload the contents of the `Halo MCC Tracker` folder to the repository root.
3. In GitHub, go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose branch: `main`.
6. Choose folder: `/root`.
7. Save.

Your site will be available at:

```text
https://YOUR-GITHUB-NAME.github.io/YOUR-REPO-NAME/
```

## wort.gg pull button

GitHub Pages cannot run server functions. The tracker now tries to call wort.gg directly from the browser:

```text
https://wort.gg/api/stats/Cujo3211/campaign
```

If the browser blocks direct fetch, use the manual fallback:

1. Open Database page.
2. Click **PULL FROM WORT.GG**.
3. Click **OPEN WORT.JSON**.
4. Copy the full JSON response.
5. Paste it into the text box.
6. Click **USE PASTED JSON**.
7. Review/apply rows.
8. Click **DOWNLOAD JSON** to save the updated `campaign_times.json`.
