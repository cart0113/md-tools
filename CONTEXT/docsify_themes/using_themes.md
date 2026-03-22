---
title: Using md-tools Docsify Themes
type: reference
created: 2026-03-22
---

# Using md-tools Docsify Themes in Another Project

This project provides two custom docsify themes. Any project with a docsify
docs site can use them.

## Where the themes live

Repository: `cart0113/md-tools`

Raw GitHub URLs (use these in your `index.html`):

```
https://raw.githubusercontent.com/cart0113/md-tools/main/docs/themes/graphite.css
https://raw.githubusercontent.com/cart0113/md-tools/main/docs/themes/inkwell.css
```

## Option A — link directly from GitHub (simplest)

Replace the CDN theme link in your `docs/index.html`:

```html
<!-- instead of this -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@4/lib/themes/buble.css">

<!-- use one of these -->
<link rel="stylesheet" href="https://raw.githubusercontent.com/cart0113/md-tools/main/docs/themes/graphite.css">
<link rel="stylesheet" href="https://raw.githubusercontent.com/cart0113/md-tools/main/docs/themes/inkwell.css">
```

## Option B — copy the file (more reliable)

Copy the CSS file into your project's `docs/themes/` directory:

```bash
mkdir -p docs/themes
curl -o docs/themes/graphite.css \
  https://raw.githubusercontent.com/cart0113/md-tools/main/docs/themes/graphite.css
```

Then reference it locally:

```html
<link rel="stylesheet" href="themes/graphite.css">
```

## Option C — jsDelivr CDN (cached, fast)

jsDelivr mirrors GitHub repos automatically:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/cart0113/md-tools@main/docs/themes/graphite.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/cart0113/md-tools@main/docs/themes/inkwell.css">
```

## Switching themes

The only change needed is the CSS `<link>` in `index.html`. No JavaScript or
plugin changes are required. Both themes work with docsify's search plugin,
sidebar, and GitHub corner out of the box.

## No CDN base theme needed

These themes are standalone — they do NOT layer on top of buble.css or vue.css.
Remove any existing docsify theme link when switching to Inkwell or Graphite.
