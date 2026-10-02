import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { composed } from "#steps/steps.fixtures.tsx";

describe("Content", () => {
  it("shows the current step's content", async () => {
    await drawn(composed({ defaultStep: 1 }));

    expect(screen.getByText("About Amount").hidden).toBe(false);
  });

  it("hides the content of another step", async () => {
    await drawn(composed({ defaultStep: 1 }));

    expect(screen.getByText("About Account").hidden).toBe(true);
  });

  it("drops the machine's tabpanel role", async () => {
    await drawn(composed());

    expect(screen.queryByRole("tabpanel")).toBeNull();
  });

  it("drops tabIndex and aria-labelledby", async () => {
    await drawn(composed());

    const content = screen.getByText("About Account");

    expect([
      content.hasAttribute("tabindex"),
      content.hasAttribute("aria-labelledby"),
    ]).toStrictEqual([false, false]);
  });

  it("renders a div", async () => {
    await drawn(composed());

    expect(screen.getByText("About Account").tagName).toBe("DIV");
  });
});
