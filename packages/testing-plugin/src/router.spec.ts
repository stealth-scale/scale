import { describe, expect, it } from "vitest";

import { hostedOf } from "#hosted.ts";
import { NOTES } from "#manifest.fixtures.ts";
import { notesContract } from "#notes.fixtures.ts";
import { opened, routerOf } from "#router.ts";

function routedOf(): ReturnType<typeof routerOf> {
  const { host, product } = hostedOf(NOTES);

  return routerOf(host, product, () => null);
}

describe("router", () => {
  it("opens the router at the root", () => {
    expect(routedOf().router.state.location.pathname).toBe("/");
  });

  it("maps each declared route's id to its route", () => {
    expect(routedOf().routes.has("notes/note")).toBe(true);
  });

  it("navigates to the route at its sample", async () => {
    const routed = routedOf();

    await opened(routed, { to: notesContract.routes.note });

    expect(routed.router.state.location.pathname).toBe("/notes/n1");
  });

  it("navigates to the route at the parameters given", async () => {
    const routed = routedOf();

    await opened(routed, { params: { noteId: "n7" }, to: notesContract.routes.note });

    expect(routed.router.state.location.pathname).toBe("/notes/n7");
  });
});
