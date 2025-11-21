<!-- Copilot instructions for Sparkling CVA 2025 -->
# Sparkling CVA 2025 — AI Agent Guidance

This repository is a small, static website (plain HTML/CSS/JS) for an event. There is no build toolchain — files are served directly from the filesystem or a lightweight static server. The notes below capture the minimal, high-value information an AI coding agent needs to be immediately productive.

1) Big picture
- **Static site**: HTML pages, `style.css`, and `script.js` drive the UI. No bundler, no server-side code.
- **Primary interactive page**: `phatdong/index_clean.html` is the canonical gallery page. `phatdong/index.html` may be corrupted by sync merges — prefer the clean file for edits and preview.
- **House orbit & points**: `script.js` builds a dynamic “house orbit” from `ttin.txt` and `points.json`. `ttin.txt` can be either a JSON array or a prose format parsed by `parseHouseProseDetailed`.

2) Key files and responsibilities
- `phatdong/index_clean.html`: Primary gallery and canonical data array `data` (edit slides here).
- `phatdong/index.html`: Legacy / possibly corrupted by sync. Do not edit unless you will replace it atomically.
- `script.js`: Single source of runtime logic: background handling, IntersectionObserver reveals, countdown, house orbit builder, `setImageWithWebp`, points override, ranking algorithm.
- `ttin.txt`: Holds house metadata. Accepts either JSON array (preferred) or prose blocks starting with `NHÀ X:` — `script.js` will parse both.
- `points.json`: Optional override for weekly points. Accepts either an array (`[{code:'a',points:123},...]`) or an object `{ points: [...] }`.
- `photo/`: All images and avatars (WebP preferred). Code attempts `.webp` first and falls back to original extension.

3) Important runtime patterns & conventions
- Image preference: functions named `setImageWithWebp` rewrite filenames to `.webp` and set `onerror` to fall back to original. When adding images, include `.webp` versions if possible.
- Data loading: `script.js` fetches `ttin.txt` and `points.json` with `{ cache: 'no-store' }`. It accepts both formats and will merge prose details into JSON.
- Ranking: competition ranking is used (ties share rank, next rank skips accordingly). See `render()` in `script.js`.
- Animation/build-on-reveal: many heavy builders run only after their section intersects the viewport (IntersectionObserver). Tests should trigger the section reveal or run code in a browser preview.

4) Developer workflow (how to preview/test)
- Quick preview: open `phatdong/index_clean.html` directly in a browser for static checks.
- Recommended local server: from repo root run:
```bash
python -m http.server 8000
# then open http://localhost:8000/phatdong/index_clean.html
```
- When editing `phatdong/index.html` (the non-clean file), **stop sync/merge tools first** (OneDrive, etc.), then replace the entire file with the clean version to avoid repeated concatenated merges.

5) Project-specific patterns to follow
- Always keep files in UTF-8 and preserve Vietnamese diacritics in filenames and links — do not rename images unless you update every reference.
- Prefer editing `phatdong/index_clean.html` rather than `phatdong/index.html` to avoid merged garbage.
- When adding house data, update `ttin.txt` (JSON array recommended) and/or `points.json` if you're updating scores only. Examples below.

6) Examples
- Minimal `points.json` (array form):
```json
[ { "code": "a", "points": 480 }, { "code": "p", "points": 440 } ]
```
- `ttin.txt` JSON array example (top of file):
```json
[ { "code": "a", "name": "Adetis", "points": 450, "image": "photo/a.webp", "info": "..." } ]
```
- Prose snippet accepted by parser (also valid inside `ttin.txt`):
```
𝄞 NHÀ A: #ADETIS - SÁO MÈO KÉP - SỰ LINH HOẠT
Giữa những triền ruộng bậc thang... (full paragraph)
```

7) Integration & extension notes
- `script.js` merges `ttin.txt` (JSON or prose) with `points.json` overrides. Any new external data feeds must match these shapes or be converted client-side.
- If you add new interactive sections, follow the existing pattern: delay heavy DOM building until the section enters view, and use `setImageWithWebp` for images.

8) Troubleshooting hints (common problems)
- Symptom: `phatdong/index.html` contains multiple full HTML documents — fix by replacing the file with `index_clean.html` and disabling sync while editing.
- Symptom: Vietnamese characters appear garbled — ensure `<meta charset="utf-8">` at top and file encoding is UTF-8.
- Symptom: house points not updated — check `points.json` format (array vs `{ points: [...] }`) and that filenames/case match codes used in `ttin.txt`.

If anything is unclear or you want the instructions expanded (more examples, test checklist, or a small CI job to validate `phatdong/index.html` vs `index_clean.html`), tell me which section to expand and I will iterate.
<!-- Copilot / AI agent instructions for Sparkling CVA 2025 repo -->
# Guidance for AI coding agents

This repository is a small, static website (HTML/CSS/JS) for the Sparkling Chu Văn An 2025 event. There is no build toolchain—files are served directly from the filesystem or a simple static server. Use these notes to be productive quickly and avoid known pitfalls.

1) Big picture
- **Static site**: Plain HTML files, `style.css`, and `script.js` make up the UI. No bundler.
- **Primary interactive page(s)**: `phatdong/index_clean.html` (clean, trusted version) and other pages under `phatdong/`, `snight/`, `thapnanggieomo/` etc.
- **Dynamic data sources**: `ttin.txt` (prose or JSON) and `points.json` (array or object) provide runtime data consumed by `script.js` (house orbit, points, info panels).
- **Assets**: `photo/` contains images (WebP preferred). `convert_to_webp.py` exists to help produce WebP images.

2) Where to start when editing or fixing things
- For gallery edits, open `phatdong/index_clean.html`. The README documents a `data` array near the bottom that maps `image`, `title`, and `text` for slides.
- To change house info or points, modify `ttin.txt` (freeform prose or JSON array) or `points.json` (an array or `{ points: [...] }`). `script.js` will merge/override values at runtime.
- Prefer editing `index_clean.html` rather than `phatdong/index.html` because the latter may be corrupted by sync merges (see README troubleshooting).

3) Important runtime patterns (refer to `script.js`)
- Image preference: the code tries WebP first by rewriting filenames to `.webp` where possible (`setImageWithWebp`).
- Data loading: `script.js` fetches `ttin.txt` and `points.json` with `{ cache: 'no-store' }`. It accepts either JSON arrays or a custom prose format parsed by `parseHouseProseDetailed`.
- Points override logic: when `points.json` is present it overrides `points` fields by house `code`. `points.json` can be either `[{code:"a",points:123}, ...]` or `{ points: [...] }`.
- Ranking algorithm: ties are handled using competition ranking (1,1,3...). The render code computes `rank` and groups top houses before building the orbit.
- DOM reveal: IntersectionObserver is used for lazy building of interactive sections (e.g., houses). Many components intentionally wait for section reveal before heavy work.

4) Conventions and gotchas
- Encoding: All HTML use `<meta charset="utf-8">`. Filenames include Vietnamese diacritics—do not rename files unless you update all links.
- Use `phatdong/index_clean.html` for edits and preview; only replace `phatdong/index.html` after stopping sync/merge tools and ensuring the file contains a single valid HTML document.
- Keep assets under `photo/` and commit WebP versions. The code expects images like `photo/phatdong/anh1.webp` and also per-house images like `photo/a.webp`.

5) Local developer workflow
- Preview quickly by opening HTML files directly in a browser, or run a lightweight server from the repo root:
  - `python -m http.server 8000` and open `http://localhost:8000/phatdong/index_clean.html`.
- There are no tests or build steps. Formatting and linting are manual.

6) Editing examples to reference
- Add a new slide in the gallery: edit `phatdong/index_clean.html` -> find the `data = [...]` array and append `{ image: 'photo/phatdong/anh6.webp', title: '...', text: '...' }`.
- Add/update house points: edit `points.json` as `[{"code":"a","points":450}, ...]`. The code accepts lowercase/uppercase codes.
- Provide rich house prose: update `ttin.txt` with either JSON array or the prose blocks that begin with `NHÀ X:` — `script.js`'s `parseHouseProseDetailed` will extract `displayName`, `instrument`, `trait`, and longer `info` text.

7) Files and lines to check when debugging
- `README.md` — contains troubleshooting notes and references to `index_clean.html`.
- `script.js` — single source of runtime logic: data loading, image selection, ranking, DOM rendering. Search for `loadData`, `render`, and `parseHouseProseDetailed`.
- `phatdong/index_clean.html` — canonical gallery HTML and data array.

8) Deployment notes
- Presence of `CNAME` suggests GitHub Pages is likely used; ensure URLs remain relative (they are). When publishing, prefer the clean files (not the corrupted `index.html`).

9) What NOT to change without confirmation
- Do not rename images that include diacritics or change paths globally—links are case-sensitive on many hosts.
- Avoid editing `phatdong/index.html` until you confirm sync tools are disabled; use `index_clean.html` instead.

If anything here is unclear or you want me to include short code snippets (e.g. exact JSON examples for `points.json` or a minimal `ttin.txt` prose sample), tell me which section to expand and I will iterate.
