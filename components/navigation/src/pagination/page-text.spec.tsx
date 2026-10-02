import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { PageText } from "#pagination/page-text.tsx";
import { composed } from "#pagination/pagination.fixtures.tsx";
import { Root } from "#pagination/root.tsx";

describe("PageText", () => {
  it("renders an output", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "pagination", "pageText").tagName).toBe("OUTPUT");
  });

  it("words the current page compact by default", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "pagination", "pageText").textContent).toBe("Page 12 of 24");
  });

  it("words the current page in the format given", async () => {
    const { container } = await drawn(
      <Root count={235} defaultPage={12}>
        <PageText format="long" />
      </Root>,
    );

    expect(slotElement(container, "pagination", "pageText").textContent).toBe("111–120 of 235");
  });

  it("words the new page after a press", async () => {
    const { container } = await drawn(composed());

    await pressed(screen.getByRole("button", { name: "Next page" }));

    expect(slotElement(container, "pagination", "pageText").textContent).toBe("Page 13 of 24");
  });
});
