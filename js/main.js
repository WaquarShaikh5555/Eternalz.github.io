/**
 * main.js
 * ---------------------------------------------------------------------------
 * All interactive behaviour for the portfolio, in plain JavaScript:
 *
 *   1.  Theme toggle (light / dark, remembered in localStorage)
 *   2.  Mobile navigation (full-screen overlay, focus trap, Escape, scroll lock)
 *   3.  Sticky header, scroll spy and the sliding navigation indicator
 *   4.  Scroll reveal via IntersectionObserver
 *   5.  Smooth in-page scrolling that honours reduced-motion
 *   6.  Footer year + back-to-top control
 *   7.  Contact form: validation, honeypot check, AJAX submission
 *   8.  Copy-to-clipboard (Discord username)
 *   9.  Pointer-reactive layer: hero spotlight, magnetic controls, project
 *       plate tilt + cursor chip, ghost-numeral parallax, reading progress
 *
 * Everything in 9 is an enhancement layered on top of a page that already
 * works without it: each guard checks for the element, for a fine pointer and
 * for the visitor's motion preference before doing anything at all.
 *
 * Progressive enhancement throughout: with JavaScript disabled the site still
 * renders, navigates and submits the form (plain POST to Formspree).
 */
(function () {
  "use strict";

  var root = document.documentElement;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  function get(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function getAll(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /** localStorage that never throws (private mode, storage disabled). */
  var store = {
    read: function (key) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        return null;
      }
    },
    write: function (key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        /* Nothing to do - the theme simply will not persist. */
      }
    }
  };

  /** Effects are only worth running for a fine pointer with motion allowed. */
  function motionOK() {
    return !reduceMotion.matches && finePointer.matches;
  }

  /* ========================================================================
     1. Theme toggle
     ======================================================================== */
  function initTheme() {
    var toggle = get("#theme-toggle");
    if (!toggle) {
      return;
    }

    var systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)");
    var metaThemeColor = get('meta[name="theme-color"]:not([media])');

    function currentTheme() {
      var saved = root.getAttribute("data-theme");
      if (saved === "light" || saved === "dark") {
        return saved;
      }
      return systemPrefersLight.matches ? "light" : "dark";
    }

    function apply(theme, persist) {
      root.setAttribute("data-theme", theme);

      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", theme === "light" ? "#efe9dc" : "#0f0f0c");
      }

      var label = theme === "light" ? "Switch to dark theme" : "Switch to light theme";
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
      toggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");

      if (persist) {
        store.write("theme", theme);
      }
    }

    apply(currentTheme(), false);

    toggle.addEventListener("click", function () {
      apply(currentTheme() === "light" ? "dark" : "light", true);
    });

    var onSystemChange = function (event) {
      if (!store.read("theme")) {
        apply(event.matches ? "light" : "dark", false);
      }
    };

    if (typeof systemPrefersLight.addEventListener === "function") {
      systemPrefersLight.addEventListener("change", onSystemChange);
    } else if (typeof systemPrefersLight.addListener === "function") {
      systemPrefersLight.addListener(onSystemChange);
    }
  }

  /* ========================================================================
     2. Mobile navigation
     ======================================================================== */
  function initNavigation() {
    var header = get("#site-header");
    var toggle = get("#nav-toggle");
    var nav = get("#site-nav");

    if (!header || !toggle || !nav) {
      return;
    }

    var links = getAll(".site-nav__link", nav);
    var desktop = window.matchMedia("(min-width: 900px)");

    function isOpen() {
      return toggle.getAttribute("aria-expanded") === "true";
    }

    function open() {
      nav.classList.add("is-open");
      header.classList.add("is-nav-open");
      document.body.classList.add("is-nav-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation menu");
    }

    function close(returnFocus) {
      nav.classList.remove("is-open");
      header.classList.remove("is-nav-open");
      document.body.classList.remove("is-nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");

      if (returnFocus) {
        toggle.focus();
      }
    }

    toggle.addEventListener("click", function () {
      if (isOpen()) {
        close(true);
      } else {
        open();
      }
    });

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        if (isOpen()) {
          close(false);
        }
      });
    });

    document.addEventListener("keydown", function (event) {
      if (!isOpen() || desktop.matches) {
        return;
      }

      if (event.key === "Escape") {
        close(true);
        return;
      }

      if (event.key === "Tab") {
        var focusable = [toggle].concat(getAll("a[href]", nav));
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    document.addEventListener("click", function (event) {
      if (!isOpen() || desktop.matches) {
        return;
      }
      if (!header.contains(event.target)) {
        close(false);
      }
    });

    var onBreakpoint = function (event) {
      if (event.matches && isOpen()) {
        close(false);
      }
    };

    if (typeof desktop.addEventListener === "function") {
      desktop.addEventListener("change", onBreakpoint);
    } else if (typeof desktop.addListener === "function") {
      desktop.addListener(onBreakpoint);
    }
  }

  /* ========================================================================
     3. Sticky header, scroll spy, sliding indicator, progress, parallax
     ======================================================================== */
  function initScrollState() {
    var header = get("#site-header");
    var nav = get("#site-nav");
    var toTop = get("#to-top");
    var progress = get("#progress-bar");
    var indicator = get("#nav-indicator");
    var ghosts = getAll(".section__ghost");

    if (!header) {
      return;
    }

    var navLinks = getAll('.site-nav__link[href^="#"]', nav || document);
    var sections = navLinks
      .map(function (link) {
        return get(link.getAttribute("href"));
      })
      .filter(Boolean);

    var queued = null;

    /** Park the indicator under whichever link is current. */
    function positionIndicator(link) {
      if (!indicator || !nav) {
        return;
      }
      if (!link) {
        nav.classList.remove("has-active");
        return;
      }
      var navBox = nav.getBoundingClientRect();
      var box = link.getBoundingClientRect();
      indicator.style.setProperty("--ind-x", (box.left - navBox.left + nav.scrollLeft) + "px");
      indicator.style.setProperty("--ind-w", box.width + "px");
      nav.classList.add("has-active");
    }

    function update() {
      queued = null;

      // Matches the scroll target used by initSmoothScroll, plus 1px of slack
      // for sub-pixel rounding, so a clicked link always lights up.
      var offset = header.offsetHeight + 17;

      header.classList.toggle("is-stuck", window.scrollY > 8);

      if (toTop) {
        toTop.hidden = window.scrollY < 600;
      }

      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        progress.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
      }

      // Ghost numerals drift a little against the scroll for depth.
      if (ghosts.length && motionOK()) {
        var vh = window.innerHeight;
        ghosts.forEach(function (ghost) {
          var box = ghost.getBoundingClientRect();
          var descend = (box.top + box.height / 2 - vh / 2) / vh;
          ghost.style.setProperty("--ghost-shift", (descend * -34).toFixed(1) + "px");
        });
      }

      var active = "";
      var atBottom = window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atBottom) {
        active = sections.length ? "#" + sections[sections.length - 1].id : "";
      } else {
        sections.forEach(function (section) {
          if (section.getBoundingClientRect().top - offset <= 1) {
            active = "#" + section.id;
          }
        });
      }

      var activeLink = null;
      navLinks.forEach(function (link) {
        var isActive = link.getAttribute("href") === active;
        if (isActive) {
          link.setAttribute("aria-current", "true");
          activeLink = link;
        } else {
          link.removeAttribute("aria-current");
        }
      });

      positionIndicator(activeLink);
    }

    function schedule() {
      if (queued === null) {
        queued = window.requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // The indicator has to follow hover as well as scroll, so the header feels
    // like one object rather than five separate links.
    navLinks.forEach(function (link) {
      link.addEventListener("pointerenter", function () {
        positionIndicator(link);
      });
    });
    if (nav) {
      nav.addEventListener("pointerleave", function () {
        var current = get('.site-nav__link[aria-current="true"]', nav);
        positionIndicator(current);
      });
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(schedule);
    }

    update();

    var footer = get(".site-footer");
    if (toTop && footer && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          toTop.classList.toggle("is-suppressed", entry.isIntersecting);
        });
      }, { threshold: 0 }).observe(footer);
    }
  }

  /* ========================================================================
     4. Scroll reveal
     ======================================================================== */
  function initReveal() {
    var items = getAll("[data-reveal]");

    if (!items.length) {
      return;
    }

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        var element = entry.target;
        var siblings = element.parentElement
          ? getAll("[data-reveal]", element.parentElement)
          : [];
        var index = siblings.indexOf(element);

        // Brief stagger so grouped entries arrive in sequence rather than all
        // at once. Kept short - the motion must never hold content back.
        element.style.transitionDelay = Math.min(Math.max(index, 0), 3) * 45 + "ms";
        element.classList.add("is-visible");
        observer.unobserve(element);
      });
    }, {
      // threshold 0 with a shrunken root: the element reveals as soon as it is
      // meaningfully on screen, whatever its height.
      rootMargin: "0px 0px -12% 0px",
      threshold: 0
    });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ========================================================================
     5. Smooth in-page scrolling
     ======================================================================== */
  function initSmoothScroll() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;

      if (!link) {
        return;
      }

      var hash = link.getAttribute("href");
      if (!hash || hash === "#") {
        return;
      }

      var target = document.getElementById(hash.slice(1));
      if (!target) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }

      event.preventDefault();

      var header = get("#site-header");
      var offset = (header ? header.offsetHeight : 0) + 16;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: top < 0 ? 0 : top,
        behavior: reduceMotion.matches ? "auto" : "smooth"
      });

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", hash);
      }

      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });

      target.addEventListener("blur", function onBlur() {
        target.removeAttribute("tabindex");
        target.removeEventListener("blur", onBlur);
      });
    });
  }

  /* ========================================================================
     6. Footer year
     ======================================================================== */
  function initFooterMeta() {
    var year = get("#copyright-year");
    if (year) {
      year.textContent = String(new Date().getFullYear());
    }
  }

  /* ========================================================================
     7. Copy-to-clipboard (Discord username)
     ======================================================================== */
  function initCopyControls() {
    var buttons = getAll("[data-copy]");
    var status = get("#copy-status");
    var resetTimer = null;

    if (!buttons.length) {
      return;
    }

    function announce(message) {
      if (!status) {
        return;
      }
      status.textContent = message;
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(function () {
        status.textContent = "";
      }, 5000);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.getAttribute("data-copy");
        var label = button.getAttribute("data-copy-label") || "Text";
        if (!value) {
          return;
        }

        // The tick replaces the copy glyph for a moment, so the control itself
        // confirms the action rather than only the live region.
        button.classList.add("is-copied");
        window.setTimeout(function () {
          button.classList.remove("is-copied");
        }, 2000);

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(value).then(function () {
            announce(label + " copied to clipboard: " + value);
          }).catch(function () {
            announce(label + ": " + value);
          });
        } else {
          announce(label + " (copy manually): " + value);
        }
      });
    });
  }

  /* ========================================================================
     8. Contact form
     ======================================================================== */
  function initContactForm() {
    var form = get("#contact-form");
    if (!form) {
      return;
    }

    var status = get("#form-status", form);
    var submit = get("#submit-button", form);

    var rules = {
      name: {
        test: function (value) {
          return value.trim().length >= 2;
        },
        message: "Please enter your name (at least 2 characters)."
      },
      email: {
        test: function (value) {
          // Deliberately permissive: the server is the real authority.
          return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim());
        },
        message: "Please enter a valid email address."
      },
      message: {
        test: function (value) {
          return value.trim().length >= 20;
        },
        message: "Please write a message of at least 20 characters."
      }
    };

    function fieldOf(name) {
      var input = form.elements[name];
      return input ? input.closest(".field") : null;
    }

    function errorOf(name) {
      var field = fieldOf(name);
      return field ? get(".field__error", field) : null;
    }

    function setError(name, message) {
      var field = fieldOf(name);
      var error = errorOf(name);
      var input = form.elements[name];

      if (!field || !error || !input) {
        return;
      }

      field.classList.add("is-invalid");
      error.textContent = message;
      error.hidden = false;
      input.setAttribute("aria-invalid", "true");
    }

    function clearError(name) {
      var field = fieldOf(name);
      var error = errorOf(name);
      var input = form.elements[name];

      if (!field || !error || !input) {
        return;
      }

      field.classList.remove("is-invalid");
      error.hidden = true;
      input.removeAttribute("aria-invalid");
    }

    function validate(name) {
      var input = form.elements[name];
      var rule = rules[name];

      if (!input || !rule) {
        return true;
      }

      if (rule.test(input.value)) {
        clearError(name);
        return true;
      }

      setError(name, rule.message);
      return false;
    }

    function validateAll() {
      var invalid = Object.keys(rules).filter(function (name) {
        return !validate(name);
      });

      if (invalid.length) {
        var firstInvalid = form.elements[invalid[0]];
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }

      return invalid;
    }

    function showStatus(message, state) {
      if (!status) {
        return;
      }

      var text = get(".form-status__text", status);
      status.classList.remove("is-success", "is-error", "is-visible");

      if (!message) {
        return;
      }

      if (text) {
        text.textContent = message;
      }
      status.classList.add("is-visible", state === "success" ? "is-success" : "is-error");
    }

    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      if (!input) {
        return;
      }

      input.addEventListener("blur", function () {
        if (input.value.trim() !== "") {
          validate(name);
        }
      });

      input.addEventListener("input", function () {
        if (fieldOf(name) && fieldOf(name).classList.contains("is-invalid")) {
          validate(name);
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var honeypot = form.elements["_gotcha"];
      if (honeypot && honeypot.value !== "") {
        showStatus("Your message could not be sent. Please email waquarsk1@gmail.com instead.", "error");
        return;
      }

      if (validateAll().length) {
        showStatus("Please correct the highlighted fields and try again.", "error");
        return;
      }

      // A placeholder endpoint means the form is not wired up yet: say so
      // rather than posting into the void.
      if (form.getAttribute("action").indexOf("[FORMSPREE_ACTION_ID]") !== -1) {
        showStatus(
          "This form is ready to go - it just needs the Formspree form id in the action attribute. " +
          "Until then, please email waquarsk1@gmail.com.",
          "error"
        );
        return;
      }

      var label = submit ? get(".button__label", submit) : null;
      var originalLabel = label ? label.textContent : "";

      if (submit) {
        submit.disabled = true;
      }
      if (label) {
        label.textContent = "Sending…";
      }
      showStatus("", "");

      window.fetch(form.getAttribute("action"), {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (response) {
        if (!response.ok) {
          throw new Error("Request failed with status " + response.status);
        }

        form.reset();
        showStatus("Thanks - your message is on its way. I'll reply by email.", "success");
      }).catch(function () {
        showStatus(
          "Something went wrong while sending. Please try again, or email waquarsk1@gmail.com.",
          "error"
        );
      }).then(function () {
        if (submit) {
          submit.disabled = false;
        }
        if (label) {
          label.textContent = originalLabel;
        }
      });
    });
  }

  /* ========================================================================
     9. Pointer-reactive layer
     ======================================================================== */

  /** A warm light plus a slowly drifting grid, both following the pointer. */
  function initHeroField() {
    var hero = get(".hero");
    var field = get(".hero__field");
    if (!hero || !field || !motionOK()) {
      return;
    }

    var frame = null;
    var spot = get("#hero-spot");
    var grid = get(".hero__grid");

    hero.addEventListener("pointermove", function (event) {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(function () {
        frame = null;
        var box = hero.getBoundingClientRect();
        var x = event.clientX - box.left;
        var y = event.clientY - box.top;

        // Also lights on move, not only on enter, so the effect is never missed
        // by a pointer that was already inside when the listener attached.
        hero.classList.add("is-lit");

        if (spot) {
          spot.style.setProperty("--mx", x.toFixed(1) + "px");
          spot.style.setProperty("--my", y.toFixed(1) + "px");
        }

        if (grid) {
          // A few pixels of counter-drift: the grid feels like a surface
          // sitting slightly behind the page rather than a painted pattern.
          var gx = ((x / box.width) - 0.5) * -22;
          var gy = ((y / box.height) - 0.5) * -14;
          grid.style.setProperty("--gx", gx.toFixed(1) + "px");
          grid.style.setProperty("--gy", gy.toFixed(1) + "px");
        }
      });
    }, { passive: true });

    hero.addEventListener("pointerenter", function () {
      hero.classList.add("is-lit");
    });
    hero.addEventListener("pointerleave", function () {
      hero.classList.remove("is-lit");
    });
  }

  /** Controls that lean a few pixels toward the cursor. */
  function initMagnetic() {
    if (!motionOK()) {
      return;
    }

    var strength = 7;

    getAll("[data-magnetic]").forEach(function (el) {
      var frame = null;

      el.addEventListener("pointermove", function (event) {
        if (frame) {
          return;
        }
        frame = window.requestAnimationFrame(function () {
          frame = null;
          var box = el.getBoundingClientRect();
          var dx = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
          var dy = (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
          el.style.transform = "translate(" + (dx * strength).toFixed(2) + "px," + (dy * strength).toFixed(2) + "px)";
        });
      }, { passive: true });

      el.addEventListener("pointerleave", function () {
        el.style.transform = "";
      });
    });
  }

  /** Plates lean toward the pointer, and a chip rides along with the cursor. */
  function initPlates() {
    var plates = get("#plates");
    if (!plates) {
      return;
    }

    var chip = get("#plates-chip");

    if (!motionOK()) {
      return; // Static plates and no chip: nothing is lost.
    }

    var frame = null;

    plates.addEventListener("pointermove", function (event) {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(function () {
        frame = null;
        var box = plates.getBoundingClientRect();
        var x = event.clientX - box.left;
        var y = event.clientY - box.top;

        plates.classList.add("is-hot");

        if (chip) {
          chip.style.setProperty("--chip-x", x.toFixed(1) + "px");
          chip.style.setProperty("--chip-y", y.toFixed(1) + "px");
        }
      });
    }, { passive: true });

    plates.addEventListener("pointerenter", function () {
      plates.classList.add("is-hot");
    });
    plates.addEventListener("pointerleave", function () {
      plates.classList.remove("is-hot");
      getAll(".plate", plates).forEach(function (plate) {
        plate.style.removeProperty("--rx");
        plate.style.removeProperty("--ry");
      });
    });

    getAll(".plate", plates).forEach(function (plate) {
      var tiltFrame = null;

      plate.addEventListener("pointermove", function (event) {
        if (tiltFrame) {
          return;
        }
        tiltFrame = window.requestAnimationFrame(function () {
          tiltFrame = null;
          var box = plate.getBoundingClientRect();
          var relX = (event.clientX - box.left) / box.width - 0.5;
          var relY = (event.clientY - box.top) / box.height - 0.5;
          plate.style.setProperty("--ry", (relX * 9).toFixed(2) + "deg");
          plate.style.setProperty("--rx", (-relY * 9).toFixed(2) + "deg");
        });
      }, { passive: true });

      plate.addEventListener("pointerleave", function () {
        plate.style.removeProperty("--rx");
        plate.style.removeProperty("--ry");
      });
    });
  }

  /* ========================================================================
     Boot
     ======================================================================== */
  function init() {
    initTheme();
    initNavigation();
    initScrollState();
    initReveal();
    initSmoothScroll();
    initFooterMeta();
    initCopyControls();
    initContactForm();
    initHeroField();
    initMagnetic();
    initPlates();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
