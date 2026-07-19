(function () {
  "use strict";

  var GA_ID = "G-ZQGB78C9LT";

  var LOCATION_SELECTORS = [
    [".site-header", "header"],
    [".site-footer", "footer"],
    [".status-cta", "home_bottom"],
    [".status-seo-fallback", "seo_fallback"],
    [".article-cta", "article_end"],
    [".install-cta-after-faq", "after_faq"],
  ];

  function track(name, params) {
    if (typeof gtag !== "function") return;
    gtag("event", name, params);
  }

  function labelFrom(el) {
    var text = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (text.length > 80) text = text.slice(0, 80);
    return text;
  }

  function resolveLocation(el, isOauth) {
    var marked = el.closest("[data-track-location]");
    if (marked) {
      var explicit = marked.getAttribute("data-track-location");
      if (explicit) return explicit;
    }

    for (var i = 0; i < LOCATION_SELECTORS.length; i++) {
      if (el.closest(LOCATION_SELECTORS[i][0])) {
        return LOCATION_SELECTORS[i][1];
      }
    }

    if (isOauth && el.closest("#about")) return "hero";
    return "body";
  }

  function isInstallPath(pathname) {
    return pathname === "/install" || pathname === "/install/";
  }

  function hrefInfo(anchor) {
    var raw = anchor.getAttribute("href");
    if (!raw || raw.charAt(0) === "#") return null;

    var url;
    try {
      url = new URL(raw, window.location.href);
    } catch (e) {
      return null;
    }

    var isOauth = url.href.indexOf("discord.com/oauth2/authorize") !== -1;
    var isInstall =
      url.origin === window.location.origin && isInstallPath(url.pathname);

    if (!isOauth && !isInstall) return null;
    return { isOauth: isOauth, isInstall: isInstall };
  }

  function isFaqDetails(el) {
    if (!(el instanceof HTMLDetailsElement)) return false;
    if (el.classList.contains("faq-item")) return true;
    return !!(el.closest(".article-faq") || el.closest("#faq"));
  }

  try {
    if (
      new URLSearchParams(window.location.search).get("debug_mode") === "true" &&
      typeof gtag === "function"
    ) {
      gtag("config", GA_ID, { debug_mode: true });
    }
  } catch (e) {
    /* ignore bad URL */
  }

  document.addEventListener(
    "click",
    function (event) {
      var anchor = event.target && event.target.closest
        ? event.target.closest("a[href]")
        : null;
      if (!anchor) return;

      var info = hrefInfo(anchor);
      if (!info) return;

      var label = labelFrom(anchor);
      var location = resolveLocation(anchor, info.isOauth);

      if (info.isOauth) {
        track("discord_oauth_clicked", {
          location: location,
          label: label,
          page_path: window.location.pathname,
        });
        return;
      }

      track("cta_clicked", {
        location: location,
        label: label,
      });
    },
    false
  );

  document.addEventListener(
    "toggle",
    function (event) {
      var details = event.target;
      if (!isFaqDetails(details) || !details.open) return;

      var summary = details.querySelector("summary");
      var question = labelFrom(summary || details);

      track("faq_opened", {
        question: question,
        page_path: window.location.pathname,
      });
    },
    true
  );
})();
