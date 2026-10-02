import { type ReactElement } from "react";

import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { RECEIPT, STATEMENT } from "#file-upload/file-upload.fixtures.tsx";
import { ItemGroup } from "#file-upload/item-group.tsx";
import { ItemPreviewImage, type ItemPreviewImageProps } from "#file-upload/item-preview-image.tsx";
import { ItemPreview } from "#file-upload/item-preview.tsx";
import { Item } from "#file-upload/item.tsx";
import { Items } from "#file-upload/items.tsx";
import { Root } from "#file-upload/root.tsx";

/**
 * Renders an upload with one file whose row shows a preview image.
 *
 * @param file - The file in the upload.
 * @param props - The props of the preview image.
 * @returns The upload.
 */
function previewing(file: File, props: ItemPreviewImageProps = {}): ReactElement {
  return (
    <Root defaultAcceptedFiles={[file]}>
      <ItemGroup>
        <Items>
          {(each) => (
            <Item file={each}>
              <ItemPreview>
                <ItemPreviewImage {...props} />
              </ItemPreview>
            </Item>
          )}
        </Items>
      </ItemGroup>
    </Root>
  );
}

describe("ItemPreviewImage", () => {
  it("points an image at an object URL of an image file", async () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:receipt");

    const { container } = await drawn(previewing(RECEIPT));

    expect(container.querySelector("img")?.getAttribute("src")).toBe("blob:receipt");
  });

  it("leaves the image's text empty", async () => {
    const { container } = await drawn(previewing(RECEIPT));

    expect(container.querySelector("img")?.alt).toBe("");
  });

  it("takes the image's text from alt", async () => {
    const { container } = await drawn(previewing(RECEIPT, { alt: "Receipt from Halden & Co" }));

    expect(container.querySelector("img")?.alt).toBe("Receipt from Halden & Co");
  });

  it("renders nothing for a file that is not an image", async () => {
    const { container } = await drawn(previewing(STATEMENT));

    expect(container.querySelector("img")).toBeNull();
  });

  it("revokes the object URL when it unmounts", async () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:receipt");

    const revoke = vi.spyOn(URL, "revokeObjectURL");
    const { unmount } = await drawn(previewing(RECEIPT));

    unmount();

    expect(revoke).toHaveBeenLastCalledWith("blob:receipt");
  });
});
