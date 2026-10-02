import { describe, expect, it } from "vitest";

import { LIVES, ROLES } from "#alert/live.ts";

describe("live", () => {
  it("orders LIVES from off to assertive", () => {
    expect(LIVES).toStrictEqual(["off", "polite", "assertive"]);
  });

  it("maps assertive to the alert role", () => {
    expect(ROLES.assertive).toStrictEqual({ role: "alert" });
  });

  it("maps polite to the status role", () => {
    expect(ROLES.polite).toStrictEqual({ role: "status" });
  });

  it("maps off to no attributes", () => {
    expect(ROLES.off).toStrictEqual({});
  });

  it("sets aria-live on no level", () => {
    expect.hasAssertions();

    for (const attributes of Object.values(ROLES)) {
      expect(attributes).not.toHaveProperty("aria-live");
    }
  });
});
