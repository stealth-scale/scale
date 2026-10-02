# @stealthscale/testing-config

## 0.6.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`791fc09`](https://github.com/stealth-scale/scale/commit/791fc09a3f58b30375168810ed56fd664acfd7df) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Skip `*.example.tsx` in `source.specs` and `source.declared`.

## 0.5.0

### Minor Changes

- [#29](https://github.com/stealth-scale/config/pull/29) [`3744ad1`](https://github.com/stealth-scale/config/commit/3744ad13d9e94c9bf1bc3ab9e1f78692d54883f4) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - exclude a specimen from the source checks
  
  - `.specimen.tsx` joins the suffixes a file carries when it is not itself a source, beside
    `.spec.tsx` and `.fixtures.tsx`.
  - `source.specs` no longer asks a specimen for a specification beside it.
  - `source.declared` no longer reports what a specimen imports, because a specimen runs in the
    catalogue and resolves through the workspace root.

## 0.4.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`393b8bb`](https://github.com/stealth-scale/config/commit/393b8bb4d261fa15d33282d86f77bc77bc9982b4) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-config: hold a package's barrels to a specification where it asks
  
  - `violations` takes `barrels: true`, under which `source.specs` reports a barrel with no
    specification beside it as it reports any other source. A component package asks for it, because a
    barrel there is where a component's public surface is written and where a recipe or a binding
    leaks out.
  - The walk into a barrel enters an object once. A React context provider reaches itself through its
    context, and the walk overflowed the stack on a package that published one.
  - `source.specs` leaves a module alone whose every export is an `export interface`, as it already
    left one exporting types alone. An interface compiles to nothing, so there is no behaviour to
    write cases against, and the rule asked for a specification that could only assert types.
  - `source.declared` reports a package a file under `src` imports that the manifest lists under
    neither `dependencies` nor `peerDependencies`. Neither `publint` nor `attw` reads an import, so a
    package importing something it never declared installs and then fails at run time. A subpath reads
    as the package that publishes it, a relative path and a `node:` builtin are read past, and so is a
    specification, which runs in the workspace. An import written inside a template literal is read
    past too, because it is code a package generates for somebody else to run.
  - `source.jsx` reports a file suffixed `.tsx` that writes no JSX, which sends a reader looking for
    markup that was never written. The other way round needs no check, because a compiler refuses JSX
    in a `.ts` file.
  - `source.declared` reads past a specifier carrying a URI scheme, not just a `node:` builtin. A
    bundler's virtual module such as `virtual:i18n` is answered by a plugin rather than installed, so
    no manifest declares it. A package name carries no colon and a scoped name opens with `@`, so
    nothing installed matches.

## 0.3.0

### Minor Changes

- [#19](https://github.com/stealth-scale/config/pull/19) [`df4a6eb`](https://github.com/stealth-scale/config/commit/df4a6eb98d387e86c7c38b7629eab42399789af3) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-config: walk namespaces in plugin.named and require configResolved only
  
  - A factory inside a namespace is called, and its plugin is asked to be named for the dotted path,
    so `theme.runtime()` is asked for `stealth:theme.runtime`.
  - A plugin is asked for `configResolved` and for no other hook. A plugin that serves at `load`
    passes without `generateBundle`.

## 0.2.0

### Minor Changes

- [#17](https://github.com/stealth-scale/config/pull/17) [`cfe3dd7`](https://github.com/stealth-scale/config/commit/cfe3dd7291e7576f1637c7a438415a8ad065586c) Thanks [@stealth-admin](https://github.com/stealth-admin)! - testing-config: publish the conformance suite for config and plugin packages
  
  - `violations({ at, kind, module })` reads a package and returns each part of the house contract it
    breaks, as one sentence per breach.
  - Thirteen checks cover the manifest, the barrel, the README block table, the layers each factory
    returns, the tiers, and a plugin's name and peer.
  - `arguments` supplies what a factory with required parameters is called with. `skip` turns a check
    off with a reason, and `only` narrows a run.
  - `README.md` ships in the tarball, listing all thirteen checks against what each one reports.
  - `description` names the `library` kind beside `config` and `plugin`.
