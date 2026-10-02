import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { App } from "#app.tsx";

describe("App", () => {
  it("reads every legend from the English catalogue", async () => {
    await drawn(<App />);

    expect(screen.getByText("Who you are").tagName).toBe("LEGEND");
  });

  it("names each field from the English catalogue", async () => {
    await drawn(<App />);

    expect(screen.getByRole("textbox", { name: "Your name" }).getAttribute("name")).toBe("name");
  });

  it("reads a field's help text from the English catalogue", async () => {
    await drawn(<App />);

    expect(screen.getByText("We reply within a day").tagName).toBe("P");
  });

  it("switches every word to Dutch", async () => {
    await drawn(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Nederlands" }));
    await settled();

    expect([
      screen.getByText("Wie u bent").tagName,
      screen.getByRole("textbox", { name: "Uw naam" }).getAttribute("name"),
      screen.getByRole("button", { name: "Versturen" }).tagName,
    ]).toStrictEqual(["LEGEND", "name", "BUTTON"]);
  });

  it("switches every word back to English", async () => {
    await drawn(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Nederlands" }));
    await settled();
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    await settled();

    expect(screen.getByText("Who you are").tagName).toBe("LEGEND");
  });

  it("thanks the person by name once the form is sent", async () => {
    await drawn(<App />);
    fireEvent.change(screen.getByRole("textbox", { name: "Your name" }), {
      target: { value: "Roy" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
      target: { value: "roy@example.com" },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Sales" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "I agree to be contacted" }));
    await settled();
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await settled();

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toBe("Thanks Roy, we have your message");
    });
  });
});
