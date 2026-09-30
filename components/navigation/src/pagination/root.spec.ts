import { act, screen } from "@testing-library/react";
import { type PageChangeDetails } from "@zag-js/pagination";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { address, composed, observer } from "#pagination/pagination.fixtures.tsx";
import { recipe } from "#pagination/recipe.ts";
import { type RootProps } from "#pagination/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation with links", async () => {
    await expect(
      accessibilityViolations(() => composed({ getPageUrl: address, type: "link" })),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a navigation landmark named Pagination", async () => {
    await drawn(composed());

    expect(screen.getByRole("navigation", { name: "Pagination" }).tagName).toBe("NAV");
  });

  it("takes the name aria-label gives", async () => {
    await drawn(composed({ "aria-label": "Results" }));

    expect(screen.getByRole("navigation", { name: "Results" })).toBeTruthy();
  });

  it("passes size to every button", async () => {
    await drawn(composed({ size: "sm" }));

    expect(screen.getByRole("button", { name: "Page 12" }).classList).toContain(
      variantClass("button", "size", "sm"),
    );
  });

  it("passes the ghost look to every button by default", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Next page" }).classList).toContain(
      variantClass("button", "variant", "ghost"),
    );
  });

  it("passes variant to every button", async () => {
    await drawn(composed({ variant: "outline" }));

    expect(screen.getByRole("button", { name: "Page 11" }).classList).toContain(
      variantClass("button", "variant", "outline"),
    );
  });

  it("passes palette to every button", async () => {
    await drawn(composed({ palette: "accent" }));

    expect(screen.getByRole("button", { name: "Page 13" }).classList).toContain(
      variantClass("button", "palette", "accent"),
    );
  });

  it("starts on the page defaultPage names", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Page 12" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("calls onPageChange with the new page", async () => {
    const told = vi.fn<(details: PageChangeDetails) => void>();

    await drawn(composed({ onPageChange: told }));
    await pressed(screen.getByRole("button", { name: "Page 13" }));

    expect(told).toHaveBeenLastCalledWith({ page: 13, pageSize: 10 });
  });

  it("keeps a controlled page on a press", async () => {
    await drawn(composed({ page: 4 }));
    await pressed(screen.getByRole("button", { name: "Page 5" }));

    expect(screen.getByRole("button", { name: "Page 4" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("sets data-crowded once a resize finds the pages too wide", async () => {
    const resize = observer();
    const { container } = await drawn(composed());

    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(460);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(354);
    act(() => {
      resize();
    });

    expect(slotElement(container, "pagination", "root").dataset["crowded"]).toBe("");
  });

  it("leaves data-crowded out while the pages fit", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "pagination", "root").dataset["crowded"]).toBeUndefined();
  });
});
