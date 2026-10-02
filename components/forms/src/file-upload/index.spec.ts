import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#file-upload/index.ts";

describe("index", () => {
  it("exports the fourteen parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "ClearTrigger",
      "Dropzone",
      "Item",
      "ItemContent",
      "ItemDeleteTrigger",
      "ItemGroup",
      "ItemName",
      "ItemPreview",
      "ItemPreviewImage",
      "ItemSizeText",
      "Items",
      "Label",
      "Root",
      "Trigger",
    ]);
  });

  it("throws for every part other than Root rendered outside a root", () => {
    const { ItemContent: _content, Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of FileUpload was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
