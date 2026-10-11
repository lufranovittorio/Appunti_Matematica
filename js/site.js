(function () {
  "use strict";

  var root = document.documentElement;

  // Light/dark theme. The choice is remembered in this browser when storage
  // is available; otherwise the operating system preference is used.
  var themeButton = document.getElementById("theme-toggle");
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var explicit = root.getAttribute("data-theme");
      var dark = explicit
        ? explicit === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = dark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("hodge-theme", next); } catch (e) {}
    });
  }

  // Table of contents drawer on narrow screens.
  var tocButton = document.getElementById("toc-toggle");
  function setTocOpen(open) {
    document.body.classList.toggle("toc-open", open);
    if (tocButton) tocButton.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (tocButton) {
    tocButton.addEventListener("click", function () {
      setTocOpen(!document.body.classList.contains("toc-open"));
    });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setTocOpen(false);
  });

  // Keep the current page visible in the sidebar.
  var toc = document.getElementById("site-toc");
  var current = toc && toc.querySelector("li.current > a");
  if (current) {
    toc.scrollTop = current.offsetTop - toc.clientHeight / 3;
  }

  // Collapsible proofs.
  Array.prototype.forEach.call(document.querySelectorAll(".proof_heading"), function (heading) {
    heading.setAttribute("role", "button");
    heading.setAttribute("tabindex", "0");
    heading.setAttribute("aria-expanded", "true");
    function toggle() {
      var collapsed = heading.parentNode.classList.toggle("collapsed");
      heading.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }
    heading.addEventListener("click", toggle);
    heading.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  });

  // Previews of references. Resting the pointer on a link to a numbered
  // statement, an equation, a section or a bibliography entry shows the
  // target in a box, fetched from its page (every page lives at the root of
  // the site) and typeset by MathJax. With a mouse the box appears on hover;
  // on touch screens the first tap on a reference opens it as a panel at the
  // bottom of the screen, with a link to the target, and a second tap on the
  // same reference follows it. Links inside a preview are not previewed again.
  var article = document.querySelector(".main-text");
  var canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (article && window.DOMParser) {
    var pages = {};
    var box = null;
    var activeLink = null;
    var showTimer = null;
    var hideTimer = null;

    var targetOf = function (link) {
      if (link.classList.contains("tag")) return null;
      var href = link.getAttribute("href");
      if (!href || href.indexOf("#") < 0) return null;
      var url;
      try { url = new URL(href, window.location.href); } catch (e) { return null; }
      if (url.origin !== window.location.origin || !/\.html$/.test(url.pathname) || url.hash.length < 2) return null;
      return { page: url.pathname, id: decodeURIComponent(url.hash.slice(1)) };
    };

    var loadPage = function (path) {
      if (!pages[path]) {
        pages[path] = fetch(path).then(function (response) {
          if (!response.ok) throw new Error(response.status);
          return response.text();
        }).then(function (text) {
          return new DOMParser().parseFromString(text, "text/html");
        });
        pages[path].catch(function () { delete pages[path]; });
      }
      return pages[path];
    };

    // The piece of the target page to show: the whole statement, the
    // equation, a heading with its first paragraphs, or a bibliography entry.
    var extract = function (doc, id) {
      var el = doc.getElementById(id);
      if (!el) {
        var named = doc.getElementsByName(id);
        el = named.length ? named[0] : null;
      }
      if (!el) return null;
      var out = document.createElement("div");
      var wrapper = el.closest("div[class*='_thmwrapper'], div.equation, div.displaymath");
      if (wrapper) {
        out.appendChild(wrapper.cloneNode(true));
      } else if (/^H[1-6]$/.test(el.tagName)) {
        out.appendChild(el.cloneNode(true));
        var paragraphs = 0;
        for (var next = el.nextElementSibling; next && paragraphs < 2; next = next.nextElementSibling) {
          if (/^H[1-6]$/.test(next.tagName) || /_thmwrapper|proof_wrapper/.test(next.className)) break;
          out.appendChild(next.cloneNode(true));
          if (next.tagName === "P") paragraphs++;
        }
      } else if (el.parentNode && el.parentNode.tagName === "DT") {
        var list = document.createElement("dl");
        list.className = "bibliography";
        list.appendChild(el.parentNode.cloneNode(true));
        if (el.parentNode.nextElementSibling) list.appendChild(el.parentNode.nextElementSibling.cloneNode(true));
        out.appendChild(list);
      } else {
        out.appendChild(el.cloneNode(true));
      }
      Array.prototype.forEach.call(out.querySelectorAll("[id], [name]"), function (node) {
        node.removeAttribute("id");
        node.removeAttribute("name");
      });
      return out;
    };

    var place = function (link) {
      if (!canHover) return;
      var rect = link.getBoundingClientRect();
      var width = box.offsetWidth;
      var height = box.offsetHeight;
      var left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8);
      var below = window.innerHeight - rect.bottom;
      var top = (below >= height + 12 || below >= rect.top) ? rect.bottom + 6 : rect.top - height - 6;
      box.style.left = (left + window.pageXOffset) + "px";
      box.style.top = (top + window.pageYOffset) + "px";
    };

    var hide = function () {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      activeLink = null;
      if (box) box.hidden = true;
    };

    var scheduleHide = function () {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hide, 250);
    };

    var show = function (link) {
      var target = targetOf(link);
      if (!target) return;
      activeLink = link;
      loadPage(target.page).then(function (doc) {
        if (activeLink !== link) return;
        var content = extract(doc, target.id);
        if (!content) {
          if (!canHover) window.location.href = link.href;
          return;
        }
        if (!box) {
          box = document.createElement("div");
          box.className = canHover ? "preview-box main-text" : "preview-box preview-sheet main-text";
          box.setAttribute("role", canHover ? "tooltip" : "dialog");
          box.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
          box.addEventListener("mouseleave", function () { if (canHover) scheduleHide(); });
          document.body.appendChild(box);
        }
        box.innerHTML = "";
        if (!canHover) {
          var bar = document.createElement("div");
          bar.className = "preview-bar";
          var open = document.createElement("a");
          open.href = link.href;
          open.textContent = "Open \u2192";
          var close = document.createElement("button");
          close.type = "button";
          close.className = "preview-close";
          close.setAttribute("aria-label", "Close the preview");
          close.textContent = "\u00d7";
          close.addEventListener("click", hide);
          bar.appendChild(open);
          bar.appendChild(close);
          box.appendChild(bar);
        }
        box.appendChild(content);
        box.style.visibility = "hidden";
        box.hidden = false;
        place(link);
        var reveal = function () {
          if (activeLink !== link) return;
          place(link);
          box.style.visibility = "";
        };
        if (window.MathJax && MathJax.Hub) {
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, box], reveal);
        } else {
          reveal();
        }
      }, function () {});
    };

    var linkFrom = function (node) {
      var link = node && node.closest ? node.closest("a[href]") : null;
      return link && article.contains(link) && targetOf(link) ? link : null;
    };

    if (!canHover) {
      article.addEventListener("click", function (event) {
        var link = linkFrom(event.target);
        if (!link || (link === activeLink && box && !box.hidden)) return;
        event.preventDefault();
        show(link);
      });
      document.addEventListener("click", function (event) {
        if (box && !box.hidden && !box.contains(event.target) && !linkFrom(event.target)) hide();
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") hide();
      });
    }
    if (canHover) {
    article.addEventListener("mouseover", function (event) {
      var link = linkFrom(event.target);
      if (!link) return;
      clearTimeout(hideTimer);
      if (link === activeLink) return;
      clearTimeout(showTimer);
      showTimer = setTimeout(function () { show(link); }, 300);
    });
    article.addEventListener("mouseout", function (event) {
      var link = linkFrom(event.target);
      if (!link || (event.relatedTarget && link.contains(event.relatedTarget))) return;
      clearTimeout(showTimer);
      if (link === activeLink) scheduleHide();
    });
    article.addEventListener("focusin", function (event) {
      var link = linkFrom(event.target);
      if (link) {
        clearTimeout(showTimer);
        showTimer = setTimeout(function () { show(link); }, 300);
      }
    });
    article.addEventListener("focusout", function () { scheduleHide(); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") hide();
    });
    window.addEventListener("resize", hide);
    }
  }

  // "Chapter PDF": on the pages of a chapter, a header link to print.html,
  // which collects the chapter and opens the print dialog.
  var pdfLink = document.querySelector('.site-header a.header-link[href="book.pdf"]');
  var page = window.location.pathname.split("/").pop().replace(/\.html$/, "");
  var heading = document.querySelector(".main-text h1[id]");
  var chapter = page.indexOf("-section-") > 0 ? page.split("-section-")[0]
    : (heading && heading.id === page ? page : null);
  if (pdfLink && chapter) {
    var chapterLink = document.createElement("a");
    chapterLink.className = "header-link";
    chapterLink.href = "print.html?chapter=" + encodeURIComponent(chapter);
    chapterLink.textContent = "Chapter PDF";
    chapterLink.title = "Collect this chapter in one page and print it or save it as a PDF";
    pdfLink.parentNode.insertBefore(chapterLink, pdfLink);
    pdfLink.title = "The whole book as a PDF";
  }

  // Search box. A four-character tag (tags start with a digit) goes straight
  // to its item; anything else is looked up on search.html, which the form
  // also reaches without JavaScript. Every page lives at the root of the site.
  // Pressing "/" moves the focus to the box.
  var form = document.getElementById("site-search");
  if (form) {
    var searchInput = form.querySelector("input");
    form.addEventListener("submit", function (event) {
      var query = searchInput.value.trim();
      if (!query) {
        event.preventDefault();
        return;
      }
      if (/^[0-9][0-9A-Z]{3}$/i.test(query)) {
        event.preventDefault();
        window.location.href = "tag/" + query.toUpperCase() + ".html";
      }
    });
    document.addEventListener("keydown", function (event) {
      var active = document.activeElement;
      if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey &&
          !(active && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName))) {
        event.preventDefault();
        searchInput.focus();
      }
    });
  }
})();
