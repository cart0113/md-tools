# Walker

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
