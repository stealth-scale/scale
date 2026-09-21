import { describe, expect, it } from "vitest";

import * as barrel from "#portal/index.ts";

describe("index", () => {
  it("exports Portal alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Portal"]);
  });
});
