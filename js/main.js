/* Bicoastal Bus — site script. No dependencies.
   Everything here is progressive enhancement: the pages work without it. */

(function () {
  "use strict";

  // Lets the CSS know scripting is available (see `html:not(.js)` rules).
  document.documentElement.classList.add("js");

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset when the viewport grows past the mobile breakpoint (56em in CSS).
    window.matchMedia("(min-width: 56em)").addEventListener("change", function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* ---- Menu tabs (menus.html) ------------------------------------------- */
  var tablist = document.querySelector('[role="tablist"]');

  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));

    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var active = t === tab;
        t.setAttribute("aria-selected", String(active));
        t.tabIndex = active ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
      });
      if (focus) tab.focus();
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });

    // Deep link support: menus.html#brunch opens the Brunch tab.
    var initial = tabs.filter(function (t) {
      return "#" + t.getAttribute("aria-controls") === window.location.hash;
    })[0];
    select(initial || tabs[0]);
  }

  /* ---- Inquiry form (contact.html) -------------------------------------- */
  var form = document.querySelector("[data-inquiry-form]");

  if (form) {
    // Date can't be in the past.
    var date = form.querySelector('input[type="date"]');
    if (date) date.min = new Date().toISOString().slice(0, 10);

    // Preselect Events or Delivered from the link that brought the visitor
    // here: contact.html?type=event or contact.html?type=delivered
    var type = new URLSearchParams(window.location.search).get("type");
    var radio = type && form.querySelector('input[name="type"][value="' + type.replace(/[^a-z]/g, "") + '"]');
    if (radio) radio.checked = true;

    // Native validation handles required fields. This only guards against
    // submitting before a real endpoint is wired up — delete once it is.
    form.addEventListener("submit", function (e) {
      if (form.getAttribute("action") === "#") {
        e.preventDefault();
        form.querySelector(".form-status").textContent =
          "This form isn't connected yet. Set the form's action attribute in contact.html to your form endpoint.";
      }
    });
  }

  /* ---- Footer year ------------------------------------------------------ */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
