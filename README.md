# The Hodge Project

A cumulative reference that develops, with complete proofs, the mathematics
needed to state, understand and work with the Hodge conjecture, together with
the theory around it. It is organised like the
[Stacks project](https://stacks.math.columbia.edu): one LaTeX source, a strict
logical order, and a permanent tag for every result.

## Requirements

- Python 3.10 or later with plasTeX 3.1 (`pip install plasTeX`)
- A TeX distribution with `latexmk`, `pdflatex` and `dvisvgm` (MiKTeX or TeX Live)

## Commands

```
python make.py check    # labels, references (no forward references) and tags
python make.py status   # status of every chapter
python make.py tags     # give tags to new labels (also done by the builds)
python make.py pdf      # output/pdf/book.pdf
python make.py html     # website in output/html
python make.py all      # both
python make.py serve    # http://localhost:8000
```

The builds stop if `check` finds errors; add `--force` to build anyway.

## Writing

See `CLAUDE.md` for the conventions: labels, environments, proofs, diagrams
and chapter status. In short, every file in `chapters/` is one chapter, the
order in `book.tex` is the logical order, and a proof may only use what comes
before it.
