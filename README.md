# GTM DOM Loaded

```
<script>
  document.head.appendChild(Object.assign(document.createElement("script"), {
    src: "https://cdn.jsdelivr.net/gh/Striker-Marketing/HandleUmamiTracking@1/script.min.js?cb=" + Math.floor(Date.now() / 600000),
    onload: function () { handleUmamiTracking("YOUR-UMAMI-WEBSITE-ID"); },
  }));
</script>
```

`handleUmamiTracking` injects the Umami script (`https://umami.striker.marketing/script.js`) with the given website ID, so the site must not also include the Umami `<script>` tag.
