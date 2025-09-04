# PsychoDiagnostic — static site

A simple, responsive one-page website inspired by a psychodiagnostic landing page.

## Structure

- index.html — content and layout
- styles.css — styles and responsive rules
- script.js — interactions (mobile menu, accordion, validation)

## Local preview

Open `index.html` in your browser.

Or start a tiny local server:

```bash
python3 -m http.server 5173
# then open http://localhost:5173
```

## Deploy

- GitHub Pages: push this folder as a repo, enable Pages (root)
- Netlify: drag-and-drop the folder or connect repository
- Vercel: import as static project, output directory is the project root

## Notes

- The contact form demonstrates client-side validation only.
- Replace email/phone with your real contacts.
