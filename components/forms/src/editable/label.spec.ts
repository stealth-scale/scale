import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, preview } from "#editable/editable.fixtures.tsx";

describe("Label", () => {
  it("renders a label element", async () => {
    await drawn(composed());

    expect(screen.getByText("Workspace name").tagName).toBe("LABEL");
  });

  it("moves focus to the preview on a press", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByText("Workspace name"));
    await settled();

    expect(document.activeElement).toBe(preview());
  });

  it("names the preview only while it is mounted", async () => {
    const { rerender } = await drawn(composed());

    rerender(composed({}, { labelled: false }));
    await settled();

    expect(preview().getAttribute("aria-labelledby")).not.toContain("label");
  });
});
