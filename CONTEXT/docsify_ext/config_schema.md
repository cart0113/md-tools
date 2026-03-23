# Docsify Extension Config Schema

The config file lives at `docs/docsify-ext.yaml`. All keys are required (no defaults). The Python config generator validates this on every build.

## Keys

| Key | Type | Description |
|-----|------|-------------|
| `theme_name` | string | CSS theme name (currently only `code-one`) |
| `theme_picker` | bool | Show the floating color palette picker button |
| `document_inline_sidebar_selector` | bool | Show the sidebar bar indicator for document sections |
| `document_header_depth` | int | How many heading levels to show in sidebar (3 = title + h1 + h2) |
| `top_level_folders_as_top_control` | bool | Render top-level folders as a horizontal nav bar at page top |
| `hamburger_menu` | bool | Show the docsify sidebar toggle button |
| `github_corner` | bool | Show the GitHub corner link |

## Validation

When `top_level_folders_as_top_control` is true, the sidebar builder enforces that all top-level items in `docs/` are directories (no loose `.md` files at the root level). This is validated during sidebar generation and will raise `SidebarError` on violation.
