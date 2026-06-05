const handleUmamiTracking = () => {
  if (!window.umami) return;

  const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const STORAGE_KEY = "utm_attribution";

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
        return originalTrack(eventName, Object.assign({ page_url: url }, utms, eventData || {}));
      }
      // Object form is for overriding the pageview payload — pass through untouched.
      return originalTrack(eventName);
    };
  }

  // 1. Capture UTMs from the current URL and persist them for the session.
  const incomingUtms = readUtmsFromUrl();
  if (Object.keys(incomingUtms).length > 0) {
    saveUtms(incomingUtms);
  }

  // 2. Make every future umami.track() call carry the stored UTMs.
  const storedUtms = loadUtms();
  attachUtmsToTrack(storedUtms);

  // 3. Track the initial pageview (it'll pick up the UTMs via the wrapper).
  window.umami.track("Page View");
};
handleUmamiTracking();
