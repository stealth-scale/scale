import { type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useOptions } from "#json-tree-view/options.ts";

/**
 * Reads the options, which throws outside a provider.
 */
function Reader(): ReactNode {
  useOptions();

  return null;
}

describe("options", () => {
  it("throws from useOptions outside JsonTreeView.Root", () => {
    expect(() => render(<Reader />)).toThrow(
      "A part of JsonTreeView was drawn outside the root that holds it together.",
    );
  });
});
