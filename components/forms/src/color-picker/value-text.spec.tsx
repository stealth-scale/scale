import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Root } from "#color-picker/root.tsx";
import { ValueText } from "#color-picker/value-text.tsx";

describe("ValueText", () => {
  it("renders the color in the format in force", async () => {
    await drawn(
      <Root defaultValue="#2563EB">
        <ValueText />
      </Root>,
    );

    expect(screen.getByText("rgba(37, 99, 235, 1)").tagName).toBe("SPAN");
  });

  it("renders the color in the format passed as format", async () => {
    await drawn(
      <Root defaultValue="#2563EB">
        <ValueText format="hex" />
      </Root>,
    );

    expect(screen.getByText("#2563EB")).toBeDefined();
  });

  it("renders its children in place of the color", async () => {
    await drawn(
      <Root defaultValue="#2563EB">
        <ValueText>Brand blue</ValueText>
      </Root>,
    );

    expect(screen.getByText("Brand blue")).toBeDefined();
  });
});
