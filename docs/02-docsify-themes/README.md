# Docsify Themes

This project includes `code-one`, a custom docsify theme designed for
readability and code-heavy documentation.

## Features

- **Color picker** — switch between Parchment, Slate, Nord, and Solarized
  palettes from the sidebar
- **Syntax highlighting** — Prism-based with themed token colors that adapt
  to the active palette
- **Line numbers** — automatic line numbering on all code blocks
- **Copy button** — one-click copy on hover for code blocks
- **Sidebar indicator** — a spanning bar highlights the active page and
  current section

## Using in Another Project

Include the base docsify layout, then layer `code-one.css` on top:

```html
<!-- base docsify layout (required) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@4/lib/themes/vue.css">

<!-- code-one theme -->
<link rel="stylesheet" href="themes/code-one.css">

<!-- color palette overrides -->
<link rel="stylesheet" href="themes/color-themes.css">
```

Load the plugins before docsify:

```html
<script src="themes/theme-picker.js"></script>
<script src="themes/code-enhancements.js"></script>
<script src="themes/sidebar-nav.js"></script>
```

Then add them to the docsify config:

```javascript
window.$docsify = {
  plugins: [codeEnhancementsPlugin, themePickerPlugin, sidebarNavPlugin],
}
```

## Theme Files

| File                 | Purpose                                    |
|----------------------|--------------------------------------------|
| `code-one.css`       | Base theme — layout, typography, code       |
| `color-themes.css`   | Color palette definitions for the picker   |
| `theme-picker.js`    | Sidebar color picker widget                |
| `code-enhancements.js` | Line numbers and copy button            |
| `sidebar-nav.js`     | Active section bar indicator               |
