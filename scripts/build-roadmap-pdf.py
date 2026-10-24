#!/usr/bin/env python3
"""Render docs/ROADMAP.md into a printable, house-styled PDF."""

import re
import sys

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    ListFlowable,
    ListItem,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

PLUM = colors.HexColor("#170429")
PLUM_SOFT = colors.HexColor("#3d2255")
GOLD = colors.HexColor("#d4af37")
GOLD_SOFT = colors.HexColor("#b8972f")
IVORY = colors.HexColor("#f7f3ea")
GREY = colors.HexColor("#6b6472")

PAGE_W, PAGE_H = A4
MARGIN = 20 * mm

# ----------------------------------------------------------------- styles
body = ParagraphStyle(
    "body", fontName="Helvetica", fontSize=10.3, leading=16.2,
    textColor=PLUM_SOFT, alignment=TA_LEFT, spaceAfter=3,
)
bullet = ParagraphStyle("bullet", parent=body, fontSize=10.1, leading=15.4, spaceAfter=2.4)
h1 = ParagraphStyle(
    "h1", fontName="Times-Bold", fontSize=22, leading=26,
    textColor=PLUM, spaceBefore=2, spaceAfter=2,
)
h2 = ParagraphStyle(
    "h2", fontName="Times-Bold", fontSize=15.5, leading=19,
    textColor=PLUM, spaceBefore=13, spaceAfter=5,
)
h3 = ParagraphStyle(
    "h3", fontName="Helvetica-Bold", fontSize=8.8, leading=12,
    textColor=GOLD_SOFT, spaceBefore=8, spaceAfter=3,
)
quote = ParagraphStyle(
    "quote", parent=body, fontName="Times-Italic", fontSize=10.5, leading=15,
    textColor=PLUM_SOFT, leftIndent=6, spaceBefore=2, spaceAfter=6,
)
cover_title = ParagraphStyle(
    "cover_title", fontName="Times-Bold", fontSize=34, leading=38,
    textColor=IVORY, alignment=TA_LEFT,
)
cover_sub = ParagraphStyle(
    "cover_sub", fontName="Times-Italic", fontSize=13, leading=19,
    textColor=colors.HexColor("#cbb9dd"), alignment=TA_LEFT,
)
cover_small = ParagraphStyle(
    "cover_small", fontName="Helvetica", fontSize=7.6, leading=12,
    textColor=colors.HexColor("#9c86b3"),
)


def inline(text):
    """Markdown-lite -> reportlab inline markup."""
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.+?)\*\*", r'<font name="Helvetica-Bold">\1</font>', text)
    text = re.sub(r"`(.+?)`", r'<font name="Courier" size="8.4" color="#3d2255">\1</font>', text)
    text = re.sub(r"(?<!\*)\*([^*]+?)\*(?!\*)", r'<i>\1</i>', text)
    return text


TAG = re.compile(r"`(Me|You|Both)`\s*`([SML])`\s*")


def task_para(text):
    """Render '- [ ] `Me` `M` Do the thing' with a coloured tag prefix."""
    raw = text.strip()
    tag_html = ""
    m = TAG.search(raw)
    if m:
        who, size = m.group(1), m.group(2)
        colour = {"Me": "#8a6a1e", "You": "#5b2a86", "Both": "#2f6b5a"}[who]
        tag_html = (
            f'<font name="Helvetica-Bold" size="7.2" color="{colour}">'
            f"{who.upper()} &middot; {size}</font>&nbsp;&nbsp;"
        )
        raw = raw[: m.start()] + raw[m.end():]
    return Paragraph(tag_html + inline(raw), bullet)


# ----------------------------------------------------------------- content
def parse(md):
    """Turn the markdown into a flat list of flowable-ish blocks."""
    lines = md.splitlines()
    out = []
    i = 0
    para_buf = []

    def flush():
        nonlocal para_buf
        if para_buf:
            out.append(("p", " ".join(para_buf).strip()))
            para_buf = []

    while i < len(lines):
        line = lines[i].rstrip()
        stripped = line.strip()

        if not stripped:
            flush()
            i += 1
            continue

        if stripped == "---":
            flush()
            out.append(("hr", None))
            i += 1
            continue

        m = re.match(r"^(#{1,3})\s+(.*)$", stripped)
        if m:
            flush()
            out.append((f"h{len(m.group(1))}", m.group(2)))
            i += 1
            continue

        if re.match(r"^[-*]\s+", stripped):
            flush()
            items = []
            while i < len(lines):
                s = lines[i].strip()
                mm_ = re.match(r"^[-*]\s+(\[.\]\s*)?(.*)$", s)
                if not mm_:
                    break
                items.append(mm_.group(2))
                i += 1
            out.append(("ul", items))
            continue

        if re.match(r"^\d+\.\s+", stripped):
            flush()
            items = []
            while i < len(lines):
                s = lines[i].strip()
                mm_ = re.match(r"^\d+\.\s+(.*)$", s)
                if not mm_:
                    break
                items.append(mm_.group(1))
                i += 1
            out.append(("ol", items))
            continue

        if stripped.startswith("|"):
            flush()
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")])
                i += 1
            rows = [r for r in rows if not all(set(c) <= set("-: ") for c in r)]
            out.append(("table", rows))
            continue

        para_buf.append(stripped)
        i += 1

    flush()
    return out


def build_story(blocks):
    story = []
    for kind, value in blocks:
        if kind == "h1":
            story.append(Paragraph(inline(value), h1))
            story.append(Spacer(1, 2))
            story.append(HRFlowable(width="100%", thickness=2, color=GOLD, spaceBefore=3, spaceAfter=9))
        elif kind == "h2":
            story.append(Paragraph(inline(value), h2))
            story.append(HRFlowable(width=26 * mm, thickness=0.9, color=GOLD, spaceBefore=-1, spaceAfter=6))
        elif kind == "h3":
            story.append(Paragraph(inline(value).upper(), h3))
        elif kind == "p":
            story.append(Paragraph(inline(value), body))
        elif kind == "quote":
            story.append(Paragraph(inline(value), quote))
        elif kind == "hr":
            story.append(Spacer(1, 4))
            story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#ddd4c6"), spaceAfter=4))
        elif kind == "ul":
            story.append(ListFlowable(
                [ListItem(task_para(it), leftIndent=10, value="circle") for it in value],
                bulletType="bullet", start="circle", leftIndent=10,
                bulletFontSize=4.5, bulletColor=GOLD, spaceAfter=6,
            ))
        elif kind == "ol":
            story.append(ListFlowable(
                [ListItem(Paragraph(inline(it), bullet), leftIndent=10) for it in value],
                bulletType="1", leftIndent=10, bulletFontName="Helvetica-Bold",
                bulletFontSize=9, bulletColor=GOLD_SOFT, spaceAfter=6,
            ))
        elif kind == "table":
            data = [[Paragraph(inline(c), ParagraphStyle(
                "th", fontName="Helvetica-Bold", fontSize=7.6, leading=10, textColor=PLUM)) for c in value[0]]]
            for row in value[1:]:
                data.append([Paragraph(inline(c), ParagraphStyle(
                    "td", fontName="Helvetica", fontSize=7.6, leading=10.5, textColor=PLUM_SOFT)) for c in row])
            t = Table(data, hAlign="LEFT", colWidths=[(PAGE_W - 2 * MARGIN) / len(value[0])] * len(value[0]))
            t.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#efe7f5")),
                ("LINEBELOW", (0, 0), (-1, 0), 0.8, GOLD),
                ("LINEBELOW", (0, 1), (-1, -1), 0.3, colors.HexColor("#e2d9e8")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
            ]))
            story.append(t)
            story.append(Spacer(1, 7))
    return story


# ----------------------------------------------------------------- pages
def cover(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PLUM)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    # halo mark
    cx, cy = PAGE_W - 34 * mm, PAGE_H - 42 * mm
    canvas.setStrokeColor(GOLD)
    for r, w in ((15 * mm, 0.7), (9 * mm, 0.7)):
        canvas.setLineWidth(w)
        canvas.circle(cx, cy, r, stroke=1, fill=0)
    canvas.setFillColor(GOLD)
    canvas.circle(cx, cy, 2.4 * mm, stroke=0, fill=1)

    canvas.setFillColor(GOLD)
    canvas.rect(MARGIN, PAGE_H - 52 * mm, 16 * mm, 1.1 * mm, stroke=0, fill=1)

    canvas.setFillColor(colors.HexColor("#9c86b3"))
    canvas.setFont("Helvetica", 7.4)
    canvas.drawString(MARGIN, PAGE_H - 46 * mm, "A N N A ' S   B E A U T I S T R Y")

    canvas.setFillColor(IVORY)
    canvas.setFont("Times-Bold", 33)
    canvas.drawString(MARGIN, PAGE_H - 78 * mm, "The Roadmap")
    canvas.setFont("Times-Italic", 14)
    canvas.setFillColor(colors.HexColor("#cbb9dd"))
    canvas.drawString(MARGIN + 1, PAGE_H - 90 * mm, "Everything between a beautiful site")
    canvas.drawString(MARGIN + 1, PAGE_H - 98 * mm, "and a business that gets booked.")

    canvas.setStrokeColor(colors.HexColor("#4a2a63"))
    canvas.setLineWidth(0.6)
    canvas.line(MARGIN, 62 * mm, PAGE_W - MARGIN, 62 * mm)

    canvas.setFillColor(colors.HexColor("#b9a4cc"))
    canvas.setFont("Helvetica", 8.4)
    canvas.drawString(MARGIN, 52 * mm, "Who  \u00b7  Me = I do it   You = needs your login or decision   Both = I walk you through it")
    canvas.drawString(MARGIN, 45 * mm, "Size  \u00b7  S = under an hour    M = a few hours    L = a day or more")
    canvas.setFillColor(colors.HexColor("#8a76a0"))
    canvas.setFont("Helvetica", 7.4)
    canvas.drawString(MARGIN, 26 * mm, "Cape Coast, Ghana  \u00b7  prepared 22 October 2026")
    canvas.drawRightString(PAGE_W - MARGIN, 26 * mm, "1")
    canvas.restoreState()


def later(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(IVORY)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setStrokeColor(colors.HexColor("#e0d6c6"))
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, PAGE_H - 15 * mm, PAGE_W - MARGIN, PAGE_H - 15 * mm)
    canvas.setFillColor(colors.HexColor("#9a8f86"))
    canvas.setFont("Helvetica", 6.8)
    canvas.drawString(MARGIN, PAGE_H - 12.4 * mm, "ANNA'S BEAUTISTRY  \u00b7  THE ROADMAP")
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 12.4 * mm, "v1  \u00b7  22 OCTOBER 2026")
    canvas.line(MARGIN, 14 * mm, PAGE_W - MARGIN, 14 * mm)
    canvas.drawString(MARGIN, 9.6 * mm, "Cape Coast, Ghana")
    canvas.drawRightString(PAGE_W - MARGIN, 9.6 * mm, str(doc.page))
    canvas.restoreState()


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "docs/ROADMAP.md"
    out = sys.argv[2] if len(sys.argv) > 2 else "annas-beautistry-roadmap.pdf"

    with open(src, encoding="utf-8") as fh:
        md = fh.read()

    blocks = parse(md)
    # Drop the leading H1 + intro; the cover carries them.
    while blocks and blocks[0][0] in ("h1", "p", "hr"):
        kind = blocks[0][0]
        blocks.pop(0)
        if kind == "hr":
            break

    doc = BaseDocTemplate(
        out, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=24 * mm, bottomMargin=20 * mm,
        title="Anna's Beautistry — The Roadmap",
        author="Anna's Beautistry",
        subject="Website, booking and SEO roadmap",
    )

    frame = Frame(MARGIN, 20 * mm, PAGE_W - 2 * MARGIN, PAGE_H - 46 * mm, id="body",
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)

    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[frame], onPage=cover),
        PageTemplate(id="body", frames=[frame], onPage=later),
    ])

    story = [NextPageTemplate("body"), PageBreak()]
    story += build_story(blocks)
    doc.build(story)
    print(f"built {out}")


if __name__ == "__main__":
    main()
