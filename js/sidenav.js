/* Floating section navigation: highlights the current section and, on pages
 * with a hero, stays hidden until the hero has scrolled out of view. */
(function () {
  var nav = document.querySelector(".sidenav");
  if (!nav) return;
  var links = Array.prototype.slice.call(nav.querySelectorAll("a[href^=\"#\"]"));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  var hero = document.querySelector(".hero");
  var queued = false;

  function update() {
    queued = false;
    if (hero) nav.classList.toggle("show", hero.getBoundingClientRect().bottom < 60);
    var current = 0;
    targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top <= 140) current = i; });
    var atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atEnd) current = links.length - 1;
    links.forEach(function (a, i) {
      if (i === current) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  update();
})();
