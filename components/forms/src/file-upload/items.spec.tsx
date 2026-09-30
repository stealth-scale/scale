import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { fileOf, picked, RECEIPT, STATEMENT } from "#file-upload/file-upload.fixtures.tsx";
import { ItemGroup } from "#file-upload/item-group.tsx";
import { Items } from "#file-upload/items.tsx";
import { type ItemType } from "#file-upload/machine.ts";
import { Root, type RootProps } from "#file-upload/root.tsx";

/**
 * Renders a root whose items write each file's name and reasons as text.
 *
 * @param props - The props of the root.
 * @param type - The list the items render.
 * @returns The upload.
 */
function listed(props: RootProps, type: ItemType = "accepted"): ReactElement {
  return (
    <Root {...props}>
      <ItemGroup type={type}>
        <Items>
          {(file, errors) => <li data-testid="file">{[file.name, ...errors].join(" ")}</li>}
        </Items>
      </ItemGroup>
    </Root>
  );
}

describe("Items", () => {
  it("calls the render function once per accepted file", async () => {
    await drawn(listed({ defaultAcceptedFiles: [STATEMENT, RECEIPT], maxFiles: 2 }));

    expect(screen.getAllByTestId("file").map((file) => file.textContent)).toStrictEqual([
      "statement.pdf",
      "receipt.png",
    ]);
  });

  it("passes each refused file with its reasons", async () => {
    const { container } = await drawn(listed({ accept: "application/pdf" }, "rejected"));

    await picked(container, [RECEIPT]);

    expect(screen.getByTestId("file").textContent).toBe("receipt.png FILE_INVALID_TYPE");
  });

  it("renders a refused file once per occurrence", async () => {
    const large = fileOf("scan.pdf", "application/pdf", 3000);
    const { container } = await drawn(listed({ maxFiles: 3, maxFileSize: 2000 }, "rejected"));

    await picked(container, [large, large]);

    expect(screen.getAllByTestId("file")).toHaveLength(2);
  });

  it("renders nothing while there are no files", async () => {
    await drawn(listed({}));

    expect(screen.queryAllByTestId("file")).toStrictEqual([]);
  });
});
