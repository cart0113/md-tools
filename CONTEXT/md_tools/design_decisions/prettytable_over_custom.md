---
description: Why prettytable instead of hand-rolled table alignment code
---

# PrettyTable Over Custom

## Rationale

- **MARKDOWN style built in.** PrettyTable has a `set_style(MARKDOWN)` mode that
  outputs pipe-delimited tables with alignment markers. No need to manually
  construct separator rows or pad cells.
- **Multiline wrapping for free.** Setting `max_width` per column automatically
  wraps long cell content into multiple rows. Custom wrapping logic is fiddly
  and error-prone — prettytable handles word boundaries, padding, and alignment
  across wrapped rows.
- **Alignment preservation.** The `:---`, `:---:`, `---:` indicators from the
  original markdown table are parsed and mapped to prettytable's `align` property.
- **Well-tested library.** Table rendering edge cases (empty cells, mixed widths,
  unicode) are already handled.
