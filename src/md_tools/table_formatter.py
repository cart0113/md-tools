"""Parse markdown tables and reformat them as fixed-width-aligned using prettytable.

Finds all markdown table blocks in a string, parses headers/rows/alignment,
and re-renders them padded and aligned within a max line width.
"""

import re

import prettytable


def _parse_alignment(separator_row):
    """Extract column alignments from the markdown separator row (e.g. |:---|---:|:---:|)."""
    cells = [c.strip() for c in separator_row.strip().strip("|").split("|")]
    alignments = []
    for cell in cells:
        left = cell.startswith(":")
        right = cell.endswith(":")
        if left and right:
            alignments.append("c")
        elif right:
            alignments.append("r")
        else:
            alignments.append("l")
    return alignments


def _parse_row(line):
    """Split a markdown table row into cell values."""
    stripped = line.strip()
    if stripped.startswith("|"):
        stripped = stripped[1:]
    if stripped.endswith("|"):
        stripped = stripped[:-1]
    return [cell.strip() for cell in stripped.split("|")]


def _is_separator_row(line):
    """Check if a line is a markdown table separator (e.g. |---|---|)."""
    stripped = line.strip().strip("|").strip()
    return bool(re.match(r"^[\s:|-]+$", stripped)) and "-" in stripped


def _natural_col_widths(headers, rows):
    """Calculate the natural (unwrapped) width needed for each column."""
    widths = [len(h) for h in headers]
    for row in rows:
        for i, cell in enumerate(row):
            if i < len(widths):
                widths[i] = max(widths[i], len(cell))
    return widths


def _compute_max_widths(headers, rows, max_line_width):
    """Compute per-column max_width values that fit within max_line_width.

    Strategy: give each column its natural width if it fits. If the table is
    too wide, only shrink columns that exceed a fair share, leaving narrow
    columns untouched.
    """
    n_cols = len(headers)
    overhead = 2 + 3 * (n_cols - 1) + 2
    available = max_line_width - overhead
    natural = _natural_col_widths(headers, rows)

    if sum(natural) <= available:
        return natural

    fair_share = available // n_cols
    locked = []
    unlocked = []
    locked_total = 0
    for i, w in enumerate(natural):
        if w <= fair_share:
            locked.append(i)
            locked_total += w
        else:
            unlocked.append(i)

    remaining = available - locked_total
    per_unlocked = remaining // max(len(unlocked), 1)

    result = list(natural)
    for i in unlocked:
        result[i] = max(per_unlocked, len(headers[i]))
    return result


def _render_table(headers, rows, alignments, max_line_width):
    """Render a parsed markdown table using prettytable with fixed-width alignment."""
    table = prettytable.PrettyTable()
    table.field_names = headers
    for row in rows:
        padded = row + [""] * (len(headers) - len(row))
        table.add_row(padded[: len(headers)])
    table.set_style(prettytable.MARKDOWN)
    col_widths = _compute_max_widths(headers, rows, max_line_width)
    for i, header in enumerate(headers):
        table._max_width[header] = col_widths[i]
        table._min_width[header] = min(col_widths[i], len(header))
    for i, alignment in enumerate(alignments):
        table.align[headers[i]] = alignment
    return table.get_string()


def reformat_tables(text, max_line_width):
    """Find all markdown tables in text and reformat them as fixed-width-aligned.

    Args:
        text: markdown content as a string
        max_line_width: maximum character width per line (tables will wrap if needed)

    Returns:
        the text with all markdown tables reformatted
    """
    lines = text.split("\n")
    result = []
    i = 0
    while i < len(lines):
        if "|" in lines[i] and i + 1 < len(lines) and _is_separator_row(lines[i + 1]):
            table_lines = []
            j = i
            while j < len(lines) and "|" in lines[j]:
                table_lines.append(lines[j])
                j += 1
            headers = _parse_row(table_lines[0])
            alignments = _parse_alignment(table_lines[1])
            rows = [_parse_row(line) for line in table_lines[2:]]
            rendered = _render_table(headers, rows, alignments, max_line_width)
            result.append(rendered)
            i = j
        else:
            result.append(lines[i])
            i += 1
    return "\n".join(result)
