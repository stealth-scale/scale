import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { tableOf } from "#data-table/data-table.fixtures.tsx";
import { HiddenText } from "#data-table/hidden-text.ts";
import { Root } from "#data-table/root.tsx";

describe("HiddenText", () => {
  it("renders a span with the recipe's visually hidden class", () => {
    render(
      <Root table={tableOf()}>
        <HiddenText>Details</HiddenText>
      </Root>,
    );

    expect(screen.getByText("Details").className).toContain("data-table__visually-hidden");
  });
});
