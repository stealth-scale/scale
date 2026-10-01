import { command } from "#command.ts";
import { timeOffContract } from "#define.fixtures.ts";
import { defineContract } from "#define.ts";
import { hostContract } from "#host.ts";
import { lazy, request } from "#manifest.fixtures.ts";
import { manifestOf } from "#resolve/resolve.fixtures.ts";
import { extension, type ExtensionTarget, slot } from "#slot.ts";

export const legacyContract = defineContract("legacy", (self) => ({
  extensions: { own: extension({ position: "after", target: self.slot("old") }) },
  slots: { new: slot(), old: slot({ deprecated: "use legacy/new" }) },
  version: "1.2.0",
}));

export const legacy = manifestOf(legacyContract);

export function extending(
  pluginId: string,
  ...targets: readonly ExtensionTarget[]
): ReturnType<typeof manifestOf> {
  const extensions = Object.fromEntries(
    targets.map((target, index) => [
      `badge-${String(index)}`,
      { kind: "extension" as const, position: "after" as const, target },
    ]),
  );

  return manifestOf(defineContract(pluginId, { extensions }));
}

export const sidebar = timeOffContract.slots["request-sidebar"];

export const ghost = extending("ghost", { id: "time-off/missing", kind: "slot" });

export const later = extending("later", { ...sidebar, version: "0.5.0" });

export const earlier = extending("earlier", { ...sidebar, version: "0.3.0" });

export const prerelease = extending("prerelease", { ...sidebar, version: "0.4.0-beta.1" });

export const odd = extending("odd", { ...sidebar, version: "four" });

export const away = extending("away", { id: "billing/invoice", kind: "slot" });

export const framed = extending("framed", hostContract.slots.aside);

export const fan = extending("fan", legacyContract.slots.old, legacyContract.slots.old);

export const needyContract = defineContract("needy", {
  commands: { delegate: command({ label: "commands.delegate" }) },
});

export const needy = manifestOf(needyContract, {
  commands: {
    delegate: {
      needs: { missing: { id: "time-off/missing", kind: "command" } },
      run: lazy({ request }),
    },
  },
});
