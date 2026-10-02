import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, STATEMENT } from "#file-upload/file-upload.fixtures.tsx";
import { ItemGroup } from "#file-upload/item-group.tsx";
import { ItemName } from "#file-upload/item-name.tsx";
import { Item } from "#file-upload/item.tsx";
import { Items } from "#file-upload/items.tsx";
import { Root } from "#file-upload/root.tsx";

describe("ItemName", () => {
  it("renders the file's name", async () => {
    const { container } = await drawn(composed({ defaultAcceptedFiles: [STATEMENT] }));

    expect(slotElement(container, "file-upload", "itemName").textContent).toBe("statement.pdf");
  });

  it("renders the children the caller passes in place of the name", async () => {
    await drawn(
      <Root defaultAcceptedFiles={[STATEMENT]}>
        <ItemGroup>
          <Items>
            {(file) => (
              <Item file={file}>
                <ItemName>September statement</ItemName>
              </Item>
            )}
          </Items>
        </ItemGroup>
      </Root>,
    );

    expect(screen.getByText("September statement").tagName).toBe("SPAN");
  });
});
