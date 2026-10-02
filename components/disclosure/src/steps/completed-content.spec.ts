import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { composed } from "#steps/steps.fixtures.tsx";

describe("CompletedContent", () => {
  it("hides the completed content before the last step is done", async () => {
    await drawn(composed({ defaultStep: 2 }));

    expect(screen.getByText("Done").hidden).toBe(true);
  });

  it("shows the completed content once the last step is done", async () => {
    await drawn(composed({ defaultStep: 2 }));
    await pressed(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Done").hidden).toBe(false);
  });

  it("drops the machine's tabpanel role", async () => {
    await drawn(composed({ defaultStep: 3 }));

    expect(screen.getByText("Done").hasAttribute("role")).toBe(false);
  });
});
