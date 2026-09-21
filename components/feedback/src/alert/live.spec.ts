import { describe, expect, it } from "vitest";

import { LIVES, ROLES } from "#alert/live.ts";

describe("live", () => {
  it("orders LIVES from the quietest level to the loudest", () => {
    expect(LIVES).toStrictEqual(["off", "polite", "assertive"]);
  });

  it("resolves assertive to the alert role alone", () => {
    expect(ROLES.assertive).toStrictEqual({ role: "alert" });
  });

  it("resolves polite to the status role alone", () => {
    expect(ROLES.polite).toStrictEqual({ role: "status" });
  });

  it("resolves off to no attributes at all", () => {
    expect(ROLES.off).toStrictEqual({});
  });

  it("sets aria-live on no announcement level", () => {
    expect.hasAssertions();

    for (const attributes of Object.values(ROLES)) {
      expect(attributes).not.toHaveProperty("aria-live");
    }
  });
});
