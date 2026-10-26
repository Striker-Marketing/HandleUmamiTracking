# HandleUmamiTracking

## Script tag

```
<script
  src="https://cdn.jsdelivr.net/gh/Striker-Marketing/HandleUmamiTracking@2/script.min.js"
  data-website-id="YOUR-UMAMI-WEBSITE-ID"
  defer></script>
```

The script reads `data-website-id` from its own tag and injects the Umami script (`https://umami.striker.marketing/script.js`), so the site must not also include the Umami `<script>` tag.

To capture extra URL params beyond the default UTMs, list them comma-separated:

```
<script
  src="https://cdn.jsdelivr.net/gh/Striker-Marketing/HandleUmamiTracking@2/script.min.js"
  data-website-id="YOUR-UMAMI-WEBSITE-ID"
  data-additional-params="gclid,fbclid"
  defer></script>
```

To also load the Umami session recorder (`https://umami.striker.marketing/recorder.js`, same website ID), add `data-recorder="true"`:

```
<script
  src="https://cdn.jsdelivr.net/gh/Striker-Marketing/HandleUmamiTracking@2/script.min.js"
  data-website-id="YOUR-UMAMI-WEBSITE-ID"
  data-recorder="true"
  defer></script>
```

## GTM DOM Loaded

Without `data-website-id` on the tag, nothing runs automatically, so you can still load it and call the function manually (e.g. from a GTM tag):

```
<script>
  document.head.appendChild(Object.assign(document.createElement("script"), {
    src: "https://cdn.jsdelivr.net/gh/Striker-Marketing/HandleUmamiTracking@2/script.min.js?cb=" + Math.floor(Date.now() / 600000),
    onload: function () { handleUmamiTracking("YOUR-UMAMI-WEBSITE-ID", ["gclid", "fbclid"], true); }, // 3rd arg: load recorder
  }));
</script>
```
