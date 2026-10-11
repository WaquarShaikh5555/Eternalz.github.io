/**
 * main.js
 * ---------------------------------------------------------------------------
 * All interactive behaviour for the portfolio, in plain JavaScript:
 *
 *   1. Theme toggle (light / dark, remembered in localStorage)
 *   2. Mobile navigation (hamburger, focus trap, Escape to close)
 *   3. Sticky-header state + active navigation link (scroll spy)
 *   4. Scroll-reveal animations via IntersectionObserver
 *   5. Smooth in-page scrolling that honours reduced-motion
 *   6. Footer year + back-to-top control
 *   7. Contact form: client-side validation, honeypot check, AJAX submission
 *
 * Progressive enhancement throughout: with JavaScript disabled the site still
 * renders, navigates and submits the form (plain POST to Formspree).
 */
(function () {
  "use strict";

  /* ========================================================================
     Shared helpers
     ======================================================================== */

  var root = document.documentElement;

  /** Respect the visitor's motion preference. */
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /** querySelector / querySelectorAll shortcuts. */
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
      // The saved value wins; otherwise follow the operating system.
      var saved = root.getAttribute("data-theme");
      if (saved === "light" || saved === "dark") {
        return saved;
      }
      return systemPrefersLight.matches ? "light" : "dark";
    }

    function apply(theme, persist) {
      root.setAttribute("data-theme", theme);

      // Keep the browser UI (mobile address bar) in step with the theme.
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", theme === "light" ? "#f7f8fb" : "#0b0d12");
      }

      // The control describes the action it performs.
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

    // Follow the OS live, but only while the visitor has made no choice.
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
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation menu");
    }

    function close(returnFocus) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");

      if (returnFocus) {
        toggle.focus();
      }
    }

    function toggleMenu() {
      if (isOpen()) {
        close(true);
      } else {
        open();
      }
    }

    toggle.addEventListener("click", toggleMenu);

    // Following a link closes the panel so the target section is visible.
    links.forEach(function (link) {
      link.addEventListener("click", function () {
        if (isOpen()) {
          close(false);
        }
      });
    });

    // Escape closes the panel, Tab is kept inside it while it is open.
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

    // A click anywhere outside the open panel dismisses it.
    document.addEventListener("click", function (event) {
      if (!isOpen() || desktop.matches) {
        return;
      }
      if (!header.contains(event.target)) {
        close(false);
      }
    });

    // Never leave the panel open when the viewport grows into the desktop nav.
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
     3. Sticky header state + active navigation link (scroll spy)
     ======================================================================== */
  function initScrollState() {
    var header = get("#site-header");
    var nav = get("#site-nav");
    var toTop = get("#to-top");

    if (!header) {
      return;
    }

    var navLinks = getAll('.site-nav__link[href^="#"]', nav || document);
    var sections = navLinks
      .map(function (link) {
        return get(link.getAttribute("href"));
      })
      .filter(Boolean);

    var latest = null;

    /** Runs at most once per animation frame. */
    function update() {
      latest = null;

      // Matches the scroll target used by initSmoothScroll, plus 1px of slack
      // for sub-pixel rounding, so a clicked link always lights up.
      var offset = header.offsetHeight + 17;

      // Sticky styling + back-to-top visibility.
      header.classList.toggle("is-stuck", window.scrollY > 8);
      if (toTop) {
        toTop.hidden = window.scrollY < 600;
      }

      // Highlight the section currently occupying the top of the viewport.
      var active = "";
      var atBottom = window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atBottom) {
        // The last section wins at the very bottom of the page.
        active = sections.length ? "#" + sections[sections.length - 1].id : "";
      } else {
        sections.forEach(function (section) {
          if (section.getBoundingClientRect().top - offset <= 1) {
            active = "#" + section.id;
          }
        });
      }

      navLinks.forEach(function (link) {
        var isActive = link.getAttribute("href") === active;
        if (isActive) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    /** Coalesce scroll events into one update per frame. */
    function schedule() {
      if (latest === null) {
        latest = window.requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();

    // Retire the back-to-top control once the footer is on screen: it would
    // otherwise sit on top of the footer text, and it has no value there.
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

    // Reduced motion or no IntersectionObserver: show everything at once.
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
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

        // Small stagger so cards arrive in sequence rather than all at once.
        element.style.transitionDelay = Math.min(Math.max(index, 0), 4) * 80 + "ms";
        element.classList.add("is-visible");
        observer.unobserve(element);
      });
    }, {
      // threshold 0 with a shrunken root: the element reveals as soon as it is
      // meaningfully on screen, whatever its height. Using a percentage
      // threshold instead would miss elements taller than the viewport.
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

      // Modified clicks (new tab, download, ...) keep their native behaviour.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }

      event.preventDefault();

      var header = get("#site-header");
      var offset = (header ? header.offsetHeight : 0) + 16;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: top < 0 ? 0 : top,
        behavior: prefersReducedMotion.matches ? "auto" : "smooth"
      });

      // Keep the URL shareable, and move focus so keyboard users follow along.
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", hash);
      }

      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });

      // Restore the natural focus target for subsequent Tab presses.
      target.addEventListener("blur", function onBlur() {
        target.removeAttribute("tabindex");
        target.removeEventListener("blur", onBlur);
      });
    });
  }

  /* ========================================================================
     6. Footer year + back-to-top
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

      // Clear the message after a moment so it never lingers stale.
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

        // The clipboard API needs a secure context; on plain HTTP (local
        // previews) it is unavailable, so fall back to simply showing it.
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

    /**
     * Validation rules, kept in one place so they are easy to change.
     * The form posts to Formspree with `novalidate`, so these checks always
     * run - and the errors are announced through the live region below.
     */
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

    /** Validates one field and returns true when it passes. */
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

    /** Shows a message in the live region, or hides it when text is empty. */
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

    // Re-validate on blur, and clear the error as soon as the input is fixed.
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

      // Honeypot: a real visitor never fills this hidden field in.
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
