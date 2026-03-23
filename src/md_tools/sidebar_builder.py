"""Generate a docsify _sidebar.md from a numbered filesystem structure.

Every .md file and directory at a given level must have a numeric prefix
(e.g., 0_name, 1_name). Files and folders are treated identically — both
are sorted by prefix number. Files become clickable links, folders become
bold section headers with their children indented beneath them. Prefixes
are stripped from all display text.
"""

import pathlib
import re

SKIP_FILES = {"_sidebar.md", "_navbar.md", "_coverpage.md"}
PREFIX_RE = re.compile(r"^(\d+)_(.+)$")
H1_RE = re.compile(r"^#\s+(.+)", re.MULTILINE | re.IGNORECASE)


class SidebarError(Exception):
    pass


def _extract_h1(file_path):
    text = file_path.read_text(encoding="utf-8")
    match = H1_RE.search(text)
    if match:
        return match.group(1).strip()
    return _strip_prefix(file_path.stem)


def _strip_prefix(name):
    match = PREFIX_RE.match(name)
    if match:
        name = match.group(2)
    return name.replace("-", " ").replace("_", " ").title()


def _parse_prefix(name):
    match = PREFIX_RE.match(name)
    if match:
        return int(match.group(1))
    return None


def _has_md_files(directory):
    for p in directory.rglob("*.md"):
        if p.name not in SKIP_FILES:
            return True
    return False


def _collect_items(directory):
    items = []
    for entry in directory.iterdir():
        if entry.name.startswith("_") or entry.name.startswith("."):
            continue
        if entry.is_file():
            if entry.suffix != ".md" or entry.name in SKIP_FILES:
                continue
            items.append(entry)
        elif entry.is_dir():
            if not _has_md_files(entry):
                continue
            items.append(entry)
    return items


def _validate_numbering(items, directory):
    numbered = []

    for item in items:
        prefix = _parse_prefix(item.name)
        if prefix is not None:
            numbered.append((prefix, item))
        else:
            raise SidebarError(
                f"Unnumbered item '{item.name}' in {directory} "
                f"— all files and folders must have a N_ prefix"
            )

    if not numbered:
        return []

    numbered.sort(key=lambda pair: pair[0])

    seen = {}
    for num, item in numbered:
        if num in seen:
            raise SidebarError(
                f"Duplicate number {num} in {directory}: "
                f"'{seen[num].name}' and '{item.name}'"
            )
        seen[num] = item

    nums = [n for n, _ in numbered]
    expected = list(range(nums[0], nums[0] + len(nums)))
    if nums != expected:
        raise SidebarError(
            f"Number gap in {directory}: found {nums}, expected {expected}"
        )

    return [item for _, item in numbered]


def _validate_top_level_folders_only(items, directory):
    for item in items:
        if item.is_file():
            raise SidebarError(
                f"Top-level file '{item.name}' in {directory} "
                f"— when top_level_folders_as_top_control is true, "
                f"all top-level items must be folders"
            )


def _build_tree(docs_root, current_dir, depth, top_level_folders_only):
    indent = "  " * depth
    lines = []

    items = _collect_items(current_dir)
    ordered = _validate_numbering(items, current_dir)

    if depth == 0 and top_level_folders_only:
        _validate_top_level_folders_only(ordered, current_dir)

    for item in ordered:
        if item.is_file():
            title = _extract_h1(item)
            rel_path = item.relative_to(docs_root)
            lines.append(f"{indent}- [{title}]({rel_path})")
        elif item.is_dir():
            label = _strip_prefix(item.name)
            lines.append(f"{indent}- **{label}**")
            lines.extend(
                _build_tree(docs_root, item, depth + 1, top_level_folders_only)
            )

    return lines


def build_sidebar(docs_folder, top_level_folders_only):
    docs_root = pathlib.Path(docs_folder)
    lines = _build_tree(docs_root, docs_root, 0, top_level_folders_only)
    return "\n".join(lines) + "\n"


def write_sidebar(docs_folder, top_level_folders_only):
    docs_root = pathlib.Path(docs_folder)
    content = build_sidebar(docs_root, top_level_folders_only)
    sidebar_path = docs_root / "_sidebar.md"
    sidebar_path.write_text(content, encoding="utf-8")
    return sidebar_path
