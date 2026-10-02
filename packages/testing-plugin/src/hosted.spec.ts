import { describe, expect, it } from "vitest";

import { NOBODY } from "@stealthscale/sdk-core";

import { hostedOf } from "#hosted.ts";
import { NOTES } from "#manifest.fixtures.ts";

const CHECK = { permission: "notes/note.edit", resource: { id: "n1", type: "notes/note" } };

describe("hostedOf", () => {
  it("starts the session signed in with every permission the product declares", () => {
    const { host } = hostedOf(NOTES);

    expect([...host.stores.session.get().permissions]).toStrictEqual([
      "notes/note.edit",
      "notes/note.read",
    ]);
  });

  it("starts from the session the options state", () => {
    const { host } = hostedOf({ ...NOTES, session: NOBODY });

    expect(host.stores.session.get().session).toBe(NOBODY);
  });

  it("allows every check where the options state no decider", async () => {
    const { sources } = hostedOf(NOTES);

    await expect(sources.access.check([CHECK])).resolves.toStrictEqual([true]);
  });

  it("decides each check with the decider the options state", async () => {
    const { sources } = hostedOf({ ...NOTES, access: () => false });

    await expect(sources.access.check([CHECK])).resolves.toStrictEqual([false]);
  });

  it("serves the flag values the options state", () => {
    const { host } = hostedOf({ ...NOTES, flags: { "notes/archive": false } });

    expect(host.stores.flags.read("notes/archive")).toBe(false);
  });

  it("turns a boolean flag on where the options state no value for it", () => {
    const { host } = hostedOf(NOTES);

    expect(host.stores.flags.read("notes/archive")).toBe(true);
  });

  it("switches a plugin off where the switches state it", () => {
    const { host } = hostedOf({ ...NOTES, switches: { notes: false } });

    expect(host.stores.availability.get()["notes"]?.on).toBe(false);
  });

  it("applies the placements the options state", () => {
    const placement = { add: ["notes/badge"] };
    const { host } = hostedOf({ ...NOTES, placements: { "host/aside": placement } });

    expect(host.stores.placements.get()).toStrictEqual({ "host/aside": placement });
  });

  it("returns the store the host keeps the person's choices in", () => {
    const { host, store } = hostedOf({ ...NOTES, switches: { notes: false } });

    host.dispose();

    expect(store.read("stealth.notes.@.plugin.notes")).toBe("off");
  });
});
