import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, STATEMENT } from "#file-upload/file-upload.fixtures.tsx";

describe("ItemContent", () => {
  it("renders a span around the name and the size", async () => {
    const { container } = await drawn(composed({ defaultAcceptedFiles: [STATEMENT] }));

    expect(slotElement(container, "file-upload", "itemContent").tagName).toBe("SPAN");
  });

  it("contains the name", async () => {
    const { container } = await drawn(composed({ defaultAcceptedFiles: [STATEMENT] }));

    expect(slotElement(container, "file-upload", "itemContent").textContent).toContain(
      "statement.pdf",
    );
  });
});
