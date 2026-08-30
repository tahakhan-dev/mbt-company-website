/*! MBT first-party analytics — cookie-less, no PII, DNT/GPC-respecting. ~2KB gz */
(function () {
  "use strict";
  // ---- privacy gates -------------------------------------------------------
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl) return;
  if (location.pathname.indexOf("/admin") === 0) return;
  var store, session;
  try {
    store = window.localStorage;
    session = window.sessionStorage;
    if (store.getItem("disable_tracking")) return;
  } catch (e) {
    return;
  }

  var ENDPOINT =
    (document.currentScript && document.currentScript.getAttribute("data-endpoint")) ||
    "/api/collect";
  var VID_MAX_AGE = 13 * 30 * 24 * 3600 * 1000; // ~13 months
  var IDLE_ROTATE = 30 * 60 * 1000; // 30 min

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  // ---- identity ------------------------------------------------------------
  var now = Date.now();
  var vid = store.getItem("mbt_vid");
  var vidT = parseInt(store.getItem("mbt_vid_t") || "0", 10);
  if (!vid || now - vidT > VID_MAX_AGE) {
    vid = uuid();
    store.setItem("mbt_vid", vid);
    store.setItem("mbt_vid_t", String(now));
  }
  var sid = session.getItem("mbt_sid");
  var sidT = parseInt(session.getItem("mbt_sid_t") || "0", 10);
  var startedAt = parseInt(session.getItem("mbt_sid_s") || "0", 10);
  if (!sid || now - sidT > IDLE_ROTATE) {
    sid = uuid();
    startedAt = now;
    session.setItem("mbt_sid", sid);
    session.setItem("mbt_sid_s", String(startedAt));
    session.removeItem("mbt_s_pc");
    session.removeItem("mbt_s_ms");
    session.removeItem("mbt_s_dur");
    var utm = {};
    var qs = new URLSearchParams(location.search);
    ["source", "medium", "campaign", "term", "content"].forEach(function (k) {
      var v = qs.get("utm_" + k);
      if (v) utm[k] = v.slice(0, 200);
    });
    session.setItem("mbt_touch", JSON.stringify({ referrer: document.referrer || "", utm: utm }));
  }
  session.setItem("mbt_sid_t", String(now));

  var touch = { referrer: "", utm: {} };
  try {
    touch = JSON.parse(session.getItem("mbt_touch") || "{}") || touch;
  } catch (e) {}

  // ---- state (session-scoped accumulators survive full page loads) ---------
  var queue = [];
  var pageCount = parseInt(session.getItem("mbt_s_pc") || "0", 10) || 0;
  var maxScroll = parseInt(session.getItem("mbt_s_ms") || "0", 10) || 0;
  var durationSec = parseInt(session.getItem("mbt_s_dur") || "0", 10) || 0;
  var visibleSince = document.visibilityState === "visible" ? now : 0;
  var pageEnteredAt = now;
  var sentScroll = {};
  var dirty = false;
  var timer = null;

  function persistState() {
    try {
      session.setItem("mbt_s_pc", String(pageCount));
      session.setItem("mbt_s_ms", String(maxScroll));
      session.setItem("mbt_s_dur", String(durationSec));
    } catch (e) {}
  }

  function device() {
    var w = window.innerWidth;
    return w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop";
  }

  function push(t, meta) {
    queue.push({ t: t, ts: Date.now(), path: location.pathname, meta: meta });
    dirty = true;
    if (queue.length >= 20) flush();
  }

  function accrue() {
    if (visibleSince) {
      durationSec += Math.max(0, Math.round((Date.now() - visibleSince) / 1000));
      visibleSince = Date.now();
    }
  }

  function flush() {
    accrue();
    persistState();
    if (!dirty && queue.length === 0) return;
    var events = queue.splice(0, 50);
    dirty = false;
    var body = JSON.stringify({
      v: 1,
      visitorId: vid,
      sessionId: sid,
      startedAt: startedAt,
      context: {
        referrer: (touch.referrer || "").slice(0, 600),
        language: (navigator.language || "").slice(0, 20),
        viewport: { w: window.innerWidth, h: window.innerHeight },
        device: device(),
        utm: touch.utm || {},
      },
      state: {
        durationSec: durationSec,
        maxScroll: maxScroll,
        pageCount: pageCount,
        path: location.pathname,
      },
      events: events,
    });
    session.setItem("mbt_sid_t", String(Date.now()));
    var sent = false;
    if (navigator.sendBeacon) {
      try {
        sent = navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
      } catch (e) {}
    }
    if (!sent) {
      fetch(ENDPOINT, {
        method: "POST",
        body: body,
        headers: { "content-type": "application/json" },
        keepalive: true,
      }).catch(function () {});
    }
  }

  // Heartbeat cadence decays 15s → 30s → 60s per page (write-budget friendly).
  function delayFor() {
    var onPage = (Date.now() - pageEnteredAt) / 1000;
    return onPage >= 180 ? 60000 : onPage >= 60 ? 30000 : 15000;
  }
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (document.visibilityState === "visible") {
        push("heartbeat");
        flush();
      }
      schedule();
    }, delayFor());
  }

  function pageView() {
    pageCount++;
    pageEnteredAt = Date.now();
    sentScroll = {};
    push("page_view", { ref: pageCount === 1 ? (document.referrer || "direct").slice(0, 300) : "internal" });
    flush();
    schedule();
  }

  // ---- listeners -----------------------------------------------------------
  var scrollTick = false;
  addEventListener(
    "scroll",
    function () {
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(function () {
        scrollTick = false;
        var doc = document.documentElement;
        var total = doc.scrollHeight - window.innerHeight;
        if (total <= 0) return;
        var pct = Math.min(100, Math.round(((window.scrollY || doc.scrollTop) / total) * 100));
        if (pct > maxScroll) maxScroll = pct;
        [25, 50, 75, 100].forEach(function (m) {
          if (pct >= m && !sentScroll[m]) {
            sentScroll[m] = true;
            push("scroll_depth", { depth: m });
          }
        });
      });
    },
    { passive: true }
  );

  addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("[data-cta],a[href]") : null;
    if (!el) return;
    var cta = el.getAttribute && el.getAttribute("data-cta");
    if (cta) push("cta_click", { cta: cta.slice(0, 60) });
    var href = el.getAttribute && el.getAttribute("href");
    if (href && /^https?:\/\//.test(href)) {
      try {
        var host = new URL(href).hostname;
        if (host !== location.hostname) {
          push("outbound_click", { href: host.slice(0, 200) });
          flush();
        }
      } catch (err) {}
    }
  });

  addEventListener("mbt:track", function (e) {
    var t = e && e.detail && e.detail.t;
    if (t === "form_start" && !window.__mbtFormStarted) {
      window.__mbtFormStarted = true;
      push("form_start");
    } else if (t === "form_submit") {
      push("form_submit");
      flush();
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      accrue();
      visibleSince = 0;
      push("heartbeat");
      flush();
    } else {
      visibleSince = Date.now();
    }
  });

  // SPA navigations (Next.js app router patches history).
  var lastPath = location.pathname;
  function onNav() {
    if (location.pathname !== lastPath && location.pathname.indexOf("/admin") !== 0) {
      lastPath = location.pathname;
      pageView();
    }
  }
  ["pushState", "replaceState"].forEach(function (fn) {
    var orig = history[fn];
    history[fn] = function () {
      var out = orig.apply(this, arguments);
      onNav();
      return out;
    };
  });
  addEventListener("popstate", onNav);

  pageView();
})();
