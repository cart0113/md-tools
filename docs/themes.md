# Docsify Themes

This project includes two custom docsify themes designed for readability.

## Graphite

Cool, technical aesthetic inspired by Tailwind and GitHub docs.

- System sans-serif font stack
- Cool gray background with blue accents
- Dark code blocks (GitHub dark style)
- Uppercase table headers, striped rows
- Compact spacing

## Inkwell

Warm, editorial aesthetic inspired by Stripe docs and Sphinx.

- Serif headings (Georgia), sans-serif for navigation
- Cream background with burnt-orange accents
- Dark code blocks (Catppuccin Mocha palette)
- Warm-toned callout boxes
- Generous spacing and taller line height

## Switching Themes

In `docs/index.html`, change the CSS link:

```html
<!-- Graphite (default) -->
<link rel="stylesheet" href="themes/graphite.css">

<!-- Inkwell -->
<link rel="stylesheet" href="themes/inkwell.css">
```

No other changes needed — both themes are standalone and work with docsify's
search plugin, sidebar, and GitHub corner.

## Using in Another Project

Copy the CSS file into your project, or link directly:

```html
<!-- jsDelivr CDN -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/cart0113/md-tools@main/docs/themes/graphite.css">

<!-- or Inkwell -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/cart0113/md-tools@main/docs/themes/inkwell.css">
```

Remove any existing docsify theme link (buble.css, vue.css, etc.) — these
themes are fully standalone.
