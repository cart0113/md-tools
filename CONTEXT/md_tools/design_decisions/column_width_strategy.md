---
description: Why custom column width distribution instead of prettytable's max_table_width
---

# Column Width Strategy

## The Problem

PrettyTable's `max_table_width` distributes available width proportionally to
content length. This squeezes narrow columns unfairly — a column with "Short"
might get truncated to "Sho" while wide columns still have plenty of room.

## The Solution

Custom width distribution in `_compute_max_widths()`:

1. Calculate each column's natural (unwrapped) width
2. If everything fits within `max_line_width`, use natural widths
3. If not, compute a fair share per column (`available / n_cols`)
4. Columns at or below fair share keep their natural width (locked)
5. Remaining space is divided equally among the wide columns

This ensures narrow columns are never squeezed while wide columns share the
burden of wrapping equally.
