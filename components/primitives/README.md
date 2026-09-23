# @stealthscale/component-primitives

Components that decide where content renders and render no element of their own. The package has no
recipe and no preset.

## Install

```bash
pnpm add @stealthscale/component-primitives
```

The package peers on `react` and `react-dom`.

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

## Types

| Type          | Props of                                      |
| ------------- | --------------------------------------------- |
| `PortalProps` | `Portal`: `children`, `container`, `disabled` |

## Licence

MIT. See [LICENSE](LICENSE).
