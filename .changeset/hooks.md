---
"@stealthscale/hooks": minor
---

hooks: add splitEnumerable

- `splitEnumerable(split)` wraps a state machine's props splitter so it reads a copy of the props
  holding their own enumerable properties only. In development React defines a non-enumerable `key`
  getter on the props of an element created with a key, which warns when read. A machine's splitter
  reads every own key, so a root rendered with a `key` warned twice: once for the read, and once
  more when the copied `key` was spread onto the root's element.
