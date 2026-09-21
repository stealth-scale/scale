# @stealthscale/vite-plugin-specimen

## 0.2.0

### Minor Changes

- [#34](https://github.com/stealth-scale/scale/pull/34) [`e94c22a`](https://github.com/stealth-scale/scale/commit/e94c22a6c39e1c13d8f99b46334ae8ecc7b65192) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-plugin-specimen: classify a dependency's declaration as an option
  
  - A property declared by a package the component's package depends on at run time is an option, the
    transitive dependencies included. A menu root keeps 31 properties instead of five: its four
    variants, and the 27 options the state machine and the packages it depends on declare.
  - A peer is not walked, so the rendering library's attributes and the foundation's style props stay
    under `dropped.foreign`.
  - The index build reads each package directory's manifest once per build when it names the package a
    specimen belongs to.
  
  vite-plugin-specimen: carry the namespace a page names its catalogue by
  
  - A page that states `namespace` as a literal in its `specimen()` call carries it into the index as
    `Indexed.namespace`, empty where it states none, so a catalogue resolves the page's words in the
    namespace they are keys in.
  
  vite-plugin-specimen: list the components a page imports from its own package
  
  - The fragments module exports `imported` beside `fragments`: every value the file binds from a
    specifier under the package's imports map whose name starts with a capital letter, sorted. A
    namespace import is listed under its local name, and a type specifier, a type-only declaration and
    a lowercase binding such as `recipe` are left out.
  
  vite-plugin-specimen: read a name a scope binds as that scope's own
  
  - The slicer collected every identifier of a subtree as a reference, binding positions among them. A
    parameter named after another scene closed that whole scene into the snippet, so a page of two
    scenes showed both of them under either one.
  - The walk now tracks what each function binds: its own name, its parameters and the variables its
    body declares. A name bound inside a scope resolves to no declaration of the file, and a name the
    scope only mentions still does.
  
  vite-plugin-specimen: give a specimen a hot update boundary of its own
  
  - Every listed specimen the plugin transforms, and every fragments module it generates, accepts its
    own hot update and dispatches `UPDATED` (`specimen:updated`) on the window with the page's
    identifier and the module that replaced the old one. A specimen exports scenes and constants
    beside its components, so the refresh runtime could not accept an edit to it, and every save ran
    the application's own modules again. The catalogue kit listens for the event and redraws the page
    in place.
  - The index, the fragments and the props modules are resolved to their specifiers as written, with
    no NUL in front, because a server that bundles registers a module reached through a dynamic import
    under its identifier and loads a module behind a NUL as nothing.
  - A fragments module watches the page's file, so a server that bundles generates it again on a save.
    That server runs no hot update hook, so a change to a typed file restarts the compiler from
    `watchChange` where the environment says it bundles, and the modules are left to the bundler.
  
  vite-plugin-specimen: merge a page's module and its fragments into one chunk
  
  - The plugin names the chunk a page's module and its fragments are bundled into after the page,
    `actions-button-[hash].js`, so a page opens with one request rather than two. The props keep a
    chunk of their own, loaded where somebody opens them. The catalogue's build writes 185 chunks
    rather than 262.
  - `Indexed.source`, the file's text as one string, is gone. No catalogue read it, and it cost a
    chunk per page that no browser ever asked for.
  
  vite-plugin-specimen: write a page's path relative to the root wherever the file is
  
  - `Indexed.path` is written relative to the project root whether or not the root holds the file,
    `../../components/actions/src/button/button.specimen.tsx` for a catalogue beside the packages it
    shows. A file outside the root kept its absolute path before, and the index is shipped, so a built
    catalogue carried the directory layout of the machine it was built on.
  
  vite-plugin-specimen: name a page's props chunk after the page
  
  - A props module is bundled into a chunk named `<page>-props`, `actions-button-props-[hash].js`,
    rather than one the bundler named after the last segment of the module's identifier, which called
    two pages' props `text` and `menu`.
  - A page's fragments and its imported names come from one parse of the file rather than two.
  - Every string written into a generated module goes through `quoted()` from `vite-plugin-base`,
    which escapes the line and paragraph separators JSON leaves bare.
  - `client.d.ts` declares `imported` on a fragments module, which the module has exported since the
    names were listed.
  
  vite-plugin-specimen: include a page chunk's dependencies recursively
  
  - The page chunk group sets `includeDependenciesRecursively: true`, so the modules only the page
    reaches, its icons among them, are bundled into the page's chunk. Without it the bundler left a
    stub chunk under the page's own name that held those modules and re-exported the page, and the two
    chunks imported each other. A table the page built at module level from an icon in the stub read
    `undefined`, because the stub's binding was hoisted and not yet evaluated.

### Patch Changes

- Updated dependencies [[`725cf7e`](https://github.com/stealth-scale/scale/commit/725cf7eb750c998e795e546db2809009e6c3c2b5)]:
  - @stealthscale/vite-plugin-base@0.3.0

## 0.1.0

### Minor Changes

- [#29](https://github.com/stealth-scale/config/pull/29) [`578a9bb`](https://github.com/stealth-scale/config/commit/578a9bb016cb3e7e6f33c043d1360839e9a55f11) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - resolve what a page's components accept out of their types
  
  - `props` on the options serves `virtual:specimen-props/<id>`, which maps every part onto the props
    it takes, the named types those refer to, and what was dropped.
  - Classify a property by every declaration behind it rather than the first, which keeps `gap` on a
    list and `aria-label` on an icon button where the style props and the rendering library share
    those names.
  - Drop a property with no declaration at all, which is what a styling condition resolves to, so no
    pattern names the conditions.
  - Read a recipe file for a variant and the component's own package for an option, both through the
    compiler's own metadata for where a file sits, so a repository states no path.
  - Report the dropped counts rather than hiding them. A button resolves to 1341 properties, six of
    which are its own.
  - Expand a union written under a name into its options, so `size: Scale` reads as its eight steps.
  - Skip a type from TypeScript's own libraries.
  - `typescript` is an optional peer, loaded on the first page that carries props.
  
  218 tests, 100% on all four metrics.

- [#29](https://github.com/stealth-scale/config/pull/29) [`c68ac09`](https://github.com/stealth-scale/config/commit/c68ac0960da80e74da7e7444c4b9e89d6380eba2) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - add the specimen index plugin
  
  - Parse `id`, `group`, `title` and `about` out of a specimen's default export.
  - Serve `virtual:specimen-index` as one listing per file with a dynamic import per page, and
    `virtual:specimen-fragments/<id>` as one snippet per scene.
  - Serve both without a source map, which was four fifths of the payload.
  - List a file that declares no page with the reason as its opening and a rejecting loader, and throw
    on a build instead.
  - Refuse the second of two files declaring one identifier and name the first.
  - Reload the index when a page appears, disappears, or changes its metadata, and leave it alone when
    an edit changes only a scene.
  
  138 tests, 100% on all four metrics.
