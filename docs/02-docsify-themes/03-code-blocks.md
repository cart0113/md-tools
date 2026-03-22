# Code Blocks Demo

A showcase of syntax-highlighted code blocks in various languages.

## Python

```python
from pathlib import Path
import hashlib


class FileProcessor:
    """Walk a directory tree and compute checksums."""

    BUFFER_SIZE = 65536

    def __init__(self, root_dir, algorithm):
        self.root_dir = Path(root_dir)
        self.algorithm = algorithm
        self._results = {}

    def process(self):
        for path in self.root_dir.rglob("*"):
            if path.is_file():
                digest = self._hash_file(path)
                self._results[str(path)] = digest
        return self._results

    def _hash_file(self, file_path):
        h = hashlib.new(self.algorithm)
        with open(file_path, "rb") as f:
            while chunk := f.read(self.BUFFER_SIZE):
                h.update(chunk)
        return h.hexdigest()


processor = FileProcessor("/tmp/data", "sha256")
results = processor.process()
for path, digest in results.items():
    print(f"{digest[:12]}  {path}")
```

## Markdown

```markdown
# Project Title

A short description of **what this project does** and who it's for.

## Installation

Install via pip:

- Clone the repository
- Run `pip install -e .`

## Usage

| Flag        | Description          | Default |
|-------------|----------------------|---------|
| `--verbose` | Enable verbose mode  | `false` |
| `--output`  | Output directory     | `./out` |

> **Note:** Requires Python 3.10+.
```

## reStructuredText

```rst
File Processor
==============

.. module:: file_processor
   :synopsis: Recursive file hashing utility.

Overview
--------

The ``FileProcessor`` class walks a directory tree and computes
cryptographic checksums for every file it encounters.

.. code-block:: python

   processor = FileProcessor("/tmp/data", "sha256")
   results = processor.process()

Parameters
~~~~~~~~~~

:param root_dir: Top-level directory to scan.
:type root_dir: str or pathlib.Path
:param algorithm: Hash algorithm name (e.g. ``sha256``, ``md5``).
:type algorithm: str

.. warning::

   Large directory trees may take significant time to process.

.. seealso::

   :mod:`hashlib` — Secure hashes and message digests.
```

## YAML

```yaml
name: ci-pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -e ".[dev]"
      - name: Run tests
        run: pytest tests/ -v --tb=short
```

## JavaScript

```javascript
/**
 * Debounce a function call by the given delay.
 */
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, ...args) {
    const callbacks = this.listeners.get(event) || [];
    for (const cb of callbacks) {
      cb(...args);
    }
  }
}

const bus = new EventBus();
const log = debounce((msg) => console.log(`[event] ${msg}`), 200);

bus.on("data", log);
bus.emit("data", "hello world");
```

## TOML

```toml
[project]
name = "md-tools"
version = "0.4.0"
description = "Recursive markdown processing tools"
requires-python = ">=3.10"
license = "MIT"

[project.scripts]
md-tools = "md_tools.cli:main"

[project.optional-dependencies]
dev = [
    "pytest>=7.0",
    "ruff>=0.4",
    "mypy>=1.10",
]

[tool.ruff]
line-length = 120
target-version = "py310"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "W"]

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-v --tb=short"
```

## Bash

```bash
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
DOCS_DIR="${REPO_ROOT}/docs"

echo "Building docs from ${DOCS_DIR}..."

for md_file in "${DOCS_DIR}"/*.md; do
    filename="$(basename "${md_file}")"
    echo "  Processing: ${filename}"
    wc -l < "${md_file}"
done

echo "Done. $(ls "${DOCS_DIR}"/*.md | wc -l) files processed."
```

## Inline Code in Text

Use `pip install md-tools` to install. The config lives in `pyproject.toml`
under the `[tool.md-tools]` section. Run `md-tools --help` for the full
list of flags. The `--recursive` flag enables directory walking via
`pathlib.Path.rglob()`.
