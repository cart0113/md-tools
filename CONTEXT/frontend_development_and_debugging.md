---
title: Frontend Development and Debugging
type: reference
created: 2026-03-22
---

# Frontend Development and Debugging

How we develop and debug CSS, JS, and docsify theme behavior in this project.

## Debugging approach (in preference order)

### 1. Console logging (preferred)

Add `console.log` calls with a descriptive prefix so output is easy to
identify:

```js
console.log('[sidebar-nav] click', { href: href, isTopLevel: isTopLevel });
```

Bump the cache-bust version in `docs/index.html` (see `cache_busting.md`),
ask for a hard refresh, reproduce the issue, and read the console output.
This gives exact state values at each decision point.

### 2. Screenshots

Screenshots show visual state — which element is highlighted, where the
mouse ended up, whether a section collapsed. Good for confirming CSS
changes and layout shifts.

### 3. Playwright (ask first)

Playwright is available via MCP but is not our first choice. It is slow
for iterative debugging and adds overhead. Only use it when console logs
and screenshots aren't sufficient — and ask before launching it.

## Cache busting

Every change to local CSS or JS must be followed by bumping the `?v=`
query string in `docs/index.html`. Without this, the browser serves stale
files and changes appear to have no effect. See `cache_busting.md` for
details.

## Workflow

1. Make the code change
2. Bump `?v=` in `docs/index.html`
3. Hard refresh the browser (Cmd+Shift+R)
4. Reproduce and check console / screenshot
5. Remove debug logging before committing
