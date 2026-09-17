#!/usr/bin/env python3
"""cvd-check.py — check that two accent colors stay distinguishable under color vision deficiency.

    python3 cvd-check.py "#1f5bb5" "#c86a28" --bg "#fbfaf7"                         # light mode pair
    python3 cvd-check.py "#1f5bb5" "#c86a28" --bg "#fbfaf7" --dark "#7fa8ec" "#f0a068" --dark-bg "#15171b"

Prints CIELAB ΔE between the two colors as seen with normal vision and simulated protanopia,
deuteranopia and tritanopia (Machado et al. 2009 matrices), plus WCAG contrast of each color on both
backgrounds. With --dark A B, the dark-mode variants are checked on --dark-bg instead (decks usually
lighten the accents in dark mode). Exit code 1 if any simulated ΔE < 40 or any contrast < 3.0
(the WCAG threshold for large text and graphics).
"""
import argparse, math, sys
def hex2rgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
def lin(c):
    c /= 255; return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
def unlin(v):
    v = max(0, min(1, v)); return 255 * (12.92 * v if v <= 0.0031308 else 1.055 * v ** (1 / 2.4) - 0.055)
def lab(rgb):
    r, g, b = [lin(x) for x in rgb]
    X = 0.4124 * r + 0.3576 * g + 0.1805 * b; Y = 0.2126 * r + 0.7152 * g + 0.0722 * b; Z = 0.0193 * r + 0.1192 * g + 0.9505 * b
    f = lambda t: t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116
    fx, fy, fz = f(X / 0.95047), f(Y), f(Z / 1.08883)
    return (116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz))
def dE(a, b): return math.sqrt(sum((x - y) ** 2 for x, y in zip(lab(a), lab(b))))
M = {'protan': [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
     'deutan': [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
     'tritan': [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]]}
def sim(rgb, kind):
    l = [lin(x) for x in rgb]; m = M[kind]
    return tuple(unlin(sum(m[i][j] * l[j] for j in range(3))) for i in range(3))
def lum(rgb):
    r, g, b = [lin(x) for x in rgb]; return 0.2126 * r + 0.7152 * g + 0.0722 * b
def contrast(a, b):
    la, lb = lum(a), lum(b); hi, lo = max(la, lb), min(la, lb); return (hi + 0.05) / (lo + 0.05)
p = argparse.ArgumentParser(); p.add_argument('a'); p.add_argument('b')
p.add_argument('--bg', default='#ffffff'); p.add_argument('--dark-bg', default='#15171b')
p.add_argument('--dark', nargs=2, metavar=('A_DARK', 'B_DARK'), help='dark-mode variants of A and B')
p.add_argument('--min-de', type=float, default=40); p.add_argument('--min-contrast', type=float, default=3.0)
o = p.parse_args(); A, B = hex2rgb(o.a), hex2rgb(o.b); bg, dbg = hex2rgb(o.bg), hex2rgb(o.dark_bg)
AD, BD = (hex2rgb(o.dark[0]), hex2rgb(o.dark[1])) if o.dark else (A, B)
ok = True
for label, (X, Y) in (('light pair', (A, B)), ('dark pair', (AD, BD))):
    if label == 'dark pair' and not o.dark: continue
    print(f"[{label}] ΔE normal {dE(X, Y):6.1f}")
    for k in ('protan', 'deutan', 'tritan'):
        d = dE(sim(X, k), sim(Y, k)); flag = '' if d >= o.min_de else '  <-- too close'; ok &= d >= o.min_de
        print(f"[{label}] ΔE {k:7s}{d:6.1f}{flag}")
for name, c, back, bname in (('A', A, bg, o.bg), ('B', B, bg, o.bg), ('A dark', AD, dbg, o.dark_bg), ('B dark', BD, dbg, o.dark_bg)):
    if 'dark' in name and not o.dark: continue
    c1 = contrast(c, back); ok &= c1 >= o.min_contrast
    print(f"contrast {name:7s} on {bname}: {c1:4.1f}" + ('' if c1 >= o.min_contrast else '  <-- low'))
print('OK' if ok else 'FAIL'); sys.exit(0 if ok else 1)
