# Sidebar Builder

A Python tool that auto-generates docsify's `_sidebar.md` from the filesystem
structure of the docs folder.

## The Problem

Docsify requires a hand-maintained `_sidebar.md` for cross-page navigation.
This gets out of sync as pages are added, removed, or reordered. There is no
built-in auto-generation.

## How It Works

Files and folders use a numeric prefix (`N_`) to control their order in the
sidebar. The prefix is stripped from all display text — users never see it.
Files and folders are treated identically and share one number sequence per
directory level.

### Filesystem Convention

```
docs/
├── 0_overview/
│   └── 0_home.md
├── 1_api/
│   ├── 0_walker.md
│   └── 1_formatter.md
├── 2_guides/
│   ├── 0_getting-started.md
│   └── 1_advanced/
│       ├── 0_plugins.md
│       └── 1_config.md
```

### Generated Sidebar

```markdown
- **Overview**
  - [Home](0_overview/0_home.md)
- **Api**
  - [Walker](1_api/0_walker.md)
  - [Formatter](1_api/1_formatter.md)
- **Guides**
  - [Getting Started](2_guides/0_getting-started.md)
  - **Advanced**
    - [Plugins](2_guides/1_advanced/0_plugins.md)
    - [Config](2_guides/1_advanced/1_config.md)
```

Folders become bold section headers. Files become clickable links. Nesting
follows the filesystem structure — each subfolder adds one level of indentation.

## Display Names

Each page's sidebar link text comes from:

1. The first `# heading` (h1) in the file, if one exists
2. Otherwise, the filename with prefix stripped, hyphens/underscores replaced
   with spaces, and title-cased

Folder labels use the same cleanup on the directory name.

## Validation

The tool errors on numbering problems:

- **Unnumbered items** — any file or folder without a `N_` prefix
- **Duplicate numbers** — two items at the same level with the same prefix
- **Gaps** — numbers that skip values (e.g., 0, 1, 4)
- Skipped files: `_sidebar.md`, `_navbar.md`, `_coverpage.md`
- Directories with no `.md` files (like asset folders) are skipped entirely

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

if ! git diff --cached --name-only | grep -q '^docs/'; then
    exit 0
fi

PYTHONPATH="${REPO_ROOT}/src" python-main -c "
import md_tools.sidebar_builder as sb
sb.write_sidebar('${DOCS_DIR}')
"

git add "${SIDEBAR}"
```

Make it executable:

```bash
chmod +x .git/hooks/pre-commit
```

Commits that touch `docs/` will regenerate `_sidebar.md` automatically.
