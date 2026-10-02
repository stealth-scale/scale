import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, STATEMENT } from "#file-upload/file-upload.fixtures.tsx";
import { ItemGroup } from "#file-upload/item-group.tsx";
import { ItemPreview } from "#file-upload/item-preview.tsx";
import { Item } from "#file-upload/item.tsx";
import { Items } from "#file-upload/items.tsx";
import { Root } from "#file-upload/root.tsx";

describe("ItemPreview", () => {
  it("renders a span", async () => {
    const { container } = await drawn(composed({ defaultAcceptedFiles: [STATEMENT] }));

    expect(slotElement(container, "file-upload", "itemPreview").tagName).toBe("SPAN");
  });

  it("hides itself from assistive technology", async () => {
    const { container } = await drawn(composed({ defaultAcceptedFiles: [STATEMENT] }));

    expect(slotElement(container, "file-upload", "itemPreview").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("renders the glyph the caller passes", async () => {
    await drawn(
      <Root defaultAcceptedFiles={[STATEMENT]}>
        <ItemGroup>
          <Items>
            {(file) => (
              <Item file={file}>
                <ItemPreview>
                  <svg data-testid="glyph" />
                </ItemPreview>
              </Item>
            )}
          </Items>
        </ItemGroup>
      </Root>,
    );

    expect(screen.getByTestId("glyph").tagName.toLowerCase()).toBe("svg");
  });
});
