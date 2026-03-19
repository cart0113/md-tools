# Table Formatter

Parses markdown tables and re-renders them as fixed-width-aligned using
[prettytable](https://github.com/jazzband/prettytable).

## The Problem

LLMs generate markdown tables like this:

```markdown
| Scenario | Action |
|----------|--------|
| Different dates | Separate incidents |
| Same event with new sources/details | Merge into existing incident |
```

These look ragged in any fixed-width viewer — columns don't line up, and the
pipe characters zigzag across the page.

## The Solution

`reformat_tables()` finds every markdown table in a string, parses headers,
alignment, and rows, then re-renders with padded columns:

```markdown
| Scenario                            | Action                       |
| :-----------------------------------| :----------------------------|
| Different dates                     | Separate incidents           |
| Same event with new sources/details | Merge into existing incident |
```

## Column Width Strategy

When a table would exceed `max_line_width`, the formatter distributes space
intelligently:

1. Columns that fit within a fair share keep their natural width
2. Only wide columns get wrapped into multiline cells
3. Narrow columns are never squeezed

This avoids the default prettytable behavior of proportional squeezing, which
can truncate short columns like "Yes" to "Ye".

## Alignment Preservation

The original table's alignment indicators are preserved:

| Markdown | Meaning | prettytable |
|:---------|:-------:|------------:|
| `:---`   | left    | `l`         |
| `:---:`  | center  | `c`         |
| `---:`   | right   | `r`         |
