# Additions to make

A shared list of results to add to the book. Add a line whenever something is
missing; tick it off (`[x]`) when it is in. Each item says which chapter it
belongs to, so that it respects the logical order of `book.tex` (no forward
references in proofs).

## Open

- Small results worth adding whenever they come up while reading: write them
  here with the chapter they belong to.

## Done

- [x] **Weinstein and Synge** (`riemannian-geometry`, variation section):
  Weinstein's fixed point theorem, Synge's theorem (even dimension: simply
  connected; odd dimension: orientable), a counterexample for every
  hypothesis, and $\mathbb{RP}^2 \times \mathbb{RP}^2$ has no metric of
  positive curvature. The second variation formula now has its boundary term.
- [x] **Conformal metrics** (`riemannian-geometry`): $K = -e^{-2u}\Delta u$;
  the hyperbolic plane, the Poincaré disc and the Cayley map, the sphere.
- [x] **Uniformisation** (`complex-manifolds`, new section): coverings and
  quotients of Riemann surfaces, the uniformisation theorem (quoted),
  automorphisms of $\mathbb{CP}^1$, $\mathbb{C}$, $\mathbb{D}$, the Poincaré
  metric and Schwarz–Pick, classification of Riemann surfaces by their
  universal covering, compact surfaces of genus $\geq 2$ are hyperbolic with
  area $4\pi(g-1)$, the little Picard theorem.

- [x] **First and second variation of energy** (`riemannian-geometry`, new
  section): variations and variation fields, energy versus length, the first
  variation formula (geodesics are the critical points), the index form and
  the second variation formula, Jacobi's theorem on conjugate points, and a
  complete proof of the Bonnet–Myers theorem (previously only quoted).
- [x] **Minimal surfaces** (`riemannian-geometry`, new section): first and
  second variation of area, catenoid, helicoid, Scherk's surface, the minimal
  surface equation, minimal graphs minimise area (calibration), Jörgens'
  lemma and Bernstein's theorem with Nitsche's proof, the Bernstein problem in
  higher dimensions (quoted).
- [x] **Derivatives along curves** (`connections`, `riemannian-geometry`): why
  $\nabla_{\dot\gamma}s$ makes sense although $\dot\gamma$ need not extend to a
  vector field; it is the pullback connection $(\gamma^*\nabla)_{d/dt}$.

- [x] **Volume and surface integrals** (`riemannian-geometry`, new section
  "Volume and integration"): the Riemannian measure (also on non-orientable
  manifolds), the volume form $\sqrt{\det g}\,dx^1 \wedge \cdots \wedge dx^n$,
  the volume of parametrised submanifolds of $\mathbb{R}^N$ (sum of squares of
  minors; curves, $|x_u \times x_v|$, hypersurfaces, graphs), do Carmo's
  surface integrals as a special case, $\mathrm{vol}_M = \iota_\nu\Omega$ and
  flux integrals, the divergence theorem, areas of spheres and tori,
  Archimedes' theorem.
- [x] **Weingarten equations in coordinates** (`riemannian-geometry`): for a
  hypersurface of $\mathbb{R}^{n+1}$, $d\nu = -S$,
  $h_{ij} = -\sum_k a_{ki}g_{kj}$, $A = -(g)^{-1}(h)$, do Carmo's formulas for
  $a_{ij}$, and a remark on the sign conventions.
- [x] **Killing fields and space forms** (`riemannian-geometry`, new section):
  local isometries are determined by first-order data, Killing's equation,
  Killing fields are Jacobi fields along geodesics, the Lie algebra of Killing
  fields has dimension at most $n(n+1)/2$, Bochner's theorem, the
  Killing–Hopf theorem, isometries of $\mathbb{R}^n$ and $S^n$, space forms,
  even-dimensional spherical space forms; Cheng's maximal diameter theorem and
  the sphere theorem (quoted).
- [x] **Engel and Lie** (`representation-theory`, new section "Nilpotent and
  solvable Lie algebras"): derived and lower central series, triangular
  matrices, Engel's theorem (linear form and $\operatorname{ad}$-nilpotence),
  the invariance lemma, Lie's theorem and its corollaries, counterexamples
  over $\mathbb{R}$ and in characteristic $p$, Cartan's criterion (quoted).

- [x] **Global theorems on surfaces** (`riemannian-geometry`, following
  do Carmo): geodesic curvature, theorem of turning tangents (quoted), local
  and global Gauss–Bonnet with boundary, geodesic triangles and angle excess,
  Minding's theorem (in any dimension, via Jacobi fields), a compact surface
  in $\mathbb{R}^3$ has a point with $K > 0$, Hadamard's theorem (Gauss map is a
  diffeomorphism when $K > 0$), Liebmann's theorem (sketched), Hilbert's
  theorem (quoted).

- [x] **Differential forms, slower** (`differential-forms`): the three
  descriptions of a $k$-form (sections, alternating maps, coefficients) with the
  change of chart $\omega^{(y)}_J = \sum_I \omega^{(x)}_I \det(\partial x^I/\partial y^J)$;
  the exterior derivative proved step by step (coefficients
  $\sum_m (-1)^m \partial_{j_m}\omega_{J \setminus j_m}$, locality, agreement on
  overlaps, naturality, invariant formula); $dr$ versus $\partial/\partial r$ and
  $dx \wedge dy = r\,dr \wedge d\theta$; orientation of hypersurfaces by a unit
  normal, the Möbius band.
- [x] **Top de Rham cohomology per component** (`de-rham`): the isomorphism
  $H^n_{\mathrm{dR}}(M) \cong \mathbb{R}^c$ made explicit.
- [x] **Layer cake, maximal theorem, absolutely continuous functions**
  (`measure-theory`): $\int f = \int_0^\infty \mu(f > t)\,dt$, $\|Mf\|_p \le C\|f\|_p$,
  and $F(x) = F(a) + \int_a^x F'$ for absolutely continuous $F$.
- [x] **Submanifold geometry** (`riemannian-geometry`): first and second
  fundamental forms, Gauss formula, shape operator, Gauss and Codazzi
  equations, principal and mean curvature, Theorema Egregium, surfaces in
  $\mathbb{R}^3$ with $E, F, G$ and $h_{ij}$, the general computation for
  submanifolds of $\mathbb{R}^N$, spheres, cylinders, graphs.

- [x] **Naturality of integral curves** (`smooth-manifolds`): $F$-related
  fields, $F \circ \Phi_t = \Psi_t \circ F$, and $\Psi_t = F \Phi_t F^{-1}$ for a
  diffeomorphism.
- [x] **Fibre products** (`smooth-manifolds`, `vector-bundles`): the fibre
  product of manifolds along a submersion, with its tangent space and universal
  property, and the identification $f^*E \cong N \times_M E$ of the pullback
  bundle.
- [x] **Whitney's theorem, general case** (`smooth-manifolds`): proper
  embedding in $\mathbb{R}^{2n+1}$ and immersion in $\mathbb{R}^{2n}$, sketched.
- [x] **Regular surfaces** (`smooth-manifolds`): four equivalent local
  descriptions of a submanifold of $\mathbb{R}^N$ (slice, graph,
  parametrisation, regular level set), and a remark identifying do Carmo's
  regular surfaces with the 2-dimensional submanifolds of $\mathbb{R}^3$.

- [x] **More measure theory** (`measure-theory`): Littlewood's three
  principles, approximation of measurable sets by finite unions of boxes,
  Lusin's theorem (with the extension to $C_c$), Vitali's covering lemma, the
  Hardy–Littlewood maximal inequality, the Lebesgue differentiation theorem,
  the density theorem, the fundamental theorem of calculus for Lebesgue
  integrals, the Cantor function, and a Lebesgue measurable set that is not
  Borel.
- [x] **Chain rule on manifolds** (`smooth-manifolds`): it was already in the
  proposition on tangent spaces (tag 017S); added the global form, the tangent
  map $df \colon TM \to TN$ with $d(g \circ f) = dg \circ df$ (the tangent
  functor).

- [x] **Complex projective space** (`homotopy`, `topological-manifolds`):
  $\mathbb{CP}^n$ is compact Hausdorff with one cell in each even dimension,
  $\mathbb{CP}^1 \cong S^2$ by an explicit map (the Riemann sphere, the Hopf
  map), $\pi_1(\mathbb{CP}^n) = 1$ and $\pi_1(\mathbb{RP}^n) = \mathbb{Z}/2$ from
  the cells.
- [x] **Simply connected 4-manifolds** (`poincare-duality`): $S^2 \times S^2$
  and $\mathbb{CP}^2 \# \overline{\mathbb{CP}^2}$ have the same homology but are
  not homotopy equivalent; the Poincaré conjecture in dimension 4 (homology
  4-spheres, Freedman) and the role of the intersection form.

- [x] **Wu's formula** (`characteristic-classes`, section "Stiefel–Whitney
  classes and Wu's formula"): Thom's definition of the Stiefel–Whitney classes,
  Wu classes, Wu's formula $w(M) = \mathrm{Sq}(v)$, homotopy invariance of the
  Stiefel–Whitney numbers, $w_n[M] \equiv \chi(M) \pmod 2$, examples
  $\mathbb{RP}^2$, $\mathbb{RP}^3$, $\mathbb{RP}^4$.
- [x] **Zig-zag lemma** (`homological-algebra`): the long exact sequence
  theorem now carries the name, a remark draws the zig-zag, and an exercise
  proves it by a direct diagram chase.
- [x] **Löwenheim–Skolem, downward and upward** (new chapter `model-theory`,
  after `number-systems`): elementary substructures, Tarski–Vaught test,
  downward and upward Löwenheim–Skolem for all cardinals, ultraproducts and
  Łoś's theorem, compactness for all languages, Łoś–Vaught test, Cantor's
  theorem on dense linear orders.
- [x] **Lindström's theorem** (`model-theory`): with Ehrenfeucht–Fraïssé
  theory (partial isomorphisms, Hintikka formulas) and abstract logics.
- [x] **Jordan form over non-closed fields** (`linear-algebra`): counterexample
  over $\mathbb{R}$, "Jordan form exists iff $\chi_f$ splits", real Jordan form,
  Jordan–Chevalley decomposition over perfect fields and the counterexample
  over $\mathbb{F}_p(t)$.
- [x] **Deformations and deformation retracts** (`homotopy`): terminology
  (strong and weak), properties, Möbius band, mapping cylinder, punctured torus,
  the comb space, retracts that are not deformation retracts.
