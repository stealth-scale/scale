import { type ReactElement } from "react";

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FormProvider } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { engine } from "#engine.ts";
import { type Signup } from "#schema.ts";
import { SignupForm } from "#signup-form.tsx";
import { words } from "#words.ts";

const done = vi.fn<(value: Signup) => void>();

/**
 * Renders the form under the page's engine and its words.
 */
function Page(): ReactElement {
  return (
    <FormProvider engine={engine} translate={words}>
      <SignupForm onDone={done} />
    </FormProvider>
  );
}

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
 * Fills the form as an individual with values every rule accepts.
 */
async function filled(): Promise<void> {
  fireEvent.click(screen.getByRole("radio", { name: "An individual" }));
  typed("Username", "ann");
  typed("Password", "hunter22hunter");
  typed("Password again", "hunter22hunter");
  await settled();
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
  await settled();
}

/**
 * Returns the words of every refusal on the page.
 */
function refusals(): ReadonlyArray<null | string> {
  return screen.getAllByRole("alert").map((alert) => alert.textContent);
}

describe("SignupForm", () => {
  it("reads the account kinds from the schema's choices", async () => {
    await drawn(<Page />);

    expect(screen.getAllByRole("radio").map((radio) => radio.getAttribute("value"))).toStrictEqual([
      "business",
      "individual",
    ]);
  });

  it("renders both passwords in password boxes", async () => {
    await drawn(<Page />);

    expect([box("Password").type, box("Password again").type]).toStrictEqual([
      "password",
      "password",
    ]);
  });

  it("renders no VAT field before a business is chosen", async () => {
    await drawn(<Page />);

    expect(screen.queryByLabelText(/^VAT number/u)).toBeNull();
  });

  it("renders a required VAT field once the account is a business", async () => {
    await drawn(<Page />);
    fireEvent.click(screen.getByRole("radio", { name: "A business" }));
    await settled();

    expect([box("VAT number").name, box("VAT number").required]).toStrictEqual(["vat", true]);
  });

  it("refuses a VAT number the registered format does not accept", async () => {
    await drawn(<Page />);
    await filled();
    fireEvent.click(screen.getByRole("radio", { name: "A business" }));
    await settled();
    typed("VAT number", "nl");
    await submitted();

    await waitFor(() => {
      expect(refusals()).toContain("Enter a VAT number like NL123456789B01");
    });
  });

  it("refuses a confirmation that differs under the registered keyword", async () => {
    await drawn(<Page />);
    await filled();
    typed("Password again", "other");
    await submitted();

    await waitFor(() => {
      expect(refusals()).toContain("The passwords differ");
    });
  });

  it("refuses a taken name on blur", async () => {
    await drawn(<Page />);
    typed("Username", "roy");
    fireEvent.blur(box("Username"));
    await settled();

    await waitFor(() => {
      expect(refusals()).toContain("That name is taken");
    });
  });

  it("refuses a password containing the username through the form validator", async () => {
    await drawn(<Page />);
    await filled();
    typed("Password", "ann12345678");
    typed("Password again", "ann12345678");
    await submitted();

    await waitFor(() => {
      expect(refusals()).toContain("Do not put your name in your password");
    });
  });

  it("hands the values over once every rule passes", async () => {
    await drawn(<Page />);
    await filled();
    await submitted();

    await waitFor(() => {
      expect(done).toHaveBeenCalledWith({
        confirm: "hunter22hunter",
        kind: "individual",
        password: "hunter22hunter",
        username: "ann",
      });
    });
  });
});
