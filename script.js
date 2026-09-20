(function () {
  var drawer = document.getElementById("nav-drawer");
  if (!drawer) return;

  var toggle = drawer.querySelector(".menu-toggle");
  var overlay = drawer.querySelector(".nav-overlay");
  var links = drawer.querySelectorAll("#mobile-nav a");

  function syncExpanded() {
    if (toggle) {
      toggle.setAttribute("aria-expanded", drawer.open ? "true" : "false");
    }
    var lock = drawer.open && window.matchMedia("(max-width: 767px)").matches;
    document.body.style.overflow = lock ? "hidden" : "";
  }

  function closeDrawer() {
    if (drawer.open) {
      drawer.open = false;
    }
    syncExpanded();
  }

  drawer.addEventListener("toggle", syncExpanded);
  window.addEventListener("resize", syncExpanded);
  syncExpanded();

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && drawer.open) {
      closeDrawer();
      if (toggle) toggle.focus();
    }
  });

  if (overlay) {
    overlay.addEventListener("click", closeDrawer);
  }

  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", closeDrawer);
  }
})();
