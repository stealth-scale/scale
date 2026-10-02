import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { App } from "#app.tsx";

/**
 * Types a value into the box a label names, with or without the required mark after its words.
 */
function typed(label: string, value: string): void {
  fireEvent.change(screen.getByLabelText(new RegExp(`^${label}\\*?$`, "u")), {
    target: { value },
  });
}

describe("App", () => {
  it("renders the form with no account kind chosen", async () => {
    await drawn(<App />);

    expect(
      screen.getAllByRole<HTMLInputElement>("radio").map((radio) => radio.checked),
    ).toStrictEqual([false, false]);
  });

  it("welcomes the person once every rule passes", async () => {
    await drawn(<App />);
    fireEvent.click(screen.getByRole("radio", { name: "An individual" }));
    typed("Username", "ann");
    typed("Password", "hunter22hunter");
    typed("Password again", "hunter22hunter");
    await settled();
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
    await settled();

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toBe("Welcome, ann");
    });
  });
});
