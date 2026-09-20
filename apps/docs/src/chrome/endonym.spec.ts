import { describe, expect, it } from "vitest";

import { endonymOf, markOf } from "#chrome/endonym.ts";

describe("endonymOf", () => {
  it("writes a language in itself", () => {
    expect(endonymOf("nl")).toBe("Nederlands");
    expect(endonymOf("ar")).toBe("العربية");
  });

  it("answers the tag for one the browser cannot name", () => {
    expect(endonymOf("zz")).toBe("zz");
  });

  it("answers the tag for one the browser refuses", () => {
    expect(endonymOf("x-unknown")).toBe("x-unknown");
  });
});

describe("markOf", () => {
  it("writes the language in capitals and drops the region", () => {
    expect(markOf("nl-BE")).toBe("NL");
    expect(markOf("en")).toBe("EN");
  });
});
