import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#tabs/content.tsx";
import { composed, tabbed } from "#tabs/tabs.fixtures.tsx";

describe("Content", () => {
  it("renders a div", async () => {
    const { container } = await drawn(tabbed(<Content value="first">The panel</Content>));

    expect(slotElement(container, "tabs", "content").tagName).toBe("DIV");
  });

  it("shows the selected tab's panel", async () => {
    await drawn(composed());

    expect(screen.getByRole("tabpanel").textContent).toBe("The first panel");
  });

  it("hides every other panel", async () => {
    const { container } = await drawn(composed());
    const panels = [...container.querySelectorAll("[data-part=content]")];

    expect(panels.filter((panel) => panel.hasAttribute("hidden"))).toHaveLength(2);
  });

  it("shows another panel on a press of its tab", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByRole("tab", { name: "Second" }));
    await settled();

    expect(screen.getByRole("tabpanel").textContent).toBe("The second panel");
  });

  it("sets aria-labelledby to its tab's id", async () => {
    await drawn(composed());

    expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).toBe(
      screen.getByRole("tab", { name: "First" }).id,
    );
  });

  it("sets tabindex 0", async () => {
    await drawn(composed());

    expect(screen.getByRole("tabpanel").getAttribute("tabindex")).toBe("0");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      tabbed(
        <Content as="section" value="first">
          The panel
        </Content>,
      ),
    );

    expect(slotElement(container, "tabs", "content").tagName).toBe("SECTION");
  });
});
