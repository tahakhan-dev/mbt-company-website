/* Aigenvora first-party pageview beacon — no cookies, no fingerprinting.
   Honors Do Not Track / Global Privacy Control. See /privacy. */
(function () {
  if (
    navigator.doNotTrack === "1" ||
    window.doNotTrack === "1" ||
    navigator.globalPrivacyControl === true
  ) {
    return;
  }
  var sid;
  try {
    sid = localStorage.getItem("agv_sid");
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("agv_sid", sid);
    }
  } catch (e) {
    sid = "anon";
  }
  var sent = "";
  var send = function () {
    var path = location.pathname;
    if (path === sent || path.indexOf("/admin") === 0) return;
    sent = path;
    var u = new URLSearchParams(location.search);
    var body = JSON.stringify({
      p: path,
      r: document.referrer || "",
      sid: sid,
      us: u.get("utm_source") || "",
      um: u.get("utm_medium") || "",
      uc: u.get("utm_campaign") || "",
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/collect", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/collect", { method: "POST", body: body, keepalive: true });
    }
  };
  document.addEventListener("astro:page-load", send);
  if (document.readyState === "complete") send();
})();
