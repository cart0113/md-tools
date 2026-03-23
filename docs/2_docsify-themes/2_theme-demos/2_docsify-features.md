# Docsify Features Demo

A tour of special docsify markdown extensions and formatting features.

## Alerts / Callouts

Docsify supports several tip/warning/danger callout styles:

> [!NOTE]
> This is a **note** callout. Use it for general information that readers
> should be aware of.

> [!TIP]
> This is a **tip** callout. Use it for helpful suggestions or best practices.

> [!WARNING]
> This is a **warning** callout. Use it when something could cause problems
> if not handled carefully.

> [!ATTENTION]
> This is an **attention** callout. Use it for critical information that
> must not be overlooked.

## Emphasis and Formatting

Regular text with **bold**, *italic*, ***bold italic***, ~~strikethrough~~,
and `inline code` formatting.

Keyboard keys: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>

Superscript using HTML: x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup>

Subscript: H<sub>2</sub>O

## Links

- [Internal link to Home](/)
- [Internal link to Walker page](walker.md)
- [External link to Docsify docs](https://docsify.js.org)
- [Link with title](https://github.com "GitHub Homepage")

## Images

Docsify supports images with optional sizing:

![Placeholder](https://via.placeholder.com/600x200/2d3748/e2e8f0?text=Theme+Preview ':size=600x200')

With custom size:

![Small image](https://via.placeholder.com/200x100/4a5568/e2e8f0?text=200x100 ':size=200x100')

## Task Lists

- [x] Set up project structure
- [x] Create base theme CSS
- [x] Add sidebar navigation
- [ ] Write documentation
- [ ] Publish to npm

## Tables

### Simple Table

| Feature       | Status    |
|---------------|-----------|
| Sidebar       | Done      |
| Search        | Done      |
| Theme picker  | Done      |
| Code blocks   | Done      |

### Wide Table

| Module           | Description                          | Lines | Status      | Priority |
|------------------|--------------------------------------|-------|-------------|----------|
| table_formatter  | Reformat markdown tables             | 280   | Stable      | High     |
| walker           | Recursive file processor             | 150   | Stable      | High     |
| cli              | Command-line interface               | 90    | Beta        | Medium   |
| plugins          | Formatter plugin system              | 200   | In Progress | Low      |

### Aligned Columns

| Left-aligned | Center-aligned | Right-aligned |
|:-------------|:--------------:|--------------:|
| Left         |    Center      |         Right |
| Content      |    Content     |       Content |
| Here         |    Here        |          Here |

## Blockquotes

> A simple single-line blockquote.

> A multi-line blockquote. This one spans multiple lines to show how the
> theme handles longer quoted content. It should maintain consistent styling
> across the full block.

Nested blockquotes:

> Outer quote
>> Inner quote
>>> Deeply nested quote

## Horizontal Rules

Content above the rule.

---

Content between rules.

***

Content below the rules.

## Definition-Style Lists

Using bold terms with descriptions:

**md-tools**
: A recursive markdown processing toolkit.

**table-formatter**
: A module that reformats markdown tables to fixed-width columns.

**walker**
: A module that recursively processes files in a directory tree.

## HTML Details / Collapsible Sections

<details>
<summary>Click to expand this section</summary>

This content is hidden by default. It can contain any markdown:

- List items
- **Bold text**
- `Code spans`

```python
print("Code blocks work inside details too")
```

</details>

<details>
<summary>Another collapsible section</summary>

| Column A | Column B |
|----------|----------|
| Data     | Data     |
| More     | More     |

</details>

## Embedded HTML

<div style="padding: 1em; border: 2px dashed var(--theme-color, #42b983); border-radius: 8px; margin: 1em 0;">
  <strong>Custom HTML block</strong> — This uses a dashed border with the
  theme accent color. Useful for special callouts or custom layouts.
</div>

## Footnote-Style References

This paragraph references a concept [^1] and another detail [^2].

[^1]: First footnote — docsify doesn't natively render footnotes, but this
shows how the raw markdown looks in the theme.

[^2]: Second footnote — some plugins add footnote support.

## Mixed Content Section

This section combines several elements to test spacing and flow:

> [!TIP]
> Start by reading the **Walker** docs before diving into plugins.

Here's a quick example:

```python
import md_tools

walker = md_tools.Walker("/path/to/docs")
walker.process()
```

The output looks like this:

| File              | Tables Found | Reformatted |
|-------------------|--------------|-------------|
| README.md         | 3            | Yes         |
| api-reference.md  | 7            | Yes         |
| changelog.md      | 0            | No          |

Key takeaways:

1. The walker finds all markdown files recursively
2. Each file is checked for tables
3. Tables are reformatted in-place

- [x] Walker scans directories
- [x] Formatter processes tables
- [ ] Plugins handle custom formats

---

*End of the docsify features demo.*
