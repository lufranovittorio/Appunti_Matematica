# The Hodge Project

A Stacks-project-style reference, written in LaTeX, that develops with complete
proofs all the mathematics needed for the Hodge conjecture and the theory
around it. One source produces a PDF (pdflatex) and a website (plasTeX).
Language: English.

## Layout

- `book.tex` — master file. The order of `\part` / `\include` lines is the
  logical order of the whole project.
- `preamble.tex` — packages and numbered environments. `macros.tex` — math macros.
- `chapters/<slug>.tex` — one file per chapter. The slug is permanent.
- `tags/tags` — permanent tags, one `TAG,label` per line. Append-only.
- `make.py` — checker and build tool (see README.md).
- `web/Themes/hodge/` — plasTeX theme: layouts, `styles/theme-hodge.css`, `js/site.js`.
  Every `.js` file in the theme is loaded on every page, so page-specific
  scripts live elsewhere: `web/search.js` drives `search.html`, which
  `make.py html` writes together with the index `search-index.js`.
- `sources/` — reference material (e.g. the Hodge conjecture PDF the Part IX
  chapters are based on). Not part of the build.
- `output/` — generated; never edit by hand.
- `_old/`, `build/`, `main/`, `template/`, `algebra.tex`, `analisi.tex`,
  `geometria.tex`, `main.tex`, `main.paux` (if present) — the user's earlier
  experiments, unrelated to this project. Do not use or modify them.

## Rules for writing chapters

- **No forward references.** A proof may only use material that appears
  earlier in `book.tex`. Outside proofs, text may point forward within the same
  chapter (e.g. an introduction announcing the main theorem) and to later
  chapters as a whole, but not to results of later chapters. Examples,
  counterexamples, remarks and exercises may *mention* later notions
  informally. Only `chapters/introduction.tex` may refer forward freely.
  `make.py check` enforces this (errors inside proofs and in Prerequisites
  lines, warnings otherwise).
- **Citations**: `\cite{key}` / `\cite[Theorem 2.3]{key}` with keys from
  `hodge-project.bib` (style amsalpha). Only add entries whose details are
  certain. Results quoted without proof must cite a source.
- **Every result is proved.** Use `\begin{proof}` for complete proofs,
  `\begin{proof}[Sketch of proof]` when verifications are omitted (name them),
  and no proof only for results quoted from the literature (give the reference).
- **Numbered environments**: definition, theorem, proposition, lemma,
  corollary, conjecture, example, counterexample, exercise, notation, remark.
  Exercises may be followed by `\begin{solution}`. All share one counter within
  the section, so every numbered environment must be inside a `\section`.
- **Labels**: chapter `\label{<slug>}`; everything else
  `\label{<slug>:<type>-<name>}` where `<type>` is the environment name,
  `section`/`subsection`, or `equation`; `<name>` is lower-case words joined by
  hyphens. Put section labels on the same line as `\section{...}` and
  environment labels right after `\begin{...}`. Every numbered environment
  gets a label (so it gets a tag).
- **Tags** are assigned by `make.py` in label order and never change. If a label
  is renamed, edit its line in `tags/tags`; never delete or reuse a tag.
- **Chapter status**: `\chapterstatus{planned|draft|complete|checked}` right
  after `\chapter`. Planned chapters contain a summary, a Prerequisites line
  (`\noindent\textbf{Prerequisites.} Chapter~\ref{slug} (Title), ...`) and a
  Planned contents list. Only a human reader may set a chapter to `checked`.
- **Math that works on both outputs**: plasTeX expands macros from
  `macros.tex` itself, and MathJax 2.7.9 renders the result. Stick to amsmath /
  amssymb commands that MathJax supports; do not add packages without testing
  the HTML build. `mathtools` and `amscd` are not supported.
- **Diagrams**: use `tikz-cd`, *outside* math mode, wrapped in `center`:
  `\begin{center}\begin{tikzcd} ... \end{tikzcd}\end{center}`. plasTeX turns it
  into an SVG image. A `tikzcd` inside `\[ \]` is not rendered on the website.
- New chapters: add the file, add `\include{chapters/<slug>}` in the right
  place in `book.tex`, and run `python make.py check`.

## Building

- `python make.py check` before and after any change to the sources.
- `python make.py html` / `pdf` / `all`; `python make.py serve` to view the site.
- The website must use MathJax **2.7.9** (HTML-CSS output), because the user
  wants formulas to be selectable text. Do not upgrade to MathJax 3/4.
- Write `.tex` files with the file-writing tools, not shell heredocs: the shell
  can silently turn `\\` into `\`.
