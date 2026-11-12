/**
 * theme-init.js
 * ---------------------------------------------------------------------------
 * Runs before the first paint (loaded synchronously in <head> so it is NOT
 * deferred) to apply the visitor's saved colour scheme. This is what stops the
 * page flashing the wrong theme, so it must stay tiny and dependency-free.
 *
 * It also flags the document as script-enabled with `html.js`, which enables
 * the one-time hero type entrance; the page remains readable without JavaScript.
 */
(function () {
  "use strict";

  var root = document.documentElement;

  // Enables the restrained hero type entrance (CSS: `.js .hero__word`).
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
