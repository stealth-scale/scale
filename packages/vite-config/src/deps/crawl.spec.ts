import { describe, expect, it } from "vitest";

import { crawl } from "#deps/crawl.ts";

describe("crawl", () => {
  it("targets optimizeDeps.entries", () => {
    for (const held of crawl({ because: "why", files: ["src/preview.ts"] })) {
      expect(held.at).toBe("optimizeDeps.entries");
    }
  });

  it("returns one contribution per file named deps.crawl(file)", () => {
    const held = crawl({ because: "why", files: ["a.ts", "b.ts"] });

    expect(held.map((each) => each.name)).toStrictEqual(["deps.crawl(a.ts)", "deps.crawl(b.ts)"]);
  });

  it("sets item to the glob as it was written", () => {
    const [held] = crawl({ because: "why", files: ["src/**/*.story.tsx"] });

    expect(held?.item).toBe("src/**/*.story.tsx");
  });

  it("sets because to the reason it was given", () => {
    const [held] = crawl({ because: "the kit loads a preview, not a page", files: ["a.ts"] });

    expect(held?.because).toBe("the kit loads a preview, not a page");
  });

  it("returns an empty array when files is empty", () => {
    expect(crawl({ because: "why", files: [] })).toStrictEqual([]);
  });
});
