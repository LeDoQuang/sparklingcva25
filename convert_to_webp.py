#!/usr/bin/env python3
"""
Batch-convert images in ./photo to WebP with smart defaults.
- PNG => WebP lossless (keeps transparency), method=6
- JPEG/JPG/etc. => WebP lossy (quality configurable), method=6
- Skips files that already have a .webp sibling unless --force
- Optional: delete original after successful conversion with --delete-original

Usage (Windows PowerShell):
  # 1) Install Pillow once
  #   python -m pip install --upgrade pillow
  # 2) Run with defaults (dir=./photo, q=82)
  #   python convert_to_webp.py
  # 3) Custom quality (lossy only)
  #   python convert_to_webp.py --quality 80
  # 4) Force overwrite .webp
  #   python convert_to_webp.py --force
  # 5) Convert another folder
  #   python convert_to_webp.py --dir "c:/path/to/images"
  # 6) Remove originals after converting
  #   python convert_to_webp.py --delete-original
"""
from __future__ import annotations

import argparse
import os
from pathlib import Path
from typing import Iterable, Tuple

try:
    from PIL import Image
except ImportError as e:
    raise SystemExit("Pillow is required. Install with: python -m pip install pillow") from e

SUPPORTED_EXTS = {".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tif", ".tiff", ".webp"}


def is_image(p: Path) -> bool:
    return p.is_file() and p.suffix.lower() in SUPPORTED_EXTS


def human_size(n: int) -> str:
    units = ["B", "KB", "MB", "GB"]
    s = float(n)
    for u in units:
        if s < 1024.0:
            return f"{s:.1f} {u}"
        s /= 1024.0
    return f"{s:.1f} TB"


MAX_WEBP_DIMENSION = 16383  # WebP encoder max per-dimension size (safety cap)


def convert_one(src: Path, webp_path: Path, *, quality: int, force: bool, delete_original: bool) -> Tuple[bool, str]:
    # Skip if webp exists and not forcing
    if webp_path.exists() and not force:
        return False, f"skip: {src.name} -> {webp_path.name} (exists)"

    # Open image
    try:
        with Image.open(src) as im:
            # Convert mode for consistent saving; keep alpha if any
            if im.mode in ("P", "LA"):
                im = im.convert("RGBA")
            elif im.mode == "CMYK":
                im = im.convert("RGB")

            # Encode options
            ext = src.suffix.lower()
            save_kwargs = {"method": 6}  # 0..6, slower=better
            if ext == ".png":
                # Prefer lossless for graphics/logos
                save_kwargs.update({"lossless": True, "quality": 100})
            else:
                save_kwargs.update({"lossless": False, "quality": quality})

            # Ensure parent exists
            webp_path.parent.mkdir(parents=True, exist_ok=True)

            # If image exceeds WebP max dimension, downscale proportionally
            w, h = im.size
            max_dim = max(w, h)
            if max_dim > MAX_WEBP_DIMENSION:
                scale = MAX_WEBP_DIMENSION / float(max_dim)
                new_size = (max(1, int(w * scale)), max(1, int(h * scale)))
                try:
                    im = im.resize(new_size, resample=Image.Resampling.LANCZOS)
                except Exception:
                    im = im.resize(new_size)

            # Save WebP (first attempt)
            try:
                im.save(webp_path, format="WEBP", **save_kwargs)
            except Exception:
                # Fallback: try lossy save if lossless failed (common for huge or complex PNGs)
                try:
                    im.save(webp_path, format="WEBP", method=6, lossless=False, quality=min(quality, 85))
                except Exception as inner:
                    raise inner

            # Report stats
            before = src.stat().st_size
            after = webp_path.stat().st_size
            delta = after - before
            pct = (after / before - 1.0) * 100 if before else 0.0
            result = f"ok: {src.name} -> {webp_path.name}  ({human_size(before)} -> {human_size(after)}, {pct:+.1f}%)"

            # Optionally delete original only if conversion succeeded and new file is non-empty
            if delete_original and after > 0:
                try:
                    src.unlink()
                    result += "  [deleted original]"
                except Exception as de:
                    result += f"  [warn: cannot delete original: {de}]"

            return True, result
    except Exception as e:
        return False, f"error: {src.name}: {e}"


def main():
    parser = argparse.ArgumentParser(description="Convert images in a folder to WebP (with PNG lossless).")
    parser.add_argument("--dir", default=str(Path(__file__).parent / "photo"), help="Directory to scan (default: ./photo)")
    parser.add_argument("--quality", type=int, default=82, help="Quality for lossy formats (default: 82)")
    parser.add_argument("--force", action="store_true", help="Overwrite existing .webp files")
    parser.add_argument("--delete-original", action="store_true", help="Delete original files after successful conversion")
    parser.add_argument("--cleanup", action="store_true", help="Delete originals that already have a .webp sibling (no reconversion)")
    args = parser.parse_args()

    base = Path(args.dir)
    if not base.exists():
        raise SystemExit(f"Directory not found: {base}")

    images: Iterable[Path] = [p for p in base.rglob("*") if is_image(p)]

    converted = 0
    skipped = 0
    errors = 0

    print(f"Scanning: {base.resolve()}")
    for src in images:
        # Skip already-webp sources (unless you want to recompress, which we avoid)
        if src.suffix.lower() == ".webp":
            skipped += 1
            continue
        webp_path = src.with_suffix(".webp")
        ok, msg = convert_one(src, webp_path, quality=args.quality, force=args.force, delete_original=args.delete_original)
        print(msg)
        if ok:
            converted += 1
        else:
            if msg.startswith("skip:"):
                skipped += 1
            else:
                errors += 1

        print(f"\nSummary:")
        print(f"  Converted: {converted}")
        print(f"  Skipped:   {skipped}")
        print(f"  Errors:    {errors}")

        # Optional cleanup pass: remove originals that already have .webp sibling
        if args.cleanup:
            print("\nCleanup: deleting originals that already have .webp ...")
            removed = 0
            kept = 0
            failed = 0
            for src in images:
                if src.suffix.lower() == ".webp":
                    continue
                webp_path = src.with_suffix('.webp')
                if webp_path.exists() and webp_path.stat().st_size > 0:
                    try:
                        src.unlink()
                        print(f"deleted: {src}")
                        removed += 1
                    except Exception as de:
                        print(f"warn: cannot delete {src}: {de}")
                        failed += 1
                else:
                    kept += 1
            print(f"Cleanup summary: removed={removed}, kept={kept}, failed={failed}")


if __name__ == "__main__":
    main()
