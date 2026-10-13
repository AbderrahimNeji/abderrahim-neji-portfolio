(function () {
  var drawer = document.getElementById("nav-drawer");
  if (drawer) {
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
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window) || !nodes.length) {
    return;
  }

  document.documentElement.classList.add("motion-ready");

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px 12% 0px" }
  );

  for (var n = 0; n < nodes.length; n++) {
    observer.observe(nodes[n]);
  }
})();
