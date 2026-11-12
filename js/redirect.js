(function () {
  "use strict";

  var year = document.getElementById("y");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  var refresh = document.querySelector('meta[http-equiv="refresh"]');
  if (!refresh) {
    return;
  }

  var match = /^\s*\d+\s*;\s*url\s*=\s*(.+)$/i.exec(refresh.content || "");
  if (!match) {
    return;
  }

  var destination = match[1].trim().replace(/^['"]|['"]$/g, "");
  window.setTimeout(function () {
    window.location.replace(destination);
  }, 700);
})();
