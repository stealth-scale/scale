import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Region, Root } from "#toast/index.ts";
import { framed, raised, regioned, toasterOf } from "#toast/toast.fixtures.tsx";

describe("Root", () => {
  it("renders a div with role status", async () => {
    const toaster = toasterOf();

    await drawn(regioned(toaster));
    await raised(toaster, { title: "Exported" });

    expect(screen.getByRole("status").tagName).toBe("DIV");
  });

  it("sets aria-labelledby to the title's id", async () => {
    const toaster = toasterOf();

    await drawn(regioned(toaster));
    await raised(toaster, { title: "Exported" });

    expect(screen.getByRole("status").getAttribute("aria-labelledby")).toBe(
      screen.getByText("Exported").id,
    );
  });

  it("sets aria-describedby to the description's id", async () => {
    const toaster = toasterOf();

    await drawn(regioned(toaster));
    await raised(toaster, { description: "Four hundred lines.", title: "Exported" });

    expect(screen.getByRole("status").getAttribute("aria-describedby")).toBe(
      screen.getByText("Four hundred lines.").id,
    );
  });

  it("sets data-type to the toast's type", async () => {
    const toaster = toasterOf();

    await drawn(regioned(toaster));
    await raised(toaster, { title: "Payout held", type: "error" });

    expect(screen.getByRole("status").dataset["type"]).toBe("error");
  });

  it("takes a place in the tab order", async () => {
    const toaster = toasterOf();

    await drawn(regioned(toaster));
    await raised(toaster, { title: "Exported" });

    expect(screen.getByRole("status").tabIndex).toBe(0);
  });

  it("dismisses the toast on Escape", async () => {
    const toaster = toasterOf();

    await drawn(regioned(toaster));
    await raised(toaster, { duration: Number.POSITIVE_INFINITY, title: "Exported" });
    fireEvent.keyDown(screen.getByRole("status"), { key: "Escape" });
    await settled();
    await framed();

    expect(screen.getByRole("status").dataset["state"]).toBe("closed");
  });

  it("renders the machine's two empty elements", async () => {
    const toaster = toasterOf();
    const { container } = await drawn(regioned(toaster));

    await raised(toaster, { title: "Exported" });

    expect(container.querySelectorAll("[data-ghost]")).toHaveLength(2);
  });

  it("renders the element as names", async () => {
    const toaster = toasterOf();
    const { container } = await drawn(
      <Region toaster={toaster}>{() => <Root as="section">Exported</Root>}</Region>,
    );

    await raised(toaster, { title: "Exported" });

    expect(slotElement(container, "toast", "root").tagName).toBe("SECTION");
  });
});
