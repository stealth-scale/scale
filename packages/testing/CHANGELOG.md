# @stealthscale/testing

## 0.4.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`832064c`](https://github.com/stealth-scale/scale/commit/832064cb73b2d437c496f551b26202ca96cdd954) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing: bind a context in the load driver
  
  - `loaded(plugin, id, context)` binds the context as `this` when one is given, for a plugin that
    watches a file while loading a module. Nothing is bound where it is absent, as before.

## 0.3.0

### Minor Changes

- [#21](https://github.com/stealth-scale/config/pull/21) [`012b4d5`](https://github.com/stealth-scale/config/commit/012b4d523dd89ff15f1a4906d502b471f592f880) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing: read a declaration out of a compiled stylesheet
  
  - `declared(css, selector, property)` returns what one selector declares a property as. The selector
    is matched literally, so one carrying a wildcard or a bracket reads the same as any other, and it
    is found wherever it sits in a selector list.
  - The two application specifications and the plugin's assembly specification each carried a copy,
    and the copies escaped four characters of the seven a pattern reads as syntax.

## 0.2.0

### Minor Changes

- [#19](https://github.com/stealth-scale/config/pull/19) [`ba92db7`](https://github.com/stealth-scale/config/commit/ba92db7bba5a8d8e87b508147398dfb258d2f741) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing: drive a plugin's hooks from a specification
  
  - `configured`, `started`, `resolved`, `loaded`, `transformed`, `updated` and `generated` call one
    hook each, the way a bundler would, and return what the hook produced.
  - `hookContext` builds the context a hook reads `this` from, and records what the hook asked to
    watch, reported and invalidated.
  - The package peers on `vite` for the plugin type.

## 0.1.1

### Patch Changes

- [#17](https://github.com/stealth-scale/config/pull/17) [`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257) Thanks [@stealth-admin](https://github.com/stealth-admin)! - testing: publish the licence and the README, and state the node floor
  
  - The tarball includes `LICENSE` and `README.md`.
  - `engines.node` is `>=26.0.0`.
  - The README names the package `@stealthscale/testing` and installs it with pnpm. It lists every
    export with its signature, and the members of `ScratchWorkspace`.
  - `description` is a sentence naming what the package does.
