#!/usr/bin/env python3
"""Build and consistency tool for the Hodge Project.

    python make.py check    check labels, references and tags
    python make.py tags     give a permanent tag to every label that has none
    python make.py status   show the status of every chapter
    python make.py pdf      build output/pdf/book.pdf
    python make.py html     build the website in output/html
    python make.py all      tags, check, pdf and html
    python make.py serve    serve the website at http://localhost:8000
"""

import argparse
import html
import os
import re
import shutil
import subprocess
import sys
import unicodedata
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BOOK = ROOT / "book.tex"
CHAPTER_DIR = ROOT / "chapters"
BIBLIOGRAPHY = ROOT / "hodge-project.bib"
TAGS_FILE = ROOT / "tags" / "tags"
OUTPUT = ROOT / "output"
PDF_DIR = OUTPUT / "pdf"
HTML_DIR = OUTPUT / "html"
GENERATED_MARKER = ".generated-by-make"

# MathJax 2.7.9 with HTML-CSS output renders formulas as real text, so they
# can be selected; MathJax 3 does not.
MATHJAX_URL = ("https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/"
               "MathJax.js?config=TeX-AMS-MML_HTMLorMML")

# Numbered environments (see preamble.tex). The label of each one must be
# <chapter>:<environment>-<name>.
THEOREM_ENVS = {"theorem", "proposition", "lemma", "corollary", "conjecture",
                "definition", "example", "counterexample", "exercise",
                "notation", "remark"}
EQUATION_ENVS = {"equation", "align", "gather", "multline", "alignat", "flalign"}
PROOF_ENVS = {"proof", "solution"}
SECTIONING = {"section", "subsection", "subsubsection"}

STATUSES = {
    "planned": "Only an outline of this chapter exists.",
    "draft": "This chapter is being written; its proofs have not been checked.",
    "complete": "This chapter is written; its proofs await independent checking.",
    "checked": "Every proof in this chapter has been checked.",
}

# Chapters that may refer forward (see the introduction).
FORWARD_REFERENCE_CHAPTERS = {"introduction"}

NAME = r"[a-z0-9]+(?:-[a-z0-9]+)*"
TAG_RE = re.compile(r"[0-9A-Z]{4}")
TAG_DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

TOKEN_RE = re.compile(
    r"\\(?P<beginend>begin|end)\{(?P<env>[^}]+)\}"
    r"|\\label\{(?P<label>[^}]+)\}"
    r"|\\(?:ref|eqref|pageref|autoref)\{(?P<ref>[^}]+)\}"
    r"|\\cite\*?(?:\[[^\]]*\])?\{(?P<cite>[^}]+)\}"
    r"|\\(?P<sectioning>part|chapter|section|subsection|subsubsection)\*?(?=[\[{])"
    r"|\\chapterstatus\{(?P<status>[^}]*)\}"
)


@dataclass
class Chapter:
    slug: str
    number: int
    part: str
    title: str = ""
    status: str = ""


@dataclass
class Label:
    name: str
    chapter: str
    where: str
    position: int


@dataclass
class Reference:
    target: str
    chapter: str
    where: str
    position: int
    context: str  # "proof", "prerequisites" or "text"


@dataclass
class Project:
    chapters: list = field(default_factory=list)
    labels: dict = field(default_factory=dict)
    references: list = field(default_factory=list)
    citations: list = field(default_factory=list)  # (key, where)
    errors: list = field(default_factory=list)
    warnings: list = field(default_factory=list)
    position: int = 0

    def next_position(self):
        self.position += 1
        return self.position


def strip_comment(line):
    return re.sub(r"(?<!\\)%.*", "", line)


def latex_to_text(s):
    """Rough plain-text rendering of a title, for terminal output only."""
    accents = {'"': "\u0308", "'": "\u0301", "`": "\u0300", "v": "\u030c", "^": "\u0302"}
    s = re.sub(r"\\([\"'`^])\{?([A-Za-z])\}?", lambda m: m.group(2) + accents[m.group(1)], s)
    s = re.sub(r"\\v\{([A-Za-z])\}", lambda m: m.group(1) + accents["v"], s)
    s = s.replace("--", "\u2013").replace("$", "")
    return unicodedata.normalize("NFC", s)


# ---------------------------------------------------------------------------
# Scanning the sources
# ---------------------------------------------------------------------------

def scan_project():
    project = Project()
    part = ""
    for lineno, raw in enumerate(BOOK.read_text(encoding="utf-8").splitlines(), 1):
        line = strip_comment(raw)
        where = f"book.tex:{lineno}"
        m = re.search(r"\\part\{([^}]*)\}", line)
        if m:
            part = m.group(1)
        for m in re.finditer(r"\\label\{([^}]+)\}", line):
            name = m.group(1)
            if not re.fullmatch(f"part-{NAME}", name):
                project.errors.append(f"{where}: part label '{name}' must have the form part-<name>")
            add_label(project, Label(name, "book", where, project.next_position()))
        for m in re.finditer(r"\\include\{chapters/([^}]+)\}", line):
            chapter = Chapter(m.group(1), len(project.chapters) + 1, part)
            project.chapters.append(chapter)
            scan_chapter(project, chapter)
    check_references(project)
    return project


def add_label(project, label):
    if label.name in project.labels:
        other = project.labels[label.name]
        project.errors.append(f"{label.where}: label '{label.name}' already defined at {other.where}")
        return
    project.labels[label.name] = label


def scan_chapter(project, chapter):
    path = CHAPTER_DIR / f"{chapter.slug}.tex"
    rel = f"chapters/{chapter.slug}.tex"
    if not path.exists():
        project.errors.append(f"book.tex includes {rel}, which does not exist")
        return
    if not re.fullmatch(NAME, chapter.slug):
        project.errors.append(f"{rel}: file name must be lower case words separated by hyphens")

    stack = []  # entries [environment, line, labelled]
    in_section = False
    has_chapter_label = False

    for lineno, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        line = strip_comment(raw)
        where = f"{rel}:{lineno}"
        sectioning = None
        for m in TOKEN_RE.finditer(line):
            if m.group("beginend") == "begin":
                env = m.group("env")
                if env in THEOREM_ENVS and not in_section:
                    project.warnings.append(f"{where}: {env} outside of any section")
                stack.append([env, lineno, False])
            elif m.group("beginend") == "end":
                env = m.group("env")
                if not stack or stack[-1][0] != env:
                    project.errors.append(f"{where}: \\end{{{env}}} does not match the open environment")
                    while stack and stack[-1][0] != env:
                        stack.pop()
                    if not stack:
                        continue
                opened, start, labelled = stack.pop()
                if opened in THEOREM_ENVS and not labelled:
                    project.warnings.append(f"{rel}:{start}: {opened} has no label")
            elif m.group("sectioning"):
                sectioning = m.group("sectioning")
                if sectioning == "part":
                    project.errors.append(f"{where}: \\part belongs in book.tex, not in a chapter")
                elif sectioning == "chapter":
                    t = re.search(r"\\chapter\*?\{(.*?)\}\\label", line) or re.search(r"\\chapter\*?\{(.*)\}", line)
                    chapter.title = latex_to_text(t.group(1)) if t else chapter.slug
                else:
                    in_section = True
            elif m.group("label"):
                name = m.group("label")
                check_label(project, chapter, name, where, stack, sectioning)
                if name == chapter.slug:
                    has_chapter_label = True
                add_label(project, Label(name, chapter.slug, where, project.next_position()))
            elif m.group("ref"):
                if any(entry[0] in PROOF_ENVS for entry in stack):
                    context = "proof"
                elif "Prerequisites" in line:
                    context = "prerequisites"
                else:
                    context = "text"
                for target in m.group("ref").split(","):
                    project.references.append(Reference(
                        target.strip(), chapter.slug, where, project.next_position(), context))
            elif m.group("cite"):
                for key in m.group("cite").split(","):
                    project.citations.append((key.strip(), where))
            elif m.group("status") is not None:
                status = m.group("status").strip()
                if status not in STATUSES:
                    project.errors.append(f"{where}: unknown status '{status}' (use {', '.join(STATUSES)})")
                chapter.status = status

    for env, start, _ in stack:
        project.errors.append(f"{rel}:{start}: \\begin{{{env}}} is never closed")
    if not has_chapter_label:
        project.errors.append(f"{rel}: the chapter must be labelled \\label{{{chapter.slug}}}")
    if not chapter.status:
        project.errors.append(f"{rel}: missing \\chapterstatus{{...}}")


def check_label(project, chapter, name, where, stack, sectioning):
    innermost = stack[-1] if stack else None
    if innermost and (innermost[0] in THEOREM_ENVS or innermost[0] in EQUATION_ENVS):
        kind = "equation" if innermost[0] in EQUATION_ENVS else innermost[0]
        innermost[2] = True
    elif sectioning == "chapter":
        if name != chapter.slug:
            project.errors.append(f"{where}: the chapter label must be '{chapter.slug}', not '{name}'")
        return
    elif sectioning in SECTIONING:
        kind = sectioning
    else:
        project.errors.append(
            f"{where}: label '{name}' is not attached to a numbered environment, an equation or a sectioning command")
        return
    if not re.fullmatch(f"{re.escape(chapter.slug)}:{kind}-{NAME}", name):
        project.errors.append(f"{where}: label '{name}' should have the form {chapter.slug}:{kind}-<name>")


def bibliography_keys():
    if not BIBLIOGRAPHY.exists():
        return set()
    text = BIBLIOGRAPHY.read_text(encoding="utf-8")
    return set(re.findall(r"@\w+\s*\{\s*([^,\s]+)\s*,", text))


def check_references(project):
    keys = bibliography_keys()
    for key, where in project.citations:
        if key not in keys:
            project.errors.append(f"{where}: citation '{key}' is not in {BIBLIOGRAPHY.name}")
    for ref in project.references:
        label = project.labels.get(ref.target)
        if label is None:
            project.errors.append(f"{ref.where}: reference to undefined label '{ref.target}'")
            continue
        if label.position < ref.position or ref.chapter in FORWARD_REFERENCE_CHAPTERS:
            continue
        if ref.context == "proof":
            project.errors.append(f"{ref.where}: forward reference to '{ref.target}' inside a proof")
        elif ref.context == "prerequisites":
            project.errors.append(f"{ref.where}: prerequisite '{ref.target}' comes later in book.tex")
        elif ":" in ref.target and label.chapter != ref.chapter:
            # Outside proofs, forward references within a chapter and to whole
            # chapters or parts are fine; forward references to results of
            # later chapters are discouraged.
            project.warnings.append(f"{ref.where}: forward reference to '{ref.target}'")


# ---------------------------------------------------------------------------
# Tags
# ---------------------------------------------------------------------------

def read_tags(project=None):
    """Return the list of (tag, label) pairs in tags/tags."""
    pairs = []
    if not TAGS_FILE.exists():
        return pairs
    for lineno, raw in enumerate(TAGS_FILE.read_text(encoding="utf-8").splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        tag, sep, label = line.partition(",")
        if not sep or not TAG_RE.fullmatch(tag):
            if project:
                project.errors.append(f"tags/tags:{lineno}: malformed line '{line}'")
            continue
        pairs.append((tag, label))
    return pairs


def check_tags(project):
    pairs = read_tags(project)
    seen_tags, seen_labels = {}, {}
    for tag, label in pairs:
        if tag in seen_tags:
            project.errors.append(f"tags/tags: tag {tag} is used twice")
        if label in seen_labels:
            project.errors.append(f"tags/tags: label '{label}' has two tags ({seen_labels[label]} and {tag})")
        seen_tags[tag] = label
        seen_labels[label] = tag
    for label in project.labels:
        if label not in seen_labels:
            project.warnings.append(f"label '{label}' has no tag yet (run: python make.py tags)")
    for tag, label in pairs:
        if label not in project.labels:
            project.warnings.append(
                f"tag {tag} points to '{label}', which no longer exists "
                "(if the label was renamed, edit tags/tags; never reuse or delete a tag)")


def tag_to_int(tag):
    return int(tag, 36)


def int_to_tag(n):
    digits = ""
    while n:
        n, r = divmod(n, 36)
        digits = TAG_DIGITS[r] + digits
    return digits.rjust(4, "0")


def assign_tags(project):
    pairs = read_tags()
    tagged = {label for _, label in pairs}
    next_number = max((tag_to_int(tag) for tag, _ in pairs), default=0) + 1
    new_lines = []
    for label in sorted(project.labels.values(), key=lambda l: l.position):
        if label.name in tagged:
            continue
        new_lines.append(f"{int_to_tag(next_number)},{label.name}")
        next_number += 1
    if new_lines:
        TAGS_FILE.parent.mkdir(exist_ok=True)
        header = "" if TAGS_FILE.exists() else (
            "# Permanent tags: one line TAG,label per item.\n"
            "# Never delete or reuse a tag. If a label is renamed, edit its line here.\n")
        with TAGS_FILE.open("a", encoding="utf-8", newline="\n") as f:
            f.write(header + "".join(line + "\n" for line in new_lines))
    print(f"tags: {len(new_lines)} new tag(s), {len(pairs) + len(new_lines)} in total")


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def report(project):
    for w in project.warnings:
        print(f"warning: {w}")
    for e in project.errors:
        print(f"error: {e}")
    print(f"check: {len(project.chapters)} chapters, {len(project.labels)} labels, "
          f"{len(project.references)} references, "
          f"{len(project.errors)} error(s), {len(project.warnings)} warning(s)")
    return not project.errors


def command_check(args):
    project = scan_project()
    check_tags(project)
    return report(project)


def command_tags(args):
    project = scan_project()
    if project.errors:
        report(project)
        print("tags: fix the errors above before assigning tags")
        return False
    assign_tags(project)
    return True


def command_status(args):
    project = scan_project()
    part = None
    counts = {s: 0 for s in STATUSES}
    for chapter in project.chapters:
        if chapter.part != part:
            part = chapter.part
            print(f"\n{part or '(no part)'}")
        counts[chapter.status] = counts.get(chapter.status, 0) + 1
        print(f"  {chapter.number:3d}  {chapter.status:9s} {chapter.title}")
    print("\n" + ", ".join(f"{n} {s}" for s, n in counts.items()))
    return True


def prepare(args):
    """Assign tags and check the project before a build."""
    project = scan_project()
    if not project.errors:
        assign_tags(project)
    check_tags(project)
    ok = report(project)
    if not ok and not args.force:
        print("build stopped because of errors (use --force to build anyway)")
    return project, ok or args.force


def run_logged(cmd, log_path, env=None):
    log_path.parent.mkdir(parents=True, exist_ok=True)
    with log_path.open("w", encoding="utf-8", errors="replace") as log:
        result = subprocess.run(cmd, cwd=ROOT, stdout=log, stderr=subprocess.STDOUT, env=env)
    return result.returncode


def command_pdf(args, project=None):
    if project is None:
        project, ok = prepare(args)
        if not ok:
            return False
    latexmk = shutil.which("latexmk")
    if not latexmk:
        print("pdf: latexmk not found")
        return False
    (PDF_DIR / "chapters").mkdir(parents=True, exist_ok=True)
    cmd = [latexmk, "-pdf", "-interaction=nonstopmode", "-halt-on-error",
           "-file-line-error", "-outdir=output/pdf", "book.tex"]
    # latexmk runs BibTeX inside output/pdf, so tell it where the .bib file is.
    env = dict(os.environ, BIBINPUTS=str(ROOT) + os.pathsep)
    print("pdf: running latexmk (log: output/latexmk.log)")
    code = run_logged(cmd, OUTPUT / "latexmk.log", env)
    if code != 0:
        log = PDF_DIR / "book.log"
        if log.exists():
            lines = log.read_text(encoding="utf-8", errors="replace").splitlines()
            for i, line in enumerate(lines):
                if line.startswith("!") or re.match(r"^\S+\.tex:\d+:", line):
                    print("  " + "\n  ".join(lines[i:i + 3]))
        print("pdf: FAILED")
        return False
    print(f"pdf: wrote {(PDF_DIR / 'book.pdf').relative_to(ROOT)}")
    return True


def command_html(args, project=None):
    if project is None:
        project, ok = prepare(args)
        if not ok:
            return False
    plastex = shutil.which("plastex")
    if not plastex:
        print("html: plastex not found")
        return False
    if HTML_DIR.exists():
        if not (HTML_DIR / GENERATED_MARKER).exists():
            print(f"html: {HTML_DIR} was not created by make.py; remove it by hand first")
            return False
        shutil.rmtree(HTML_DIR)
    HTML_DIR.mkdir(parents=True)
    # plasTeX reads the bibliography from book.bbl, which BibTeX produces
    # during the PDF build.
    bbl = PDF_DIR / "book.bbl"
    if bbl.exists():
        shutil.copy2(bbl, ROOT / "book.bbl")
    else:
        print("html: output/pdf/book.bbl is missing; run 'python make.py pdf' first "
              "or the bibliography will be empty")
    # The theme path must be absolute: plasTeX looks for the theme's scripts
    # after changing into the output directory.
    cmd = [plastex, "--renderer", "HTML5",
           "--extra-templates", str(ROOT / "web"), "--theme", "hodge", "--theme-css", "hodge",
           "--split-level", "1",
           "--filename", "index [$id, $title(4), $num(4)]",
           "--imager", "pdftoppm", "--vector-imager", "dvisvgm",
           "--mathjax-url", MATHJAX_URL,
           "--dir", "output/html", "book.tex"]
    print("html: running plasTeX (log: output/plastex.log)")
    code = run_logged(cmd, OUTPUT / "plastex.log")
    (HTML_DIR / GENERATED_MARKER).write_text("Created by make.py; safe to delete.\n", encoding="utf-8")
    log_lines = (OUTPUT / "plastex.log").read_text(encoding="utf-8", errors="replace").splitlines()
    problems = sorted({l.strip() for l in log_lines if l.startswith(("WARNING", "ERROR"))})
    for line in problems[:40]:
        print(f"  plasTeX {line}")
    if code != 0 or not (HTML_DIR / "index.html").exists():
        print("html: FAILED")
        return False
    postprocess_html(project)
    pdf = PDF_DIR / "book.pdf"
    if pdf.exists():
        shutil.copy2(pdf, HTML_DIR / "book.pdf")
    print(f"html: wrote {HTML_DIR.relative_to(ROOT)}/index.html")
    return True


def command_all(args):
    project, ok = prepare(args)
    if not ok:
        return False
    return command_pdf(args, project) and command_html(args, project)


def command_serve(args):
    if not (HTML_DIR / "index.html").exists():
        print("serve: build the website first (python make.py html)")
        return False
    print(f"Serving {HTML_DIR} at http://localhost:{args.port} (Ctrl+C to stop)")
    try:
        subprocess.run([sys.executable, "-m", "http.server", str(args.port),
                        "--directory", str(HTML_DIR)])
    except KeyboardInterrupt:
        pass
    return True


# ---------------------------------------------------------------------------
# Website post-processing: tags, status banners, tag pages
# ---------------------------------------------------------------------------

THM_HEADING_RE = re.compile(r'<div class="(\w+)_thmwrapper[^"]*" id="([^"]+)">\s*<div class="\1_thmheading">')
HEADING_RE = re.compile(r'<h(\d) id="([^"]+)">(.*?)</h\1>', re.S)
CITE_RE = re.compile(r'<span class="cite">.*?</span>', re.S)
TOC_LINK_RE = re.compile(r'(<a [^>]*data-label="([^"]+)"[^>]*>.*?</a>)', re.S)
ID_RE = re.compile(r'\bid="([^"]+)"')


def tag_badge(tag):
    return f'<a class="tag" href="tag/{tag}.html" title="Permanent link: tag {tag}">{tag}</a>'


def postprocess_html(project):
    label_tag = {label: tag for tag, label in read_tags()}
    chapters = {c.slug: c for c in project.chapters}
    locations = {}

    for path in sorted(HTML_DIR.glob("*.html")):
        text = path.read_text(encoding="utf-8")

        def thm(m):
            tag = label_tag.get(m.group(2))
            return m.group(0) + (tag_badge(tag) if tag else "")

        def heading(m):
            level, label, content = m.group(1), m.group(2), m.group(3)
            tag = label_tag.get(label)
            out = f'<h{level} id="{label}">{content}{tag_badge(tag) if tag else ""}</h{level}>'
            chapter = chapters.get(label.split(":")[0])
            if level == "1" and chapter and chapter.status != "checked":
                out += (f'\n<p class="status-banner status-{chapter.status}">'
                        f'<strong>{chapter.status.capitalize()}.</strong> {STATUSES[chapter.status]}</p>')
            return out

        def toc_link(m):
            chapter = chapters.get(m.group(2))
            if not chapter:
                return m.group(1)
            return m.group(1) + f'<span class="status-chip status-{chapter.status}">{chapter.status}</span>'

        text = THM_HEADING_RE.sub(thm, text)
        text = HEADING_RE.sub(heading, text)
        text = CITE_RE.sub(lambda m: re.sub(r"\s*([\[\],])\s*", r"\1 ", m.group(0))
                           .replace("[ ", "[").replace(" ]", "]").replace("] ", "]"), text)
        if path.name == "index.html":
            text = TOC_LINK_RE.sub(toc_link, text)
        path.write_text(text, encoding="utf-8")

        for m in ID_RE.finditer(text):
            if m.group(1) in label_tag:
                locations.setdefault(m.group(1), path.name)

    tag_dir = HTML_DIR / "tag"
    tag_dir.mkdir(exist_ok=True)
    rows = []
    for tag, label in read_tags():
        page = locations.get(label)
        if page is None:
            continue
        url = f"{page}#{label}"
        (tag_dir / f"{tag}.html").write_text(TAG_PAGE.format(
            tag=tag, url=html.escape("../" + url), label=html.escape(label)), encoding="utf-8")
        rows.append(f'<tr><td><a class="tag" href="tag/{tag}.html">{tag}</a></td>'
                    f'<td><a href="{html.escape(url)}"><code>{html.escape(label)}</code></a></td></tr>')
    (HTML_DIR / "tags.html").write_text(TAGS_PAGE.format(rows="\n".join(rows), count=len(rows)),
                                        encoding="utf-8")
    missing = [label for label in label_tag if label in project.labels and label not in locations]
    if missing:
        print(f"html: {len(missing)} tagged label(s) not found in the website, e.g. {missing[0]}")


TAG_PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Tag {tag}</title>
<meta http-equiv="refresh" content="0; url={url}" />
<link rel="canonical" href="{url}" />
</head>
<body>
<p>Tag {tag} refers to <a href="{url}">{label}</a>.</p>
</body>
</html>
"""

TAGS_PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Tags - The Hodge Project</title>
<link rel="stylesheet" href="styles/theme-hodge.css" />
</head>
<body class="tags-page">
<header class="site-header">
  <a class="site-title" href="index.html">The Hodge Project</a>
</header>
<main class="content tags-content">
<h1>Tags</h1>
<p>Every labelled item of the project has a permanent tag. The page
<code>tag/XXXX.html</code> always leads to the item with tag <code>XXXX</code>,
even if chapters are renumbered. There are {count} tags.</p>
<table class="tags-table">
<thead><tr><th>Tag</th><th>Label</th></tr></thead>
<tbody>
{rows}
</tbody>
</table>
</main>
</body>
</html>
"""


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(errors="replace")
    parser = argparse.ArgumentParser(description="Build and consistency tool for the Hodge Project.")
    sub = parser.add_subparsers(dest="command", required=True)
    for name, func, help_text in [
        ("check", command_check, "check labels, references and tags"),
        ("tags", command_tags, "assign tags to new labels"),
        ("status", command_status, "show the status of every chapter"),
        ("pdf", command_pdf, "build the PDF"),
        ("html", command_html, "build the website"),
        ("all", command_all, "build the PDF and the website"),
        ("serve", command_serve, "serve the website locally"),
    ]:
        p = sub.add_parser(name, help=help_text)
        p.set_defaults(func=func)
        if name in ("pdf", "html", "all"):
            p.add_argument("--force", action="store_true", help="build even if the check finds errors")
        if name == "serve":
            p.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    sys.exit(0 if args.func(args) else 1)


if __name__ == "__main__":
    main()
