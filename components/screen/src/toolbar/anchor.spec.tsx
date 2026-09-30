import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { variantClass } from "@stealthscale/testing-theme";

import { Anchor } from "#toolbar/anchor.tsx";

describe("Anchor", () => {
  it("renders an a", () => {
    render(<Anchor {...{ href: "#drafts" }}>Drafts</Anchor>);

    expect(screen.getByRole("link", { name: "Drafts" }).tagName).toBe("A");
  });

  it("applies the button's classes", () => {
    render(<Anchor {...{ href: "#drafts" }}>Drafts</Anchor>);

    expect(screen.getByRole("link").classList).toContain(variantClass("button", "size", "md"));
  });

  it("sets no type attribute", () => {
    render(<Anchor {...{ href: "#drafts" }}>Drafts</Anchor>);

    expect(screen.getByRole("link").hasAttribute("type")).toBe(false);
  });
});
