import { describe, expect, it } from "vitest";

import { renderOver } from "#host-render.tsx";
import { hostedOf } from "#hosted.ts";
import { NOTES } from "#manifest.fixtures.ts";
import { notesContract } from "#notes.fixtures.ts";
import { CustomFrame } from "#probes.fixtures.tsx";
import { rootOf } from "#root.tsx";

describe("renderOver", () => {
  it("renders the root at the route once the router loaded", async () => {
    const view = await renderOver(hostedOf(NOTES), rootOf(CustomFrame), {
      to: notesContract.routes.list,
    });

    expect(view.container.textContent).toBe("custom frameNotes");
  });

  it("opens the router at the root where no route is given", async () => {
    const view = await renderOver(hostedOf(NOTES), rootOf(CustomFrame));

    expect(view.router.state.location.pathname).toBe("/");
  });
});
