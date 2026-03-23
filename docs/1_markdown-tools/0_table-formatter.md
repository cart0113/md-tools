# Table Formatter

Parses markdown tables and re-renders them as fixed-width-aligned using
[prettytable](https://github.com/jazzband/prettytable).

LLMs generate tables like this:

```markdown
| Scenario | Action |
|----------|--------|
| Different dates | Separate incidents |
| Same event with new sources/details | Merge into existing incident |
```

`reformat_tables()` finds every table, parses headers, alignment, and rows,
then re-renders with padded columns:

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

## Alignment Preservation

The original table's alignment indicators are preserved:

| Markdown | Meaning | prettytable |
|:---------|:-------:|------------:|
| `:---`   | left    | `l`         |
| `:---:`  | center  | `c`         |
| `---:`   | right   | `r`         |
