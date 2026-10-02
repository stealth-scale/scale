import { within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  PALETTE_KEYS,
  pressedKeys,
  REQUEST_KEYS,
  requesting,
  type Run,
} from "#commands/commands.fixtures.ts";
import { BrokenFrame } from "#parts/frames.fixtures.tsx";
import { framed, named } from "#parts/parts.fixtures.tsx";
import { silenced } from "#routes/routes.fixtures.ts";

describe("HostRoot", () => {
  it("renders the extensions of the layout region before the frame", async () => {
    const { view } = await framed({ at: "/time-off" });
    const banner = within(view.container).getByText("banner");
    const main = within(view.container).getByRole("main");

    expect(banner.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders the extensions of the overlay region after the toast region", async () => {
    const { view } = await framed({ at: "/time-off" });
    const region = within(view.container).getByRole("region", { name: /^Notifications/v });
    const dialogs = within(view.container).getByText("dialogs");

    expect(region.compareDocumentPosition(dialogs) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("opens the palette with Mod+K", async () => {
    const { view } = await framed({ at: "/time-off" });

    await pressedKeys(PALETTE_KEYS);

    expect(
      within(view.container).queryByRole("dialog", { name: "Command palette" }),
    ).not.toBeNull();
  });

  it("runs the command a key binds", async () => {
    const requested = vi.fn<Run>();

    await framed({ at: "/time-off", host: { product: requesting(requested) } });
    await pressedKeys(REQUEST_KEYS);

    expect(requested).toHaveBeenCalledTimes(1);
  });

  it("renders the failure page in place of a frame that throws", async () => {
    silenced();
    named();

    const { view } = await framed({ at: "/time-off", frame: BrokenFrame });

    expect(within(view.container).getByRole("heading", { level: 1 }).textContent).toBe(
      "People could not be shown",
    );
  });

  it("reports an error in the frame with the target host", async () => {
    silenced();

    const { host } = await framed({ at: "/time-off", frame: BrokenFrame });

    expect(host.stores.reports.get().at(-1)).toMatchObject({
      kind: "render-failed",
      target: "host",
    });
  });
});
