import { describe, expect, it } from "vitest";

import * as barrel from "#sample/index.ts";

describe("index", () => {
  it("names everything the sample publishes and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["DisplayProvider", "Sample"]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
