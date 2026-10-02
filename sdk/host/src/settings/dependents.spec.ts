import { describe, expect, it } from "vitest";

import { type ResolvedPlugin } from "@stealthscale/sdk-core";

import { dependentsOf } from "#settings/dependents.ts";
import { SETTLED } from "#settings/settings.fixtures.ts";

const [BASE] = SETTLED.plugins as readonly [ResolvedPlugin];

function pluginOf(id: string, requires: ResolvedPlugin["requires"] = []): ResolvedPlugin {
  return { ...BASE, id, requires };
}

function needing(pluginId: string): ResolvedPlugin["requires"] {
  return [{ pluginId, range: "^1.0.0" }];
}

function optionally(pluginId: string): ResolvedPlugin["requires"] {
  return [{ optional: true, pluginId, range: "^1.0.0" }];
}

const PLUGINS = [
  pluginOf("core"),
  pluginOf("reports", needing("core")),
  pluginOf("exports", needing("reports")),
  pluginOf("hints", optionally("core")),
  pluginOf("loose"),
];

function onAll(): boolean {
  return true;
}

describe("dependentsOf", () => {
  it("returns the plugins that require a plugin through another in install order", () => {
    expect(dependentsOf(PLUGINS, "core", onAll).map(({ id }) => id)).toStrictEqual([
      "reports",
      "exports",
    ]);
  });

  it("returns no plugin that requires it as optional", () => {
    expect(dependentsOf(PLUGINS, "core", onAll).map(({ id }) => id)).not.toContain("hints");
  });

  it("returns no plugin that is already off", () => {
    expect(
      dependentsOf(PLUGINS, "core", (id) => id !== "reports").map(({ id }) => id),
    ).toStrictEqual([]);
  });

  it("returns the plugins of a ring of requirements once", () => {
    const ring = [pluginOf("first", needing("second")), pluginOf("second", needing("first"))];

    expect(dependentsOf(ring, "first", onAll).map(({ id }) => id)).toStrictEqual(["second"]);
  });

  it("returns the plugins the fixture product's payroll requires time off for", () => {
    expect(dependentsOf(SETTLED.plugins, "time-off", onAll).map(({ id }) => id)).toStrictEqual([
      "payroll",
    ]);
  });
});
