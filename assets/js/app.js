/* ============================================================
   Interview Prep — single-page app
   - loads content/manifest.json
   - builds sidebar, hash-routes, fetches + renders Markdown
   - progress tracked PER QUESTION, per track; theme persisted
   ============================================================ */
(function () {
  "use strict";

  var LS_THEME    = "prep.theme";
  var LS_QDONE    = "prep.questionsDone"; // { "q:<stepId>:<qid>": true }
  var LS_TASKS    = "prep.tasks";         // { taskKey: true }  (in-content GFM task lists)
  var LS_COLLAPSE = "prep.navCollapsed";  // "1" | "0"  (desktop sidebar)

  // a heading counts as a trackable "question" when it starts with
  // Q<n> (tech Q&A), Problem <n> (DSA coding problems), or Scenario <n>
  var Q_RE = /^(Q\d+|Problem\s+\d+|Scenario\s+\d+)/i;

  var manifest = null;
  var flatSteps = [];                // ordered list of step objects across tracks
  var byId = {};                     // id -> step object (incl. home)
  var currentStep = null;            // step object currently rendered (null on home)

  var els = {
    nav:        document.getElementById("nav"),
    article:    document.getElementById("article"),
    themeBtn:   document.getElementById("themeBtn"),
    menuBtn:    document.getElementById("menuBtn"),
    backdrop:   document.getElementById("backdrop"),
    trackProg:  document.getElementById("trackProgress")
  };

  /* ---------- storage helpers ---------- */
  function load(key) {
    try { return JSON.parse(localStorage.getItem(key)) || {}; }
    catch (e) { return {}; }
  }
  function save(key, obj) {
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {}
  }

  /* ---------- theme ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    els.themeBtn.textContent = t === "dark" ? "🌙" : "☀️";
    els.themeBtn.title = t === "dark" ? "Switch to light" : "Switch to dark";
  }
  function initTheme() {
    var saved = localStorage.getItem(LS_THEME) || "dark";
    applyTheme(saved);
    els.themeBtn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem(LS_THEME, next);
      applyTheme(next);
    });
  }

  /* ---------- sidebar open / collapse ----------
     Desktop (> 860px): ☰ collapses the sidebar so the article gets a wider
                        reading area. State is remembered.
     Mobile  (<=860px): ☰ slides the sidebar in as an overlay. */
  function isDesktop() { return window.innerWidth > 860; }

  function initMenu() {
    if (localStorage.getItem(LS_COLLAPSE) === "1") {
      document.body.classList.add("sidebar-collapsed");
    }
    function syncMenuTitle() {
      var collapsed = document.body.classList.contains("sidebar-collapsed");
      els.menuBtn.title = isDesktop()
        ? (collapsed ? "Show sidebar" : "Hide sidebar")
        : "Open navigation";
    }
    els.menuBtn.addEventListener("click", function () {
      if (isDesktop()) {
        document.body.classList.toggle("sidebar-collapsed");
        localStorage.setItem(LS_COLLAPSE,
          document.body.classList.contains("sidebar-collapsed") ? "1" : "0");
      } else {
        document.body.classList.toggle("nav-open");
      }
      syncMenuTitle();
    });
    els.backdrop.addEventListener("click", function () {
      document.body.classList.remove("nav-open");
    });
    window.addEventListener("hashchange", function () {
      document.body.classList.remove("nav-open");
    });
    window.addEventListener("resize", syncMenuTitle);
    syncMenuTitle();
  }

  /* ---------- questions / progress model ---------- */
  function qid(title) {
    // stable id derived from the question label only ("Q1", "Scenario 1")
    var m = String(title).match(Q_RE);
    return m ? m[1].toLowerCase().replace(/\s+/g, "-") : null;
  }
  function qKey(stepId, id) { return "q:" + stepId + ":" + id; }

  // pull the trackable questions out of raw markdown (skips fenced code blocks)
  function extractQuestions(md) {
    var out = [], seen = {}, inFence = false;
    String(md).split(/\r?\n/).forEach(function (line) {
      if (/^\s*```/.test(line)) { inFence = !inFence; return; }
      if (inFence) return;
      var m = line.match(/^###\s+(.+?)\s*#*\s*$/);
      if (!m) return;
      var title = m[1].replace(/[`*]/g, "").trim();
      var id = qid(title);
      if (id && !seen[id]) { seen[id] = true; out.push({ id: id, title: title }); }
    });
    return out;
  }
  function indexStep(step, md) {
    step.questions = extractQuestions(md);
    return step.questions;
  }

  function qState() { return load(LS_QDONE); }

  function stepStats(step) {
    var qs = step.questions || [];
    var st = qState();
    var done = qs.filter(function (q) { return !!st[qKey(step.id, q.id)]; }).length;
    return { total: qs.length, done: done, pct: qs.length ? Math.round(done / qs.length * 100) : 0 };
  }
  function trackStats(track) {
    var total = 0, done = 0, st = qState();
    track.steps.forEach(function (s) {
      (s.questions || []).forEach(function (q) {
        total++;
        if (st[qKey(s.id, q.id)]) done++;
      });
    });
    return { total: total, done: done, pct: total ? Math.round(done / total * 100) : 0 };
  }

  function setQuestion(stepId, id, val) {
    var st = qState();
    if (val) st[qKey(stepId, id)] = true; else delete st[qKey(stepId, id)];
    save(LS_QDONE, st);
  }

  function refreshProgress() {
    if (!manifest) return;
    manifest.tracks.forEach(function (t) {
      var s = trackStats(t);
      var bar = document.getElementById("bar-" + t.key);
      var pct = document.getElementById("pct-" + t.key);
      if (bar) bar.style.width = s.pct + "%";
      if (pct) pct.textContent = s.pct + "%";
      var dbar = document.getElementById("dashbar-" + t.key);
      var dcnt = document.getElementById("dashcnt-" + t.key);
      if (dbar) dbar.style.width = s.pct + "%";
      if (dcnt) dcnt.textContent = s.done + " / " + s.total;
    });
    // per-step badges + done state in the sidebar
    flatSteps.forEach(function (step) {
      var s = stepStats(step);
      var badge = document.querySelector('.nav-prog[data-step="' + step.id + '"]');
      var link  = document.querySelector('.nav-link[data-id="' + step.id + '"]');
      if (badge) {
        if (!s.total) { badge.textContent = ""; badge.classList.remove("full"); }
        else if (s.done === s.total) { badge.textContent = "✓"; badge.classList.add("full"); }
        else { badge.textContent = s.done + "/" + s.total; badge.classList.remove("full"); }
      }
      if (link) link.classList.toggle("done", s.total > 0 && s.done === s.total);
    });
  }

  /* ---------- sidebar ---------- */
  function shortLabel(label) {
    return String(label).replace(/^Track\s+\w+\s*[—–-]\s*/, "");
  }

  function buildNav() {
    var html = "";
    var h = manifest.home;
    html += '<a class="nav-link nav-home" data-route="#/" href="#/">'
          + '<span>🎯</span><span>' + esc(h.title) + '</span></a>';

    manifest.tracks.forEach(function (track) {
      html += '<div class="nav-group-label">' + esc(track.icon + " " + track.label) + "</div>";
      track.steps.forEach(function (step) {
        html += '<a class="nav-link" data-id="' + esc(step.id) + '" data-route="#/' + esc(step.id) + '" href="#/' + esc(step.id) + '">'
              + '<span class="nav-title">' + esc(step.title) + "</span>"
              + '<span class="nav-prog" data-step="' + esc(step.id) + '"></span>'
              + '<span class="nav-check">✓</span></a>';
      });
    });
    els.nav.innerHTML = html;
  }

  function buildTrackProgress() {
    var html = "";
    manifest.tracks.forEach(function (t) {
      html += '<div class="progress-mini">'
            +   '<div class="progress-mini-label">'
            +     '<span>' + esc(t.icon + " " + shortLabel(t.label)) + '</span>'
            +     '<span id="pct-' + esc(t.key) + '">0%</span>'
            +   '</div>'
            +   '<div class="progress-track"><div id="bar-' + esc(t.key) + '" class="progress-fill"></div></div>'
            + '</div>';
    });
    els.trackProg.innerHTML = html;
  }

  function highlightNav(id) {
    document.querySelectorAll(".nav-link").forEach(function (a) {
      var route = a.getAttribute("data-route");
      a.classList.toggle("active", route === "#/" + (id || "") || (route === "#/" && !id));
    });
  }

  /* ---------- markdown rendering ---------- */
  function renderMarkdown(md) {
    if (window.marked && marked.setOptions) {
      marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });
    }
    var html = window.marked ? marked.parse(md) : esc(md);
    els.article.innerHTML = html;
    enhance();
  }

  function enhance() {
    var art = els.article;

    // 1) wrap tables for horizontal scroll
    art.querySelectorAll("table").forEach(function (t) {
      if (t.parentElement && t.parentElement.classList.contains("table-wrap")) return;
      var w = document.createElement("div");
      w.className = "table-wrap";
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });

    // 2) code blocks: highlight + wrap + lang label
    art.querySelectorAll("pre > code").forEach(function (code) {
      if (window.hljs) {
        try { hljs.highlightElement(code); } catch (e) {}
      }
      var pre = code.parentElement;
      if (pre.parentElement && pre.parentElement.classList.contains("code-wrap")) return;
      var wrap = document.createElement("div");
      wrap.className = "code-wrap";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      var m = (code.className || "").match(/language-([\w-]+)/);
      if (m) {
        var tag = document.createElement("span");
        tag.className = "code-lang";
        tag.textContent = m[1] === "csharp" ? "C#" : m[1];
        wrap.appendChild(tag);
      }
    });

    // 3) callouts: interview tips + scenario quotes
    var lastH3 = "";
    Array.prototype.forEach.call(art.children, function (node) {
      if (node.tagName === "H3") lastH3 = (node.textContent || "");
      if (node.tagName === "BLOCKQUOTE") {
        var txt = node.textContent || "";
        if (/^\s*💬/.test(txt) || /interview tip/i.test(txt.slice(0, 40))) {
          node.classList.add("callout-tip");
          node.innerHTML = node.innerHTML.replace(/💬\s*<strong>?\s*Interview tip:?\s*<\/strong>?/i, "")
                                         .replace(/^\s*💬\s*Interview tip:?\s*/i, "")
                                         .replace(/^\s*💬\s*/, "");
        } else if (/^scenario/i.test(lastH3)) {
          node.classList.add("callout-scenario");
        }
      }
    });

    // 4) section heading accents
    art.querySelectorAll("h2").forEach(function (h) {
      var t = (h.textContent || "").toUpperCase();
      if (t.indexOf("QUICK REVISION") !== -1) h.classList.add("section-revision");
      else if (t.indexOf("SELF-CHECK") !== -1) h.classList.add("section-check");
    });

    // 5) interactive task lists (in-content GFM checkboxes)
    wireTaskLists();

    // 6) per-question completion checkboxes
    wireQuestionChecks();
  }

  function taskKey(text) {
    return "t:" + text.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 120);
  }

  function wireTaskLists() {
    var tasks = load(LS_TASKS);
    els.article.querySelectorAll("li").forEach(function (li) {
      var box = li.querySelector('input[type="checkbox"]');
      if (!box) return;
      li.classList.add("task-item");
      var ul = li.parentElement;
      if (ul && ul.tagName === "UL") ul.classList.add("contains-task-list");
      box.disabled = false;

      var key = taskKey(li.textContent || "");
      if (Object.prototype.hasOwnProperty.call(tasks, key)) box.checked = !!tasks[key];

      var label = document.createElement("label");
      var n = box.nextSibling;
      while (n) {
        var next = n.nextSibling;
        label.appendChild(n);
        n = next;
      }
      li.appendChild(label);

      box.addEventListener("change", function () {
        var t = load(LS_TASKS);
        t[key] = box.checked;
        save(LS_TASKS, t);
      });
    });
  }

  // add a checkbox to every Q / Scenario heading on the current step page
  function wireQuestionChecks() {
    if (!currentStep) return;
    var st = qState();
    var seen = {};
    els.article.querySelectorAll("h3").forEach(function (h) {
      var title = (h.textContent || "").replace(/\s+/g, " ").trim();
      var id = qid(title);
      if (!id || seen[id]) return;
      seen[id] = true;

      var key = qKey(currentStep.id, id);
      h.classList.add("q-head");

      var box = document.createElement("input");
      box.type = "checkbox";
      box.className = "q-check";
      box.title = "Mark this question complete";
      box.checked = !!st[key];
      if (box.checked) h.classList.add("q-done");

      box.addEventListener("change", function () {
        setQuestion(currentStep.id, id, box.checked);
        h.classList.toggle("q-done", box.checked);
        refreshProgress();
        updateStepHeader();
      });

      h.insertBefore(box, h.firstChild);
    });
  }

  /* ---------- home dashboard ---------- */
  function injectDashboardHero() {
    var rows = "";
    manifest.tracks.forEach(function (t) {
      var s = trackStats(t);
      rows += '<div class="dash-track">'
            +   '<div class="dash-track-head">'
            +     '<span>' + esc(t.icon + " " + shortLabel(t.label)) + '</span>'
            +     '<span class="dash-count" id="dashcnt-' + esc(t.key) + '">' + s.done + " / " + s.total + '</span>'
            +   '</div>'
            +   '<div class="progress-track"><div class="progress-fill" id="dashbar-' + esc(t.key) + '" style="width:' + s.pct + '%"></div></div>'
            + '</div>';
    });
    var hero = document.createElement("div");
    hero.className = "dash-hero";
    hero.innerHTML = '<h2>Your progress</h2>'
                   + '<div class="dash-sub">Questions you’ve checked off, per track.</div>'
                   + rows;
    var h1 = els.article.querySelector("h1");
    if (h1 && h1.nextSibling) h1.parentNode.insertBefore(hero, h1.nextSibling);
    else els.article.insertBefore(hero, els.article.firstChild);
  }

  /* ---------- step page header (per-question progress + bulk actions) ---------- */
  function injectStepHeader(step) {
    var s = stepStats(step);
    var bar = document.createElement("div");
    bar.className = "step-progress" + (s.total > 0 && s.done === s.total ? " complete" : "");
    bar.innerHTML =
        '<div class="sp-row">'
      +   '<span class="sp-title">📋 Questions completed</span>'
      +   '<span class="sp-count"><b>' + s.done + "</b> / " + s.total + "</span>"
      + '</div>'
      + '<div class="progress-track"><div class="progress-fill" style="width:' + s.pct + '%"></div></div>'
      + '<div class="sp-actions">'
      +   '<button type="button" class="btn ghost sp-all">Mark all complete</button>'
      +   '<button type="button" class="btn ghost sp-clear">Clear all</button>'
      + '</div>';

    bar.querySelector(".sp-all").addEventListener("click", function () { setAllQuestions(step, true); });
    bar.querySelector(".sp-clear").addEventListener("click", function () { setAllQuestions(step, false); });

    var h1 = els.article.querySelector("h1");
    if (h1 && h1.nextSibling) h1.parentNode.insertBefore(bar, h1.nextSibling);
    else els.article.insertBefore(bar, els.article.firstChild);
  }

  function updateStepHeader() {
    if (!currentStep) return;
    var s = stepStats(currentStep);
    var sp = document.querySelector(".step-progress");
    if (!sp) return;
    var cnt = sp.querySelector(".sp-count");
    var fill = sp.querySelector(".progress-fill");
    if (cnt) cnt.innerHTML = "<b>" + s.done + "</b> / " + s.total;
    if (fill) fill.style.width = s.pct + "%";
    sp.classList.toggle("complete", s.total > 0 && s.done === s.total);
  }

  function setAllQuestions(step, val) {
    var st = qState();
    (step.questions || []).forEach(function (q) {
      var k = qKey(step.id, q.id);
      if (val) st[k] = true; else delete st[k];
    });
    save(LS_QDONE, st);
    els.article.querySelectorAll("input.q-check").forEach(function (b) { b.checked = val; });
    els.article.querySelectorAll("h3.q-head").forEach(function (h) { h.classList.toggle("q-done", val); });
    refreshProgress();
    updateStepHeader();
  }

  /* ---------- step footer (prev / next) ---------- */
  function injectStepNav(step) {
    var idx = flatSteps.findIndex(function (s) { return s.id === step.id; });
    var prev = idx > 0 ? flatSteps[idx - 1] : null;
    var next = idx < flatSteps.length - 1 ? flatSteps[idx + 1] : null;
    var navEl = document.createElement("div");
    navEl.className = "step-nav";
    navEl.innerHTML =
      (prev ? '<a class="prev" href="#/' + esc(prev.id) + '"><span class="sn-label">← Previous</span><span class="sn-title">' + esc(prev.title) + "</span></a>"
            : '<span class="spacer"></span>')
      + (next ? '<a class="next" href="#/' + esc(next.id) + '"><span class="sn-label">Next →</span><span class="sn-title">' + esc(next.title) + "</span></a>"
              : '<span class="spacer"></span>');
    els.article.appendChild(navEl);
  }

  /* ---------- routing ---------- */
  function currentId() {
    return location.hash.replace(/^#\/?/, "");
  }

  function route() {
    var id = currentId();
    var target = id && byId[id] ? byId[id] : manifest.home;
    var isHome = target === manifest.home;
    currentStep = isHome ? null : target;
    highlightNav(isHome ? "" : target.id);
    els.article.innerHTML = '<div class="loader">Loading…</div>';
    window.scrollTo(0, 0);

    fetch(encodeURI(target.file) + "?v=" + Date.now(), { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(function (md) {
        document.title = (isHome ? "Interview Prep" : target.title + " · Interview Prep");
        if (!isHome) indexStep(target, md);   // keep this step's question index fresh
        renderMarkdown(md);
        if (isHome) injectDashboardHero();
        else { injectStepHeader(target); injectStepNav(target); }
        refreshProgress();
      })
      .catch(function (err) {
        els.article.innerHTML =
          '<h1>Couldn’t load this page</h1>'
          + "<p>Failed to load <code>" + esc(target.file) + "</code> (" + esc(err.message) + ").</p>"
          + "<p>If you opened the file directly, run it through a local server "
          + "(<code>python -m http.server</code>) or your Netlify URL — browsers block <code>fetch()</code> on <code>file://</code>.</p>";
      });
  }

  /* ---------- boot-time scan: count questions in every step for accurate totals ---------- */
  function scanAll() {
    var jobs = flatSteps.map(function (step) {
      if (step.questions) return Promise.resolve();
      return fetch(encodeURI(step.file) + "?v=" + Date.now(), { cache: "no-cache" })
        .then(function (r) { return r.ok ? r.text() : ""; })
        .then(function (md) { indexStep(step, md); })
        .catch(function () { step.questions = step.questions || []; });
    });
    return Promise.all(jobs).then(refreshProgress);
  }

  /* ---------- util ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    initTheme();
    initMenu();
    fetch("content/manifest.json?v=" + Date.now(), { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (m) {
        manifest = m;
        byId[m.home.id] = m.home;
        m.tracks.forEach(function (t) {
          t.steps.forEach(function (s) { flatSteps.push(s); byId[s.id] = s; });
        });
        buildNav();
        buildTrackProgress();
        refreshProgress();
        window.addEventListener("hashchange", route);
        route();        // render the current page now…
        scanAll();      // …and index all other steps in the background for totals
      })
      .catch(function (err) {
        els.article.innerHTML =
          '<h1>Setup error</h1><p>Could not load <code>content/manifest.json</code> ('
          + esc(err.message) + "). Serve the folder over HTTP, not <code>file://</code>.</p>";
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
