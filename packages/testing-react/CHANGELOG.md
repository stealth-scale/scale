# @stealthscale/testing-react

## 0.9.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`4a42977`](https://github.com/stealth-scale/scale/commit/4a42977d47a88b2053038c54e515cfa8488c406e) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-react: add unhovered
  
  - `unhovered(element)` moves a pointer off an element and settles what that started. It dispatches
    `pointerout` with no element the pointer moved to, which React reads as the pointer leaving the
    document, so every `onPointerLeave` above the element runs. It is the counterpart of `hovered`.

## 0.8.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`1c28e6b`](https://github.com/stealth-scale/config/commit/1c28e6b381252c34e271bc172a002a8fa7ea42ab) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-react: check that a component honours as
  
  - `violations` takes an `as` option beside `asChild`. It renders the component with `as: "a"` and
    reports `does not honour as` where the element read back is not an anchor, which is what a
    component bound through the compiler's factory owes a caller who changes its element.
  - `accessibilityViolations` renders a component under the same `props` and `wrapper`, runs axe over
    it, and returns each rule it breaks as `id: help`. The kit depends on `axe-core` for it.
  - `settled` waits for whatever the last interaction started. A state machine schedules its own
    update rather than making one during the event, so an assertion straight after `fireEvent` reads
    the state from before the press. It flushes inside `act`, which also stops React warning about an
    update it did not see.
  - `rootedViolations` draws each part of a component on its own and reports the ones that draw rather
    than throw. A part reads its machine through a context the root provides, so one drawn outside its
    root has no api, and returning nothing there gives a part with no behaviour and no error. A part
    that throws something other than what was expected is reported apart from one that drew.
  - `drawn` renders a component built on a state machine and waits for the machine to commit. The
    machine commits its first state on a microtask after mounting, so a bare render leaves an update
    outside the act scope React checks. Measured on the tabs fixture: a bare render, a render followed
    by a synchronous act, and a render inside one each report two such updates, and this reports none.
    The disclosure package reported 140 of them before this and reports none after.
  - `pressed` fires the three events a browser fires for a press, and settles the machine between the
    press and the click. A machine that moves its highlight as the pointer goes down and reports the
    highlighted row on the click reports nothing at all for a sequence fired in one turn.
  - `accessibilityViolations` settles the render before axe reads it, so a component built on a state
    machine is audited in the state it reaches rather than the one it mounts in.

## 0.7.1

### Patch Changes

- [#17](https://github.com/stealth-scale/config/pull/17) [`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257) Thanks [@stealth-admin](https://github.com/stealth-admin)! - testing-react: publish the licence and the README, and state the node floor
  
  - The tarball includes `LICENSE` and `README.md`. The README lists every reader, the
    `ConformanceOptions` fields and each phrase a violation is reported as.
  - `engines.node` is `>=26.0.0`.
  - `description` is a sentence naming what the package does.

## 0.7.0

### Minor Changes

- [`996c217`](https://github.com/stealth-scale/config/commit/996c217cf135390cdc20d481c75107180da64f01) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-react: read a part's ARIA and what it holds
  
  `attr` reads the `data-` a component states about itself. What it owes a screen reader is written on
  `aria-`, which no reader covered, so a specification asserting `aria-current` or `aria-expanded`
  reached for `getAttribute`. `vp check --fix` rewrites that to `dataset`, which a strict `tsconfig`
  then rejects for coming off an index signature.
  
  Nesting had the same gap: an arrow's tip belongs inside the arrow, and saying so took a selector
  written in the specification.
  
  - aria(container, name, attribute): an `aria-` attribute, `undefined` where absent
  - holds(container, outer, inner): whether one part is drawn inside another

## 0.6.0

### Minor Changes

- [`5b8086c`](https://github.com/stealth-scale/config/commit/5b8086c84266aeaf969b4fb5442b14f3bd2f5a39) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-react: read the style attribute a component set
  
  A count a caller works out at run time cannot be a class, so a component hands it to a custom
  property and its recipe reads it from there. `Rendered` did not carry `style`, so no specification
  could check that the value arrived.
  
  `Rendered` is now `Element & ElementCSSInlineStyle & HTMLOrSVGElement`, which every element a
  component in this design system renders satisfies.

## 0.5.0

### Minor Changes

- [`494d106`](https://github.com/stealth-scale/config/commit/494d106601fd5b1f96e6538e84df303fe05e18ea) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-react: read a mark drawn in SVG, not only HTML
  
  An icon renders an `svg`, which is not an `HTMLElement`. `only` threw on one, and `renderedAs` and
  `violations` compared its lowercase tag name against the upper-cased name every other component
  reports, so a conforming icon failed every check.
  
  - `only`, `part` and `parts` answer `Rendered`, which is `Element & HTMLOrSVGElement`; `only` still
    throws for anything that is neither
  - `renderedAs` and `violations` upper-case the tag name, so `element: "SVG"` reads the way
    `element: "DIV"` does

## 0.4.0

### Minor Changes

- [`5a3a0ab`](https://github.com/stealth-scale/config/commit/5a3a0ab72646dd938a5355e1cce2842e09bcac8c) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Check a component that cannot be rendered on its own
  
  - `violations` takes `wrapper`, for whatever a component needs above it, and `subject`, for finding
    the element under test inside it. A compound's part needs both
  - a component that throws is reported as throwing, with its message, rather than as rendering
    nothing: a part missing its provider throws, and the two are different bugs

## 0.3.0

### Minor Changes

- [`be64d43`](https://github.com/stealth-scale/config/commit/be64d437b98a7eb6a886941521f6a8e04d187278) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Read the component contract a wrapper breaks
  
  - add `violations(Component, options)`: mounts once per check, answers what it does not keep
  - always: renders an element, merges `className` without dropping its own, forwards `ref`, spreads
    props it does not name
  - on request: `element` names the tag, `children`, `asChild` — none of them every component's
  - violations rather than a verdict, so nothing here asserts and the package needs no test runner

## 0.2.0

### Minor Changes

- [`b6f0e92`](https://github.com/stealth-scale/config/commit/b6f0e92c3510b5bc7e26d1822d436ba0445f2008) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Read a component through `data-part` rather than `data-slot`, which is the attribute Ark marks each
  piece of an anatomy with and the one every component here actually renders. Nothing carried a
  `data-slot`, so every reader in this package matched nothing.
  
  Adds `parts`, for the pieces a component repeats, and `only`, for the single element a render
  produced — which a specification otherwise reaches by asserting `firstElementChild` is not null, and
  that assertion is one the house linter refuses.
  
  Removes `describeContract`. It held a component to a contract about forwarding refs, merging
  `className` and spreading props, which is a contract worth asserting where components are written by
  hand. Here they are re-exports of Chakra and Ark, so the suite tested a dependency against
  conventions from the design system this package was ported from. `vitest` goes with it: nothing here
  registers tests any more, so the runner is no longer a peer.
