---
"@stealthscale/testing-router": patch
---

testing-router: settle the render in mountRouter before returning it

- `mountRouter` renders inside an async `act` and flushes one microtask before it returns, so a page
  holding a component built on a state machine no longer reports an update outside `act`.
  `mountRoute` calls it and gains the same.
