---
"@stealthscale/testing": minor
---

testing: bind a context in the load driver

- `loaded(plugin, id, context)` binds the context as `this` when one is given, for a plugin that
  watches a file while loading a module. Nothing is bound where it is absent, as before.
