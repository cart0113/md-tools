---
title: Theme Comparison
type: reference
created: 2026-03-22
---

# Inkwell vs Graphite

Both themes address the same core complaints with default docsify themes:
too light, washed-out code blocks, and weak visual hierarchy.

## Graphite

Aesthetic: cool, technical, GitHub-flavored.

- Sans-serif throughout (system font stack)
- Cool gray background (#f6f7f9) with blue accent (#0969da)
- Code blocks: dark (GitHub dark style), subtle shadow, language label badge
- Tables: uppercase header labels, striped rows, full border
- Callouts: blue-tinted info boxes
- Compact spacing, tight line height (1.65)
- Best for: API docs, technical references, developer tools

## Inkwell

Aesthetic: warm, editorial, Stripe/Sphinx-flavored.

- Serif headings (Georgia), sans-serif body for nav/tables
- Warm cream background (#faf8f5) with burnt-orange accent (#b35c1e)
- Code blocks: dark (Catppuccin Mocha palette), stronger shadow, language badge
- Tables: warm-toned header, striped rows
- Callouts: warm amber-tinted boxes
- More generous spacing, taller line height (1.75)
- Best for: guides, tutorials, narrative documentation

## Shared design decisions

Both themes share these improvements over stock docsify:

1. Darker, more readable body text (#24292f / #2c2c2c vs docsify default)
2. Dark code blocks with monospace font stack and generous padding
3. Language label badges on code blocks (via `data-lang` attribute)
4. Distinct inline code styling with background + border
5. Striped, bordered tables with hover highlighting
6. Active sidebar items use the accent color as background
7. Styled blockquotes that read as callout boxes
8. Custom scrollbars
9. Fully standalone — no base docsify theme required
