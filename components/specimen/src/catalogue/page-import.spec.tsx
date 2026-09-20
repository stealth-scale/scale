import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Import } from "#catalogue/page-import.tsx";

describe("Import", () => {
  it("writes the statement that imports the names from the package", async () => {
    const { container } = await drawn(
      <Import names={["Button", "IconButton"]} package="@stealthscale/component-actions" />,
    );

    expect(slotElement(container, "code-block", "code").textContent).toBe(
      'import { Button, IconButton } from "@stealthscale/component-actions";',
    );
  });

  it("heads the block with the package's name", async () => {
    const { container } = await drawn(
      <Import names={["Button"]} package="@stealthscale/component-actions" />,
    );

    expect(slotElement(container, "code-block", "title").textContent).toBe(
      "@stealthscale/component-actions",
    );
  });

  it("draws nothing where the index knows no package", async () => {
    const { container } = await drawn(<Import names={["Button"]} package="" />);

    expect(container.textContent).toBe("");
  });

  it("draws nothing where the page imports no component", async () => {
    const { container } = await drawn(
      <Import names={[]} package="@stealthscale/component-actions" />,
    );

    expect(container.textContent).toBe("");
  });
});
