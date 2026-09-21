import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports Portal alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Portal"]);
  });

  it("exports no recipe or binding helper", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
