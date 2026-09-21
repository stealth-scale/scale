import { describe, expect, it } from "vitest";

import { declared } from "#stylesheet.ts";

const CSS = `
@layer tokens {
  :where(:root, :host) {
    --colors-bg: white;
    --colors-fg: black;
  }
  @media (prefers-color-scheme: dark) {
    :where(:root, :host):not([data-color-mode=light], [data-color-mode=light] *) {
      --colors-bg: near-black;
    }
    :where(:root) [data-theme=abyss], [data-theme=abyss]:where(:root), [data-theme=abyss] :where(:root) {
      --colors-bg: deep;
    }
  }
}
@layer recipes {
  .button { border-radius: var(--radii-l2) }
  .button--size-lg { padding: 1rem }
}
`;

describe("declared", () => {
  it("returns the value a selector declares for a property", () => {
    expect(declared(CSS, ":where(:root, :host)", "--colors-bg")).toBe("white");
    expect(declared(CSS, ".button", "border-radius")).toBe("var(--radii-l2)");
  });

  it("matches a selector containing regular expression syntax characters", () => {
    expect(
      declared(
        CSS,
        ":where(:root, :host):not([data-color-mode=light], [data-color-mode=light] *)",
        "--colors-bg",
      ),
    ).toBe("near-black");
  });

  it("matches a selector at any position in a selector list", () => {
    expect(declared(CSS, "[data-theme=abyss]:where(:root)", "--colors-bg")).toBe("deep");
    expect(declared(CSS, "[data-theme=abyss] :where(:root)", "--colors-bg")).toBe("deep");
  });

  it("returns undefined when no rule declares the property", () => {
    expect(declared(CSS, ".button", "color")).toBeUndefined();
    expect(declared(CSS, ".missing", "color")).toBeUndefined();
  });

  it("returns undefined when only a longer selector opens the rule", () => {
    expect(declared(CSS, ".button--size", "padding")).toBeUndefined();
  });
});
