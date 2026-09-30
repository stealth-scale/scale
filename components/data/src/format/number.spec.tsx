import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { scoped } from "#format/format.fixtures.tsx";
import { Number as FormatNumber } from "#format/index.ts";

/**
 * Options of a price in euros.
 */
const EUROS: Intl.NumberFormatOptions = { currency: "EUR", style: "currency" };

describe("Number", () => {
  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(() => <FormatNumber locale="en-US" value={1234.5} />),
    ).resolves.toStrictEqual([]);
  });

  it("renders a data element whose value is the number", () => {
    render(<FormatNumber locale="en-US" value={1234.5} />);

    expect(screen.getByText("1,234.5").getAttribute("value")).toBe("1234.5");
  });

  it("writes the figure by the options of Intl.NumberFormat", () => {
    render(<FormatNumber locale="de-DE" options={EUROS} value={1234.5} />);

    expect(screen.getByText("1.234,50 €").tagName).toBe("DATA");
  });

  it("writes the figure in the locale in scope", () => {
    render(scoped("de-DE", <FormatNumber value={1234.5} />));

    expect(screen.getByText("1.234,5")).toBeDefined();
  });

  it("passes the element's props to the element", () => {
    render(<FormatNumber className="total" locale="en-US" value={2} />);

    expect(screen.getByText("2").classList.contains("total")).toBe(true);
  });
});
