---
description: Design and behavior of the sidebar builder — numbered filesystem convention, validation rules, output format
---

# Sidebar Builder — Design

## Problem

Docsify requires a hand-maintained `_sidebar.md` for cross-page navigation.
This gets out of sync as pages are added, removed, or reordered. There is no
built-in auto-generation.

## Solution

A Python tool that generates `_sidebar.md` from the filesystem structure of the
docs folder. Ordering is controlled by numeric prefixes on files and folders.
The prefixes are stripped in the sidebar output so users never see them.

## Filesystem Convention

Every `.md` file and every directory must have a two-digit numeric prefix.
Files and folders share a single number sequence per directory level — no
number can be used by both a file and a folder.

```
docs/
├── 01-home.md
├── 02-markdown-tools/
│   └── 01-overview.md
├── 03-docsify-themes/
│   ├── 01-overview.md
│   ├── 02-sidebar-builder.md
│   └── 03-code-blocks.md
```

### Prefix Format

- Pattern: `NN-` where NN is a zero-padded two-digit number (01, 02, ... 99)
- The prefix and its trailing hyphen are stripped for display
- The remainder becomes the display name (with h1 override — see below)

### Skipped Files

- `_sidebar.md`, `_navbar.md`, `_coverpage.md` — always skipped
- Files starting with `_` or `.` — skipped
- Non-`.md` files — skipped
- Directories with no `.md` files anywhere inside them — skipped

There are no special files. `README.md` is not allowed — it will trigger a
validation error like any other unnumbered file.

## Display Name Resolution

For each `.md` file, the sidebar link text is determined by:

1. The first `# heading` (h1) in the file, if one exists
2. Otherwise, the filename with prefix stripped, hyphens/underscores replaced
   with spaces, and title-cased

Folders use their directory name with the same prefix-stripping and
title-casing logic. Folders appear as bold non-clickable labels in the sidebar.

## Sidebar Output

The generated `_sidebar.md` mirrors the filesystem hierarchy:

```markdown
- [md-tools](01-home.md)
- **Markdown Tools**
  - [Markdown Tools](02-markdown-tools/01-overview.md)
- **Docsify Themes**
  - [Docsify Themes](03-docsify-themes/01-overview.md)
  - [Sidebar Builder](03-docsify-themes/02-sidebar-builder.md)
  - [Code Blocks Demo](03-docsify-themes/03-code-blocks.md)
```

Link hrefs keep the numeric prefixes (docsify needs the real filenames). Only
the display text is cleaned.

## Docsify Homepage

Since there is no `README.md`, the docsify config must set `homepage` to point
to the numbered home page:

```javascript
window.$docsify = {
  homepage: '01-home.md',
  nameLink: '/#/01-home',
}
```

## Validation Rules

The tool errors (not warns) on numbering problems:

- **Unnumbered items**: any file or folder without a `NN-` prefix is an error
- **Duplicate numbers**: two items at the same level sharing a prefix
  (e.g., `01-foo.md` and `01-bar/` in the same directory)
- **Gaps**: numbers that skip values (e.g., 01, 02, 05 — missing 03, 04)
- **Invalid prefix format**: prefixes that aren't zero-padded two digits
  (e.g., `1-foo.md` instead of `01-foo.md`)

Errors are raised as exceptions with a clear message naming the problem file
and the rule it violates.

## Non-Markdown Files and Asset Directories

Directories that contain zero `.md` files (directly or recursively) are skipped
entirely. This handles asset directories like `themes/` which hold CSS/JS but
no documentation pages.

## API

```python
import md_tools.sidebar_builder as sidebar_builder

content = sidebar_builder.build_sidebar("docs")

sidebar_builder.write_sidebar("docs")
```

- `build_sidebar(docs_folder)` — returns the sidebar markdown as a string
- `write_sidebar(docs_folder)` — writes `_sidebar.md` into the docs folder,
  returns the path written

## Git Pre-Commit Hook

A pre-commit hook at `.git/hooks/pre-commit` auto-rebuilds the sidebar on any
commit that touches `docs/`. The hook runs the sidebar builder and stages the
updated `_sidebar.md`.
