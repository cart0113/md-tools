# md-tools

Two things live here: **markdown processing tools** and **docsify themes**.

## Markdown Tools

A Python library for recursively processing markdown files. A walker traverses
a directory tree, finds all `.md` files, and applies a pluggable processing
function to each one. The first built-in formatter reformats markdown tables to
fixed-width alignment.

## Docsify Themes

A custom docsify theme (`code-one`) with a color picker, syntax-highlighted
code blocks with line numbers, and a sidebar navigation indicator. Includes a
sidebar builder tool that auto-generates `_sidebar.md` from a numbered
filesystem structure.
