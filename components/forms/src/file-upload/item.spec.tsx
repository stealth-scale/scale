import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { composed, picked, RECEIPT, STATEMENT } from "#file-upload/file-upload.fixtures.tsx";
import { Item } from "#file-upload/item.tsx";
import { Root } from "#file-upload/root.tsx";

describe("Item", () => {
  it("renders a list item", async () => {
    await drawn(composed({ defaultAcceptedFiles: [STATEMENT] }));

    expect(screen.getByRole("listitem").tagName).toBe("LI");
  });

  it("marks the row of an accepted file", async () => {
    await drawn(composed({ defaultAcceptedFiles: [STATEMENT] }));

    expect(screen.getByRole("listitem").dataset["type"]).toBe("accepted");
  });

  it("marks the row of a refused file", async () => {
    const { container } = await drawn(composed({ accept: "application/pdf" }));

    await picked(container, [RECEIPT]);

    expect(screen.getByRole("listitem").dataset["type"]).toBe("rejected");
  });

  it("throws outside an item group", async () => {
    await expect(
      drawn(
        <Root>
          <Item file={STATEMENT} />
        </Root>,
      ),
    ).rejects.toThrow(
      "A part of FileUpload.ItemGroup was drawn outside the root that holds it together.",
    );
  });
});
