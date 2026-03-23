---
description: What md-tools is, its architecture, and how the walker/formatter pattern works
---

# md-tools — Overview

## What It Is

A collection of tools for recursively processing markdown files. The core pattern
is a walker that traverses a directory tree, finds `.md` files, and applies a
pluggable Python function to each one.

## Architecture

Currently one tool in `src/md_tools/`, with the walker designed to support more:

- **`walker.py`** — `walk_and_apply(folder_path, process_fn)` recursively finds
  all `.md` files and applies `process_fn(text, file_path) -> text`. Only writes
  back files that actually changed.

- **`table_formatter.py`** — `reformat_tables(text, max_line_width)` finds all
  markdown tables in a string, parses them, and re-renders them as fixed-width-
  aligned using prettytable. Columns are padded so they line up in monospace fonts.
  Tables that would exceed `max_line_width` get their wide columns wrapped into
  multiline cells while narrow columns keep their natural width.

Future tools would follow the same pattern: a function with signature
`(text, file_path) -> text` that can be passed to the walker.

## Usage Pattern

```python
import md_tools.table_formatter as table_formatter
import md_tools.walker as walker

def reformat(text, file_path):
    return table_formatter.reformat_tables(text, max_line_width=120)

walker.walk_and_apply("/path/to/folder", reformat)
```

The walker is generic — any function that takes `(text, path)` and returns text
can be plugged in. Table formatting is just the first formatter.
