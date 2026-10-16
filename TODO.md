# Additions to make

A shared list of results to add to the book. Add a line whenever something is
missing; tick it off (`[x]`) when it is in. Each item says which chapter it
belongs to, so that it respects the logical order of `book.tex` (no forward
references in proofs).

## Open

- Small results worth adding whenever they come up while reading: write them
  here with the chapter they belong to.
- **Slower rewrite, chapter by chapter** (the user finds the text rushed):
  after `connections`, continue with `vector-bundles`, `differential-forms`,
  `de-rham`, `characteristic-classes`, then the other parts; more
  explanations, examples, remarks and exercises everywhere.

## Done

- [x] **Hopf fibrations; notation for the second fundamental form**
  (`topological-manifolds`, `riemannian-geometry`): fibre bundles (quoted:
  bundles are Serre fibrations), quaternionic projective space, the Hopf
  fibrations $S^n \to \mathbb{RP}^n$, $S^{2n+1} \to \mathbb{CP}^n$, $S^{4n+3} \to
  \mathbb{HP}^n$ with explicit local trivialisations, $\mathbb{HP}^1 \cong S^4$,
  octonionic $S^{15} \to S^8$ quoted, consequences for homotopy groups
  ($\pi_3(S^2) \cong \pi_3(S^3)$, $\pi_k(S^4) \cong \pi_{k-1}(S^3)$ for $k \le 6$,
  $\pi_7(S^7) \hookrightarrow \pi_7(S^4)$), exercise on the two solid tori; a
  remark collecting the equivalent expressions of the second fundamental form
  ($\langle S v, w\rangle = -\langle\overline\nabla_v\nu, w\rangle = -\langle d\nu(v), w\rangle$, co-orientation,
  Gauss map, Gauss equation in the usual notation).

- [x] **Gradient, Hessian, divergence and Laplacian** (`riemannian-geometry`, new
  section after covariant derivatives along curves): definitions, coordinate
  formulas (with $\sum_i\Gamma^i_{ij} = \partial_j\log\sqrt{\det g}$), steepest
  ascent, symmetry of the Hessian, $\mathrm{Hess}f = \langle\nabla\mathrm{grad}f, -\rangle$,
  $(f\circ\gamma)'' = \mathrm{Hess}f(\dot\gamma, \dot\gamma)$, second derivative test,
  $d\iota_X\mathrm{vol} = \mathrm{div}X\,\mathrm{vol}$, divergence theorem and Green's formula on
  Riemannian manifolds with boundary; examples (polar and spherical coordinates,
  conformal metrics, hyperbolic plane, distance function); exercises
  (Leibniz rules, radial Laplacian, linear functions on spheres).

- [x] **Connection from parallel transport** (`connections`): proposition
  $\nabla_vs = \frac{d}{dt}\big|_0P_t^{-1}s(\gamma(t))$ with proof, the expansion
  $P_t = I - t\theta(v) + O(t^2)$ (connection form = infinitesimal transport),
  comparison with the Lie derivative, pointer from the definition of a
  connection, exercise (line bundle over $\mathbb{R}$; metric iff transport is
  isometric).

- [x] **Parallelizable manifolds** (`vector-bundles`, `characteristic-classes`):
  definition, examples (open sets, tori, Lie groups, $S^3$ with quaternions,
  products, $S^1 \times S^n$ with an explicit frame), even spheres excluded by
  the hairy ball theorem, the theorem on spheres quoted from Bott–Milnor and
  Kervaire, obstructions (orientability, $\chi = 0$, characteristic classes)
  and the counterexample $S^5$; exercise on $\mathbb{RP}^3$ and $T^2 \times S^2$.

- [x] **Covariant derivative as tangential projection** (`riemannian-geometry`):
  corollary for submanifolds of $\mathbb{R}^N$ ($\nabla_XY = P(X(Y))$, $D_tV = P(V')$,
  geodesics have normal acceleration), identification with the projection
  connection, $\gamma'' = D_t\dot\gamma + \mathrm{II}(\dot\gamma, \dot\gamma)$, examples
  (circles of latitude, great circles, helices on the cylinder, parallel
  transport), exercise on the geodesics of the cylinder.

- [x] **Integration by parts; surface integrals; Green and Stokes**
  (`real-analysis`, `measure-theory`, `riemannian-geometry`): examples of
  integration by parts in one variable (Wallis' integrals, periodic
  functions) and an exercise ($\int x^m(1-x)^n$); integration by parts in
  $\mathbb{R}^n$ for compactly supported functions; Green's identities on a
  region; a remark explaining that $dy \wedge dz$ in the flux formula is the
  pullback by the inclusion, computed in a parametrisation through the minors
  of the Jacobian, which are the components of $x_u \times x_v$ (the classical
  vector surface element $d\vec\Sigma = \nu\,dA$); flux through a graph;
  Green's theorem with the area formula; Stokes' theorem of vector calculus
  with the right-hand rule; examples and exercises (hemisphere, paraboloid,
  uniqueness for the Dirichlet problem).

- [x] **Website: previews on touch screens, chapter PDF, mobile overflow**:
  on phones the first tap on a reference opens the preview as a panel at the
  bottom of the screen (with "Open" and a close button), a second tap follows
  the link; a "Chapter PDF" header link opens `print.html?chapter=...`, which
  collects the chapter and opens the browser's print dialog (save as PDF), so
  no server build is needed; long inline formulas no longer widen the page on
  narrow screens. Example of the trivial connection now explains why a
  section of a trivial bundle is a vector-valued function, and the column
  convention.

- [x] **Elliptic operators and Hodge theorem, slower; products of bundle-valued
  forms** (`connections`, `elliptic-operators`, `hodge-theorem`): products
  of bundle-valued forms as a definition with a proposition (frame formulas,
  change of frame, evaluation, associativity) and worked examples; the remark
  on the missing exterior derivative in row/column notation with the line
  bundle example. Elliptic operators: motivation and plan, symbol
  computations (Laplacian in coordinates, Cauchy–Riemann, non-elliptic
  examples), Sobolev examples (Dirac, jump), interpolation inequality,
  resonance example, fixed the symbol of the adjoint (no factor $(-1)^m$),
  exercises (spherical harmonics, $d/d\theta + a$, heat equation,
  harmonic functions as real parts). Hodge theorem: finite-dimensional
  Hodge lemma, circle and Helmholtz decompositions, conformal invariance of
  harmonic $1$-forms on surfaces, proof of the Bochner–Weitzenböck formula
  on $1$-forms, sharpness of Bochner; the solution of the metric-dependence
  exercise was wrong (a conformal change on a surface does not change the
  harmonic $1$-forms) and is replaced; solutions to all exercises. In
  `connections`, the definition of a connection now contains only the
  definition, with motivation; the properties of $\nabla_X$ are proved in
  the next proposition with every step cited, using the new remark
  $df(X) = Xf$ in `differential-forms` (it was used everywhere but never
  stated); the change-of-frame and existence proofs are more detailed.

- [x] **Previews and residues** (website, `complex-manifolds`,
  `riemannian-geometry`, `real-analysis`): hovering over a reference to a
  statement, a section, a numbered equation or a bibliography entry shows it
  in a box (`site.js`); the tagged formulas $(*)$, $(**)$, $(\ddagger)$,
  $(\dagger)$ became labelled equations with `\eqref`, so they are previewed
  too; `\bysame` in the bibliography no longer prints "to3em". New section on
  meromorphic $1$-forms: residue independent of the chart, residue theorem on a
  compact Riemann surface, zeros = poles, no single simple pole on a torus, no
  holomorphic forms on $\mathbb{P}^1$, one-variable Euler–Jacobi formula, the
  higher-dimensional global residue theorem quoted from Griffiths–Harris;
  exercises (residue at infinity, Abel's theorem for tori in one direction).
  Exercise on the half-space, ball and hyperboloid models of hyperbolic space
  (Cayley map, inversion, projection chart); classical form of the curvature in
  orthogonal coordinates with the factor $\frac12$.

- [x] **Moving frames and Chern's proof of Gauss–Bonnet–Chern**
  (`multilinear-algebra`, `characteristic-classes`, `riemannian-geometry`),
  from the two papers the user sent (Chern 1944, Cartan's moving frames). The
  Pfaffian is now defined (via $\alpha_A^m = m!\,\mathrm{Pf}(A)\,\mathrm{vol}$) with
  $\mathrm{Pf}(g^TAg) = \det g\,\mathrm{Pf}(A)$ and $\mathrm{Pf}^2 = \det$; the sign of
  the old $2 \times 2$ example was wrong for our curvature conventions and has
  been fixed. New section on the Euler form: normal frames, closedness and
  independence of the connection, index of an isolated zero, Chern's forms
  $\Phi_k$, $\Psi_k$ on the sphere bundle with the transgression formula
  (checked numerically for $n = 4$), global angular form, Chern's theorem
  $\int e(\nabla) = \sum \mathrm{ind}$, Gauss–Bonnet–Chern, surface case,
  exercises. Riemannian chapter: section on moving frames (Cartan's lemma,
  structure equations with uniqueness, surfaces in orthogonal and polar
  coordinates, torus of revolution, conformally flat metrics in every
  dimension, hyperbolic half-space and ball and stereographic sphere, hypersurfaces
  and the Gauss equation, Gauss–Bonnet–Chern for constant curvature and the
  volume of $S^{2m}$); hyperbolic space now proved complete of curvature $-1$
  (no longer quoted from do Carmo); Poincaré–Hopf for surfaces; exercises
  (Heisenberg metric, warped products, $f(x_n)^2\delta$ metrics, dimension 4).

- [x] **Characteristic classes, Chern–Weil part slower**
  (`characteristic-classes`): motivation, examples of invariant polynomials
  (traces, elementary symmetric functions, Pfaffian), the lemma turning
  covariant derivatives into ordinary ones with proof, explicit $c_1$, $c_2$,
  $c_r$ forms, Chern forms of $\mathcal{O}(-1)$ and of $TS^2$
  ($\int c_1 = -1$ and $2$), Chern character and Todd class on
  $\mathbb{CP}^1$ with the Riemann–Roch check; exercises ($\mathcal{O}(a) \oplus
  \mathcal{O}(b)$, $c_1(E) = c_1(\det E)$, pullback by $z^k$, $c_2$ of a sum).

- [x] **de Rham cohomology, slower** (`de-rham`): motivation by closed versus
  exact forms, first computations ($\mathbb{R}$, $S^1$, punctured plane), the
  homotopy operator derived line by line, the explicit Poincaré lemma
  $\eta = \int_0^1 t^{k-1}\iota_X\omega(tx)\,dt$ with worked primitives,
  Mayer–Vietoris with the connecting homomorphism made explicit, spheres by
  induction in detail, the connecting map on the circle; exercises on
  punctured planes, the solid angle form and explicit primitives.

- [x] **Differential forms, slower** (`differential-forms`): why forms are the
  right integrands (the sign of the Jacobian), worked wedge products and
  pullbacks (helix, sphere, spherical coordinates), the interior product and
  the Lie derivative with examples, Cartan's formula proved in five steps,
  grad/curl/div computed, integration with a detailed proof of
  well-definedness, integration through a parametrisation up to a null set,
  integrals over $S^2$, manifolds with boundary (boundary well defined,
  "outward vector first"), Stokes with a complete proof, checks of Stokes
  (area, volume, annulus), new exercises (primitives, spherical volume,
  Stokes on a hemisphere, Lie derivatives of rotations, Hamiltonian flows).

- [x] **Vector bundles, rewritten slowly** (`vector-bundles`): unwound
  definition, bijective morphisms are isomorphisms, cocycles with full proofs,
  worked cocycles (tangent bundle = Jacobians, stereographic charts of $S^n$,
  Möbius, $\mathcal{O}(-1)$), sections as twisted functions (no holomorphic
  sections of $\mathcal{O}(-1)$), explicit cocycles of all operations,
  subbundles, reduction to $O(r)$ and $U(r)$, rank-jump counterexample,
  winding numbers and the elementary classification $\Pic^\infty(\mathbb{CP}^1)
  \cong \mathbb{Z}$ by degree, $T\mathbb{CP}^1 \cong \mathcal{O}(2)$, new
  computational and theoretical exercises.

- [x] **Connections, rewritten slowly** (`connections`): bundle-valued forms
  and what they are concretely, the tensoriality lemma, the two languages
  ($\nabla \colon \Gamma(E) \to \Omega^1(M, E)$ and $\nabla_Xs$), projection
  connections on subbundles, connection forms of the sphere and of the
  tautological bundle of $\mathbb{CP}^1$, induced connections, the exterior
  covariant derivative with complete proofs, curvature computations
  ($\int\frac{i}{2\pi}F = -1$ on $\mathbb{CP}^1$), transport around a latitude,
  holonomy of small loops, holonomy of line bundles, counterexamples, new
  exercises.
- [x] **"On a first reading" notes** (`introduction`, `logic`,
  `model-theory`, `cohomology-operations`, `riemannian-geometry`,
  `complex-manifolds`).

- [x] **Positive curvature on non-compact manifolds, rays, lines, splitting**
  (`riemannian-geometry`): why Bonnet–Myers needs a uniform bound, the
  theorems of Gromoll–Meyer, Cheeger–Gromoll (soul) and Perelman (quoted),
  existence of rays and of lines, the Cheeger–Gromoll splitting theorem
  (quoted, with an outline), complete manifolds with $\mathrm{Ric} > 0$
  contain no line.
- [x] **Gauss formula for immersions** (`riemannian-geometry`): with the
  pullback connection, $df(\nabla_XY) = (\overline{\nabla}^f_X\,df(Y))^\top$,
  without extending vector fields.

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
