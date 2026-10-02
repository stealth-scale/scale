import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { memoryStore } from "@stealthscale/settings";
import { drawn, settled } from "@stealthscale/testing-react";

import { App } from "#app.tsx";
import { resetProfiles } from "#records.ts";

describe("App", () => {
  it("renders the form for the first profile", async () => {
    resetProfiles();
    await drawn(<App store={memoryStore()} />);

    expect(screen.getByLabelText<HTMLInputElement>(/^Name\*?$/u).value).toBe("Roy");
  });

  it("renders an alert when no profile has the identifier", async () => {
    await drawn(<App id="p-9" store={memoryStore()} />);

    expect(screen.getByRole("alert").textContent).toBe("There is no profile to edit");
  });

  it("reports the save", async () => {
    resetProfiles();
    await drawn(<App store={memoryStore()} />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    await settled();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Save" })).toBeDefined();
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await settled();

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toBe("Saved Roy");
    });
  });
});
