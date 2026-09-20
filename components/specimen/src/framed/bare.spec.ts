import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { bare } from "#framed/bare.ts";

describe("bare", () => {
  it("draws what it is given and nothing round it", () => {
    const { container } = render(bare(createElement("output", null, "drawn")));

    expect(container.innerHTML).toBe("<output>drawn</output>");
  });

  it("draws nothing for nothing", () => {
    const { container } = render(bare(null));

    expect(container.innerHTML).toBe("");
  });
});
