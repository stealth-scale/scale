import { act, renderHook } from "@testing-library/react";
import { describe, expect, expectTypeOf, it } from "vitest";

import { formatForDisplay } from "@stealthscale/provider-hotkeys";

import { READER } from "#access/access.fixtures.ts";
import { RUN, SYNC } from "#commands/commands.fixtures.ts";
import { useCommand, useCommands } from "#commands/commands.ts";
import { fixtureHost } from "#host/host.fixtures.tsx";
import { type Approval, timeOffContract } from "#host/product.fixtures.ts";
import { routedWrapper } from "#host/routed.fixtures.tsx";

describe("commands", () => {
  it("translates the label in the plugin's catalogue", async () => {
    const { result } = renderHook(() => useCommand(timeOffContract.commands.request), {
      wrapper: await routedWrapper(fixtureHost()),
    });

    expect(result.current.label).toBe("Request time off");
  });

  it("formats the keys for the operating system", async () => {
    const { result } = renderHook(() => useCommand(timeOffContract.commands.request), {
      wrapper: await routedWrapper(fixtureHost()),
    });

    expect(result.current.keys).toBe(formatForDisplay("Mod+Shift+R"));
  });

  it("leaves the keys out for a command that binds none", async () => {
    const { result } = renderHook(() => useCommand(timeOffContract.commands.approve), {
      wrapper: await routedWrapper(fixtureHost()),
    });

    expect(result.current.keys).toBeUndefined();
  });

  it("returns enabled where the condition is true", async () => {
    const { result } = renderHook(() => useCommand(timeOffContract.commands.approve), {
      wrapper: await routedWrapper(fixtureHost()),
    });

    expect(result.current.enabled).toBe(true);
  });

  it("returns disabled while the condition is false", async () => {
    const { result } = renderHook(() => useCommand(timeOffContract.commands.approve), {
      wrapper: await routedWrapper(fixtureHost({ session: READER })),
    });

    expect(result.current.enabled).toBe(false);
  });

  it("returns disabled after the plugin turns off", async () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useCommand(timeOffContract.commands.request), {
      wrapper: await routedWrapper(host),
    });

    act(() => {
      host.availability.set({
        ...host.availability.get(),
        "time-off": { on: false, reason: "off" },
      });
    });

    expect(result.current.enabled).toBe(false);
  });

  it("returns disabled for a command no installed plugin declares", async () => {
    const { result } = renderHook(() => useCommand(RUN), {
      wrapper: await routedWrapper(fixtureHost()),
    });

    expect(result.current.enabled).toBe(false);
  });

  it("translates the reference's label for a command no installed plugin declares", async () => {
    const { result } = renderHook(() => useCommand(RUN), {
      wrapper: await routedWrapper(fixtureHost()),
    });

    expect(result.current.label).toBe("Run payroll");
  });

  it("returns the qualified id for a bare reference no installed plugin declares", async () => {
    const { result } = renderHook(() => useCommand(SYNC), {
      wrapper: await routedWrapper(fixtureHost()),
    });

    expect(result.current.label).toBe(SYNC.id);
  });

  it("runs the command through the host with its arguments", async () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useCommand(timeOffContract.commands.approve), {
      wrapper: await routedWrapper(host),
    });

    await expect(result.current.run({ requestId: "7" })).resolves.toBe("ran time-off/approve");
    expect(host.recorded.ran).toStrictEqual([["time-off/approve", { requestId: "7" }]]);

    expectTypeOf(result.current.run).parameters.toEqualTypeOf<[args: Approval]>();
  });

  it("types the result by the reference", async () => {
    const { result } = renderHook(() => useCommand(timeOffContract.commands.pick), {
      wrapper: await routedWrapper(fixtureHost()),
    });

    await expect(result.current.run()).resolves.toBe("ran time-off/pick");

    expectTypeOf(result.current.run).returns.toEqualTypeOf<Promise<string>>();
  });

  it("lists every command of the installed plugins in install order", async () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useCommands(), { wrapper: await routedWrapper(host) });

    expect(result.current.map(({ command }) => command)).toStrictEqual(
      host.runtime.product.commands,
    );
  });

  it("reports which listed commands are enabled", async () => {
    const { result } = renderHook(() => useCommands(), {
      wrapper: await routedWrapper(fixtureHost({ session: READER })),
    });

    expect(result.current.map(({ command, enabled }) => [command.id, enabled])).toStrictEqual([
      ["time-off/approve", false],
      ["time-off/pick", true],
      ["time-off/request", true],
    ]);
  });

  it("translates each listed label in its plugin's catalogue", async () => {
    const { result } = renderHook(() => useCommands(), {
      wrapper: await routedWrapper(fixtureHost()),
    });

    expect(result.current.map(({ keys, label }) => [label, keys])).toStrictEqual([
      ["Approve request", undefined],
      ["Pick a person", undefined],
      ["Request time off", formatForDisplay("Mod+Shift+R")],
    ]);
  });

  it("runs a listed command through the host", async () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useCommands(), { wrapper: await routedWrapper(host) });

    await expect(result.current[0]?.run({ requestId: "7" })).resolves.toBe("ran time-off/approve");
    expect(host.recorded.ran).toStrictEqual([["time-off/approve", { requestId: "7" }]]);
  });
});
