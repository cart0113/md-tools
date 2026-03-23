# Docsify Extension Architecture

## Config Flow: YAML → Python → JS

1. User edits `docs/docsify-ext.yaml` (single source of truth)
2. On commit, pre-commit hook runs Python:
   - `docsify_ext_config.load_config()` reads and validates the YAML
   - `docsify_ext_config.generate_config_js()` writes `docs/themes/docsify-ext-config.js`
   - `sidebar_builder.write_sidebar()` receives `top_level_folders_only` flag from config
3. Generated JS file is loaded first in `<head>`:
   - Sets `window.__docsifyExtConfig` object
   - Applies CSS classes to `<html>` before docsify renders (`ext-no-hamburger`, `ext-no-github-corner`, `ext-has-top-nav`)
4. `docs/index.html` reads config to set docsify options (`subMaxLevel`, `repo`) and conditionally load plugins

## Plugin Architecture

All plugins are docsify plugins (functions receiving `hook`). They are conditionally included in the `plugins` array based on config flags:

| Plugin | File | Config gate |
|--------|------|-------------|
| `codeEnhancementsPlugin` | `code-enhancements.js` | Always active |
| `collapsibleFoldersPlugin` | `collapsible-folders.js` | Always active |
| `themePickerPlugin` | `theme-picker.js` | `theme_picker` |
| `sidebarNavPlugin` | `sidebar-nav.js` | `document_inline_sidebar_selector` |
| `topNavPlugin` | `top-nav.js` | `top_level_folders_as_top_control` |

## CSS Layers

- `code-one.css` — base theme (colors, typography, layout)
- `color-themes.css` — palette overrides via CSS class selectors
- `docsify-ext.css` — extension styles (indicator, collapsible folders, top nav, config toggles)

## Key Files

- `docs/docsify-ext.yaml` — config source of truth
- `src/md_tools/docsify_ext_config.py` — config reader and JS generator
- `src/md_tools/sidebar_builder.py` — sidebar generator with top-level validation
- `docs/themes/docsify-ext-config.js` — generated JS config (do not edit manually)
- `.git/hooks/pre-commit` — build orchestration
