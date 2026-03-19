---
description: Why the walker takes a generic function rather than being table-specific
---

# Walker as Generic Applier

## Rationale

The walker accepts any `process_fn(text, file_path) -> text` rather than being
coupled to table formatting. This keeps the recursive traversal logic separate
from the transformation logic.

- **Composability.** Multiple formatters can be chained by composing functions.
- **Future formatters.** New markdown processing tools (heading normalization,
  link checking, front matter cleanup) plug in without touching the walker.
- **The file_path argument** is passed so formatters can make path-dependent
  decisions (e.g., skip certain directories, use different settings per folder).
