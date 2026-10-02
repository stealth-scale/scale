import { describe, expect, it } from "vitest";

import { internalsOf } from "#host/internals.ts";
import { standaloneHosted } from "#standalone/hosted.ts";
import { WORKBENCH } from "#standalone/workbench.fixtures.tsx";

describe("standaloneHosted", () => {
  it("starts the host signed in with every declared permission", () => {
    const { host } = standaloneHosted(WORKBENCH, {});

    expect(host.stores.session.get().session.permissions).toContain("time-off/request.approve");
  });

  it("keeps a person's switches in local storage", () => {
    localStorage.clear();

    const { host } = standaloneHosted(WORKBENCH, {});

    internalsOf(host).switches.set("time-off", false);

    expect(Object.keys(localStorage).some((key) => key.endsWith("plugin.time-off"))).toBe(true);
  });

  it("starts every operation at its sample", () => {
    expect(standaloneHosted(WORKBENCH, {}).modes.get()).toStrictEqual({});
  });
});
