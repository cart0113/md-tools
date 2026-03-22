# Cache Busting

Local CSS and JS files in `docs/index.html` use query-string versioning
(`?v=YYYYMMDD`) to bust browser caches after changes.

## How it works

Each `<link>` and `<script>` tag for local theme files includes a `?v=` suffix:

```html
<link rel="stylesheet" href="themes/code-one.css?v=20260322">
<script src="themes/sidebar-nav.js?v=20260322"></script>
```

The browser treats each unique URL (including query string) as a separate
resource. Bumping the version forces a fresh fetch even if the file was
previously cached.

## When to bump

Bump the `?v=` value in `docs/index.html` whenever you modify any local
CSS or JS file under `docs/themes/`. Use the current date (`YYYYMMDD`) as
the version — this keeps values monotonically increasing and easy to read.

Files affected:
- `themes/code-one.css`
- `themes/color-themes.css`
- `themes/theme-picker.js`
- `themes/code-enhancements.js`
- `themes/sidebar-nav.js`

CDN-hosted files (docsify core, Prism, search plugin) do not need cache
busting — they use versioned CDN URLs already.
