Sparkling CVA 2025 — static site
================================

Overview
--------
This repository contains a small, static website for the Sparkling Chu Văn An 2025 event. It’s plain HTML/CSS/JS with no build tooling. Files are opened directly in a browser or served via a lightweight static server.

Key features implemented
------------------------
- Global background using bg1.webp with a subtle dark overlay
- Event gallery (Lễ Phát Động) with split layout:
	- Left: image
	- Right: caption (title + text)
- Navigation that doesn’t cover the caption content:
	- Prev/Next circular buttons over the image frame
	- Keyboard arrows (←/→)
- Auto-play every 20s with a visual progress bar
- 5 slide “house” indicators (1–5) for direct navigation
- UTF-8 Vietnamese text throughout (diacritics preserved)

Repository structure (partial)
------------------------------
- CNAME
- convert_to_webp.py
- index.html
- points.json
- README.md
- script.js
- style.css
- ttin.txt
- comingsoon/index.html
- fonts/
- nhaycovu/index.html
- phatdong/
	- index.html (legacy, may be corrupted by sync merges)
- photo/
	- phatdong/
- snight/index.html
- thapnanggieomo/index.html

Primary page for Lễ Phát Động
------------------------------
Path: phatdong/index_clean.html

Why “index_clean.html”? The original phatdong/index.html was repeatedly auto-merged by sync tooling (e.g., OneDrive), resulting in multiple complete HTML documents appended into one file, breaking linters and causing garbled Vietnamese text. The clean file avoids those merges and is safe to preview and ship.

What’s on the page
------------------
- Background: ../photo/bg1.webp with overlay
- Images: ../photo/phatdong/anh1.webp … anh5.webp
- Auto-play: 20 seconds per slide, shows a bottom progress bar
- Controls: Prev/Next buttons, 5 house indicators, keyboard arrows
- Layout: Image left, caption right; responsive tweaks for mobile

Editing the gallery content
---------------------------
In phatdong/index_clean.html, look for the JavaScript array named `data` near the bottom. Each slide has:
- image: relative path to .webp
- title: slide title
- text: slide caption/description

To change content, edit the `data` entries and/or replace images under photo/phatdong/.

Encoding and filenames
----------------------
- All HTML files use `<meta charset="utf-8">` at the top of `<head>`.
- Filenames include Vietnamese diacritics. Do not rename files unless you update all links. Keep casing and diacritics intact to avoid broken links on case-sensitive hosts.

Known sync issue (OneDrive/Git merge)
-------------------------------------
Symptoms:
- phatdong/index.html contains multiple full HTML documents concatenated
- Linter errors such as a `<link>` tag appearing inside a `<style>` block
- Garbled Vietnamese text (mojibake)

Workarounds:
- Use phatdong/index_clean.html for preview and deployment
- If you must keep the original name:
	1) Close sync/merge tools while editing
	2) Replace the entire file content with the clean version
	3) Ensure there is only one `</html>` at the end and nothing appended after it

Local preview
-------------
Option A: Double-click an HTML file to open it in your browser (easiest).

Option B: Run a lightweight static server (recommended for relative paths):

```powershell
cd "c:\Users\dogth\OneDrive\Máy tính\Sparkling"
python -m http.server 8000
# then open http://localhost:8000/phatdong/index.html
```

Notes
-----
- CNAME suggests the site may be hosted on GitHub Pages. If so, ensure links are relative (as they are now) and assets are committed.
- Keep image sizes optimized (use WebP). The `convert_to_webp.py` can help batch convert if needed.

Next steps
----------
- If you’re happy with `index.html`, either:
	- Update navigation to link to `/phatdong/index.html`, or
	- Replace `/phatdong/index.html` with the clean version after stopping any sync process.

Troubleshooting checklist
-------------------------
- Page loads but linter complains: check for duplicate HTML appended after the first `</html>`
- Vietnamese characters broken: ensure `<meta charset="utf-8">` and no duplicate, mixed-encoding content
- Buttons hidden: container overflow? The current layout uses pointer-events on the wrapper and places buttons safely inside the image frame
- Auto-play not advancing: verify the script section at the bottom runs (no console errors) and images exist at expected paths
