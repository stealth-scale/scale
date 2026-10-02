import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { fileOf } from "#file-upload/file-upload.fixtures.tsx";
import * as FileUpload from "#file-upload/index.ts";

/**
 * Renders an upload with one file whose row shows its size.
 *
 * @param props - The props of the root.
 * @param size - The props of the size text.
 * @returns The upload.
 */
function sized(props: FileUpload.RootProps, size: FileUpload.ItemSizeTextProps = {}): ReactElement {
  return (
    <FileUpload.Root {...props}>
      <FileUpload.ItemGroup>
        <FileUpload.Items>
          {(file) => (
            <FileUpload.Item file={file}>
              <FileUpload.ItemSizeText {...size} />
            </FileUpload.Item>
          )}
        </FileUpload.Items>
      </FileUpload.ItemGroup>
    </FileUpload.Root>
  );
}

describe("ItemSizeText", () => {
  it("renders the file's size in decimal units", async () => {
    const { container } = await drawn(
      sized({ defaultAcceptedFiles: [fileOf("scan.pdf", "application/pdf", 5_240_000)] }),
    );

    expect(slotElement(container, "file-upload", "itemSizeText").textContent).toBe("5.24 MB");
  });

  it("formats the size in the upload's locale", async () => {
    const { container } = await drawn(
      sized({
        defaultAcceptedFiles: [fileOf("scan.pdf", "application/pdf", 1500)],
        locale: "de-DE",
      }),
    );

    expect(slotElement(container, "file-upload", "itemSizeText").textContent).toBe("1,5 kB");
  });

  it("renders a size below a kilobyte in the long unit", async () => {
    const { container } = await drawn(
      sized({ defaultAcceptedFiles: [fileOf("notes.txt", "text/plain", 520)] }),
    );

    expect(slotElement(container, "file-upload", "itemSizeText").textContent).toBe("520 bytes");
  });

  it("renders a size below a kilobyte in the upload's locale", async () => {
    const { container } = await drawn(
      sized({ defaultAcceptedFiles: [fileOf("notes.txt", "text/plain", 520)], locale: "de-DE" }),
    );

    expect(slotElement(container, "file-upload", "itemSizeText").textContent).toBe("520 Byte");
  });

  it("renders the children the caller passes in place of the size", async () => {
    await drawn(
      sized(
        { defaultAcceptedFiles: [fileOf("scan.pdf", "application/pdf")] },
        { children: "Uploaded" },
      ),
    );

    expect(screen.getByText("Uploaded").tagName).toBe("SPAN");
  });
});
