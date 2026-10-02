import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { CheckoutForm } from "#checkout-form.tsx";

const done = vi.fn<(value: unknown) => void>();

describe("CheckoutForm", () => {
  it("renders no VAT number for an individual", async () => {
    await drawn(<CheckoutForm onDone={done} />);

    expect(screen.queryByLabelText(/^Vat/u)).toBeNull();
  });

  it("renders an empty VAT number for a business", async () => {
    await drawn(<CheckoutForm onDone={done} />);
    fireEvent.click(screen.getByRole("radio", { name: "business" }));
    await settled();

    expect(screen.getByLabelText<HTMLInputElement>(/^Vat/u).value).toBe("");
  });

  it("refuses an order missing what the schema requires", async () => {
    await drawn(<CheckoutForm onDone={done} />);
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await settled();

    await waitFor(() => {
      expect(
        screen.getAllByRole("alert").filter((alert) => alert.textContent !== "").length,
      ).toBeGreaterThan(3);
    });
    expect(done).not.toHaveBeenCalled();
  });
});
