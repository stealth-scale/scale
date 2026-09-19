---
"@stealthscale/provider-viewport": minor
---

provider-viewport: publish widthOf

- `widthOf(breakpoint)` reads the width a breakpoint starts at, in pixels, so a component measuring
  its own element compares against the vocabulary rather than against a number a caller invented.
  Every screen component now folds at `useNarrow(ref, widthOf("md"), "md")`.
- It answers a number rather than a condition, and the README says so. A component that reads it
  measures its own element and folds on that. A component that wants the window folds on a style
  prop or a media query, which is what the breakpoints are for.

provider-viewport: measure before the first paint

- `useNarrow` takes its first measurement in the layout effect that starts watching the element and
  leaves the later ones to the observer. The viewport's first answer is its fallback, because the
  window is read in an effect, so every measured component rendered narrow first. A component
  folding on the answer was painted folded and unfolded a frame later.
- An element that measures no width has no box to compare, and the answer it had stands. A document
  with no layout engine reports every width as 0.
