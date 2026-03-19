"""Recursively walk a folder and apply a processing function to every .md file.

The walker finds all markdown files, reads them, applies the given function,
and writes back the result if the content changed.
"""

import pathlib


def walk_and_apply(folder_path, process_fn):
    """Recursively find all .md files under folder_path and apply process_fn to each.

    Args:
        folder_path: root directory to walk
        process_fn: callable that takes (text: str, file_path: pathlib.Path) -> str
            receives the file content and path, returns the transformed content

    Returns:
        list of pathlib.Path for files that were modified
    """
    root = pathlib.Path(folder_path)
    modified = []
    for md_file in sorted(root.rglob("*.md")):
        original = md_file.read_text(encoding="utf-8")
        result = process_fn(original, md_file)
        if result != original:
            md_file.write_text(result, encoding="utf-8")
            modified.append(md_file)
    return modified
