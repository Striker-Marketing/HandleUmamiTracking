# GTM DOM Loaded

```
<script>
  document.head.appendChild(Object.assign(document.createElement("script"), {
    src: `https://cdn.jsdelivr.net/gh/Striker-Marketing/HandleUmamiTracking@1/script.min.js?cb=${Math.floor(Date.now() / 600000)}`,
  }));
</script>
```