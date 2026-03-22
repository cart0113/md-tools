"""Generate a docsify _sidebar.md from a numbered filesystem structure.

Files and folders use NN- prefixes to control sidebar order. Prefixes are
stripped for display text. The tool validates numbering and errors on
duplicates, gaps, or mixed numbered/unnumbered items at the same level.
"""

import pathlib
import re

SKIP_FILES = {"_sidebar.md", "_navbar.md", "_coverpage.md"}
PREFIX_RE = re.compile(r"^(\d{2})-(.+)$")
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
            if entry.name.lower() == "readme.md":
                continue
            items.append(entry)
        elif entry.is_dir():
            if not _has_md_files(entry):
                continue
            items.append(entry)
    return items


def _validate_numbering(items, directory):
    numbered = []
    unnumbered = []

    for item in items:
        name = (
            item.name
            if item.is_dir()
            else item.stem
            if item.suffix == ".md"
            else item.name
        )
        prefix = _parse_prefix(item.name)
        if prefix is not None:
            numbered.append((prefix, item))
        else:
            bad_match = re.match(r"^(\d+)-", item.name)
            if bad_match:
                raise SidebarError(
                    f"Invalid prefix format '{item.name}' in {directory} "
                    f"— use two-digit zero-padded prefix (e.g., 01-name)"
                )
            unnumbered.append(item)

    if numbered and unnumbered:
        unnumbered_names = ", ".join(i.name for i in unnumbered)
        raise SidebarError(
            f"Mixed numbered and unnumbered items in {directory}: "
            f"unnumbered: {unnumbered_names}"
        )

    if not numbered:
        return sorted(items, key=lambda i: i.name)

    numbered.sort(key=lambda pair: pair[0])

    seen = {}
    for num, item in numbered:
        if num in seen:
            raise SidebarError(
                f"Duplicate number {num:02d} in {directory}: "
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


def _build_tree(docs_root, current_dir, depth):
    indent = "  " * depth
    lines = []

    readme = current_dir / "README.md"
    if depth == 0 and readme.exists():
        title = _extract_h1(readme)
        lines.append(f"{indent}- [{title}](/)")

    items = _collect_items(current_dir)
    ordered = _validate_numbering(items, current_dir)

    for item in ordered:
        if item.is_file():
            title = _extract_h1(item)
            rel_path = item.relative_to(docs_root)
            lines.append(f"{indent}- [{title}]({rel_path})")
        elif item.is_dir():
            label = _strip_prefix(item.name)
            dir_readme = item / "README.md"
            if dir_readme.exists():
                rel_path = dir_readme.relative_to(docs_root)
                lines.append(f"{indent}- [{label}]({rel_path})")
            else:
                lines.append(f"{indent}- **{label}**")
            lines.extend(_build_tree(docs_root, item, depth + 1))

    return lines


def build_sidebar(docs_folder):
    docs_root = pathlib.Path(docs_folder)
    lines = _build_tree(docs_root, docs_root, 0)
    return "\n".join(lines) + "\n"


def write_sidebar(docs_folder):
    docs_root = pathlib.Path(docs_folder)
    content = build_sidebar(docs_root)
    sidebar_path = docs_root / "_sidebar.md"
    sidebar_path.write_text(content, encoding="utf-8")
    return sidebar_path
