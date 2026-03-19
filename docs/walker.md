# Walker

Recursively traverses a directory tree, finds all `.md` files, and applies a
processing function to each one.

## API

```python
import md_tools.walker as walker

modified_files = walker.walk_and_apply(folder_path, process_fn)
```

**Arguments:**

- `folder_path` — root directory to walk
- `process_fn` — callable with signature `(text: str, file_path: Path) -> str`

**Returns:** list of `Path` objects for files that were actually modified.

## Behavior

- Files are processed in sorted order for deterministic results
- Only writes back files where the output differs from the input
- The `file_path` argument lets formatters make path-dependent decisions
  (e.g., skip certain directories or use different settings per folder)

## Design

The walker is generic — it knows nothing about tables or formatting. Any
function that transforms markdown text can be plugged in. This keeps traversal
logic separate from transformation logic and makes it easy to compose multiple
formatters.
