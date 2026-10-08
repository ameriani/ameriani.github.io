# Alessandra Meriani — Academic website

Static personal academic site (English / Italian, light / dark). No build step.

## Local preview

    python3 -m http.server 8080

Open http://localhost:8080/ — do not open `index.html` as a file (JSON will not load).

## Edit content

- English: `data/content-en.json`
- Italian: `data/content-it.json` (keep the same keys)
- Photo: replace `assets/profile.jpg`
- Optional CV/PDF: put files in `assets/` and set `"cv"` or work item `"pdf"` paths in both JSON files (`null` hides the link)

## Publish on GitHub Pages

1. Create a GitHub repository (e.g. `alessandra-meriani.github.io` or any repo).
2. Push this folder to `main`.
3. Settings → Pages → Source: Deploy from branch → `main` / `/ (root)`.
4. Wait for the site URL; share it and update the UniBo “sito personale” link if desired.

## Optional tests (developers)

    npm test
