import { command, event } from "#command.ts";
import { timeOffContract } from "#define.fixtures.ts";
import { defineContract } from "#define.ts";
import { lazy, request } from "#manifest.fixtures.ts";
import { type HotkeyCheck } from "#resolve/options.ts";
import { identityContract } from "#resolve/requirements.fixtures.ts";
import { manifestOf } from "#resolve/resolve.fixtures.ts";
import { needs } from "#version.ts";

export const keysContract = defineContract("keys", {
  commands: {
    clash: { keys: "Shift+Mod+R", kind: "command", label: "commands.clash" },
    palette: { keys: "Cmd+K", kind: "command", label: "commands.palette" },
    resolves: { keys: "Mod+U", kind: "command", label: "commands.resolves", result: true },
    takes: { arguments: true, keys: "Mod+T", kind: "command", label: "commands.takes", sample: {} },
    unreadable: { keys: "Hyper+X", kind: "command", label: "commands.unreadable" },
  },
});

export const keys = manifestOf(keysContract);

export const unsampled = manifestOf(
  defineContract("unsampled", {
    commands: { pick: { arguments: true, kind: "command", label: "commands.pick" } },
  }),
);

export const relayContract = defineContract("relay", {
  commands: {
    forward: command({ label: "commands.forward" }),
    local: command({ label: "commands.local" }),
  },
  events: { asked: event({ emit: "anyone" }) },
  requires: [needs(identityContract, "^0.4.0")],
});

export const relay = manifestOf(relayContract, {
  commands: {
    forward: {
      needs: {
        approve: timeOffContract.commands.approve,
        local: { id: "relay/local", kind: "command" },
        signIn: { id: "identity/signIn", kind: "command" },
      },
      run: lazy({ request }),
    },
    local: { run: lazy({ request }) },
  },
});

export function validateHotkey(hotkey: string): HotkeyCheck {
  return hotkey.startsWith("Hyper")
    ? { errors: ["Unknown modifier: 'Hyper'"], valid: false }
    : { errors: [], valid: true };
}
