import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { App } from "#app.tsx";

/**
 * Returns the box a label names, with or without the required mark after the label's words.
 */
function box(label: string): HTMLInputElement {
  return screen.getByLabelText<HTMLInputElement>(new RegExp(`^${label}\\*?$`, "u"));
}

/**
 * Types a value into the box a label names.
 */
function typed(label: string, value: string): void {
  fireEvent.change(box(label), { target: { value } });
}

/**
 * Types an amount into the line's number input, as a person does once it has focus.
 */
async function amounted(value: string): Promise<void> {
  const amount = screen.getByRole("spinbutton", { name: /^Amount/u });

  act(() => {
    amount.focus();
  });
  await settled();
  fireEvent.input(amount, { target: { value } });
  await settled();
}

/**
 * Fills every field the schema requires of an individual.
 */
async function filled(): Promise<void> {
  typed("Full name", "Roy");
  typed("Email", "roy@example.com");
  fireEvent.click(screen.getByRole("radio", { name: "An individual" }));
  typed("Address", "Main street 1");
  typed("Postcode", "2611");
  typed("City", "Delft");
  fireEvent.click(screen.getByRole("radio", { name: "Netherlands" }));
  typed("Description", "Design");
  await settled();
  await amounted("120");
}

/**
 * Submits the order.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Place order" }));
  await settled();
}

describe("App", () => {
  it("renders the fieldsets in the order the schema states with their legends", async () => {
    await drawn(<App />);

    expect(
      screen
        .getAllByRole("group")
        .map((group) => group.querySelector(":scope > legend")?.textContent)
        .filter((legend) => legend !== undefined),
    ).toStrictEqual(["Who is ordering", "Billing address", "Lines"]);
  });

  it("renders an email box for a string of the email format", async () => {
    await drawn(<App />);

    expect(box("Email").type).toBe("email");
  });

  it("renders a radio group for a choice of two", async () => {
    await drawn(<App />);

    expect(screen.getByRole("radiogroup", { name: "Country" })).toBeDefined();
  });

  it("renders the page's own textarea for the notes", async () => {
    await drawn(<App />);

    expect(box("Notes").tagName).toBe("TEXTAREA");
  });

  it("renders the page's amount in the currency the options name", async () => {
    await drawn(<App />);

    expect(screen.getByRole<HTMLInputElement>("spinbutton", { name: /^Amount/u }).value).toContain(
      "€",
    );
  });

  it("spans the city over two columns", async () => {
    await drawn(<App />);

    expect(
      box("City").closest<HTMLElement>(".form__cell")?.style.getPropertyValue("--form-span"),
    ).toBe("2");
  });

  it("renders no VAT number for an individual", async () => {
    await drawn(<App />);

    expect(screen.queryByLabelText(/^VAT number/u)).toBeNull();
  });

  it("renders the VAT number for a business", async () => {
    await drawn(<App />);
    fireEvent.click(screen.getByRole("radio", { name: "A business" }));
    await settled();

    expect(box("VAT number").name).toBe("vat");
  });

  it("adds a line", async () => {
    await drawn(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    await settled();

    expect(screen.getAllByLabelText(/^Description/u)).toHaveLength(2);
  });

  it("removes a line", async () => {
    await drawn(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    await settled();
    fireEvent.click(screen.getByRole("button", { name: "Remove item 2" }));
    await settled();

    expect(screen.getAllByLabelText(/^Description/u)).toHaveLength(1);
  });

  it("lists the field nobody placed", async () => {
    await drawn(<App />);

    expect(screen.getByRole("listitem").textContent).toBe("reference");
  });

  it("lists every message the form reads", async () => {
    await drawn(<App />);

    expect([
      screen.getByText("checkout.fields.billing.city.label").tagName,
      screen.getByText("checkout.groups.who.legend").tagName,
    ]).toStrictEqual(["TD", "TD"]);
  });

  it("shows a refusal in a line under the shared words", async () => {
    await drawn(<App />);
    await filled();
    await amounted("0");
    await submitted();

    await waitFor(() => {
      expect(screen.getAllByRole("alert").map((alert) => alert.textContent)).toContain(
        "At least one",
      );
    });
  });

  it("submits the values once the schema accepts them", async () => {
    await drawn(<App />);
    await filled();
    await submitted();

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toContain('"amount": 120');
    });
  });
});
