// print.html?chapter=<slug>: collects the pages of one chapter into a single
// page, typesets it, and opens the browser's print dialog, from which the
// chapter can be saved as a PDF. Nothing is compiled on a server: the site is
// static, and the pages are those already published.
(function () {
  "use strict";

  var status = document.getElementById("print-status");
  var body = document.getElementById("print-body");
  var button = document.getElementById("print-button");
  var slug = new URLSearchParams(window.location.search).get("chapter") || "";

  function fail(message) {
    status.textContent = message;
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    fail("No chapter was given. Open this page from the “Chapter PDF” link of a chapter.");
    return;
  }

  function load(path) {
    return fetch(path).then(function (response) {
      if (!response.ok) throw new Error(path + ": " + response.status);
      return response.text();
    }).then(function (text) {
      return new DOMParser().parseFromString(text, "text/html");
    });
  }

  function article(doc) {
    var main = doc.querySelector("article.main-text");
    var part = document.createElement("section");
    part.className = "print-part";
    if (main) {
      Array.prototype.forEach.call(main.childNodes, function (node) {
        part.appendChild(document.importNode(node, true));
      });
    }
    return part;
  }

  load(slug + ".html").then(function (chapter) {
    var title = chapter.querySelector("article.main-text h1");
    if (title) {
      title = title.cloneNode(true);
      Array.prototype.forEach.call(title.querySelectorAll(".tag"), function (tag) { tag.remove(); });
      document.title = title.textContent.replace(/\s+/g, " ").trim() + " - The Hodge Project";
    }
    var pages = [];
    Array.prototype.forEach.call(chapter.querySelectorAll("nav.local-toc a[href]"), function (link) {
      var href = link.getAttribute("href");
      if (href.indexOf(slug + "-section-") === 0 && pages.indexOf(href) < 0) pages.push(href);
    });
    body.appendChild(article(chapter));
    status.textContent = "Loading " + pages.length + " sections…";
    return Promise.all(pages.map(load)).then(function (docs) {
      docs.forEach(function (doc) { body.appendChild(article(doc)); });
    });
  }).then(function () {
    status.textContent = "Typesetting the formulas…";
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, body], function () {
      status.textContent = "Ready. Use “Print or save as PDF” and choose “Save as PDF” as the printer.";
      button.hidden = false;
      window.print();
    });
  }).catch(function (error) {
    fail("The chapter could not be loaded (" + error.message + ").");
  });

  button.addEventListener("click", function () { window.print(); });
})();
