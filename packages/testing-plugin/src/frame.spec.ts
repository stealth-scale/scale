import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NOTES } from "#manifest.fixtures.ts";
import { notesContract } from "#notes.fixtures.ts";
import { renderPlugin } from "#render.tsx";

describe("PluginFrame", () => {
  it("mounts every region of the host", async () => {
    const view = await renderPlugin(null, NOTES);

    expect([...view.host.stores.mounted.get().keys()].toSorted()).toStrictEqual([
      "host/aside",
      "host/brand",
      "host/content",
      "host/footer",
      "host/header",
      "host/layout",
      "host/navigation",
      "host/overlay",
      "host/root",
      "host/status",
      "host/toolbar",
      "host/userMenu",
    ]);
  });

  it("renders an extension placed in a region", async () => {
    const view = await renderPlugin(null, NOTES);

    expect(within(view.container).getByText("badge")).toBeTruthy();
  });

  it("renders the page in the main landmark", async () => {
    const view = await renderPlugin(null, { ...NOTES, route: { to: notesContract.routes.list } });

    expect(within(view.container).getByRole("main").textContent).toBe("Notes");
  });
});
