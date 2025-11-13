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
