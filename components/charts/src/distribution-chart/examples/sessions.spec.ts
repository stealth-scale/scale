import { describe, expect, it } from "vitest";

import { FREE, PRO } from "#distribution-chart/examples/sessions.ts";

describe("sessions", () => {
  it("lists 120 sessions on the free plan", () => {
    expect(FREE).toHaveLength(120);
  });

  it("lists 30 sessions on the paid plan", () => {
    expect(PRO).toHaveLength(30);
  });
});
