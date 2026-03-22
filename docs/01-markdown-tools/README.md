# Markdown Tools

A Python library for recursively processing markdown files. The walker finds
`.md` files and applies a processing function to each one. The table formatter
is the first built-in processor.

## Table Formatter

Parses markdown tables and re-renders them as fixed-width-aligned using
[prettytable](https://github.com/jazzband/prettytable).

LLMs generate tables like this:

```markdown
| Scenario | Action |
|----------|--------|
| Different dates | Separate incidents |
| Same event with new sources/details | Merge into existing incident |
```

`reformat_tables()` finds every table, parses headers, alignment, and rows,
then re-renders with padded columns:

```markdown
| Scenario                            | Action                       |
| :-----------------------------------| :----------------------------|
| Different dates                     | Separate incidents           |
| Same event with new sources/details | Merge into existing incident |
```

### Column Width Strategy

When a table would exceed `max_line_width`, the formatter distributes space
intelligently:

1. Columns that fit within a fair share keep their natural width
2. Only wide columns get wrapped into multiline cells
3. Narrow columns are never squeezed

### Alignment Preservation

The original table's alignment indicators are preserved:

| Markdown | Meaning | prettytable |
|:---------|:-------:|------------:|
| `:---`   | left    | `l`         |
| `:---:`  | center  | `c`         |
| `---:`   | right   | `r`         |

## Walker

Recursively traverses a directory tree, finds all `.md` files, and applies a
processing function to each one.

```python
import md_tools.walker as walker

modified_files = walker.walk_and_apply(folder_path, process_fn)
```

**Arguments:**

- `folder_path` — root directory to walk
- `process_fn` — callable with signature `(text: str, file_path: Path) -> str`

**Returns:** list of `Path` objects for files that were actually modified.

The walker is generic — any function that transforms markdown text can be
plugged in. Files are processed in sorted order for deterministic results.
Only files where the output differs from the input are written back.

## Usage

### Reformat Tables in a Folder

```bash
python-main examples/reformat_tables.py /path/to/folder
```

### Example Script

```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

import md_tools.table_formatter as table_formatter
import md_tools.walker as walker


def reformat(text, file_path):
    return table_formatter.reformat_tables(text, max_line_width=120)


target_folder = sys.argv[1]
modified = walker.walk_and_apply(target_folder, reformat)

for path in modified:
    print(f"reformatted: {path}")

if not modified:
    print("no tables needed reformatting")
```

### Composing Formatters

Chain multiple formatters by composing functions:

```python
import md_tools.table_formatter as table_formatter
import md_tools.walker as walker

def pipeline(text, file_path):
    text = table_formatter.reformat_tables(text, max_line_width=120)
    text = some_other_formatter(text)
    return text

walker.walk_and_apply("/my/docs", pipeline)
```
