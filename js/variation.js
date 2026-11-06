/* Variation section: one task at a time. The selected Level 1 and Level 2 clips
 * loop while on screen; everything else stays paused and undownloaded. */
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".vtabs button"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".vpanel"));
  if (!tabs.length) return;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current = 0, visible = false;

  function clips(i) { return Array.prototype.slice.call(panels[i].querySelectorAll("video")); }
  function update() {
    panels.forEach(function (panel, i) {
      panel.hidden = i !== current;
      tabs[i].setAttribute("aria-pressed", i === current ? "true" : "false");
      clips(i).forEach(function (v) {
        if (i === current && visible && !document.hidden && !still) {
          var r = v.play(); if (r) r.catch(function () {});
        } else {
          v.pause();
        }
      });
    });
  }
  tabs.forEach(function (t, i) { t.addEventListener("click", function () { current = i; update(); }); });
  if (still) panels.forEach(function (_, i) { clips(i).forEach(function (v) { v.controls = true; }); });
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    update();
  }, { threshold: 0.2 }).observe(document.querySelector(".vselect"));
  document.addEventListener("visibilitychange", update);
  update();
})();
