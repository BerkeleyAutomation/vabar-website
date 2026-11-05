
(function () {
  "use strict";

  /* ---------- failure decomposition chart ---------- */
  var ROWS = [
    ["Tool Sorting", "L1", 37.8, 51.4, 10.8],
    ["Tool Sorting", "L2", 56.4, 28.7, 14.9],
    ["Tool Hanging", "L1", 0.0, 0.0, 100.0],
    ["Tool Hanging", "L2", 21.4, 28.6, 50.0],
    ["Gear Meshing", "L1", null, null, null],
    ["Gear Meshing", "L2", 7.1, 21.4, 71.4],
    ["Syringe Packing", "L1", 0.0, 0.0, 100.0],
    ["Syringe Packing", "L2", 57.9, 0.0, 42.1],
    ["Cable Insertion", "L1", 50.0, 0.0, 50.0],
    ["Cable Insertion", "L2", 0.0, 4.0, 96.0],
    ["Cable Routing", "L1", 27.3, 45.5, 27.3],
    ["Cable Routing", "L2", 5.3, 31.6, 63.2]
  ];
  var NAMES = { p: "Perception", g: "Grasp", m: "Motion" };
  var host = document.getElementById("failchart");

  ROWS.forEach(function (r) {
    var task = r[0], lvl = r[1];
    var row = document.createElement("div");
    row.className = "chartrow";

    var lab = document.createElement("div");
    lab.className = "rl";
    lab.innerHTML = task + " <em>" + lvl + "</em>";
    row.appendChild(lab);

    var stack = document.createElement("div");
    stack.className = "stack";

    if (r[2] === null) {
      var na = document.createElement("div");
      na.className = "na";
      na.textContent = "no failures to attribute";
      stack.appendChild(na);
    } else {
      [["p", r[2]], ["g", r[3]], ["m", r[4]]].forEach(function (pair) {
        var key = pair[0], val = pair[1];
        if (val <= 0) { return; }
        var seg = document.createElement("div");
        seg.className = "seg " + key;
        seg.style.flex = val + " 1 0";
        seg.setAttribute("data-tip", task + " " + lvl + "\n" + NAMES[key] + ": " + val.toFixed(1) + "%");
        seg.setAttribute("tabindex", "0");
        seg.setAttribute("role", "img");
        seg.setAttribute("aria-label", task + " " + lvl + ", " + NAMES[key] + " " + val.toFixed(1) + " percent of failures");
        stack.appendChild(seg);
      });
    }
    row.appendChild(stack);

    var vals = document.createElement("div");
    vals.className = "rv";
    if (r[2] === null) {
      var nav = document.createElement("span");
      nav.className = "na";
      nav.textContent = "n/a";
      vals.appendChild(nav);
    } else {
      [r[2], r[3], r[4]].forEach(function (v) {
        var c = document.createElement("span");
        if (v <= 0) { c.className = "z"; }
        c.textContent = v.toFixed(1);
        vals.appendChild(c);
      });
    }
    row.appendChild(vals);
    host.appendChild(row);
  });

  /* ---------- tooltip ---------- */
  var tip = document.getElementById("tip");
  function show(e, text) {
    tip.textContent = text;
    tip.style.opacity = "1";
    var pad = 14;
    var x = (e.clientX || 0) + pad, y = (e.clientY || 0) + pad;
    var r = tip.getBoundingClientRect();
    if (x + r.width > window.innerWidth - 8) { x = window.innerWidth - r.width - 8; }
    if (y + r.height > window.innerHeight - 8) { y = (e.clientY || 0) - r.height - pad; }
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  }
  function hide() { tip.style.opacity = "0"; }

  host.addEventListener("mousemove", function (e) {
    var t = e.target.closest ? e.target.closest("[data-tip]") : null;
    if (t) { show(e, t.getAttribute("data-tip")); } else { hide(); }
  });
  host.addEventListener("mouseleave", hide);
  host.addEventListener("focusin", function (e) {
    var t = e.target;
    if (t && t.getAttribute && t.getAttribute("data-tip")) {
      var b = t.getBoundingClientRect();
      show({ clientX: b.left + b.width / 2, clientY: b.bottom }, t.getAttribute("data-tip"));
    }
  });
  host.addEventListener("focusout", hide);
  window.addEventListener("scroll", hide, { passive: true });


})();
