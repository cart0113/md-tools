# Sidebar Builder

A Python tool that auto-generates docsify's `_sidebar.md` from the filesystem
structure of the docs folder.

## The Problem

Docsify requires a hand-maintained `_sidebar.md` for cross-page navigation.
This gets out of sync as pages are added, removed, or reordered. There is no
built-in auto-generation.

## How It Works

Files and folders use a two-digit numeric prefix (`NN-`) to control their order
in the sidebar. The prefix is stripped in the display text — users never see it.

### Filesystem Convention

```
docs/
├── README.md
├── 01-introduction.md
├── 02-usage.md
├── 03-api/
│   ├── 01-walker.md
│   ├── 02-table-formatter.md
│   └── 03-sidebar-builder.md
└── 04-themes.md
```

### Generated Sidebar

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

Link hrefs keep the numeric prefixes (docsify needs the real filenames). Only
the display text is cleaned.

## Display Names

Each page's sidebar link text comes from:

1. The first `# heading` (h1) in the file, if one exists
2. Otherwise, the filename with prefix stripped, hyphens replaced with spaces,
   and title-cased

Folders use their directory name with the same cleanup. If a folder contains a
`README.md`, the folder entry becomes a clickable link to that page.

## Special Files

- `README.md` — no prefix needed. At the root level it becomes the Home `/`
  link. Inside a subdirectory it becomes the folder's clickable link.
- `_sidebar.md`, `_navbar.md`, `_coverpage.md` — always skipped.
- Directories with no `.md` files (like an assets folder) are skipped entirely.

## Validation

The tool errors on numbering problems:

- **Duplicate numbers** — two items at the same level with the same prefix
- **Gaps** — numbers that skip values (e.g., 01, 02, 05)
- **Mixed** — numbered and unnumbered items at the same level
- **Bad format** — prefixes that aren't zero-padded two digits (e.g., `1-` instead of `01-`)

## Usage

```python
import md_tools.sidebar_builder as sidebar_builder

content = sidebar_builder.build_sidebar("docs")

sidebar_builder.write_sidebar("docs")
```

## Git Pre-Commit Hook

The sidebar can be rebuilt automatically on every commit. Create
`.git/hooks/pre-commit`:

```bash
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
DOCS_DIR="${REPO_ROOT}/docs"
SIDEBAR="${DOCS_DIR}/_sidebar.md"

# Only rebuild if docs/ files are being committed
if ! git diff --cached --name-only | grep -q '^docs/'; then
    exit 0
fi

PYTHONPATH="${REPO_ROOT}/src" python-main -c "
import md_tools.sidebar_builder as sb
sb.write_sidebar('${DOCS_DIR}')
"

# Stage the updated sidebar
git add "${SIDEBAR}"
```

Make it executable:

```bash
chmod +x .git/hooks/pre-commit
```

Now any commit that touches files under `docs/` will regenerate `_sidebar.md`
and include it in the commit. Commits that don't touch docs are unaffected.
