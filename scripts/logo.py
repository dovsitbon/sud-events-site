# Redessine le logo SUD EVENTS en tracés SVG (aucune police nécessaire à l'affichage),
# d'après le logo imprimé visible dans leur reel du 03 (jupe de buffet) :
# cercle fin, « TRAITEUR & DÉCORATION » sur l'arc, monogramme « SE » calligraphique,
# « SUD EVENTS » en capitales fines, branche à baies dessinée au trait en bas à gauche.
#
#   pip install fonttools
#   python scripts/logo.py <dossier des polices>
#     PinyonScript-Regular.ttf, CormorantGaramond[wght].ttf, Jost[wght].ttf (Google Fonts, licence OFL)
#
# Écrit data/logo.json (tracés utilisés par components/Logo.tsx et l'ouverture),
# public/logo.svg, public/logo-light.svg et app/icon.svg.
import json
import math
import os
import re
import sys

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

FONTS = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CX, CY, R = 200, 200, 172


def load(name, wght=None):
    f = TTFont(os.path.join(FONTS, name))
    if wght is not None:
        f = instantiateVariableFont(f, {"wght": wght})
    return f


def glyph(font, ch):
    return font.getBestCmap()[ord(ch)]


def advance(font, ch):
    return font["hmtx"][glyph(font, ch)][0]


def draw(font, ch, matrix, pen):
    gs = font.getGlyphSet()
    gs[glyph(font, ch)].draw(TransformPen(pen, matrix))


def line(font, text, size, tracking, cx, baseline):
    """Texte horizontal centré sur cx ; tracking en fraction de la taille."""
    upm = font["head"].unitsPerEm
    s = size / upm
    widths = [advance(font, c) * s for c in text]
    total = sum(widths) + tracking * size * (len(text) - 1)
    x = cx - total / 2
    pen = SVGPathPen(font.getGlyphSet())
    for c, w in zip(text, widths):
        if c != " ":
            draw(font, c, (s, 0, 0, -s, x, baseline), pen)
        x += w + tracking * size
    return pen.getCommands()


def arc_text(font, text, size, tracking, radius):
    """Texte posé sur le haut du cercle, lu dans le sens horaire, centré à midi."""
    upm = font["head"].unitsPerEm
    s = size / upm
    widths = [advance(font, c) * s for c in text]
    total = sum(widths) + tracking * size * (len(text) - 1)
    a = -total / 2 / radius  # angle de départ (0 = midi)
    pen = SVGPathPen(font.getGlyphSet())
    for c, w in zip(text, widths):
        mid = a + w / 2 / radius
        if c != " ":
            px, py = CX + radius * math.sin(mid), CY - radius * math.cos(mid)
            cos, sin = math.cos(mid), math.sin(mid)
            # glyphe (unités de police, y vers le haut) → centré sur son milieu, retourné, tourné de `mid`
            ox = -w / 2
            m = (s * cos, s * sin, s * sin, -s * cos, px + ox * cos, py + ox * sin)
            draw(font, c, m, pen)
        a += (w + tracking * size) / radius
    return pen.getCommands()


def glyph_path(font, ch, size, x, baseline):
    s = size / font["head"].unitsPerEm
    pen = SVGPathPen(font.getGlyphSet())
    draw(font, ch, (s, 0, 0, -s, x, baseline), pen)
    return pen.getCommands()


def circle_arc(r, start, end):
    """Arc de cercle (angles en degrés, 0 = droite, sens horaire)."""
    a0, a1 = math.radians(start), math.radians(end)
    x0, y0 = CX + r * math.cos(a0), CY + r * math.sin(a0)
    x1, y1 = CX + r * math.cos(a1), CY + r * math.sin(a1)
    large = 1 if (end - start) % 360 > 180 else 0
    return f"M{x0:.2f} {y0:.2f}A{r} {r} 0 {large} 1 {x1:.2f} {y1:.2f}"


pinyon = load("PinyonScript-Regular.ttf")
cormorant = load("CormorantGaramond[wght].ttf", 600)
jost = load("Jost[wght].ttf", 300)

data = {
    "viewBox": "0 0 400 408",
    # le cercle s'interrompt là où passe la branche (entre 6 h et 8 h)
    "circle": circle_arc(R, 152, 98 + 360),
    "arc": arc_text(cormorant, "TRAITEUR & DÉCORATION", 18.5, 0.4, R - 31),
    "s": glyph_path(pinyon, "S", 148, 120, 232),
    "e": glyph_path(pinyon, "E", 132, 186, 242),
    "name": line(jost, "SUD EVENTS", 25, 0.16, CX, 292),
    # branche dessinée au trait le long du bas du cercle : tige, rameaux et feuilles (stroke), baies (fill)
    "branch": (
        "M222 386C178 384 134 366 96 334C86 325 78 315 71 304"
        "M176 381C171 389 165 395 157 399"
        "M132 364C124 371 115 376 104 378"
        "M98 337C90 340 80 341 70 339"
        "M78 316C72 310 69 302 69 293"
    ),
    "leaves": (
        "M208 385C207 364 214 348 232 336C233 357 225 373 208 385Z"
        "M154 376C149 363 150 352 158 342C163 354 162 366 154 376Z"
        "M116 355C103 352 95 344 91 333C103 335 112 343 116 355Z"
    ),
    "berries": [
        [156, 400, 3.2], [150, 395, 2.5], [161, 393, 2.3],
        [102, 379, 3], [97, 373, 2.4], [107, 385, 2.2],
        [68, 339, 3], [63, 333, 2.4], [66, 346, 2.2],
        [69, 290, 3], [63, 294, 2.4], [74, 286, 2.2],
    ],
}

def tidy(d):
    return re.sub(r"-?\d+\.\d+", lambda m: f"{float(m.group()):.1f}".rstrip("0").rstrip("."), d)


for k, v in data.items():
    if isinstance(v, str) and k != "viewBox":
        data[k] = tidy(v)

with open(os.path.join(ROOT, "data/logo.json"), "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False)


def svg(color, bg=None, monogram_only=False, size=400):
    berries = "".join(f'<circle cx="{x}" cy="{y}" r="{r}"/>' for x, y, r in data["berries"])
    rect = f'<rect width="400" height="400" fill="{bg}"/>' if bg else ""
    if monogram_only:
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="{size}" height="{size}">{rect}'
            f'<circle cx="200" cy="200" r="182" fill="none" stroke="{color}" stroke-width="6"/>'
            f'<g fill="{color}" transform="translate(204 206) scale(1.5) translate(-200 -190)"><path d="{data["s"]}"/><path d="{data["e"]}"/></g></svg>'
        )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 408" width="{size}" height="{round(size * 1.02)}" role="img" aria-label="Sud Events, traiteur et décoration">{rect}'
        f'<path d="{data["circle"]}" fill="none" stroke="{color}" stroke-width="1.8" stroke-linecap="round"/>'
        f'<g fill="{color}"><path d="{data["arc"]}"/><path d="{data["s"]}"/><path d="{data["e"]}"/><path d="{data["name"]}"/>'
        f'{berries}</g>'
        f'<path d="{data["branch"]}{data["leaves"]}" fill="none" stroke="{color}" stroke-width="1.6" stroke-linecap="round"/></svg>'
    )


with open(os.path.join(ROOT, "public/logo.svg"), "w", encoding="utf-8") as f:
    f.write(svg("#1E1A17"))
with open(os.path.join(ROOT, "public/logo-light.svg"), "w", encoding="utf-8") as f:
    f.write(svg("#F7F1E8"))
with open(os.path.join(ROOT, "app/icon.svg"), "w", encoding="utf-8") as f:
    f.write(svg("#1E1A17", bg="#E9D9C1", monogram_only=True, size=64))
print("logo prêt")
