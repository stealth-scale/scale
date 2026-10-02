import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, copies, measured } from "#marquee/marquee.fixtures.tsx";

describe("Content", () => {
  it("renders one clone after the first copy without autoFill", async () => {
    await drawn(composed());

    expect(copies()).toHaveLength(2);
  });

  it("renders the first copy without aria-hidden", async () => {
    await drawn(composed());

    expect(copies()[0]?.getAttribute("aria-hidden")).toBeNull();
  });

  it("renders the first copy without inert", async () => {
    await drawn(composed());

    expect(copies()[0]?.hasAttribute("inert")).toBe(false);
  });

  it("hides a clone from assistive technology", async () => {
    await drawn(composed());

    expect(copies()[1]?.getAttribute("aria-hidden")).toBe("true");
  });

  it("makes a clone inert so Tab skips its controls", async () => {
    await drawn(composed());

    expect(copies()[1]?.hasAttribute("inert")).toBe(true);
  });

  it("renders as many copies as fill the viewport under autoFill", async () => {
    measured();
    await drawn(composed({ autoFill: true }));
    await settled();

    expect(copies()).toHaveLength(5);
  });

  it("passes the caller's props to every copy", async () => {
    await drawn(composed({}, { className: "strip" }));

    expect(copies().every((copy) => copy.classList.contains("strip"))).toBe(true);
  });
});
