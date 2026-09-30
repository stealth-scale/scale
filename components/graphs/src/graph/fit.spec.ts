import { describe, expect, it } from "vitest";

import { FIT, MIN_ZOOM } from "#graph/fit.ts";

describe("fit", () => {
  it("fits the graph at most at its own size", () => {
    expect(FIT.maxZoom).toBe(1);
  });

  it("keeps 32px clear at the top for a tag above a card", () => {
    expect(FIT.padding).toMatchObject({ top: "32px" });
  });

  it("keeps 32px clear at the bottom for the attribution", () => {
    expect(FIT.padding).toMatchObject({ bottom: "32px" });
  });

  it("keeps 24px clear at either side", () => {
    expect(FIT.padding).toMatchObject({ left: "24px", right: "24px" });
  });

  it("zooms out as far as 10%", () => {
    expect(MIN_ZOOM).toBe(0.1);
  });
});
