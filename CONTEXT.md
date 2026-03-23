# md-tools

Pluggable markdown processing tools. A generic walker applies tool functions to
all `.md` files in a directory tree. Currently ships one tool (table formatter);
more may be added following the same `(text, file_path) -> text` pattern.

## Python

- Use `python-main` and `ruff-main`
- Source lives in `src/md_tools/`

## Key Dependencies

- prettytable: table parsing and fixed-width rendering
