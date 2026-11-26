/* Cookie consent and tracking. Nothing is loaded before the visitor chooses.
   Categories: "statistiche" (Google Analytics 4) and "marketing" (Google Ads, Meta pixel).
   The choice is kept in localStorage for six months, then asked again.
   IDs come from hugo.toml ([params.tracciamento]) through the #tracciamento JSON block;
   outside a production build ("hugo server") the scripts are not loaded, only logged. */
(function () {
  "use strict";
  var cfgEl = document.getElementById("tracciamento"), banner = document.getElementById("consenso");
  if (!cfgEl || !banner) return;
  var cfg = JSON.parse(cfgEl.textContent), KEY = "consenso-cookie", MAX_AGE = 1000 * 60 * 60 * 24 * 182;
  var loaded = { statistiche: false, marketing: false };

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      return v && Date.now() - v.quando < MAX_AGE ? v : null;
    } catch (e) { return null; }
  }
  function save(statistiche, marketing) {
    var v = { statistiche: statistiche, marketing: marketing, quando: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* private mode: ask again next visit */ }
    return v;
  }
  function script(src) {
    var s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s);
  }

  function gtagBase(v) {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    var ads = v.marketing ? "granted" : "denied";
    window.gtag("consent", "default", {
      analytics_storage: v.statistiche ? "granted" : "denied",
      ad_storage: ads, ad_user_data: ads, ad_personalization: ads
    });
    window.gtag("js", new Date());
    script("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(v.statistiche && cfg.ga4 ? cfg.ga4 : cfg.ads));
  }

  function apply(v) {
    if (!cfg.attivo) { console.info("[consenso] anteprima: nessuno script caricato", v); return; }
    if (v.statistiche && !loaded.statistiche && cfg.ga4) {
      gtagBase(v); window.gtag("config", cfg.ga4); loaded.statistiche = true;
    }
    if (v.marketing && !loaded.marketing) {
      if (cfg.ads) { gtagBase(v); window.gtag("config", cfg.ads); }
      if (cfg.meta_pixel) {
        /* Meta pixel base code */
        (function (f, b, e, u, n, t, s) {
          if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
          if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
          t = b.createElement(e); t.async = true; t.src = u; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
        })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
        window.fbq("init", cfg.meta_pixel); window.fbq("track", "PageView");
      }
      loaded.marketing = true;
    }
  }

  /* Google Ads conversion: a click on a booking link, as on the previous site. */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-prenota]");
    if (a && loaded.marketing && cfg.ads_conversione && window.gtag) {
      window.gtag("event", "conversion", { send_to: cfg.ads_conversione });
    }
  });

  var boxS = banner.querySelector("[name=statistiche]"), boxM = banner.querySelector("[name=marketing]");
  var prefs = banner.querySelector(".consenso-preferenze");
  function open(withPrefs) {
    var v = read();
    boxS.checked = !!(v && v.statistiche); boxM.checked = !!(v && v.marketing);
    prefs.hidden = !withPrefs; banner.hidden = false;
  }
  function choose(statistiche, marketing) {
    var before = read(), v = save(statistiche, marketing);
    banner.hidden = true;
    /* A withdrawn consent cannot unload scripts already running: reload without them. */
    if (before && ((before.statistiche && !statistiche) || (before.marketing && !marketing))) { location.reload(); return; }
    apply(v);
  }
  banner.querySelector("[data-consenso=accetta]").addEventListener("click", function () { choose(true, true); });
  banner.querySelector("[data-consenso=rifiuta]").addEventListener("click", function () { choose(false, false); });
  banner.querySelector("[data-consenso=salva]").addEventListener("click", function () { choose(boxS.checked, boxM.checked); });
  banner.querySelector("[data-consenso=preferenze]").addEventListener("click", function () { prefs.hidden = !prefs.hidden; });
  /* Footer link and the links written in the cookie policy (plain Markdown, no data attribute). */
  document.querySelectorAll('[data-apri-consenso], a[href="#consenso"]').forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); open(true); });
  });

  var saved = read();
  if (saved) apply(saved); else open(false);
})();
