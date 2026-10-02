import { type ReactElement } from "react";

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FormProvider, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { ContactForm } from "#contact-form.tsx";
import { type Contact } from "#schema.ts";
import { catalogues } from "#words.ts";

const sent = vi.fn<(value: Contact) => void>();

/**
 * Renders the form under the English catalogue.
 */
function Page(): ReactElement {
  return (
    <FormProvider translate={translateFrom(catalogues.en)}>
      <ContactForm onSent={sent} />
    </FormProvider>
  );
}

/**
 * Fills every field of the form with a value the schema accepts.
 */
async function filled(): Promise<void> {
  fireEvent.change(screen.getByRole("textbox", { name: "Your name" }), {
    target: { value: "Roy" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
    target: { value: "roy@example.com" },
  });
  fireEvent.click(screen.getByRole("radio", { name: "Sales" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "I agree to be contacted" }));
  await settled();
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Send" }));
  await settled();
}

/**
 * Returns the words of every refusal on the page.
 */
function refusals(): ReadonlyArray<null | string> {
  return screen
    .getAllByRole("alert")
    .map((alert) => alert.textContent)
    .filter((words) => words !== "");
}

describe("ContactForm", () => {
  it("renders the two fieldsets the schema states", async () => {
    await drawn(<Page />);

    expect(
      screen.getAllByRole("group").map((group) => group.querySelector("legend")?.textContent),
    ).toStrictEqual(["Who you are", "What you need"]);
  });

  it("renders the topic with no choice made", async () => {
    await drawn(<Page />);

    expect(
      screen.getAllByRole<HTMLInputElement>("radio").map((radio) => radio.checked),
    ).toStrictEqual([false, false]);
  });

  it("renders the consent unticked", async () => {
    await drawn(<Page />);

    expect(
      screen.getByRole<HTMLInputElement>("checkbox", { name: "I agree to be contacted" }).checked,
    ).toBe(false);
  });

  it("shows the schema's refusals in the catalogue's words after a submit", async () => {
    await drawn(<Page />);
    await submitted();

    await waitFor(() => {
      expect(refusals()).toStrictEqual([
        "Enter at least 2 characters",
        "Enter your email address",
        "Pick a topic",
        "Tick the box to continue",
      ]);
    });
  });

  it("moves focus to the first refused field after a submit", async () => {
    await drawn(<Page />);
    await submitted();

    await waitFor(() => {
      expect(document.activeElement).toHaveProperty("name", "name");
    });
  });

  it("reads a refusal the whole product shares where the form has no words of its own", async () => {
    await drawn(<Page />);
    await filled();
    fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
      target: { value: "nobody" },
    });
    await submitted();

    await waitFor(() => {
      expect(refusals()).toContain("Enter an address like name@example.com");
    });
  });

  it("hands the values over once they pass", async () => {
    await drawn(<Page />);
    await filled();
    await submitted();

    await waitFor(() => {
      expect(sent).toHaveBeenCalledWith({
        consent: true,
        email: "roy@example.com",
        message: "",
        name: "Roy",
        topic: "sales",
      });
    });
  });
});
