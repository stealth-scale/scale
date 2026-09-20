---
"@stealthscale/testing-react": minor
---

testing-react: add unhovered

- `unhovered(element)` moves a pointer off an element and settles what that started. It dispatches
  `pointerout` with no element the pointer moved to, which React reads as the pointer leaving the
  document, so every `onPointerLeave` above the element runs. It is the counterpart of `hovered`.
