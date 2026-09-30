import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, field } from "#tags-input/tags-input.fixtures.tsx";

describe("Label", () => {
  it("renders a label element", async () => {
    await drawn(composed());

    expect(screen.getByText("Accounts").tagName).toBe("LABEL");
  });

  it("points at the input", async () => {
    await drawn(composed());

    expect(screen.getByText<HTMLLabelElement>("Accounts").htmlFor).toBe(field().id);
  });

  it("names the group only while it is mounted", async () => {
    const { rerender } = await drawn(composed());

    rerender(composed({}, { labelled: false }));
    await settled();

    expect(screen.getByRole("group").getAttribute("aria-labelledby")).toBeNull();
  });
});
