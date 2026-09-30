import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { variantClass } from "@stealthscale/testing-theme";

import { Opener } from "#sidebar/opener.tsx";

describe("Opener", () => {
  it("renders a button named by the label", async () => {
    await drawn(
      <Opener
        icon={<svg aria-hidden="true" />}
        label="Search pages"
        onOpen={vi.fn<() => void>()}
        size="sm"
      />,
    );

    expect(screen.getByRole("button", { name: "Search pages" })).toBeTruthy();
  });

  it("renders a square ghost button", async () => {
    await drawn(
      <Opener
        icon={<svg aria-hidden="true" />}
        label="Search pages"
        onOpen={vi.fn<() => void>()}
        size="sm"
      />,
    );

    expect(screen.getByRole("button").classList).toContain(
      variantClass("button", "shape", "square"),
    );
  });

  it("calls onOpen when pressed", async () => {
    const onOpen = vi.fn<() => void>();

    await drawn(
      <Opener icon={<svg aria-hidden="true" />} label="Search pages" onOpen={onOpen} size="sm" />,
    );
    fireEvent.click(screen.getByRole("button"));

    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("shows the label in a tooltip on focus", async () => {
    await drawn(
      <Opener
        icon={<svg aria-hidden="true" />}
        label="Search pages"
        onOpen={vi.fn<() => void>()}
        size="sm"
      />,
    );

    fireEvent.keyDown(document, { key: "Tab" });
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(screen.getByRole("tooltip").textContent).toBe("Search pages");
  });
});
