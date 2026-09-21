---
"@stealthscale/testing": minor
---

Bind a fresh serving context to `loaded` where a specification gives none, so a plugin that lists a
file to watch while loading runs under a specification that asks nothing about the watching. Add the
`changed`, `created`, `removed` and `updated` drivers, the hook context with its command and
bundling flag, and the asynchronous scratch workspace.
