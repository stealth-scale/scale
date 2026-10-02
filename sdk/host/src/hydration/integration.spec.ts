import { describe, expect, it, vi } from "vitest";

import { decisionKey } from "@stealthscale/sdk-plugin";

import { isPending } from "#host/host.fixtures.ts";
import {
  browserOf,
  dehydratedBy,
  hostOf,
  type Hydrate,
  hydrateBy,
  keysOf,
  ON,
  readingIn,
  roundTrip,
  serverOf,
  snapshotIn,
} from "#hydration/integration.fixtures.tsx";
import { SEVEN } from "#stores/access.fixtures.ts";
import { CALENDAR } from "#stores/flags.fixtures.ts";

describe("setupHostIntegration", () => {
  it("adds a host snapshot to the router's dehydrated state on a server", async () => {
    const state = await dehydratedBy(serverOf(hostOf(true)));

    expect(keysOf(state)).toStrictEqual(["host"]);
  });

  it("keeps the earlier dehydrated state beside the host snapshot", async () => {
    const state = await dehydratedBy(
      serverOf(hostOf(true), () => Promise.resolve({ query: "streamed" })),
    );

    expect(keysOf(state)).toStrictEqual(["query", "host"]);
  });

  it("resolves the snapshot once the render finished", async () => {
    const snapshot = snapshotIn(await dehydratedBy(serverOf(hostOf(true))));

    await expect(isPending(snapshot)).resolves.toBe(true);
  });

  it("puts the flags the render read in the snapshot", async () => {
    const server = serverOf(hostOf(true));
    const snapshot = snapshotIn(await dehydratedBy(server));

    server.host.stores.flags.read(CALENDAR);
    server.finish();

    expect(readingIn(await snapshot, CALENDAR)).toStrictEqual(ON);
  });

  it("puts the decisions known before the render in the snapshot", async () => {
    const server = serverOf(hostOf(true));
    const { access } = server.host.stores;

    access.prime([{ ...SEVEN, allowed: true }]);

    const snapshot = snapshotIn(await dehydratedBy(server));

    access.prime([{ ...SEVEN, allowed: false, resource: { id: "8", type: "time-off/request" } }]);
    server.finish();

    await expect(snapshot).resolves.toMatchObject({ decisions: [[decisionKey(SEVEN), true]] });
  });

  it("puts the request's subject in the snapshot", async () => {
    const server = serverOf(hostOf(true));
    const snapshot = snapshotIn(await dehydratedBy(server));

    server.finish();

    await expect(snapshot).resolves.toMatchObject({ subject: "ada@acme" });
  });

  it("hydrates the browser's flags from the server's snapshot", async () => {
    const browser = hostOf(false);

    await hydrateBy(browserOf(browser), {
      host: Promise.resolve({ decisions: [], flags: [[CALENDAR, ON]], subject: "ada@acme" }),
    });

    expect(browser.stores.flags.read(CALENDAR)).toBe(true);
  });

  it("calls the earlier hydrate before it hydrates the browser's host", async () => {
    const browser = hostOf(false);
    const seen: unknown[] = [];
    const earlier = vi.fn<Hydrate>(() => {
      seen.push(browser.stores.flags.read(CALENDAR));

      return Promise.resolve();
    });

    await hydrateBy(browserOf(browser, earlier), {
      host: Promise.resolve({ decisions: [], flags: [[CALENDAR, ON]], subject: "ada@acme" }),
    });

    expect([...seen, browser.stores.flags.read(CALENDAR)]).toStrictEqual([false, true]);
  });

  it("hydrates the decisions where the browser's subject is the server's", async () => {
    const browser = hostOf(false);

    await hydrateBy(browserOf(browser), {
      host: Promise.resolve({
        decisions: [[decisionKey(SEVEN), true]],
        flags: [],
        subject: "ada@acme",
      }),
    });

    expect(browser.stores.access.get().decisions.get(decisionKey(SEVEN))).toBe(true);
  });

  it("leaves the decisions out where the browser's subject is another", async () => {
    const browser = hostOf(false);

    await hydrateBy(browserOf(browser), {
      host: Promise.resolve({
        decisions: [[decisionKey(SEVEN), true]],
        flags: [],
        subject: "grace@acme",
      }),
    });

    expect(browser.stores.access.get().decisions.size).toBe(0);
  });

  it.each([
    { label: "no dehydrated state", state: undefined },
    { label: "a dehydrated state without a snapshot", state: { query: "streamed" } },
    { label: "a snapshot without decisions", state: { host: Promise.resolve({ flags: [] }) } },
  ])("hydrates nothing from $label", async ({ state }) => {
    const browser = hostOf(false);

    await hydrateBy(browserOf(browser), state);

    expect(browser.stores.flags.read(CALENDAR)).toBe(false);
  });

  it("hydrates a server render without a mismatch", async () => {
    await expect(roundTrip(true)).resolves.toMatchObject({ errors: [] });
  });

  it("renders the browser's flag once HostProvider mounts", async () => {
    await expect(roundTrip(true)).resolves.toMatchObject({ text: "calendar off" });
  });

  it("reports a mismatch where the browser's host was not hydrated", async () => {
    const { errors } = await roundTrip(false);

    expect(errors.some((message) => message.includes("didn't match"))).toBe(true);
  });
});
