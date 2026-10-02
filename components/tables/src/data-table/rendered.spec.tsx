import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Rendered } from "#data-table/rendered.ts";

describe("Rendered", () => {
  it("renders what the template returns for its context", () => {
    render(
      <Rendered context={{ amount: 40 }} render={(context) => `€${String(context.amount)}`} />,
    );

    expect(screen.getByText("€40")).toBeDefined();
  });
});
