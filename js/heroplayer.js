/* Front-page player: opens on Tool Sorting and plays it once. Nothing advances by
 * itself: the preview column, the bar or the overview grid choose another task. */
(function () {
  var stage = document.querySelector(".stage");
  if (!stage) return;
  var tiles = Array.prototype.slice.call(stage.querySelectorAll(".tile"));
  var overview = document.querySelector(".taskbar button[data-overview]");
  var segs = Array.prototype.slice.call(document.querySelectorAll(".taskbar button[data-name]"));
  var previews = Array.prototype.slice.call(document.querySelectorAll(".previews button"));
  var details = document.querySelector(".task-details");
  var videos = tiles.map(function (t) { return t.querySelector("video"); });
  var current = -1, frame = null, visible = false, userPaused = false;

  function fill(button, f) { button.querySelector("i").style.width = (f * 100) + "%"; }
  function setCurrent(button, on) {
    if (on) button.setAttribute("aria-current", "true"); else button.removeAttribute("aria-current");
  }
  function tick() {
    if (current < 0) return;
    var v = videos[current];
    if (v.duration) fill(segs[current], v.currentTime / v.duration);
    frame = requestAnimationFrame(tick);
  }
  function mark() {
    stage.classList.toggle("zoomed", current >= 0);
    tiles.forEach(function (t, i) { t.classList.toggle("active", i === current); });
    setCurrent(overview, current < 0);
    fill(overview, current < 0 ? 1 : 0);
    segs.forEach(function (s, i) { setCurrent(s, i === current); fill(s, 0); });
    previews.forEach(function (p, i) { setCurrent(p, i === current); });
    if (current >= 0) {
      details.href = "tasks.html#" + tiles[current].dataset.task;
      details.textContent = segs[current].dataset.name + " details →";
    } else {
      details.href = "tasks.html";
      details.textContent = "All task details →";
    }
  }
  function leave() {
    cancelAnimationFrame(frame);
    if (current >= 0) { videos[current].pause(); videos[current].load(); }  // load() restores the title frame
    userPaused = false;
  }
  function start() {
    var r = videos[current].play();
    if (r) r.catch(function () {});
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
  }
  function hold() {
    cancelAnimationFrame(frame);
    if (current >= 0) videos[current].pause();
  }
  function resume() { if (current >= 0 && !userPaused) start(); }
  function showTask(i) {
    leave();
    current = i;
    mark();
    if (visible && !document.hidden) start();
  }
  function showOverview() {
    leave();
    current = -1;
    mark();
  }

  videos.forEach(function (v, i) {
    function finished() {
      if (i !== current) return;
      cancelAnimationFrame(frame);
      v.load();  // back to the title frame; stays on this task until someone chooses
      userPaused = true;
      fill(segs[i], 0);
    }
    v.addEventListener("ended", finished);
    v.addEventListener("error", finished);
  });
  tiles.forEach(function (t, i) {
    t.addEventListener("click", function () {
      if (i !== current) { showTask(i); return; }
      userPaused = !videos[i].paused;
      if (userPaused) hold(); else start();
    });
  });
  segs.forEach(function (s, i) { s.addEventListener("click", function () { showTask(i); }); });
  previews.forEach(function (p, i) { p.addEventListener("click", function () { showTask(i); }); });
  overview.addEventListener("click", showOverview);

  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible) resume(); else hold();
  }, { threshold: 0.25 }).observe(stage);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) hold(); else if (visible) resume();
  });
  current = 0;
  mark();
})();
