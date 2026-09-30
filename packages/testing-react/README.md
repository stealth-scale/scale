# @stealthscale/testing-react

`@stealthscale/testing-react` reads a rendered React component through the markings on its anatomy.
A specification finds a piece of a component by the `data-part` name it is marked with, and reads
its state from the data attributes beside it. A class name, the text and the shape of the tree all
change under a restyling, so a specification reading through any of those three fails on a change
that broke nothing.

## Install

```bash
pnpm add -D @stealthscale/testing-react
```

The package peers on `@testing-library/react`, `react` and `vitest`. Install all three.

## Usage

```tsx
import { render } from "@testing-library/react";
import { expect, it } from "vitest";

import { attr, holds, renderedAs } from "@stealthscale/testing-react";

it("opens the panel its trigger names", () => {
  const { container } = render(<Disclosure defaultOpen />);

  expect(attr(container, "content", "state")).toBe("open");
  expect(renderedAs(container, "title")).toBe("H2");
  expect(holds(container, "root", "content")).toBe(true);
});
```

Each reader finds its part first. A reader that fails to match throws and quotes the selector it
looked for, so a renamed part fails the specification that reads it rather than passing as an absent
value. `parts` is the one exception. It returns an empty array instead of throwing, which lets a
specification assert that a component drew none of a part.

## Reference

| Function     | Signature                                                                         | What it returns                                                                               |
| ------------ | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `part`       | `(container: ParentNode, name: string) => Rendered`                               | The first element marked with the part name, in document order                                |
| `parts`      | `(container: ParentNode, name: string) => readonly Rendered[]`                    | Every element marked with the part name, as a plain array rather than a live NodeList         |
| `only`       | `(container: ParentNode) => Rendered`                                             | The first element at the top of the container, asking nothing of its markings                 |
| `attr`       | `(container: ParentNode, name: string, attribute: string) => string \| undefined` | A data attribute on the part, or `undefined` where the part sets none                         |
| `aria`       | `(container: ParentNode, name: string, attribute: string) => string \| undefined` | Any attribute the part exposes, or `undefined` where it exposes none                          |
| `holds`      | `(container: ParentNode, outer: string, inner: string) => boolean`                | True when the outer part contains the inner one, at any depth                                 |
| `renderedAs` | `(container: ParentNode, name: string) => string`                                 | The tag the part rendered as, upper-cased, so `DIV` and `SVG` are compared the same way       |
| `violations` | `(Component: ElementType, options?: ConformanceOptions) => readonly string[]`     | Each departure from the contract as a phrase, or an empty array for a component that conforms |

Note: `attr` and `aria` take the same three arguments and differ in the form of the name they
expect. `attr` indexes `dataset`, so `data-crop-shape` is read as `cropShape`. `aria` calls
`getAttribute`, so the same attribute is read as it is written. A caller passing the written form to
`attr` receives `undefined` and no error.

| Type                 | Declaration                                          | What it describes                                                                                          |
| -------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `Rendered`           | `Element & ElementCSSInlineStyle & HTMLOrSVGElement` | The element a reader returns, in HTML or SVG. The `style` member reaches a custom property set at run time |
| `ConformanceOptions` | `interface`                                          | Which optional checks `violations` runs, and how to reach a component that cannot render on its own        |

## Conformance

A bare `violations(Component)` checks what every component owes whatever else it does:

- The component renders.
- It merges a caller's `className` into its own.
- It forwards a `ref` to the element under check.
- It spreads a prop it does not name.

`conformance-probe` goes in as the class and `data-conformance` as the unnamed prop, and both come
back off the element. Every field below is optional. A bare call runs the four checks and nothing
else.

| Field      | Type                                    | Default     | What it turns on                                                                              |
| ---------- | --------------------------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| `as`       | `boolean`                               | `undefined` | Renders the component with `as="a"` and expects the element back as `A`                       |
| `asChild`  | `boolean`                               | `undefined` | Renders the component with `asChild` and an anchor child, and expects the element back as `A` |
| `children` | `boolean`                               | `undefined` | Passes a string as `children` and expects it in the element's `textContent`                   |
| `element`  | `string`                                | `undefined` | The tag the component is expected to render, spelled upper-case                               |
| `frame`    | `boolean`                               | `undefined` | Makes `accessibilityViolations` read the render one animation frame after the machine commits |
| `props`    | `Readonly<Record<string, unknown>>`     | `{}`        | The props the component needs before it can render at all                                     |
| `subject`  | `(container: ParentNode) => Rendered`   | `only`      | Finds the element to check, where the component's own root is not the first one rendered      |
| `wrapper`  | `(children: ReactNode) => ReactElement` | `undefined` | Wraps the component in the provider it cannot render outside                                  |

A part of a compound throws when it is rendered outside its root. Pass `wrapper` to supply the
provider and `subject` to find the part inside it:

```tsx
import { part, violations } from "@stealthscale/testing-react";

expect(
  violations(AccordionItem, {
    children: true,
    element: "DIV",
    subject: (container) => part(container, "item"),
    wrapper: (children) => <AccordionRoot>{children}</AccordionRoot>,
  }),
).toStrictEqual([]);
```

Each check renders the component afresh and unmounts it afterwards, so every check starts from a
clean container.

## Violations

A phrase states what the component did. The order of the list is the order the checks ran.

| Phrase                                          | Reported when                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `throws when it renders: <message>`             | The render threw. The entry stands alone, because no later check can run without an element |
| `renders no element`                            | The render produced nothing, or `subject` found nothing. This entry also stands alone       |
| `renders DIV, not SPAN`                         | `element` was given and the component rendered another tag                                  |
| `does not merge className`                      | The caller's class is absent from the element                                               |
| `replaces its own className instead of merging` | The caller's class arrived and the component's own class went                               |
| `does not forward ref`                          | The ref reached no element, or reached one other than the element under check               |
| `does not spread unknown props`                 | An attribute the component does not name never reached the element                          |
| `does not render children`                      | `children` was given and the text did not arrive                                            |
| `does not honour as`                            | `as` was given and the element is not the one it named                                      |
| `does not honour asChild`                       | `asChild` was given and the element is not the child's                                      |

## Accessibility

`accessibilityViolations(Component, options)` renders the component under the same `props` and
`wrapper` the conformance check takes, runs axe over what it rendered, and returns each rule it
breaks as `id: help`. A rule axe cannot decide, which it reports as incomplete, is left out. So is
an element with the `hidden` attribute, with everything inside it: a browser does not render it, and
the DOM the specifications run in lays it out as visible. With `frame`, axe reads the render one
animation frame later, for a machine that sets its context again in that frame. The dialog machine
does this once it opens. Axe audits an `iframe` element and not the document inside it, because the
DOM the specifications run in gives a frame no window axe can message. Audit a framed document in a
browser.

```tsx
import { accessibilityViolations } from "@stealthscale/testing-react";

await expect(
  accessibilityViolations(Button, { props: { children: "Save" } }),
).resolves.toStrictEqual([]);
```

## Machines

A component built on a state machine has two behaviours no plain component does, and both cost a
specification a case unless the kit handles them.

`settled()` waits for whatever the last interaction started. A machine schedules its own update
rather than making one during the event, so an assertion straight after `fireEvent` reads the state
from before the press. Awaiting this flushes it inside `act`, which is also what stops React warning
about an update it did not see.

```tsx
import { settled } from "@stealthscale/testing-react";

fireEvent.click(screen.getByRole("tab", { name: "Second" }));
await settled();

expect(screen.getByRole("tab", { name: "Second" }).getAttribute("aria-selected")).toBe("true");
```

`rootedViolations(parts, expected)` draws each part on its own and reports the ones that draw rather
than throw. A part reads its machine through a context the root provides, so one drawn outside its
root has no api, and returning nothing there gives a part with no behaviour and no error. One call
covers every part of a component.

```tsx
import { rootedViolations } from "@stealthscale/testing-react";

expect(
  rootedViolations(
    { Content, Indicator, Trigger },
    "A part of Collapsible was drawn outside the root that holds it together.",
  ),
).toStrictEqual([]);
```

The expectation takes a string, matched anywhere in what was thrown, or a pattern. A part that
throws something else is reported separately from one that drew, because the two are different
faults.

## Licence

MIT. See [LICENSE](LICENSE).
