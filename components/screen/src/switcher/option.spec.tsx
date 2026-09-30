import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Root } from "#switcher/root.tsx";

describe("Option", () => {
  it("renders the row of a choice with a page as a link", async () => {
    await drawn(
      <Root
        defaultOpen
        items={[{ href: "#acme", label: "Acme", value: "acme" }]}
        label="Workspace"
      />,
    );

    expect(screen.getByRole("menuitemradio").getAttribute("href")).toBe("#acme");
  });

  it("renders the row of a choice without a page as a div", async () => {
    await drawn(<Root defaultOpen items={[{ label: "Acme", value: "acme" }]} label="Workspace" />);

    expect(screen.getByRole("menuitemradio").tagName).toBe("DIV");
  });

  it("renders the initials as the mark without one", async () => {
    await drawn(
      <Root defaultOpen items={[{ label: "Acme Corp", value: "acme" }]} label="Workspace" />,
    );

    expect(screen.getByRole("menuitemradio").textContent).toBe("ACAcme Corp");
  });

  it("renders the choice's own mark", async () => {
    await drawn(
      <Root defaultOpen items={[{ label: "Acme", mark: "★", value: "acme" }]} label="Workspace" />,
    );

    expect(screen.getByRole("menuitemradio").textContent).toBe("★Acme");
  });

  it("renders the detail under the name", async () => {
    await drawn(
      <Root
        defaultOpen
        items={[{ detail: "Pro plan", label: "Acme", value: "acme" }]}
        label="Workspace"
      />,
    );

    expect(screen.getByRole("menuitemradio").textContent).toBe("AAcmePro plan");
  });
});
