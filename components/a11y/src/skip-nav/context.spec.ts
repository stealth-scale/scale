import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses } from "@stealthscale/testing-theme";

import { withProvider } from "#skip-nav/context.ts";

describe("context", () => {
  it("applies the link slot class to the element it wraps", () => {
    const Probe = withProvider("a", "link");
    const { container } = render(createElement(Probe, null, "Skip"));

    expect(slotClasses(container, "skip-nav", "link")).toContain("skip-nav__link");
  });

  it("applies the target slot class to the element it wraps", () => {
    const Probe = withProvider("div", "target");
    const { container } = render(createElement(Probe));

    expect(slotClasses(container, "skip-nav", "target")).toContain("skip-nav__target");
  });
});
