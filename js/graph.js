(function () {
  "use strict";

  // The dependency graph of graph.html. deps.js defines HODGE_DEPS:
  //   kinds    names of the numbered environments
  //   chapters [number, title, slug]
  //   pages    file names of the pages of the site
  //   items    [label, tag, kind, number, name, chapter, page], in book order
  //   uses     for each item, the items its statement and proof refer to
  // The page shows, for one item, what it uses (its prerequisites, drawn to
  // the left) or what uses it (drawn to the right), to a chosen depth.

  var data = window.HODGE_DEPS;
  var status = document.getElementById("graph-status");
  var body = document.getElementById("graph-body");
  var titleEl = document.getElementById("graph-title");
  if (!data) {
    status.textContent = "The dependency data could not be loaded.";
    return;
  }

  var items = data.items;
  var uses = data.uses;
  var usedBy = items.map(function () { return []; });
  uses.forEach(function (list, i) {
    list.forEach(function (j) { usedBy[j].push(i); });
  });
  var byTag = {};
  var byLabel = {};
  items.forEach(function (item, i) {
    if (item[1]) byTag[item[1]] = i;
    byLabel[item[0]] = i;
  });

  var MAX_NODES = 250;
  var COLUMN = 270;
  var NODE = 230;
  var GAP = 14;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function kindName(i) {
    var kind = data.kinds[items[i][2]];
    return kind.charAt(0).toUpperCase() + kind.slice(1);
  }

  function heading(i) {
    return kindName(i) + " " + items[i][3];
  }

  function urlOf(i) {
    return data.pages[items[i][6]] + "#" + items[i][0];
  }

  function graphUrl(i, dir, depth) {
    return "graph.html?tag=" + encodeURIComponent(items[i][1]) + "&dir=" + dir + "&depth=" + depth;
  }

  function chapterColor(i) {
    var c = items[i][5];
    return "hsl(" + ((c * 47) % 360) + ", 55%, " + [48, 36, 60][c % 3] + "%)";
  }

  function chapterTitle(c) {
    var chapter = data.chapters[c];
    return chapter ? chapter[0] + ". " + chapter[1] : "";
  }

  function tagLink(i) {
    var a = el("a", "tag", items[i][1]);
    a.href = "tag/" + items[i][1] + ".html";
    a.title = "Permanent link: tag " + items[i][1];
    return a;
  }

  // An entry of a list: "Theorem 12.3.4 (Name)", linked to the statement,
  // with its tag and a link to its own graph.
  function entry(i, dir, depth) {
    var li = el("li", "graph-entry kind-" + data.kinds[items[i][2]]);
    li.style.setProperty("--chap", chapterColor(i));
    var a = el("a", "graph-entry-title");
    a.href = urlOf(i);
    a.appendChild(el("span", "result-title", heading(i)));
    if (items[i][4]) a.appendChild(el("span", "result-name", " (" + items[i][4] + ")"));
    li.appendChild(a);
    li.appendChild(document.createTextNode(" "));
    li.appendChild(tagLink(i));
    var g = el("a", "graph-entry-graph", "graph");
    g.href = graphUrl(i, dir, depth);
    g.title = "Dependencies of this statement";
    li.appendChild(g);
    li.appendChild(el("div", "result-where", chapterTitle(items[i][5])));
    return li;
  }

  // Breadth-first search from start along adj; returns item -> distance.
  function levels(start, adj, maxDepth) {
    var level = {};
    level[start] = 0;
    var queue = [start];
    for (var k = 0; k < queue.length; k++) {
      var u = queue[k];
      if (level[u] >= maxDepth) continue;
      adj[u].forEach(function (v) {
        if (!(v in level)) {
          level[v] = level[u] + 1;
          queue.push(v);
        }
      });
    }
    return level;
  }

  function count(level) {
    return Object.keys(level).length - 1;
  }

  function typeset(node, then) {
    if (window.MathJax && MathJax.Hub) {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, node], then || function () {});
    } else if (then) {
      then();
    }
  }

  // The statement itself, fetched from its page as in the previews of site.js.
  function showStatement(i, container) {
    fetch(data.pages[items[i][6]]).then(function (response) {
      if (!response.ok) throw new Error(response.status);
      return response.text();
    }).then(function (text) {
      var doc = new DOMParser().parseFromString(text, "text/html");
      var target = doc.getElementById(items[i][0]);
      if (!target) return;
      var wrapper = target.closest("div[class*='_thmwrapper']") || target;
      var copy = wrapper.cloneNode(true);
      Array.prototype.forEach.call(copy.querySelectorAll("[id], [name]"), function (node) {
        node.removeAttribute("id");
        node.removeAttribute("name");
      });
      Array.prototype.forEach.call(copy.querySelectorAll(".graph-link"), function (node) {
        node.parentNode.removeChild(node);
      });
      container.appendChild(copy);
      typeset(container);
    }).catch(function () {});
  }

  // ------------------------------------------------------------ overview page

  function overview() {
    titleEl.textContent = "Dependencies";
    status.textContent = "";
    var intro = el("p", "graph-intro");
    intro.innerHTML = "Every numbered statement of the project depends on the statements that its "
      + "statement and its proof refer to. Enter a tag above, or follow the graph icon next to the tag "
      + "of a statement, to see what it uses and what uses it. Only the references written in the text "
      + "are counted, so a result used without being cited does not appear.";
    body.appendChild(intro);
    var edges = uses.reduce(function (s, list) { return s + list.length; }, 0);
    body.appendChild(el("p", "graph-status", items.length + " statements, " + edges + " dependencies."));

    var ranked = items.map(function (_, i) { return i; })
      .filter(function (i) { return usedBy[i].length > 0; })
      .sort(function (a, b) { return usedBy[b].length - usedBy[a].length || a - b; })
      .slice(0, 40);
    body.appendChild(el("h2", "graph-h2", "The most used statements"));
    var list = el("ol", "graph-list");
    ranked.forEach(function (i) {
      var li = entry(i, "usedby", 1);
      li.querySelector(".result-where").textContent += " — used directly by " + usedBy[i].length;
      list.appendChild(li);
    });
    body.appendChild(list);
    typeset(body);
  }

  // ------------------------------------------------------------ one statement

  function controls(i, dir, depth) {
    var bar = el("div", "graph-controls");
    var group = el("div", "search-filters");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "Direction");
    [["uses", "What it uses"], ["usedby", "What uses it"]].forEach(function (pair) {
      var a = el("a", "filter", pair[1]);
      a.href = graphUrl(i, pair[0], depth);
      a.setAttribute("aria-pressed", pair[0] === dir ? "true" : "false");
      group.appendChild(a);
    });
    bar.appendChild(group);
    var depths = el("div", "search-filters");
    depths.setAttribute("role", "group");
    depths.setAttribute("aria-label", "Depth");
    depths.appendChild(el("span", "graph-label", "Depth"));
    ["1", "2", "3", "4", "all"].forEach(function (d) {
      var a = el("a", "filter", d === "all" ? "All" : d);
      a.href = graphUrl(i, dir, d);
      a.setAttribute("aria-pressed", String(depth) === d ? "true" : "false");
      depths.appendChild(a);
    });
    bar.appendChild(depths);
    return bar;
  }

  function draw(i, dir, depth, canvasWrap, note) {
    var adj = dir === "uses" ? uses : usedBy;
    var maxDepth = depth === "all" ? Infinity : parseInt(depth, 10);
    var level = levels(i, adj, maxDepth);
    // Keep whole levels while the drawing stays readable.
    var perLevel = [];
    Object.keys(level).forEach(function (k) {
      var l = level[k];
      perLevel[l] = (perLevel[l] || 0) + 1;
    });
    var shown = 0;
    var deepest = 0;
    for (var l = 0; l < perLevel.length; l++) {
      if (l > 0 && shown + perLevel[l] > MAX_NODES) break;
      shown += perLevel[l];
      deepest = l;
    }
    if (deepest < perLevel.length - 1) {
      note.textContent = "Only the first " + deepest + " level" + (deepest === 1 ? "" : "s")
        + " are drawn (" + shown + " statements); the lists below and a smaller depth give the rest.";
    }
    var nodes = Object.keys(level).map(Number).filter(function (k) { return level[k] <= deepest; });
    if (nodes.length === 1) {
      canvasWrap.appendChild(el("p", "graph-status", dir === "uses"
        ? "This statement does not refer to other numbered statements."
        : "No numbered statement refers to this one."));
      return;
    }
    var columns = [];
    nodes.forEach(function (k) {
      var c = dir === "uses" ? deepest - level[k] : level[k];
      (columns[c] = columns[c] || []).push(k);
    });
    columns.forEach(function (col) { col.sort(function (a, b) { return a - b; }); });

    var canvas = el("div", "graph-canvas");
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "graph-edges");
    svg.setAttribute("aria-hidden", "true");
    var defs = document.createElementNS(svgNS, "defs");
    var marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute("id", "graph-arrow");
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "9");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "7");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("orient", "auto-start-reverse");
    var tip = document.createElementNS(svgNS, "path");
    tip.setAttribute("d", "M0 0 L10 5 L0 10 z");
    tip.setAttribute("class", "graph-arrow");
    marker.appendChild(tip);
    defs.appendChild(marker);
    svg.appendChild(defs);
    canvas.appendChild(svg);

    var box = {};
    columns.forEach(function (col, c) {
      col.forEach(function (k) {
        var node = el("div", "graph-node" + (k === i ? " main" : ""));
        node.style.left = (c * COLUMN) + "px";
        node.style.width = NODE + "px";
        node.style.setProperty("--chap", chapterColor(k));
        node.title = chapterTitle(items[k][5]);
        var a = el("a", "graph-node-title");
        a.href = urlOf(k);
        a.appendChild(el("span", "graph-node-kind", heading(k)));
        if (items[k][4]) a.appendChild(el("span", "graph-node-name", items[k][4]));
        node.appendChild(a);
        if (k !== i) {
          var g = el("a", "graph-node-graph", items[k][1]);
          g.href = graphUrl(k, dir, depth);
          g.title = "Show the graph of this statement";
          node.appendChild(g);
        }
        canvas.appendChild(node);
        box[k] = { node: node, column: c, edges: [] };
      });
    });
    canvasWrap.appendChild(canvas);

    typeset(canvas, function () {
      var height = 0;
      columns.forEach(function (col) {
        var y = 0;
        col.forEach(function (k) {
          box[k].node.style.top = y + "px";
          box[k].top = y;
          box[k].height = box[k].node.offsetHeight;
          y += box[k].height + GAP;
        });
        height = Math.max(height, y);
      });
      // Center the shorter columns vertically.
      columns.forEach(function (col) {
        var last = box[col[col.length - 1]];
        var shift = (height - (last.top + last.height + GAP)) / 2;
        col.forEach(function (k) {
          box[k].top += shift;
          box[k].node.style.top = box[k].top + "px";
        });
      });
      var width = columns.length * COLUMN - (COLUMN - NODE);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      svg.setAttribute("width", width);
      svg.setAttribute("height", height);
      svg.setAttribute("viewBox", "0 0 " + width + " " + height);

      // An arrow from each prerequisite to the statement that uses it.
      nodes.forEach(function (u) {
        uses[u].forEach(function (v) {
          if (!box[v]) return;
          var s = box[v];
          var t = box[u];
          var sy = s.top + s.height / 2;
          var ty = t.top + t.height / 2;
          var sx, tx, d;
          if (s.column < t.column) {
            sx = s.column * COLUMN + NODE;
            tx = t.column * COLUMN;
            d = "M" + sx + " " + sy + " C" + (sx + 40) + " " + sy + " " + (tx - 40) + " " + ty + " " + tx + " " + ty;
          } else if (s.column > t.column) {
            sx = s.column * COLUMN;
            tx = t.column * COLUMN + NODE;
            d = "M" + sx + " " + sy + " C" + (sx - 40) + " " + sy + " " + (tx + 40) + " " + ty + " " + tx + " " + ty;
          } else {
            sx = tx = s.column * COLUMN + NODE;
            var bulge = sx + 24 + Math.min(40, Math.abs(ty - sy) / 6);
            d = "M" + sx + " " + sy + " C" + bulge + " " + sy + " " + bulge + " " + ty + " " + tx + " " + ty;
          }
          var path = document.createElementNS(svgNS, "path");
          path.setAttribute("d", d);
          path.setAttribute("class", "graph-edge");
          path.setAttribute("marker-end", "url(#graph-arrow)");
          svg.appendChild(path);
          s.edges.push(path);
          t.edges.push(path);
        });
      });

      // Resting on a statement highlights its arrows.
      nodes.forEach(function (k) {
        var on = function () {
          canvas.classList.add("focus");
          box[k].node.classList.add("hl");
          box[k].edges.forEach(function (p) { p.classList.add("hl"); });
        };
        var off = function () {
          canvas.classList.remove("focus");
          box[k].node.classList.remove("hl");
          box[k].edges.forEach(function (p) { p.classList.remove("hl"); });
        };
        box[k].node.addEventListener("mouseenter", on);
        box[k].node.addEventListener("mouseleave", off);
        box[k].node.addEventListener("focusin", on);
        box[k].node.addEventListener("focusout", off);
      });

      // Start with the statement itself in view.
      var main = box[i];
      canvasWrap.scrollLeft = main.column * COLUMN + NODE / 2 - canvasWrap.clientWidth / 2;
      canvasWrap.scrollTop = main.top + main.height / 2 - canvasWrap.clientHeight / 2;
    });

    // Legend: the chapters involved.
    var seen = {};
    var legend = el("ul", "graph-legend");
    nodes.slice().sort(function (a, b) { return items[a][5] - items[b][5]; }).forEach(function (k) {
      var c = items[k][5];
      if (seen[c]) return;
      seen[c] = true;
      var li = el("li", "", chapterTitle(c));
      li.style.setProperty("--chap", chapterColor(k));
      legend.appendChild(li);
    });
    canvasWrap.parentNode.appendChild(legend);
  }

  function statementPage(i, dir, depth) {
    titleEl.textContent = "Dependencies of tag " + items[i][1];
    document.title = "Dependencies of tag " + items[i][1] + " - The Hodge Project";
    status.textContent = "";

    var statement = el("div", "graph-statement main-text");
    body.appendChild(statement);
    showStatement(i, statement);

    var allUses = levels(i, uses, Infinity);
    var allUsedBy = levels(i, usedBy, Infinity);
    var summary = el("p", "graph-summary");
    var plural = function (n) { return n + " statement" + (n === 1 ? "" : "s"); };
    summary.textContent = "Its statement and proof refer to " + plural(uses[i].length)
      + "; following their proofs back, " + heading(i) + " depends on " + plural(count(allUses))
      + " in all. Conversely, " + plural(usedBy[i].length) + " refer" + (usedBy[i].length === 1 ? "s" : "")
      + " to it, and " + plural(count(allUsedBy)) + " depend" + (count(allUsedBy) === 1 ? "s" : "")
      + " on it in all.";
    body.appendChild(summary);
    body.appendChild(controls(i, dir, depth));

    var note = el("p", "graph-status");
    body.appendChild(note);
    var figure = el("div", "graph-figure");
    var scroll = el("div", "graph-scroll");
    figure.appendChild(scroll);
    body.appendChild(figure);
    draw(i, dir, depth, scroll, note);

    var lists = el("div", "graph-lists");
    [["What it uses directly", uses[i]], ["What uses it directly", usedBy[i]]].forEach(function (pair) {
      var section = el("section");
      section.appendChild(el("h2", "graph-h2", pair[0] + " (" + pair[1].length + ")"));
      if (pair[1].length) {
        var list = el("ul", "graph-list");
        pair[1].slice().sort(function (a, b) { return a - b; }).forEach(function (k) {
          list.appendChild(entry(k, dir, depth));
        });
        section.appendChild(list);
      } else {
        section.appendChild(el("p", "graph-status", "None."));
      }
      lists.appendChild(section);
    });
    body.appendChild(lists);
    typeset(summary);
    typeset(lists);
  }

  var params = new URLSearchParams(window.location.search);
  var tag = (params.get("tag") || "").trim().toUpperCase();
  var label = params.get("label");
  var dir = params.get("dir") === "usedby" ? "usedby" : "uses";
  var depth = params.get("depth") || "2";
  if (depth !== "all" && !(parseInt(depth, 10) >= 1)) depth = "2";
  var input = document.getElementById("graph-input");
  if (input && tag) input.value = tag;

  var index = tag ? byTag[tag] : (label ? byLabel[label] : undefined);
  if (index !== undefined) {
    statementPage(index, dir, depth);
  } else if (tag || label) {
    titleEl.textContent = "Dependencies";
    status.innerHTML = "";
    status.appendChild(document.createTextNode("Dependencies are recorded for numbered statements; "));
    var link = el("a", "", "tag " + (tag || label));
    link.href = tag ? "tag/" + tag + ".html" : "search.html?q=" + encodeURIComponent(label);
    status.appendChild(link);
    status.appendChild(document.createTextNode(" is not one of them, or does not exist."));
  } else {
    overview();
  }
})();
