const handleUmamiTracking = (umamiSiteId, additionalUrlParams = []) => {
  if (!umamiSiteId) {
    console.warn("handleUmamiTracking: umamiSiteId is required");
    return;
  }

  const UMAMI_SRC = "https://umami.striker.marketing/script.js";
  const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", ...additionalUrlParams];
  const STORAGE_KEY = "utm_attribution";

  function getGbUuid() {
    const m = document.cookie.match(/(^|;)\s*gbuuid=([^;]*)/);
    return m ? m[2] : undefined;
  }

  function readUtmsFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const utms = {};
    UTM_KEYS.forEach(function (key) {
      const value = params.get(key);
      if (value) utms[key] = value;
    });
    return utms;
  }

  function saveUtms(utms) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utms));
  }

  function loadUtms() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  }

  function attachUtmsToTrack(utms) {
    const originalTrack = window.umami.track.bind(window.umami);

    window.umami.track = function (eventName, eventData) {
      const isCustomEvent = typeof eventName === "string";
      const url = window.location.href.split("?")[0];
      if (isCustomEvent) {
        // Read at call time — the cookie may not exist yet when setup() runs.
        const gbUuid = getGbUuid();
        return originalTrack(
          eventName,
          Object.assign(
            { page_url: url },
            utms,
            gbUuid ? { gb_uuid: gbUuid } : {},
            eventData || {}
          )
        );
      }
      // Object form is for overriding the pageview payload — pass through untouched.
      return originalTrack(eventName);
    };
  }

  function setup() {
    // 1. Capture UTMs from the current URL and persist them for the session.
    const incomingUtms = readUtmsFromUrl();
    if (Object.keys(incomingUtms).length > 0) {
      saveUtms(incomingUtms);
    }

    // 2. Make every future umami.track() call carry the stored UTMs + gb_uuid.
    const storedUtms = loadUtms();
    attachUtmsToTrack(storedUtms);

    // 3. Send a custom pageview carrying the additional params.
    if (additionalUrlParams.length > 0) {
      window.umami.track("PageView Custom");
    }
  }

  if (window.umami) {
    setup();
    return;
  }

  // Load the Umami tracker, reusing an existing tag if one was already injected.
  const existingScript = document.querySelector('script[src="' + UMAMI_SRC + '"]');
  if (existingScript) {
    existingScript.addEventListener("load", setup);
    return;
  }

  const script = document.createElement("script");
  script.src = UMAMI_SRC;
  script.defer = true;
  script.setAttribute("data-website-id", umamiSiteId);
  script.setAttribute("data-performance", "true");
  script.onload = setup;
  document.head.appendChild(script);
};

// Auto-init when loaded via <script src="..." data-website-id="..."> so no extra call is needed.
// Optional: data-additional-params="gclid,fbclid" to capture extra URL params.
(function () {
  const currentScript = document.currentScript;
  const websiteId = currentScript && currentScript.getAttribute("data-website-id");
  if (!websiteId) return;

  const additionalParams = (currentScript.getAttribute("data-additional-params") || "")
    .split(",")
    .map(function (param) { return param.trim(); })
    .filter(Boolean);

  handleUmamiTracking(websiteId, additionalParams);
})();
