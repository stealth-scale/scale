# @stealthscale/vite-config-react

## 0.9.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b588ff3`](https://github.com/stealth-scale/scale/commit/b588ff39d85f40125c2665be19124d208d485ae9) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-config-react: fail a test that updates a component outside act
  
  - React reports an update made outside `act` on `console.error`. A passing run wrote it to stderr,
    no gate read it, and the runner does not always print it, so grepping a captured run reported none
    while the warnings were still being emitted.
  - The shared setup file now records that one message and throws in `afterEach`, naming the
    component. A test that renders a component built on a state machine and asserts before the machine
    settles is reading a half-drawn tree, which is a defect rather than noise.
  - Only that message is caught. A specification that drives a component into throwing makes React
    report the throw the same way, and that is a case rather than a fault.
  
  vite-config: excuse a fixture from the cap on dependencies
  
  - `lint.composed` turns `import/max-dependencies` off for `**/*.fixtures.ts` and
    `**/*.fixtures.tsx`, beside `lint.barrelled` and under a reason of its own.
  - A fixture builds the component its specifications measure, so it imports every part that component
    is composed of. Its count is the size of the component rather than a sign that one module does too
    much, and a fixture held to the cap pushes the composition back into the specifications that were
    meant to share it.

- [#38](https://github.com/stealth-scale/scale/pull/38) [`832064c`](https://github.com/stealth-scale/scale/commit/832064cb73b2d437c496f551b26202ca96cdd954) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-config-react: import each icon from its own file
  
  - `react.layers()` carries `plugin.icons()`, which rewrites a named import from `lucide-react` into
    one import per icon file under `dist/esm/icons`, before anything else reads the source. A build
    tree-shakes the root down to the icons a page draws, but a dev server does not: the
    module-per-file server pre-bundles the root whole, five megabytes for every document that imports
    one icon, and the bundling server carries every icon in its vendor chunk. The catalogue's vendor
    chunk holds six icons and 1.4 MB now, rather than 1849 and 4.3 MB.
  - The file an identifier stands for is a spelling rule, checked against the resolver once per name:
    `Grid2X2Icon` is `grid-2-x-2` and `Grid2x2` is `grid-2x2`, and the set publishes a file under
    every alias. A name no icon file answers to, and a type, stay on the root import or are dropped,
    so `createLucideIcon` and `LucideIcon` still resolve.
  
  vite-config-react: leave a specimen out of the refresh transform
  
  - A `*.specimen.tsx` file is excluded from the React plugin's refresh transform. Its JSX still
    compiles, because the plugin sets the JSX transform for every file in its configuration. A
    specimen exports scenes and constants beside its components, which the refresh runtime read as a
    module it could not refresh and invalidated on every edit, undoing the boundary the specimen
    plugin gives the file.
  
  vite-config-react: compile under a build alone where asked
  
  - `react.layers({ compiler: "build" })`, or `compiler: { only: "build" }`, runs the React Compiler
    under a build and leaves a dev server's transforms to the JSX plugin. The compiler is most of what
    a cold dev transform costs, 1.7 seconds of a catalogue page's 2.2. What a package gives up is the
    compiler's reading of its components while it edits them, so the default keeps it on.

### Patch Changes

- Updated dependencies [[`b588ff3`](https://github.com/stealth-scale/scale/commit/b588ff39d85f40125c2665be19124d208d485ae9), [`808c86b`](https://github.com/stealth-scale/scale/commit/808c86be6484d08a16b059d7d31680c5929257b4), [`832064c`](https://github.com/stealth-scale/scale/commit/832064cb73b2d437c496f551b26202ca96cdd954)]:
  - @stealthscale/vite-config@0.7.0

## 0.8.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`5269702`](https://github.com/stealth-scale/config/commit/5269702c87d84fd49f5afa25d1728182c869c518) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - react: run the React Compiler over everything a package renders
  
  - `plugin.compiler()` returns two layers. `react.plugin.compiler` appends the Babel pass to the
    plugins a tier built. `react.plugin.compiler(pack)` gives the packer the same pass, so a library
    publishes memoised components rather than what its author wrote.
  - The memo cache is written against the React a build resolves, read from React's own manifest.
    `Compiled.target` overrides that reading, and `layers()` takes the same object in place of `true`.
    A React newer than the compiler has a target for takes the newest one. A React older than 17 fails
    when the configuration is composed, naming the version it read.
  - The layer proves the compiler can be loaded while the configuration is composed. Babel resolves a
    preset during a transform, so a package missing `babel-plugin-react-compiler` or
    `@rolldown/plugin-babel` would otherwise build clean and memoise none of it.
  - `panicThreshold` is raised from `none` to `critical_errors`. The compiler failing one of its own
    invariants now stops the build rather than leaving a function uncompiled without a report.
  - Neither layer applies where the mode is `test`. Each memo cache is a branch nobody wrote and
    coverage counts it, so a package held to full branch coverage would be asked to exercise a
    compiler's caching rather than its own code.
  - The pattern the pass reads closes on a query as well as on the end of an identifier, because the
    dev server appends one to every module it re-transforms.
  - `Refreshed.compiler` is gone. The React plugin's own option resolves the compiler from the
    plugin's own directory, which an isolated node_modules refuses, and setting it turns fast refresh
    off as well.
  
  The package peers on `@rolldown/plugin-babel` and `babel-plugin-react-compiler`. Hold `@babel/core`
  at 7 with an override. Babel 8 took `AssignmentPattern` out of its `LVal` alias, the compiler asks a
  node path that question, and under Babel 8 it refuses every `const { a = 1 } = b` and leaves the
  whole function uncompiled.

## 0.7.0

### Minor Changes

- [#21](https://github.com/stealth-scale/config/pull/21) [`e1e1b2b`](https://github.com/stealth-scale/config/commit/e1e1b2b00019a0d46e0fd6be453dccd8757ef601) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Compile MDX documents into components. `layers({ mdx: true })` adds `plugin.mdx()`, which puts
  `@mdx-js/rollup` ahead of every other plugin and gives the packer the same plugin under
  `pack.plugins`. The plugin compiles `.mdx` only, so a markdown file imported with `?raw` stays a
  string. `./mdx` publishes the declaration file a package references from its `globals.d.ts`: it
  declares the `*.mdx` module and types the elements a document renders against React's JSX.
  `@mdx-js/rollup` and `@types/mdx` are optional peers.

### Patch Changes

- Updated dependencies [[`739ba79`](https://github.com/stealth-scale/config/commit/739ba795e2ce4de0260c026c281fd6142ae28bc5)]:
  - @stealthscale/vite-config@0.6.0

## 0.6.1

### Patch Changes

- [#19](https://github.com/stealth-scale/config/pull/19) [`815c5fe`](https://github.com/stealth-scale/config/commit/815c5feeb02c060db0d6306ee3e1931992da0ea9) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-config-react: unmount every rendered root after each test
  
  - `vitest.setup.ts` calls Testing Library's `cleanup` before it empties `document.body`, so an
    effect's cleanup runs and a scroll lock or a listener from one test no longer reaches the next.
  - The package peers on `@testing-library/react`.
- Updated dependencies [[`cfc5b2a`](https://github.com/stealth-scale/config/commit/cfc5b2a7b55fd1f115faa6b76416277814352a3d)]:
  - @stealthscale/vite-config@0.5.0

## 0.6.0

### Minor Changes

- [#17](https://github.com/stealth-scale/config/pull/17) [`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257) Thanks [@stealth-admin](https://github.com/stealth-admin)! - vite-config-react: export layers() and workspace(), and name every layer for its call
  
  - `layers()` replaces the `preset/app` and `preset/web` subpaths. A package extends a tier from
    `@stealthscale/vite-config` and adds `react.layers()` beside it.
  - `workspace()` replaces `preset.workspace()`.
  - `web.json` is a fragment with the JSX option and no `extends`. A tsconfig lists
    `@stealthscale/vite-config-typescript/web.json` first and this file second.
  - `lint.fixtures()` relaxes `react/no-multi-comp` for rendered specifications and fixtures.
  - `peerDependencies` names `vite` and `vitest` from the peer catalog. `vite-plus` is not a peer.
  - `engines.node` is `>=26.0.0`.
  - `README.md` ships in the tarball, covering every factory, the `Refreshed` fields, the tsconfig
    fragment and the setup file.
  - `description` is a sentence naming what the package does.
  - `vitest.setup.ts` sets `IS_REACT_ACT_ENVIRONMENT`. React reads that global before it processes an
    update inside `act`. Without it every such update logged "The current testing environment is not
    configured to support act(...)", and the warning that reports an update outside `act` never fired.
  
  | Before                                               | After                       |
  | ---------------------------------------------------- | --------------------------- |
  | `react/react.refresh`                                | `react.plugin.refresh`      |
  | `react/react.cleanup`                                | `react.test.cleanup`        |
  | `react/test.environment(happy-dom)`                  | `react.test.document`       |
  | `react/fmt.group(react)`                             | `react.fmt.imports`         |
  | `react/react.plugin(react)`                          | `react.lint.plugins(react)` |
  | `react/lint.relax(**/*.spec.tsx, **/*.fixtures.tsx)` | `react.lint.rendered`       |
  | `react/lint.enforce(**/*.{ts,tsx})`                  | `react.lint.rules`          |

### Patch Changes

- Updated dependencies [[`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257)]:
  - @stealthscale/vite-config@0.4.0

## 0.5.1

### Patch Changes

- Updated dependencies [[`99feb93`](https://github.com/stealth-scale/config/commit/99feb93aba0cd59be739827e54409cb6e2381a5a)]:
  - @stealthscale/vite-config@0.3.0

## 0.5.0

### Minor Changes

- [`2fefebb`](https://github.com/stealth-scale/config/commit/2fefebb771539403c4990ddcf40da8d62e9e07e1) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Keep an application's page where Vite looks for it
  
  `layout.page` set the build input and nothing else, so the two halves of an application disagreed:
  the dev server reads `index.html` from the project root, which no layer moved. An application laid
  out the way the house asked for it served a 404 at the URL the dev server printed, and one laid out
  so that development worked could not be built at all.
  
  Both are gone, along with `react.override.page`, which existed only to move the same directory. An
  application keeps `index.html` beside its config, where Vite looks for it and where every other Vite
  project keeps it. A build writes `dist/index.html` rather than `dist/page/index.html`.
  
  **Moving an application over:** move `page/index.html` up to the package root and change the script
  path inside it from `../src/…` to `./src/…`. Drop any `layout.page(…)` or `react.override.page(…)`
  from the config. Whatever serves the build now points at the output directory rather than a
  directory inside it.

### Patch Changes

- Updated dependencies [[`2fefebb`](https://github.com/stealth-scale/config/commit/2fefebb771539403c4990ddcf40da8d62e9e07e1)]:
  - @stealthscale/vite-config@0.2.0

## 0.4.1

### Patch Changes

- [`2c6a7f1`](https://github.com/stealth-scale/config/commit/2c6a7f1c3025c450648ddb1df2e4458cc9856213) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - State the test environment from the tiers rather than from the workspace preset. The previous
  release put `test.document()` at the root on the reasoning that the runner reads its environment
  from the root config, and that is wrong: `test.projects` makes every package a project of its own,
  and a project is configured by its own config rather than by the root's. A rendering specification
  still met `document is not defined`, which is what the root layer was added to prevent.
  
  `test.cleanup()` was already in the tiers for exactly this reason, and the two belong together: a
  package that needs a document to draw into is the same package that needs it emptied afterwards.

## 0.4.0

### Minor Changes

- [`a1e8a24`](https://github.com/stealth-scale/config/commit/a1e8a245ee7c31c7036bb018cb3530ccdea33ffb) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Give the runner a document to draw into. A workspace holding anything that renders needs one
  everywhere, and the runner takes its environment from the root config — so every repository taking
  this package had to know to state `test.environment` itself, and one that did not met
  `document is not defined` on its first rendering specification. That reads as a broken test rather
  than as a missing setting.
  
  `happy-dom` rather than jsdom, because a theme follows the reader's colour-mode preference and jsdom
  has never implemented media queries. It is now a peer of this package rather than an optional one of
  the toolchain, since a repository that renders is not optional about having somewhere to render. A
  repository testing against something else takes `test.environment(happy-dom)` back by name.

### Patch Changes

- Updated dependencies [[`a1e8a24`](https://github.com/stealth-scale/config/commit/a1e8a245ee7c31c7036bb018cb3530ccdea33ffb)]:
  - @stealthscale/vite-config@0.1.5

## 0.3.0

### Minor Changes

- [`a9a46cf`](https://github.com/stealth-scale/config/commit/a9a46cfa1c2960e84cfb3fe505632b4dc3dfbb58) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Excuse a specification written as markup the docblock rules, as the toolchain already excuses one
  written as plain TypeScript. `lint.preset.web()` had the globs for it, but `lint` is read from the
  root config and nowhere else, and a root takes the node tier whatever its packages render — so the
  tier holding that answer was never the one the linter read. A `.spec.tsx` was therefore held to a
  standard the same file in `.ts` is excused, which in a component library is every specification
  there is.

## 0.2.0

### Minor Changes

- [`9ce239c`](https://github.com/stealth-scale/config/commit/9ce239c615561f89c6050c2df118867bf4ea3d71) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Stop enabling the `react-perf` lint plugin. Every rule it carries asks for a value to be memoised by
  hand — an array, an object, a function or an element passed as a prop — and this package turns the
  React Compiler on by default, which memoises all four. A repository taking `react.workspace()` got
  both, so it was told to write out memoisation the compiler had already done, giving the compiler
  more to reason about for an answer it had reached on its own. A repository that turns the compiler
  off wants those rules and contributes the plugin to `lint.plugins` itself.

## 0.1.1

### Patch Changes

- [`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - The readme installs with pnpm, which is what this repository is built and released under. No layer
  and no export changes.
- Updated dependencies [[`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b)]:
  - @stealthscale/vite-config@0.1.1
