/* The Hodge Project: full-text search over the statements of the book.
 *
 * The index is built by make.py (search-index.js) and assigned to
 * window.HODGE_SEARCH_INDEX:
 *   kinds:    ["chapter", "section", "definition", "theorem", ...]
 *   places:   [[number, title, url], ...]   chapters and sections
 *   items:    [[kind, tag, label, number, name, chapter, section, url, text], ...]
 * where kind indexes kinds, chapter and section index places (-1 if none),
 * and text is the beginning of the statement, with formulas as \( ... \).
 * Everything runs in the browser; nothing is sent anywhere.
 */
(function () {
  "use strict";

  var data = window.HODGE_SEARCH_INDEX;
  var input = document.getElementById("search-page-input");
  var form = document.getElementById("search-page-form");
  var statusLine = document.getElementById("search-status");
  var list = document.getElementById("search-results");
  var moreButton = document.getElementById("search-more");
  var filterBar = document.getElementById("search-filters");
  if (!data || !input || !list) return;

  var PAGE = 40;
  var SNIPPET = 320;

  var GROUPS = [
    { id: "all", label: "All", kinds: null },
    { id: "definitions", label: "Definitions", kinds: ["definition", "notation"] },
    { id: "results", label: "Results", kinds: ["theorem", "proposition", "lemma", "corollary"] },
    { id: "examples", label: "Examples", kinds: ["example", "counterexample"] },
    { id: "exercises", label: "Exercises", kinds: ["exercise"] },
    { id: "remarks", label: "Remarks", kinds: ["remark", "conjecture"] },
    { id: "sections", label: "Chapters and sections", kinds: ["chapter", "section"] }
  ];

  function fold(s) {
    s = String(s);
    if (s.normalize) s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");
    return s.toLowerCase();
  }

  // Prepare searchable fields once.
  var items = data.items.map(function (it, order) {
    var kind = data.kinds[it[0]];
    var label = it[2];
    return {
      order: order,
      kind: kind,
      tag: it[1],
      label: label,
      number: it[3],
      name: it[4],
      chapter: it[5],
      section: it[6],
      url: it[7],
      text: it[8],
      fName: fold(it[4]),
      fLabel: fold(label.replace(/[:\-]/g, " ")),
      fKind: kind,
      fText: fold(it[8])
    };
  });
  var byTag = {};
  var byLabel = {};
  items.forEach(function (it) {
    if (it.tag) byTag[it.tag] = it;
    byLabel[it.label] = it;
  });

  function parseQuery(q) {
    var terms = [];
    var re = /"([^"]+)"|(\S+)/g;
    var m;
    while ((m = re.exec(q)) !== null) {
      var t = fold(m[1] || m[2]).trim();
      if (t) terms.push(t);
    }
    return terms;
  }

  function wordStart(hay, term) {
    var i = hay.indexOf(term);
    while (i !== -1) {
      if (i === 0 || /[^a-z0-9]/.test(hay.charAt(i - 1))) return true;
      i = hay.indexOf(term, i + 1);
    }
    return false;
  }

  function score(it, terms) {
    var total = 0;
    var inName = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      var s = 0;
      if (it.fName.indexOf(t) !== -1) { s += wordStart(it.fName, t) ? 12 : 6; inName++; }
      if (it.fKind === t || (t.length > 3 && it.fKind.indexOf(t) === 0)) s += 4;
      if (it.fLabel.indexOf(t) !== -1) s += wordStart(it.fLabel, t) ? 5 : 2;
      if (it.fText.indexOf(t) !== -1) s += wordStart(it.fText, t) ? 3 : 1;
      if (s === 0) return 0;
      total += s;
    }
    if (inName === terms.length) total += 10;
    if (it.kind === "chapter") total += 4;
    else if (it.kind === "section") total += 2;
    return total;
  }

  var state = { query: "", group: "all", shown: PAGE, results: [] };

  function groupOf(id) {
    for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].id === id) return GROUPS[i];
    return GROUPS[0];
  }

  function search() {
    var q = state.query.trim();
    var group = groupOf(state.group);
    var pinned = null;
    var qu = q.toUpperCase();
    if (/^[0-9A-Z]{4}$/.test(qu) && byTag[qu]) pinned = byTag[qu];
    else if (byLabel[q]) pinned = byLabel[q];
    var terms = parseQuery(q);
    var out = [];
    if (terms.length) {
      items.forEach(function (it) {
        if (it === pinned) return;
        if (group.kinds && group.kinds.indexOf(it.kind) === -1) return;
        var s = score(it, terms);
        if (s > 0) out.push({ it: it, s: s });
      });
      out.sort(function (a, b) { return b.s - a.s || a.it.order - b.it.order; });
    }
    var res = out.map(function (r) { return r.it; });
    if (pinned) res.unshift(pinned);
    state.results = res;
    state.shown = PAGE;
    render(terms.length > 0 || pinned !== null);
  }

  // Cut the text near SNIPPET characters, never inside a formula.
  function snippet(text) {
    if (text.length <= SNIPPET) return text;
    var depth = 0;
    var cut = -1;
    for (var i = 0; i < text.length; i++) {
      var two = text.substr(i, 2);
      if (two === "\\(" || two === "\\[") { depth++; i++; continue; }
      if (two === "\\)" || two === "\\]") { depth = Math.max(0, depth - 1); i++; continue; }
      if (depth === 0 && i >= SNIPPET && text.charAt(i) === " ") { cut = i; break; }
    }
    if (cut === -1) return text;
    return text.slice(0, cut) + " …";
  }

  function place(index) {
    return index >= 0 ? data.places[index] : null;
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function capital(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function renderItem(it) {
    var li = el("li", "search-result kind-" + it.kind);
    var head = el("div", "result-head");
    if (it.tag) {
      var tag = el("a", "tag", it.tag);
      tag.href = "tag/" + it.tag + ".html";
      tag.title = "Permanent link: tag " + it.tag;
      head.appendChild(tag);
    }
    var title = el("a", "result-title");
    title.href = it.url;
    if (it.kind === "chapter" || it.kind === "section") {
      title.textContent = (it.kind === "chapter" ? "Chapter " : "Section ") + it.number + " " + it.name;
    } else {
      title.textContent = capital(it.kind) + " " + it.number;
      if (it.name) title.appendChild(el("span", "result-name", " (" + it.name + ")"));
    }
    head.appendChild(title);
    li.appendChild(head);

    var where = [];
    var chapter = place(it.chapter);
    var section = place(it.section);
    if (chapter && it.kind !== "chapter") where.push(chapter[0] + " " + chapter[1]);
    if (section && it.kind !== "section") where.push(section[0] + " " + section[1]);
    if (where.length) li.appendChild(el("div", "result-where", where.join(" › ")));
    if (it.text) li.appendChild(el("div", "result-snippet", snippet(it.text)));
    return li;
  }

  function typeset(node) {
    if (window.MathJax && window.MathJax.Hub) {
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, node]);
    }
  }

  function render(searched) {
    list.innerHTML = "";
    var n = state.results.length;
    if (!searched) {
      statusLine.textContent = "Type words to search the statements of all " + items.length +
        " items of the project, or a four-character tag.";
    } else if (n === 0) {
      statusLine.textContent = "No results. Try fewer or shorter words.";
    } else {
      statusLine.textContent = n + (n === 1 ? " result" : " results");
    }
    var shown = Math.min(n, state.shown);
    var frag = document.createDocumentFragment();
    for (var i = 0; i < shown; i++) frag.appendChild(renderItem(state.results[i]));
    list.appendChild(frag);
    moreButton.hidden = shown >= n;
    typeset(list);
  }

  function showMore() {
    var start = Math.min(state.results.length, state.shown);
    state.shown += PAGE;
    var end = Math.min(state.results.length, state.shown);
    var frag = document.createDocumentFragment();
    var added = [];
    for (var i = start; i < end; i++) {
      var li = renderItem(state.results[i]);
      added.push(li);
      frag.appendChild(li);
    }
    list.appendChild(frag);
    moreButton.hidden = end >= state.results.length;
    added.forEach(typeset);
  }

  function updateUrl() {
    var params = [];
    if (state.query) params.push("q=" + encodeURIComponent(state.query));
    if (state.group !== "all") params.push("type=" + state.group);
    var url = window.location.pathname + (params.length ? "?" + params.join("&") : "");
    try { window.history.replaceState(null, "", url); } catch (e) {}
  }

  function buildFilters() {
    GROUPS.forEach(function (g) {
      var b = el("button", "filter", g.label);
      b.type = "button";
      b.setAttribute("data-group", g.id);
      b.setAttribute("aria-pressed", g.id === state.group ? "true" : "false");
      b.addEventListener("click", function () {
        state.group = g.id;
        Array.prototype.forEach.call(filterBar.querySelectorAll("button"), function (x) {
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        updateUrl();
        search();
      });
      filterBar.appendChild(b);
    });
  }

  function readUrl() {
    var params = {};
    window.location.search.replace(/^\?/, "").split("&").forEach(function (pair) {
      if (!pair) return;
      var kv = pair.split("=");
      params[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
    });
    state.query = params.q || "";
    state.group = groupOf(params.type || "all").id;
  }

  readUrl();
  buildFilters();
  input.value = state.query;
  var headerInput = document.getElementById("search-input");
  if (headerInput) headerInput.value = state.query;

  var timer = null;
  input.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      state.query = input.value;
      updateUrl();
      search();
    }, 180);
  });
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearTimeout(timer);
      state.query = input.value;
      updateUrl();
      search();
    });
  }
  moreButton.addEventListener("click", showMore);
  search();
  input.focus();
})();
