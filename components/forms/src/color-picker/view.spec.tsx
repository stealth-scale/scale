import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Root } from "#color-picker/root.tsx";
import { View } from "#color-picker/view.tsx";

describe("View", () => {
  it("renders its children while its format is in force", async () => {
    await drawn(
      <Root defaultValue="#2563EB" format="hsla">
        <View format="hsla">HSL inputs</View>
      </Root>,
    );

    expect(screen.getByText("HSL inputs").dataset["format"]).toBe("hsla");
  });

  it("renders nothing while another format is in force", async () => {
    await drawn(
      <Root defaultValue="#2563EB" format="rgba">
        <View format="hsla">HSL inputs</View>
      </Root>,
    );

    expect(screen.queryByText("HSL inputs")).toBeNull();
  });
});
