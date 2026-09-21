# @stealthscale/vite-config

## 0.7.0

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

- [#43](https://github.com/stealth-scale/scale/pull/43) [`ab77490`](https://github.com/stealth-scale/scale/commit/ab774905ada897d5d8912490a2e6a98294f31057) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Load the inventory plugin when the plugin is constructed rather than when the tier is imported.
  Schedule `pack.hook()` moments on every bundle of a `pack` list and after a registrar another layer
  wrote. Write `define.manifest()` constants for the packer as well as for Vite. Derive
  `pack.published()` entries for a package that is its own root. State the `node` platform in
  `pack.preset.node()`, and refuse a Node built-in at the pack in `pack.preset.web()` through the new
  `pack.builtins()`. Drop the catch-all `app` group from `build.chunks()`, so each entry keeps the
  modules it reaches. Raise the spec size limit to 900 lines. Re-export `located` and
  `resolvingMetadata` from the kernel.

- [#38](https://github.com/stealth-scale/scale/pull/38) [`832064c`](https://github.com/stealth-scale/scale/commit/832064cb73b2d437c496f551b26202ca96cdd954) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-config: serve an application from one bundle in development
  
  - `server.bundled()` turns on Vite's full bundle mode for a dev server, and the application preset
    carries it, so every application is served from a handful of chunks rather than one module per
    file. The catalogue's page loaded in 729 requests and 19 MB before and in nine requests after, and
    a frame the page opens loads in eight, from the browser's cache. A specification run is left
    serving one module per file, because the runner reads one file at a time and a bundled server
    parses a setup file another package publishes as plain script.
  - Vite marks the mode experimental. A hot update is computed in the browser from what ran rather
    than on the server from the graph, and a plugin's hot update hook is handed no environment, which
    the house plugins allow for.
  - Every dynamic import is bundled when the server starts rather than when a browser first asks for
    it. The server compiles a lazy import on request and marks its output stale until a rebuild has
    folded the module in, and a document requested in that window, a frame the page opens or the
    source map a browser's tools ask for, is answered with the spinner page and reloads every client,
    which asks for its imports again: a catalogue page reloaded 39 times in 20 seconds. Bundled up
    front, the start costs five seconds more, a page nobody visited yet opens as fast as one somebody
    did, and a chunk carries a source map the browser can find.
  
  vite-config: split the house's own packages into a library chunk
  
  - `build.chunks()` groups the components, the foundations, the themes and the tooling a page runs
    into a `library` chunk, beside the `framework`, `vendor` and `app` chunks a build already wrote,
    whether they resolved to their source beside the application or were installed under the house
    scope. The library changes at another pace than the application drawn with it, so a deploy that
    touched a page alone leaves the library chunk's name, and the browser's copy of it, as they were.
    The catalogue's first load is the same 240 kB gzipped, now as 66 kB of framework, 90 of vendor, 56
    of library and 26 of the application.
  - A module is placed by its own path alone. The bundler would otherwise pull everything a matched
    module imports into the same group, and the library's dependencies followed it out of the vendor
    chunk.
  - A dev server keeps the three-way split, because it groups its chunks the way a build does and its
    React refresh runtime is a module of the application's chunk: a library chunk ran before it and
    every component called a runtime not yet set up, which was a white page.

- [#43](https://github.com/stealth-scale/scale/pull/43) [`10e17cb`](https://github.com/stealth-scale/scale/commit/10e17cbabdb003f4b911834221df7bf04d975fe5) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Add a `shared` chunk to `build.chunks()`: what several lazily loaded routes reach and the entry does
  not is one chunk, fetched once, rather than a chunk per set of routes or the chunk of whichever
  route the bundler met first with every other route importing it.

### Patch Changes

- [#34](https://github.com/stealth-scale/scale/pull/34) [`808c86b`](https://github.com/stealth-scale/scale/commit/808c86be6484d08a16b059d7d31680c5929257b4) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - walk past the worktrees an agent session checks out
  
  `.claude` holds a worktree per session, each a second copy of the repository. A run from the root
  descended into them, counting every file twice and running every specification again: 2090 of 3016
  files in one root coverage report came from a worktree, which put the report at 32% against a
  threshold of 100%.
  
  The globs are anchored at the root: `.claude/**` for the test files, which the runner globs from the
  root, and `<root>/.claude/**` for coverage, which the provider matches anywhere in an absolute path.
  A run inside a worktree counts its own files again. With `**/.claude/**` it reported 0 of 0 lines at
  100% and passed the thresholds on nothing.
- Updated dependencies [[`4a5c301`](https://github.com/stealth-scale/scale/commit/4a5c3012adeb289593f28045a10bb4f3d5b47fca), [`66b780d`](https://github.com/stealth-scale/scale/commit/66b780d8f4ede66cee40e3b0130bf6bcf2177171)]:
  - @stealthscale/vite-config-core@0.4.0
  - @stealthscale/vite-plugin-sbom@0.3.2

## 0.6.0

### Minor Changes

- [#21](https://github.com/stealth-scale/config/pull/21) [`739ba79`](https://github.com/stealth-scale/config/commit/739ba795e2ce4de0260c026c281fd6142ae28bc5) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-config: refuse an import of the toolchain
  
  - `no-restricted-imports` reports `vite-plus` and every `vite-plus/*` subpath in the style rules,
    with the ADR-0006 message to import `vite` or `vitest` instead.
  - `staged.formatted` runs `vp fmt --no-error-on-unmatched-pattern`, so a commit that stages a file
    the formatter ignores, such as `pnpm-lock.yaml`, is no longer refused.
  - `test.coverage` keeps the development server from watching `**/coverage/**`, so a test run beside
    a running server no longer reloads every page.
  - Every lint tier excuses `**/src/theme.ts` from `no-default-export` beside `**/*.config.ts`. A
    package publishes its preset under `./theme` through a default export, which the build plugin
    reads, so the file needs no departure of its own.

### Patch Changes

- Updated dependencies []:
  - @stealthscale/vite-config-core@0.3.0
  - @stealthscale/vite-plugin-sbom@0.3.1

## 0.5.0

### Minor Changes

- [#19](https://github.com/stealth-scale/config/pull/19) [`cfc5b2a`](https://github.com/stealth-scale/config/commit/cfc5b2a7b55fd1f115faa6b76416277814352a3d) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-config: excuse a barrel from the dependency cap
  
  - `lint.barrelled(files)` turns off `import/max-dependencies` for the globs it is handed.
  - Every lint tier applies it to `**/index.ts`.

### Patch Changes

- Updated dependencies [[`8cc2075`](https://github.com/stealth-scale/config/commit/8cc20751fe95cc28db6f0e5df3d4ac7e5936f354)]:
  - @stealthscale/vite-plugin-sbom@0.3.1

## 0.4.0

### Minor Changes

- [#17](https://github.com/stealth-scale/config/pull/17) [`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257) Thanks [@stealth-admin](https://github.com/stealth-admin)! - vite-config: name every layer for the call that made it, and import vite
  
  - Every departure is a verb that takes one record whose first field is `because`. The array it acts
    on is `files`, `deps`, `rules`, `runs` or `patterns` in every block.
  - `preset/workspace` exports `defineConfig` and `layers()` like the other four tiers. A root extends
    it directly.
  - `peerDependencies` names `vite` and `vitest` from the peer catalog. `vite-plus` is not a peer.
  - Every layer name carries the arguments that distinguish two calls: `server.reachable(a.dev)`,
    `preview.bound(127.0.0.1)`, `define.manifest(commit)`.
  - `lint.defaultExported`, `lint.undocumented` and `lint.specified` return a layer named for their
    own call.
  - Coverage counts every file under `src`, whether or not a test loaded it. `main.ts`, `main.tsx`,
    files under `bin` and worker files are left out as entry points.
  - `engines.node` is `>=26.0.0`.
  - `README.md` ships in the tarball, covering the five tiers, every block at the package root, and
    the four kinds of layer.
  - `description` is a sentence naming what the package does.
  - `test.browser()` imports `@vitest/browser-playwright` rather than
    `vite-plus/test/browser-playwright`. The provider is an optional peer, so the packer leaves the
    specifier external instead of inlining `vite-plus` and emitting a chunk that re-exports a package
    the consumer may not have installed.
  
  | Before                                | After                                                                                  |
  | ------------------------------------- | -------------------------------------------------------------------------------------- |
  | `deps.crawled({ because, from })`     | `deps.crawl({ because, files })`                                                       |
  | `deps.prebundled({ because, deps })`  | `deps.prebundle({ because, deps })`                                                    |
  | `ssr.bundled({ because, deps })`      | `ssr.bundle({ because, deps })`                                                        |
  | `test.uncounted({ because, files })`  | `test.omit({ because, files })`                                                        |
  | `test.globalSetup({ because, from })` | `test.prepare({ because, files })`                                                     |
  | `test.covering({ ... })`              | `test.thresholds({ ... })`                                                             |
  | `fmt.internal(patterns)`              | `fmt.own({ because, patterns })`                                                       |
  | `pack.buildBefore(because, runs)`     | `pack.buildBefore({ because, runs })`, and the same for `buildPrepare` and `buildDone` |
  | `pack.ships(exports)`                 | `pack.subpaths(exports)`                                                               |
  | `build.served(at)`                    | `build.base(at)`                                                                       |
  | `server.reached(port, names)`         | `server.address(port, names)`                                                          |
  | `preview.reached(port, names)`        | `preview.address(port, names)`                                                         |
  | `staged.on(files, runs)`              | `staged.command(files, runs)`                                                          |
  | `pack.hook(build:before)` as a name   | `pack.buildBefore`                                                                     |

### Patch Changes

- Updated dependencies [[`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257), [`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257)]:
  - @stealthscale/vite-config-core@0.3.0
  - @stealthscale/vite-plugin-sbom@0.3.0

## 0.3.0

### Minor Changes

- [`99feb93`](https://github.com/stealth-scale/config/commit/99feb93aba0cd59be739827e54409cb6e2381a5a) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Write what a page loads first to three chunks
  
  `build.chunks`, in the application tier, groups every module the entry imports statically into the
  React runtime, the other packages and the application, by how often each changes. Nothing in a
  module entry runs until its whole static import graph has arrived, so the hundred small files the
  bundler writes by default only add requests, and each one is compressed on its own: on the design
  system's docs, 119 files at 396 kB gzipped became three at 349 kB, and 118 preload hints became 3. A
  route or a page behind a dynamic import stays a chunk of its own.
  
  An application that splits its own takes the layer back by name.

## 0.2.0

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

## 0.1.5

### Patch Changes

- [`a1e8a24`](https://github.com/stealth-scale/config/commit/a1e8a245ee7c31c7036bb018cb3530ccdea33ffb) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Declare the tools the layers turn on as peers: `publint` and `@arethetypeswrong/core`, which
  `pack.quality` runs over every package that publishes, and `@vitest/coverage-v8`, which
  `test.coverage` names as its provider. All three were devDependencies alone, so a repository taking
  the toolchain got the layers without the tools and met `Failed to import module "publint"` on its
  first pack and `Cannot find dependency '@vitest/coverage-v8'` on its first test run. They worked
  here only because this repository installs them for its own packages.

## 0.1.4

### Patch Changes

- [`103d8e0`](https://github.com/stealth-scale/config/commit/103d8e02644421b27288993143cb8adb17296b08) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Leave a docblock that already fits as it was written. The formatter rewraps every docblock greedily
  on its own, and that fights the linter: `check-line-alignment` asks for a two-space wrap indent, and
  a greedy rewrap drops it wherever the description runs over by exactly one word. A file in that
  shape satisfies neither tool — `vp fmt` writes what `vp check` rejects, and the two undo each other
  on every run.
  
  `lineWrappingStyle: "balance"` wraps only what does not fit, so the width is still enforced and a
  docblock the author already wrapped is left alone. The one-word case is a defect in the formatter
  rather than in this configuration, and a file that was correct to begin with now stays that way.

## 0.1.3

### Patch Changes

- [`832b1fc`](https://github.com/stealth-scale/config/commit/832b1fc81046254fa62560e6deeb91125c177073) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Stop `require-jsdoc` writing docblocks. Its fixer inserts an empty block — `/**`, ` *`, ` */` —
  which satisfies nothing: it fails the formatter, it fails `no-blank-blocks` and
  `require-description`, and it takes the report away from the one rule that said what was missing.
  Running `vp check --fix` over a repository that had not documented much filled it with them, and
  each run left the tree in a state the next check reported differently. A docblock is the one fix a
  machine cannot write, so the author writes it.

## 0.1.2

### Patch Changes

- [`ab5f551`](https://github.com/stealth-scale/config/commit/ab5f5515a0631589b1b6e6736b65b6890069c3e8) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Import `@module-federation/vite` at the moment a config asks for the plugin. The package is declared
  an optional peer, and `federation.host()` and `federation.remote()` imported it at the top of their
  modules — which the barrel re-exports, so loading `@stealthscale/vite-config` at all failed for a
  repository that federates nothing and had never installed it. Only a config stating a host or a
  remote needs it now.
  
  Where it is genuinely missing, the error names it and says why it is optional. What the plugin
  itself refuses is passed through untouched, rather than reported as a package to go and install.

## 0.1.1

### Patch Changes

- [`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - The readme installs with pnpm, which is what this repository is built and released under. No layer
  and no export changes.
- Updated dependencies [[`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b), [`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b)]:
  - @stealthscale/vite-config-core@0.2.0
  - @stealthscale/vite-plugin-sbom@0.2.0
