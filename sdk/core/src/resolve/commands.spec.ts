import { describe, expect, it } from "vitest";

import { timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { keys, relay, unsampled, validateHotkey } from "#resolve/commands.fixtures.ts";
import { chordOf, resolveCommands } from "#resolve/commands.ts";
import { report } from "#resolve/problem.ts";
import { identity } from "#resolve/requirements.fixtures.ts";
import { contextFor, faultsOf, productOf } from "#resolve/resolve.fixtures.ts";

describe("commands", () => {
  it.each([
    { keys: "Mod+Shift+R", want: "mod+shift+r" },
    { keys: "Shift + mod + r", want: "mod+shift+r" },
    { keys: "Ctrl+Option+K", want: "alt+control+k" },
    { keys: "K", want: "k" },
  ])("writes $keys as the chord $want", ({ keys: binding, want }) => {
    expect(chordOf(binding)).toBe(want);
  });

  it("passes the commands of an installed plugin", () => {
    const context = contextFor(productOf([installed(timeOff)]), { validateHotkey });

    expect(faultsOf(resolveCommands, context)).toStrictEqual({ problems: [], warnings: [] });
  });

  it("refuses a need on a plugin the command's plugin does not require", () => {
    const context = contextFor(
      productOf([installed(timeOff), installed(identity), installed(relay)]),
    );

    expect(faultsOf(resolveCommands, context).problems).toStrictEqual([
      "relay.code.commands.forward.needs.approve: names the command time-off/approve, and relay does not require time-off",
    ]);
  });

  it("refuses the bindings a command cannot take", () => {
    const context = contextFor(productOf([installed(timeOff), installed(keys)]), {
      validateHotkey,
    });

    expect(faultsOf(resolveCommands, context).problems).toStrictEqual([
      "keys.commands.palette.keys: binds Cmd+K, which opens the palette",
      "keys.commands.resolves.keys: is refused on a command that resolves with a result",
      "keys.commands.takes.keys: is refused on a command that takes arguments",
      "keys.commands.unreadable.keys: cannot be read: Unknown modifier: 'Hyper'",
    ]);
  });

  it("refuses a command that takes arguments without a sample", () => {
    expect(
      faultsOf(resolveCommands, contextFor(productOf([installed(unsampled)]))).problems,
    ).toStrictEqual([
      "unsampled.commands.pick.sample: is required on a command that takes arguments",
    ]);
  });

  it("warns where a second command binds a chord", () => {
    const context = contextFor(productOf([installed(timeOff), installed(keys)]));

    expect(faultsOf(resolveCommands, context).warnings).toStrictEqual([
      "keys.commands.clash.keys: binds Shift+Mod+R, as time-off/request does",
    ]);
  });

  it("resolves a command with the needs its code states", () => {
    const context = contextFor(
      productOf([installed(timeOff), installed(identity), installed(relay)]),
    );
    const { commands } = resolveCommands(context, report());

    expect(commands.find(({ id }) => id === "relay/forward")).toStrictEqual({
      id: "relay/forward",
      keys: undefined,
      label: "commands.forward",
      needs: { approve: "time-off/approve", local: "relay/local", signIn: "identity/signIn" },
      plugin: "relay",
      returnsResult: false,
      takesArguments: false,
      when: undefined,
    });
  });

  it("resolves a command of a manifest without command code", () => {
    const { commands } = resolveCommands(contextFor(productOf([installed(keys)])), report());

    expect(commands.find(({ id }) => id === "keys/takes")).toMatchObject({
      needs: {},
      returnsResult: false,
      takesArguments: true,
    });
  });

  it("resolves the host's events before a plugin's", () => {
    const { events } = resolveCommands(contextFor(productOf([installed(relay)])), report());

    expect(events.map(({ emit, id, sticky }) => `${id} ${emit} ${String(sticky)}`)).toStrictEqual([
      "host/navigated owner false",
      "host/pluginChanged owner false",
      "host/recordsChanged owner false",
      "host/sessionChanged owner true",
      "relay/asked anyone false",
    ]);
  });
});
