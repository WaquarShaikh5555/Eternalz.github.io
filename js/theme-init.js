/**
 * theme-init.js
 * ---------------------------------------------------------------------------
 * Runs before the first paint (loaded synchronously in <head> so it is NOT
 * deferred) to apply the visitor's saved colour scheme. This is what stops the
 * page flashing the wrong theme, so it must stay tiny and dependency-free.
 *
 * It also flags the document as script-enabled with `html.js`, which is what
 * arms the scroll-reveal CSS: if JavaScript never runs, nothing is ever hidden.
 */
(function () {
  "use strict";

  var root = document.documentElement;

  // Enables the reveal animations (CSS: `.js [data-reveal]`).
  root.classList.add("js");

  try {
    var saved = window.localStorage.getItem("theme");
    // Only "light" is honoured explicitly; "dark" and "system" follow the CSS
    // default, which already reacts to prefers-color-scheme.
    if (saved === "light" || saved === "dark") {
      root.setAttribute("data-theme", saved);
    }
  } catch (error) {
    // Storage can be blocked (private mode, hardened settings) - the default
    // theme and the prefers-color-scheme fallback are perfectly fine.
  }
})();
