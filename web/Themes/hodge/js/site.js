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
