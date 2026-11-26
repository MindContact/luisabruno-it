/* Menu, click-to-load map, drawn illustrations, back-to-top. No tracking, no cookies. */
(function () {
  "use strict";
  var burger = document.querySelector(".burger"), menu = document.getElementById("menu");
  function openMenu(open) {
    menu.hidden = !open; burger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  }
  if (burger && menu) {
    burger.addEventListener("click", function () { openMenu(menu.hidden); });
    menu.querySelector(".menu-close").addEventListener("click", function () { openMenu(false); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { openMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) openMenu(false); });
  }

  var map = document.querySelector(".mappa");
  if (map) {
    map.querySelector("button").addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = map.dataset.map; f.loading = "lazy"; f.title = "Mappa dello studio"; f.referrerPolicy = "no-referrer-when-downgrade";
      map.innerHTML = ""; map.appendChild(f); map.classList.add("is-loaded");
    });
  }

  // Line illustrations draw themselves the first time they scroll into view.
  var drawings = document.querySelectorAll(".illu.draw");
  if (drawings.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.25 });
    drawings.forEach(function (el) {
      el.querySelectorAll("path, circle").forEach(function (p, k) { p.style.setProperty("--i", k); });
      io.observe(el);
    });
  } else {
    drawings.forEach(function (el) { el.classList.add("is-in"); });
  }

  var top = document.querySelector(".totop");
  if (top) {
    window.addEventListener("scroll", function () { top.classList.toggle("is-visible", window.scrollY > 600); }, { passive: true });
    top.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  }
})();
