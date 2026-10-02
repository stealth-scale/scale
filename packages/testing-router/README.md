# @stealthscale/testing-router

`@stealthscale/testing-router` mounts a route tree and renders the page a path matches. A
specification queries the rendered screen, and the order a router has to be driven in is written
once here instead of in every file.

## Install

```bash
pnpm add -D @stealthscale/testing-router
```

The package peers on `@stealthscale/provider-router`, `@testing-library/react` and `react`. Install
all three.

## Usage

```ts
import { mountRoute } from "@stealthscale/testing-router";
import { expect, it } from "vitest";

import { tree } from "#routes.ts";

it("renders the invoice the path names", async () => {
  const { result } = await mountRoute(tree(), "/invoices/42");

  expect(result.getByRole("article").textContent).toBe("Invoice 42");
});
```

`mountRoute` builds a router over the tree and reads the route map out of the same tree. It loads
the path's matches before it renders. Preloading is off, so a link in the rendered page fetches
nothing on its own.

## Driving a router the application built

`mountRouter` takes a router instead of a tree. Use it where the application constructs the router
itself, such as one built for a session.

```ts
const { result, router } = await mountRouter(routed(ANONYMOUS), "/orders");

await router.navigate({ to: "/orders/8802" });
```

`routerOver` builds the router without rendering it, for a case that reads `routesById` or the
resolved paths instead of a rendered screen.

## Navigate, load, then render

A router loads its matches before anything renders them. Rendering first renders the page the router
was already on, and the router reports no error. Each helper does the three steps in that order.

## Licence

MIT. See [LICENSE](LICENSE).
