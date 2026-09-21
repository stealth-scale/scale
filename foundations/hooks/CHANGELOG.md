# @stealthscale/hooks

## 0.2.0

### Minor Changes

- [#40](https://github.com/stealth-scale/scale/pull/40) [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - hooks: add splitEnumerable
  
  - `splitEnumerable(split)` wraps a state machine's props splitter so it reads a copy of the props
    holding their own enumerable properties only. In development React defines a non-enumerable `key`
    getter on the props of an element created with a key, which warns when read. A machine's splitter
    reads every own key, so a root rendered with a `key` warned twice: once for the read, and once
    more when the copied `key` was spread onto the root's element.

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`6ac64f2`](https://github.com/stealth-scale/config/commit/6ac64f2666f92a187fc06d34df1d2cd023266434) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - hooks: add the React hooks a component reads the page with
  
  - `useConst` builds a value once and returns the same one on every render after it, for anything
    whose identity a caller compares.
  - `useLiveRef` points a ref at the value this render was given, written during the render so code
    that runs before the effects reads it.
  - `useCallbackRef` returns a stable function calling the latest callback, for a handler that would
    otherwise re-run an effect on every render.
  - `useSafeLayoutEffect` runs a layout effect in a browser and the plain effect on a server.
    `layoutEffect(document)` makes the choice and is what a specification drives.
  - `useControllableState` takes the value from the caller where the caller passes one and holds it
    otherwise, re-read on every render so a caller that starts setting it partway through takes over.
  - `useMediaQuery` reads whether each query matches and re-reads all of them when one changes. The
    queries are encoded as JSON for the effect's dependency, which keeps a query holding a comma in
    one piece.
  - `useCoarsePointer` reads whether the main pointer is a finger.
  - `useIsOverflowing` watches an element and reports whether its content is cut off on each axis,
    measured again on a resize, a content change, a parent resize and after the fonts load.
  - `useStickyOffsets` sets a custom property on each sticky band holding the height of the bands
    above it, and one on the column holding the height of all of them. Its effect depends on the
    options encoded, so a caller writing the object inline does not rebuild the observers on every
    render.
  - `useMatrixCrosshair` marks the row and column under the pointer in a grid, written through the DOM
    because a matrix of a few hundred items either way is tens of thousands of cells.
  - `useAnnounce` announces a message to a screen reader through one shared region per politeness,
    with a frame's messages joined by `speakable`.
  - `createRequiredContext` makes a context a reader has to be inside, and the hook that reads it, for
    a component drawn in parts where every part needs something the root holds. React returns the
    default value for a missing provider, so the part draws wrongly and reports nothing. This throws
    where the part was written and names the component, so the message says which root is missing.
  
  `useLiveRef`, `useCallbackRef` and `useControllableState` carry the `"use no memo"` directive. Each
  one does on purpose what the React Compiler refuses to compile, and the directive turns a refusal
  the build would stop on into a decision the source records.
  
  The three hooks that wrap the behaviour library and the two that read the viewport provider are not
  here, so the package peers on React alone and a consumer of any hook installs nothing else.
  
  - `createRequiredContext` returns a third hook that returns `undefined` outside a provider. A root
    that nests inside another of its own kind reads it to find out whether one stands above it, which
    a menu holding a submenu needs. A part keeps the throwing hook, because a part outside its root is
    a mistake rather than a case.

### Patch Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`614fb9f`](https://github.com/stealth-scale/config/commit/614fb9ff17f757776a5d5132c5d21a3bb6c41efb) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - hooks: prove the stale measurement guard in useIsOverflowing
  
  The specification for `useIsOverflowing` passing over a measurement queued for an element it no
  longer watches passed with the guard deleted. Both elements registered their measurement on one
  `document.fonts.ready`, so the fresh element's ran last and wrote the expected answer whether the
  guard held or not. Each element now waits on its own promise. The stale element's promise is
  resolved and the fresh element's is left outstanding, so the measurement the guard has to refuse is
  the one that would write the answer. Resolving it inside `act` also drops the React warning about an
  update outside it.
