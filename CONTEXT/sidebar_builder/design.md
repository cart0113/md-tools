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

Files and folders use a numeric prefix to control sidebar order:

```
docs/
├── 01-introduction.md
├── 02-usage.md
├── 03-api/
│   ├── 01-walker.md
│   ├── 02-table-formatter.md
│   └── 03-sidebar-builder.md
├── 04-themes.md
└── README.md
```

### Prefix Format

- Pattern: `NN-` where NN is a zero-padded two-digit number (01, 02, ... 99)
- The prefix and its trailing hyphen are stripped for display
- The remainder becomes the display name (with h1 override — see below)

### Special Files

- `README.md` — no prefix needed. At the root level it becomes the "Home" `/`
  link. Inside a subdirectory it becomes the folder's clickable link.
- `_sidebar.md`, `_navbar.md`, `_coverpage.md` — always skipped.

## Display Name Resolution

For each `.md` file, the sidebar link text is determined by:

1. The first `# heading` in the file (h1), if one exists
2. Otherwise, the filename with prefix stripped, hyphens/underscores replaced
   with spaces, and title-cased

For folders without a README.md, the folder name is used with the same
prefix-stripping and title-casing logic.

## Sidebar Output

The generated `_sidebar.md` mirrors the filesystem hierarchy:

```markdown
- [Home](/)
- [Introduction](01-introduction.md)
- [Usage](02-usage.md)
- **API**
  - [Walker](03-api/01-walker.md)
  - [Table Formatter](03-api/02-table-formatter.md)
  - [Sidebar Builder](03-api/03-sidebar-builder.md)
- [Themes](04-themes.md)
```

Note: link hrefs keep the numeric prefixes (docsify needs the real filename).
Only the display text is cleaned.

## Validation Rules

The tool errors (not warns) on numbering problems:

- **Duplicate numbers**: two items at the same level sharing a prefix
  (e.g., `01-foo.md` and `01-bar.md` in the same directory)
- **Gaps**: numbers that skip values (e.g., 01, 02, 05 — missing 03, 04)
- **Mixed numbered/unnumbered**: at a given directory level, either all items
  are numbered or none are (excluding special files like README.md). Mixing
  numbered and unnumbered files at the same level is an error.
- **Invalid prefix format**: prefixes that don't match the `NN-` pattern
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
