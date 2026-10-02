import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Region, Root, Title } from "#toast/index.ts";
import { raised, regioned, toasterOf } from "#toast/toast.fixtures.tsx";

describe("Title", () => {
  it("renders a div", async () => {
    const toaster = toasterOf();
    const { container } = await drawn(regioned(toaster));

    await raised(toaster, { title: "Exported" });

    expect(slotElement(container, "toast", "title").tagName).toBe("DIV");
  });

  it("sets the id the root names the toast by", async () => {
    const toaster = toasterOf();

    await drawn(regioned(toaster));
    await raised(toaster, { title: "Exported" });

    expect(screen.getByText("Exported").id).toContain(":title");
  });

  it("renders the element as names", async () => {
    const toaster = toasterOf();
    const { container } = await drawn(
      <Region toaster={toaster}>
        {(toast) => (
          <Root>
            <Title as="p">{toast.title}</Title>
          </Root>
        )}
      </Region>,
    );

    await raised(toaster, { title: "Exported" });

    expect(slotElement(container, "toast", "title").tagName).toBe("P");
  });
});
