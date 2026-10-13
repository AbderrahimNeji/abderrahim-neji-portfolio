(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var mobileMq = window.matchMedia("(max-width: 767px)");

  var drawer = document.getElementById("nav-drawer");
  if (drawer) {
    var toggle = drawer.querySelector(".menu-toggle");
    var overlay = drawer.querySelector(".nav-overlay");
    var links = drawer.querySelectorAll("#mobile-nav a");

    function syncExpanded() {
      if (toggle) {
        toggle.setAttribute("aria-expanded", drawer.open ? "true" : "false");
      }
      var lock = drawer.open && mobileMq.matches;
      document.body.style.overflow = lock ? "hidden" : "";
    }

    function closeDrawer() {
      if (drawer.open) drawer.open = false;
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

    if (overlay) overlay.addEventListener("click", closeDrawer);
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", closeDrawer);
    }
  }

  var header = document.querySelector("header");
  var progressBar = document.querySelector(".scroll-progress-bar");

  function onScroll() {
    var y = window.scrollY || 0;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (progressBar) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (y / max) * 100 : 0;
      progressBar.style.width = pct + "%";
    }
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var lastOpener = null;
  var openers = document.querySelectorAll("[data-open]");
  for (var o = 0; o < openers.length; o++) {
    openers[o].addEventListener("click", function (event) {
      var id = event.currentTarget.getAttribute("data-open");
      var dialog = id ? document.getElementById(id) : null;
      if (!dialog || typeof dialog.showModal !== "function") return;
      lastOpener = event.currentTarget;
      dialog.showModal();
    });
  }

  var dialogs = document.querySelectorAll("dialog.case-dialog");
  for (var d = 0; d < dialogs.length; d++) {
    (function (dialog) {
      var closer = dialog.querySelector("[data-close]");
      if (closer) {
        closer.addEventListener("click", function () {
          dialog.close();
        });
      }
      dialog.addEventListener("click", function (event) {
        if (event.target === dialog) dialog.close();
      });
      dialog.addEventListener("close", function () {
        if (lastOpener) lastOpener.focus();
      });
    })(dialogs[d]);
  }

  initNeural();

  if (reduce || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("motion-ready");

  var revealSel =
    ".reveal-rise, .reveal-clip, .reveal-scale, .reveal-left, .reveal-right, .reveal-wipe, .reveal-pop, .timeline";
  var nodes = document.querySelectorAll(revealSel);
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px 10% 0px" }
  );
  for (var n = 0; n < nodes.length; n++) observer.observe(nodes[n]);
  window.setTimeout(function () {
    for (var s = 0; s < nodes.length; s++) nodes[s].classList.add("is-in");
  }, 2500);

  if (finePointer) {
    initPointer();
    initMagnetic();
    initTilt();
    initParallax();
  }

  function initPointer() {
    var ring = document.querySelector(".pointer-ring");
    if (!ring) return;
    ring.hidden = false;
    var x = 0;
    var y = 0;
    var tx = 0;
    var ty = 0;
    var visible = false;

    window.addEventListener(
      "pointermove",
      function (event) {
        if (event.pointerType !== "mouse") return;
        tx = event.clientX;
        ty = event.clientY;
        if (!visible) {
          visible = true;
          ring.style.opacity = "0.7";
          x = tx;
          y = ty;
        }
      },
      { passive: true }
    );

    function loop() {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      ring.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function initMagnetic() {
    var buttons = document.querySelectorAll(".magnetic");
    for (var b = 0; b < buttons.length; b++) {
      (function (btn) {
        btn.addEventListener("mousemove", function (event) {
          var rect = btn.getBoundingClientRect();
          var dx = event.clientX - (rect.left + rect.width / 2);
          var dy = event.clientY - (rect.top + rect.height / 2);
          btn.style.transform = "translate(" + dx * 0.18 + "px," + dy * 0.22 + "px)";
        });
        btn.addEventListener("mouseleave", function () {
          btn.style.transform = "";
        });
      })(buttons[b]);
    }
  }

  function initTilt() {
    var cards = document.querySelectorAll("[data-tilt]");
    for (var c = 0; c < cards.length; c++) {
      (function (card) {
        card.addEventListener("mousemove", function (event) {
          var rect = card.getBoundingClientRect();
          var px = (event.clientX - rect.left) / rect.width - 0.5;
          var py = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.transform =
            "perspective(900px) rotateX(" + (-py * 5).toFixed(2) + "deg) rotateY(" + (px * 6).toFixed(2) + "deg)";
        });
        card.addEventListener("mouseleave", function () {
          card.style.transform = "";
        });
      })(cards[c]);
    }
  }

  function initParallax() {
    var orbs = document.querySelector(".hero-orbs");
    var grid = document.querySelector(".hero-grid-layer");
    if (!orbs && !grid) return;
    var mx = 0;
    var my = 0;
    window.addEventListener(
      "pointermove",
      function (event) {
        if (event.pointerType !== "mouse") return;
        mx = (event.clientX / window.innerWidth - 0.5) * 16;
        my = (event.clientY / window.innerHeight - 0.5) * 12;
      },
      { passive: true }
    );
    window.addEventListener(
      "scroll",
      function () {
        var sy = Math.min(window.scrollY, 600) * 0.08;
        if (orbs) orbs.style.transform = "translate3d(" + mx + "px," + (my + sy) + "px,0)";
        if (grid) grid.style.transform = "translate3d(" + mx * 0.4 + "px," + sy * 0.5 + "px,0)";
      },
      { passive: true }
    );
  }

  function initNeural() {
    var canvas = document.getElementById("neural-canvas");
    if (!canvas || !canvas.getContext || reduce) return;
    var ctx = canvas.getContext("2d");
    var hero = document.querySelector(".hero");
    var running = false;
    var visible = true;
    var nodes = [];
    var links = [];
    var particles = [];
    var pointer = { x: 0, y: 0, active: false };
    var dpr = 1;
    var w = 0;
    var h = 0;
    var raf = 0;

    function count() {
      return mobileMq.matches ? 26 : 58;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth || canvas.parentElement.clientWidth;
      h = canvas.clientHeight || canvas.parentElement.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      var n = count();
      nodes = [];
      links = [];
      particles = [];
      var i;
      for (i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          ox: 0,
          oy: 0,
          r: 1.1 + Math.random() * 1.7,
          pulse: Math.random() * Math.PI * 2,
          hue: Math.random()
        });
      }
      for (i = 0; i < n; i++) {
        nodes[i].ox = nodes[i].x;
        nodes[i].oy = nodes[i].y;
      }
      var maxDist = mobileMq.matches ? 110 : 150;
      for (i = 0; i < n; i++) {
        for (var j = i + 1; j < n; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            links.push({ a: i, b: j, dist: dist });
          }
        }
      }
      var pCount = mobileMq.matches ? 10 : 28;
      for (i = 0; i < pCount && links.length; i++) {
        particles.push({
          link: links[i % links.length],
          t: Math.random(),
          speed: 0.002 + Math.random() * 0.004
        });
      }
    }

    function draw(ts) {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      var t = (ts || 0) * 0.001;
      var influence = finePointer && !mobileMq.matches && pointer.active;
      var i;

      if (!reduce) {
        for (i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          var nx = node.ox;
          var ny = node.oy;
          if (influence) {
            var pdx = pointer.x - node.ox;
            var pdy = pointer.y - node.oy;
            var pd = Math.sqrt(pdx * pdx + pdy * pdy) || 1;
            if (pd < 160) {
              var force = (160 - pd) / 160;
              nx += (pdx / pd) * force * 10;
              ny += (pdy / pd) * force * 10;
            }
          }
          node.x += (nx - node.x) * 0.08;
          node.y += (ny - node.y) * 0.08;
          node.pulse += 0.02;
        }
      }

      ctx.lineWidth = 1;
      for (i = 0; i < links.length; i++) {
        var link = links[i];
        var a = nodes[link.a];
        var b = nodes[link.b];
        var alpha = 0.14 + 0.12 * Math.sin(t + link.a);
        ctx.strokeStyle = "rgba(34, 211, 238," + alpha.toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      if (!reduce) {
        for (i = 0; i < particles.length; i++) {
          var p = particles[i];
          p.t += p.speed;
          if (p.t > 1) p.t -= 1;
          var la = nodes[p.link.a];
          var lb = nodes[p.link.b];
          var px = la.x + (lb.x - la.x) * p.t;
          var py = la.y + (lb.y - la.y) * p.t;
          ctx.fillStyle = "rgba(76, 141, 255, 0.85)";
          ctx.beginPath();
          ctx.arc(px, py, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (i = 0; i < nodes.length; i++) {
        var nd = nodes[i];
        var glow = 0.55 + 0.45 * Math.sin(nd.pulse);
        ctx.beginPath();
        ctx.fillStyle =
          nd.hue > 0.7
            ? "rgba(139, 124, 255," + (0.55 + glow * 0.35).toFixed(3) + ")"
            : "rgba(34, 211, 238," + (0.6 + glow * 0.4).toFixed(3) + ")";
        ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    if (hero) {
      hero.addEventListener(
        "pointermove",
        function (event) {
          if (event.pointerType !== "mouse") return;
          var rect = canvas.getBoundingClientRect();
          pointer.x = event.clientX - rect.left;
          pointer.y = event.clientY - rect.top;
          pointer.active = true;
        },
        { passive: true }
      );
      hero.addEventListener("pointerleave", function () {
        pointer.active = false;
      });
    }

    window.addEventListener("resize", function () {
      resize();
    });

    if ("IntersectionObserver" in window && hero) {
      var vis = new IntersectionObserver(
        function (entries) {
          visible = entries[0] && entries[0].isIntersecting;
          if (visible) start();
          else stop();
        },
        { threshold: 0.05 }
      );
      vis.observe(hero);
    }

    resize();
    start();
  }
})();
