# Additions to make

A shared list of results to add to the book. Add a line whenever something is
missing; tick it off (`[x]`) when it is in, with the tag of the new result.
Each item says which chapter it belongs to, so that it respects the logical
order of `book.tex` (no forward references in proofs).

## Requested

- [ ] **Wu's formula** (`characteristic-classes`). Stiefel–Whitney classes are
  only defined briefly (section tag 01BW). Define them through the Thom
  isomorphism and the Steenrod squares, $w(E) = \Phi^{-1}\mathrm{Sq}(\Phi(1))$;
  define the Wu classes $v_i$ of a closed manifold by
  $\mathrm{Sq}^i(x) = v_i \smile x$ for $x \in H^{n-i}(M; \mathbb{F}_2)$; prove
  Wu's formula $w(M) = \mathrm{Sq}(v)$. Consequences: $w(\mathbb{RP}^n)$,
  Stiefel–Whitney numbers are homotopy invariants. Uses `cohomology-operations`
  (Steenrod squares) and `poincare-duality` (mod 2 duality).
- [ ] **Zig-zag lemma** (`homological-algebra`). The long exact sequence of a
  short exact sequence of complexes is Theorem 00O4, proved with the snake
  lemma. Give it its usual name and add a direct diagram-chase proof of the
  connecting map.
- [ ] **Löwenheim–Skolem, downward and upward** (`logic`). Only the countable
  downward version is there (Theorem 005Y). Add elementary substructures and
  the Tarski–Vaught test, downward Löwenheim–Skolem for every infinite
  cardinal $\kappa \geq |\mathcal{L}|$, upward Löwenheim–Skolem via
  compactness, and consequences (a first-order theory with an infinite model
  has models of every infinite cardinality $\geq |\mathcal{L}|$; the Łoś–Vaught
  test).
- [ ] **Lindström's theorem** (`logic`). First-order logic is the strongest
  logic with the compactness and downward Löwenheim–Skolem properties. Needs a
  definition of abstract logic; it goes after the Löwenheim–Skolem theorems.

## Ideas for later

- Small results worth adding whenever they come up while reading: write them
  here with the chapter they belong to.
