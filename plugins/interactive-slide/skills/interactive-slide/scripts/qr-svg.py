#!/usr/bin/env python3
"""qr-svg.py — print a QR code as an inline <svg> (no runtime library, scannable on any background).

    pip install segno
    python3 qr-svg.py https://example.org/talk/ > qr.svg
    python3 qr-svg.py https://example.org/talk/ --scale 6 --border 2

Paste the output inside <span class="qr"> ... </span> (title slide) or <div class="qr-corner"> (every slide).
Generate it only after the final URL is known; a QR of a draft URL is worse than none.
"""
import argparse, sys
try:
    import segno
except ImportError:
    sys.exit("segno is not installed. Run: pip install segno")
p = argparse.ArgumentParser()
p.add_argument("url")
p.add_argument("--scale", type=int, default=4)
p.add_argument("--border", type=int, default=2)
p.add_argument("--error", default="m", help="error correction level: l, m, q, h")
a = p.parse_args()
qr = segno.make(a.url, error=a.error)
# Black modules on a white square: keep it high-contrast; do not tint the QR with accent colors.
svg = qr.svg_inline(scale=a.scale, border=a.border, dark="#000", light="#fff", omitsize=False)
print(svg.replace("<svg ", '<svg role="img" aria-label="QR code: %s" ' % a.url, 1))
