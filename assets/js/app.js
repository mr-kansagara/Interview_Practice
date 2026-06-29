/* ============================================================
   Interview Prep — single-page app
   - loads content/manifest.json
   - builds sidebar, hash-routes, fetches + renders Markdown
   - progress + theme persisted in localStorage
   ============================================================ */
(function () {
  "use strict";

  var LS_THEME = "prep.theme";
  var LS_DONE  = "prep.doneSteps";   // { stepId: true }
  var LS_TASKS = "prep.tasks";       // { taskKey: true }  (dashboard checklist)

  var manifest = null;
  var flatSteps = [];                // ordered list of step objects across tracks
  var byId = {};                     // id -> step object (incl. home)

  var els = {
    nav:        document.getElementById("nav"),
    article:    document.getElementById("article"),
    themeBtn:   document.getElementById("themeBtn"),
    menuBtn:    document.getElementById("menuBtn"),
    backdrop:   document.getElementById("backdrop"),
    miniBar:    document.getElementById("progressMiniBar"),
    miniPct:    document.getElementById("progressMiniPct")
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

  /* ---------- mobile nav ---------- */
  function initMenu() {
    function close() { document.body.classList.remove("nav-open"); }
    els.menuBtn.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
    els.backdrop.addEventListener("click", close);
    window.addEventListener("hashchange", close);
  }

  /* ---------- progress ---------- */
  function doneMap() { return load(LS_DONE); }
  function isDone(id) { return !!doneMap()[id]; }
  function setDone(id, val) {
    var m = doneMap();
    if (val) m[id] = true; else delete m[id];
    save(LS_DONE, m);
    refreshProgress();
  }
  function refreshProgress() {
    var total = flatSteps.length || 1;
    var done = flatSteps.filter(function (s) { return isDone(s.id); }).length;
    var pct = Math.round((done / total) * 100);
    if (els.miniBar) els.miniBar.style.width = pct + "%";
    if (els.miniPct) els.miniPct.textContent = pct + "%";
    // sidebar badges
    document.querySelectorAll(".nav-link[data-id]").forEach(function (a) {
      a.classList.toggle("done", isDone(a.getAttribute("data-id")));
    });
    // dashboard hero bar (if present)
    var hb = document.getElementById("dashBar");
    if (hb) {
      hb.style.width = pct + "%";
      var c = document.getElementById("dashCount");
      if (c) c.textContent = done + " / " + total;
    }
  }

  /* ---------- sidebar ---------- */
  function buildNav() {
    var html = "";
    var h = manifest.home;
    html += '<a class="nav-link nav-home" data-route="#/" href="#/">'
          + '<span>🎯</span><span>' + esc(h.title) + '</span></a>';

    manifest.tracks.forEach(function (track) {
      html += '<div class="nav-group-label">' + esc(track.icon + " " + track.label) + "</div>";
      track.steps.forEach(function (step) {
        html += '<a class="nav-link" data-id="' + esc(step.id) + '" data-route="#/' + esc(step.id) + '" href="#/' + esc(step.id) + '">'
              + "<span>" + esc(step.title) + "</span>"
              + '<span class="nav-check">✓</span></a>';
      });
    });
    els.nav.innerHTML = html;
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

    // 5) interactive task lists (dashboard checklist persistence)
    wireTaskLists();
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

      // move the label text into its own <label> for styling
      var key = taskKey(li.textContent || "");
      // stored state wins (incl. an explicit false); otherwise keep the .md default
      if (Object.prototype.hasOwnProperty.call(tasks, key)) box.checked = !!tasks[key];

      // wrap trailing text node(s) in a label
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

  /* ---------- dashboard extras ---------- */
  function injectDashboardHero() {
    var total = flatSteps.length || 1;
    var done = flatSteps.filter(function (s) { return isDone(s.id); }).length;
    var pct = Math.round((done / total) * 100);
    var hero = document.createElement("div");
    hero.className = "dash-hero";
    hero.innerHTML =
      '<h2>Your progress</h2>'
      + '<div class="dash-sub">Steps completed (of the steps built so far): '
      + '<span class="dash-count" id="dashCount">' + done + " / " + total + "</span></div>"
      + '<div class="progress-track"><div class="progress-fill" id="dashBar" style="width:' + pct + '%"></div></div>';
    var h1 = els.article.querySelector("h1");
    if (h1 && h1.nextSibling) h1.parentNode.insertBefore(hero, h1.nextSibling);
    else els.article.insertBefore(hero, els.article.firstChild);
  }

  /* ---------- step footer (mark done + prev/next) ---------- */
  function injectStepFooter(step) {
    // mark-done bar near the top
    var bar = document.createElement("div");
    bar.className = "markdone-bar" + (isDone(step.id) ? " is-done" : "");
    bar.innerHTML =
      '<span class="md-text">' + (isDone(step.id) ? "✅ Marked complete." : "Finished this step?") + "</span>";
    var btn = document.createElement("button");
    btn.className = "btn" + (isDone(step.id) ? " ghost" : "");
    btn.textContent = isDone(step.id) ? "Undo" : "Mark complete";
    btn.addEventListener("click", function () {
      var nowDone = !isDone(step.id);
      setDone(step.id, nowDone);
      bar.classList.toggle("is-done", nowDone);
      btn.textContent = nowDone ? "Undo" : "Mark complete";
      btn.classList.toggle("ghost", nowDone);
      bar.querySelector(".md-text").textContent = nowDone ? "✅ Marked complete." : "Finished this step?";
    });
    bar.appendChild(btn);
    var h1 = els.article.querySelector("h1");
    if (h1 && h1.nextSibling) h1.parentNode.insertBefore(bar, h1.nextSibling);
    else els.article.insertBefore(bar, els.article.firstChild);

    // prev / next
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
    var h = location.hash.replace(/^#\/?/, "");
    return h;
  }

  function route() {
    var id = currentId();
    var target = id && byId[id] ? byId[id] : manifest.home;
    var isHome = target === manifest.home;
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
        renderMarkdown(md);
        if (isHome) injectDashboardHero();
        else injectStepFooter(target);
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
        byId[m.home.id] = m.home;        // home reachable but routed via empty hash
        m.tracks.forEach(function (t) {
          t.steps.forEach(function (s) { flatSteps.push(s); byId[s.id] = s; });
        });
        buildNav();
        refreshProgress();
        window.addEventListener("hashchange", route);
        route();
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
