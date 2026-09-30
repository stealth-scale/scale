import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Checkbox } from "@stealthscale/component-forms";

import { tableOf } from "#data-table/data-table.fixtures.tsx";
import { Root } from "#data-table/root.tsx";
import { SelectLabel } from "#data-table/select-label.ts";

describe("SelectLabel", () => {
  it("renders the checkbox's label with the recipe's visually hidden class", () => {
    const { getByText } = render(
      <Root table={tableOf()}>
        <Checkbox.Root>
          <Checkbox.Control />
          <SelectLabel>Select Account 01</SelectLabel>
        </Checkbox.Root>
      </Root>,
    );

    expect(getByText("Select Account 01").classList.contains("data-table__visually-hidden")).toBe(
      true,
    );
  });

  it("names the checkbox by its text", () => {
    const { getByRole } = render(
      <Root table={tableOf()}>
        <Checkbox.Root>
          <Checkbox.Control />
          <SelectLabel>Select Account 01</SelectLabel>
        </Checkbox.Root>
      </Root>,
    );

    expect(getByRole("checkbox", { name: "Select Account 01" })).toBeDefined();
  });
});
