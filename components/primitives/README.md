# @stealthscale/component-primitives

The primitives every other component package builds on: `Portal`, which decides where content
renders, and `ScrollArea`, which scrolls a region with the theme's bars. An application's compiler
reads the scroll area's recipe from the preset under `./theme`.

## Install

```bash
pnpm add @stealthscale/component-primitives
```

The package peers on `react`, `react-dom`, `@stealthscale/hooks` and `@stealthscale/theme`.

## Portal

`Portal` renders its children into another element of the document. An ancestor with `overflow`
clipping or its own stacking context clips and stacks a fixed or absolute descendant, and a portal
moves the content out of that ancestor.

```tsx
import { Portal } from "@stealthscale/component-primitives";

<Portal>
  <Toast>Invoice sent</Toast>
</Portal>;
<Portal container={actions}>
  <Button size="sm">Send invoice</Button>
</Portal>;
<Portal disabled>…</Portal>;
```

The content renders into `document.body` when `container` is absent or null. `disabled` renders the
content in place, so the component tree is the same with and without the move.

The portal renders nothing on the server and in the hydrating render. The server has no document,
and the hydrating render must match the server's HTML. The client adds the content after hydration.
A root created with `createRoot` renders the content on its first render.

## Scroll area

A region that scrolls with the theme's thin bars in place of the browser's scrollbars. The root runs
the Zag scroll area machine, which sizes and moves each bar's thumb and shows a bar only while its
own axis overflows. The screen package's sidebar, app shell body, main region, panels and scrolling
sections are scroll areas.

```tsx
import { ScrollArea } from "@stealthscale/component-primitives";

<ScrollArea.Root maxHeight="xs">
  <ScrollArea.Viewport aria-labelledby={heading}>
    <ScrollArea.Content>{notes}</ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar />
</ScrollArea.Root>;
```

| Part        | Element | What it renders                                                              |
| ----------- | ------- | ---------------------------------------------------------------------------- |
| `Root`      | `div`   | The area the machine runs. It takes the options and the variants             |
| `Viewport`  | `div`   | The element that scrolls, without the browser's scrollbars                   |
| `Content`   | `div`   | The element inside the viewport that contains what scrolls                   |
| `Scrollbar` | `div`   | The bar of one axis, `vertical` unless `orientation` is `horizontal`         |
| `Thumb`     | `div`   | The thumb inside a bar. A bar renders one when it has no children            |
| `Corner`    | `div`   | The square where the two bars meet, which keeps them apart while both render |

| Axis        | Values                           | Default    |
| ----------- | -------------------------------- | ---------- |
| `variant`   | `hover`, `always`                | `hover`    |
| `size`      | `xs`, `sm`, `md`, `lg`           | `md`       |
| `scrolls`   | `vertical`, `horizontal`, `both` | `vertical` |
| `inset`     | `xs`, `sm`, `md`, `lg`           | none       |
| `fade`      | `true`                           | none       |
| `maxHeight` | `xs`, `sm`, `md`, `lg`           | none       |

- `variant="hover"` shows the bars under the pointer, while the area scrolls and while focus is
  inside it, over the content's edge. `variant="always"` shows them at rest, and the content's
  padding at the edge a bar runs along is at least the bar's thickness while that axis overflows.
- `size` sets a thumb's thickness: 4, 6, 8 and 12px. A bar is the thumb plus 2px of padding on each
  side, and the bar takes a press on its padding.
- `scrolls="vertical"` lays the content out at the viewport's width, as a region that scrolls on its
  own does. `horizontal` and `both` let the content grow to its widest child, so a row that does not
  wrap overflows the viewport with the content's padding after it.
- `inset` pads the content from the inset scale, 8 to 20px. The viewport clips its content, so a
  child's focus ring at the content's edge needs `xs` to show whole.
- `fade` fades an edge towards the content scrolled out of view, over the distance left to scroll up
  to `sizes.8`. An edge the content ends at does not fade.
- `maxHeight` stops the viewport's height at one of the theme's named sizes, 20rem at `xs` to 32rem
  at `lg`. Without it the area is as tall as its content, or as the room a flex or grid parent of a
  definite height gives it.
- The thumb is `border.emphasized`, 3.5:1 against a card by day and 3.2:1 after dark. It darkens to
  `fg.subtle` under the pointer. Forced colors paint it `CanvasText`, and `Highlight` under the
  pointer.

`<ScrollArea.Content as="ul">` renders a list whose items keep their roles, because `Root` and
`Content` have no role of their own. Every part takes `as`.

A composing recipe changes the area for its own states:

- The recipe sets the viewport's `overflow` and the content's width, which the machine writes
  inline. The app shell turns the scrolling of its main region off while the window scrolls.
- `--scroll-area-ring-offset` on the root moves the focus ring. A negative length moves it inside
  the root's edge, for an area inside a box that clips it.
- `--scroll-area-ring-style: none` on the root hides the focus ring, for a widget whose highlighted
  row shows where the keys go.

### Options

The root takes every option of the Zag scroll area machine: `dir`, `id`, `ids` and `getRootNode`.
Pass `dir="rtl"` for content that runs right to left: the machine measures the scroll position from
the start edge, and the vertical bar moves to the left.

### Accessibility

- WCAG 2.1.1 requires keyboard access to every region a pointer can scroll. While the content
  overflows either axis, the viewport is a `region` in the tab order, and the arrow keys, Page Up,
  Page Down, Home and End scroll it. Name it with `aria-label` or `aria-labelledby`. While the
  content fits, the viewport is a plain element outside the tab order.
- Content whose every item takes focus, such as a list of links, passes `focusable={false}` to the
  viewport, which then takes `tabIndex={-1}`. Firefox stops the Tab key on any element that scrolls
  unless its `tabIndex` is negative. A child that takes focus scrolls into view, a focus ring's
  width inside the edge.
- A viewport that is a widget's own element, such as a listbox's or a menu's, passes
  `focusable="none"` and takes no role and no `tabIndex` from the scroll area. The widget's machine
  sets both, so the element that scrolls is the one that has focus, and the machine scrolls a
  highlighted row into view in it.
- The root's outline is the focus ring, `spacing.ring` outside its edge while the viewport has
  keyboard focus, so the ring surrounds the bars and clears content at the edge.
- The bars have no role. A keyboard and a screen reader scroll the viewport.

### Machine behaviour

The Zag machine makes the viewport a tab stop only while both axes overflow, and gives the root, the
viewport and the content `role="presentation"`. The viewport here is a tab stop while either axis
overflows, and the three parts drop the role. Zag starts with both bars shown and measures the
viewport when it first intersects the window and when the root or the content resizes. The machine
here reports overflow only after a measurement, and it also measures as it starts, before the first
paint. A dialog's focus trap, which runs in the next frame, then finds a tab stop only on a viewport
that scrolls. The machine scrolls the viewport under a wheel turned over a bar, and to the pointer
on a press on a bar.

### Not offered

- The machine's scrolling methods (`scrollTo`, `scrollToEdge`) and its position flags. The viewport
  takes a `ref`, and `Element.scrollTo` scrolls it.
- A bar that reserves its room while the area scrolls under the pointer. `variant="always"` keeps
  the content clear of the bars.

## Types

| Type           | Props of                                                          |
| -------------- | ----------------------------------------------------------------- |
| `PortalProps`  | `Portal`: `children`, `container`, `disabled`                     |
| `ScrollArea.*` | `RootProps`, `ViewportProps`, `ContentProps`, `ScrollbarProps`, … |

## Licence

MIT. See [LICENSE](LICENSE).
