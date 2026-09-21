import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Import } from "#catalogue/page-import.tsx";

/**
 * The statement a page of the actions package declares.
 */
const STATEMENT = 'import { Button, IconButton } from "@stealthscale/component-actions";';

describe("Import", () => {
  it("writes the statement the page declares", async () => {
    const { container } = await drawn(
      <Import imports={STATEMENT} package="@stealthscale/component-actions" />,
    );

    expect(slotElement(container, "code-block", "code").textContent).toBe(STATEMENT);
  });

  it("heads the block with the package's name", async () => {
    const { container } = await drawn(
      <Import imports={STATEMENT} package="@stealthscale/component-actions" />,
    );

    expect(slotElement(container, "code-block", "title").textContent).toBe(
      "@stealthscale/component-actions",
    );
  });

  it("draws nothing where the index knows no package", async () => {
    const { container } = await drawn(<Import imports={STATEMENT} package="" />);

    expect(container.textContent).toBe("");
  });

  it("draws nothing where the page declares no statement", async () => {
    const { container } = await drawn(<Import package="@stealthscale/component-actions" />);

    expect(container.textContent).toBe("");
  });

  it("draws nothing for a page whose statement is empty", async () => {
    const { container } = await drawn(
      <Import imports="" package="@stealthscale/component-actions" />,
    );

    expect(container.textContent).toBe("");
  });
});
