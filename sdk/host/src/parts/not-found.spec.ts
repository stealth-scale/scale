import { act, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { chosen } from "#commands/commands.fixtures.ts";
import { internalsOf } from "#host/internals.ts";
import { changed, framed, named, quarantined } from "#parts/parts.fixtures.tsx";
import { SWITCHED } from "#routes/routes.fixtures.ts";
import { flagging } from "#stores/flags.fixtures.ts";

describe("HostNotFound", () => {
  it("renders a plain page for an address no route matches", async () => {
    const { view } = await framed({ at: "/nowhere" });

    expect(within(view.container).getByRole("heading", { level: 1 }).textContent).toBe(
      "Page not found",
    );
  });

  it("names the plugin a switch turned off", async () => {
    named();

    const { view } = await framed({ at: "/invoices", host: { product: SWITCHED } });

    expect(within(view.container).getByRole("heading", { level: 1 }).textContent).toBe(
      "Billing is turned off",
    );
  });

  it("renders the page again after its button turns the plugin on", async () => {
    named();

    const { view } = await framed({ at: "/invoices", host: { product: SWITCHED } });

    await chosen(within(view.container).getByRole("button", { name: "Turn on Billing" }));

    expect(within(view.container).queryByRole("heading", { level: 1 })).toBeNull();
  });

  it("names the plugin its kill switch stopped", async () => {
    named();

    const flags = flagging({ "host/plugin.billing": false }, false);
    const { view } = await framed({ at: "/invoices", host: { flags: flags.source } });

    expect(within(view.container).getByRole("heading", { level: 1 }).textContent).toBe(
      "Billing is unavailable",
    );
  });

  it("offers no button for a plugin its kill switch stopped", async () => {
    const flags = flagging({ "host/plugin.billing": false }, false);
    const { view } = await framed({ at: "/invoices", host: { flags: flags.source } });

    expect(within(view.container).queryByRole("button")).toBeNull();
  });

  it("renders a page the host quarantined", async () => {
    const { view } = await framed({ at: "/invoices", prepare: quarantined });

    expect(within(view.container).getByRole("heading", { level: 1 }).textContent).toBe(
      "This page stopped working",
    );
  });

  it("renders the page again after its button lifts the quarantine", async () => {
    const { view } = await framed({ at: "/invoices", prepare: quarantined });

    await chosen(within(view.container).getByRole("button", { name: "Try again" }));

    expect(within(view.container).queryByRole("heading", { level: 1 })).toBeNull();
  });

  it("moves focus to its heading when the page a person is on becomes not found", async () => {
    const { host, view } = await framed({ at: "/invoices" });

    await changed(() => {
      internalsOf(host).switches.set("billing", false);
    });

    expect(document.activeElement).toBe(within(view.container).getByRole("heading", { level: 1 }));
  });

  it("leaves focus alone when a navigation opens a not-found page", async () => {
    const { router, view } = await framed({ at: "/time-off" });

    await act(async () => {
      await router.navigate({ to: "/nowhere" });
    });

    expect(document.activeElement).not.toBe(
      within(view.container).getByRole("heading", { level: 1 }),
    );
  });
});
