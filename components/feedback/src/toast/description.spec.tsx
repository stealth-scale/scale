import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Description, Region, Root } from "#toast/index.ts";
import { raised, regioned, toasterOf } from "#toast/toast.fixtures.tsx";

describe("Description", () => {
  it("renders a div", async () => {
    const toaster = toasterOf();
    const { container } = await drawn(regioned(toaster));

    await raised(toaster, { description: "Four hundred lines.", title: "Exported" });

    expect(slotElement(container, "toast", "description").tagName).toBe("DIV");
  });

  it("sets the id the root describes the toast by", async () => {
    const toaster = toasterOf();

    await drawn(regioned(toaster));
    await raised(toaster, { description: "Four hundred lines.", title: "Exported" });

    expect(screen.getByText("Four hundred lines.").id).toContain(":description");
  });

  it("renders the element as names", async () => {
    const toaster = toasterOf();
    const { container } = await drawn(
      <Region toaster={toaster}>
        {(toast) => (
          <Root>
            <Description as="p">{toast.description}</Description>
          </Root>
        )}
      </Region>,
    );

    await raised(toaster, { description: "Four hundred lines.", title: "Exported" });

    expect(slotElement(container, "toast", "description").tagName).toBe("P");
  });
});
