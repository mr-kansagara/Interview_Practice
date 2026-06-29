# Interview Prep — study portal

A static website that renders the `.md` study notes in this folder with a sidebar,
dark/light themes, syntax-highlighted C#, and progress tracking saved in your browser.

## Run it locally

`fetch()` doesn't work from `file://`, so open it through a tiny web server:

```bash
# from this folder (d:\Personal\practice)
python -m http.server 8080
# then open http://localhost:8080
```

(or `npx serve` if you have Node.)

## Add a new step

1. Save the new file at the repo root, e.g. `Step-03-CSharp-Advanced.md`.
2. Add one entry under the right track in **`content/manifest.json`**:

   ```json
   {
     "id": "step-03-csharp-advanced",
     "title": "Step 03 — C# Advanced",
     "topic": "Delegates, events, generics",
     "file": "Step-03-CSharp-Advanced.md"
   }
   ```
3. Refresh / redeploy. No HTML changes needed.

## Deploy

It's a plain static site (no build step), so any static host works. For Netlify:

- **Drag & drop:** drag this folder onto https://app.netlify.com/drop.
- **Git:** push to a repo → *Add new site → Import* → publish directory `.`, no build command.

## Files

| Path | What it is |
|------|------------|
| `index.html` | App shell |
| `assets/css/style.css` | Theme + layout |
| `assets/css/highlight.css` | Code-highlight theme (CSS-variable driven) |
| `assets/js/app.js` | Routing, rendering, progress |
| `assets/js/marked.min.js`, `assets/js/highlight.min.js` | Vendored libraries (local, no CDN) |
| `content/manifest.json` | The list of steps — the one file to edit when adding a step |
| `*.md` | Your study notes (source of truth, untouched) |
