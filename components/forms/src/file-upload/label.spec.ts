import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, hiddenInput } from "#file-upload/file-upload.fixtures.tsx";

describe("Label", () => {
  it("renders a label element", async () => {
    await drawn(composed());

    expect(screen.getByText("Statements").tagName).toBe("LABEL");
  });

  it("points at the hidden file input", async () => {
    const { container } = await drawn(composed());

    expect(screen.getByText<HTMLLabelElement>("Statements").htmlFor).toBe(
      hiddenInput(container).id,
    );
  });

  it("names the group only while it is mounted", async () => {
    const { rerender } = await drawn(composed());

    rerender(composed({}, { labelled: false }));
    await settled();

    expect(screen.getByRole("group").getAttribute("aria-labelledby")).toBeNull();
  });
});
