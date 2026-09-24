import { describe, expect, it } from "vitest";

import { STAGED } from "#floated/staged.ts";

describe("STAGED", () => {
  it("turns off flip slide and the size middleware", () => {
    expect(STAGED).toStrictEqual({ flip: false, sizeMiddleware: false, slide: false });
  });

  it("sets no placement", () => {
    expect(STAGED).not.toHaveProperty("placement");
  });
});
