import { describe, expect, it } from "vitest";

import { quiet } from "#chrome/quiet.ts";

describe("quiet", () => {
  it("names the class that moves a control onto the neutral palette", () => {
    expect(quiet).toMatch(/neutral/u);
  });
});
