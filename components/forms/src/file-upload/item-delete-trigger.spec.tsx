import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import {
  composed,
  fileOf,
  framed,
  names,
  picked,
  RECEIPT,
  STATEMENT,
} from "#file-upload/file-upload.fixtures.tsx";
import { ItemDeleteTrigger } from "#file-upload/item-delete-trigger.tsx";
import { ItemGroup } from "#file-upload/item-group.tsx";
import { Item } from "#file-upload/item.tsx";
import { Items } from "#file-upload/items.tsx";
import { Root } from "#file-upload/root.tsx";

/**
 * A third file, for the cases that remove a row between two others.
 */
const INVOICE = fileOf("invoice.pdf", "application/pdf");

/**
 * Returns the delete trigger of a file, found by its default name.
 *
 * @param name - The file's name.
 * @returns The `button` element.
 */
function remover(name: string): HTMLButtonElement {
  return screen.getByRole<HTMLButtonElement>("button", { name: `Remove ${name}` });
}

/**
 * Presses a delete trigger and waits for the machine and the frame that moves focus.
 *
 * @param name - The name of the file whose trigger is pressed.
 * @returns A promise that resolves after the frame.
 */
async function removed(name: string): Promise<void> {
  fireEvent.click(remover(name));
  await settled();
  await framed();
}

describe("ItemDeleteTrigger", () => {
  it("names the button after its file", async () => {
    await drawn(composed({ defaultAcceptedFiles: [STATEMENT] }));

    expect(remover("statement.pdf").tagName).toBe("BUTTON");
  });

  it("takes its name from label", async () => {
    await drawn(
      <Root defaultAcceptedFiles={[STATEMENT]}>
        <ItemGroup>
          <Items>
            {(file) => (
              <Item file={file}>
                <ItemDeleteTrigger label={`Delete ${file.name}`} />
              </Item>
            )}
          </Items>
        </ItemGroup>
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Delete statement.pdf" })).toBeDefined();
  });

  it("removes its file on a press", async () => {
    const { container } = await drawn(composed({ defaultAcceptedFiles: [STATEMENT, RECEIPT] }));

    await removed("statement.pdf");

    expect(names(slotElement(container, "file-upload", "itemGroup"))).toStrictEqual([
      "receipt.png",
    ]);
  });

  it("moves focus to the next row's delete trigger", async () => {
    await drawn(composed({ defaultAcceptedFiles: [STATEMENT, RECEIPT, INVOICE] }));

    await removed("receipt.png");

    expect(document.activeElement).toBe(remover("invoice.pdf"));
  });

  it("moves focus to the previous row's delete trigger after the last row", async () => {
    await drawn(composed({ defaultAcceptedFiles: [STATEMENT, RECEIPT] }));

    await removed("receipt.png");

    expect(document.activeElement).toBe(remover("statement.pdf"));
  });

  it("moves focus to the dropzone after the only row", async () => {
    await drawn(composed({ defaultAcceptedFiles: [STATEMENT] }));

    await removed("statement.pdf");

    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Drop statements here" }),
    );
  });

  it("removes a refused file from the refused list", async () => {
    const { container } = await drawn(composed({ accept: "application/pdf" }));

    await picked(container, [RECEIPT]);
    await removed("receipt.png");

    expect(container.querySelectorAll("li")).toHaveLength(0);
  });

  it("leaves focus in place when the caller cancels the press", async () => {
    await drawn(
      <Root defaultAcceptedFiles={[STATEMENT, RECEIPT]} maxFiles={2}>
        <ItemGroup>
          <Items>
            {(file) => (
              <Item file={file}>
                <ItemDeleteTrigger
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                />
              </Item>
            )}
          </Items>
        </ItemGroup>
      </Root>,
    );

    await removed("statement.pdf");

    expect(document.activeElement).toBe(document.body);
  });

  it("hides itself in a read-only upload", async () => {
    await drawn(composed({ defaultAcceptedFiles: [STATEMENT], readOnly: true }));

    expect(screen.queryByRole("button", { name: "Remove statement.pdf" })).toBeNull();
  });

  it("is disabled with the upload", async () => {
    await drawn(composed({ defaultAcceptedFiles: [STATEMENT], disabled: true }));

    expect(remover("statement.pdf").disabled).toBe(true);
  });
});
