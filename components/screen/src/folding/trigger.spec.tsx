import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Menu } from "@stealthscale/component-disclosure";
import { drawn } from "@stealthscale/testing-react";
import { variantClass } from "@stealthscale/testing-theme";

import { Trigger, type TriggerProps } from "#folding/trigger.tsx";

/**
 * Renders the trigger inside a menu with the given props.
 */
function triggered(props: Omit<TriggerProps, "label" | "size" | "variant"> = {}): ReactElement {
  return (
    <Menu.Root>
      <Trigger label="More actions" size="sm" variant="outline" {...props} />
    </Menu.Root>
  );
}

describe("Trigger", () => {
  it("renders the words as the trigger's name without a mark", async () => {
    await drawn(triggered());

    expect(screen.getByRole("button").textContent).toBe("More actions");
  });

  it("names a mark with the words", async () => {
    await drawn(triggered({ icon: <svg aria-hidden="true" /> }));

    expect(screen.getByRole("button", { name: "More actions" }).getAttribute("aria-label")).toBe(
      "More actions",
    );
  });

  it("renders a square button with a mark", async () => {
    await drawn(triggered({ icon: <svg aria-hidden="true" /> }));

    expect(screen.getByRole("button").classList).toContain(
      variantClass("button", "shape", "square"),
    );
  });

  it("renders the button at the size passed as size", async () => {
    await drawn(triggered());

    expect(screen.getByRole("button").classList).toContain(variantClass("button", "size", "sm"));
  });

  it("renders the look passed as variant", async () => {
    await drawn(triggered());

    expect(screen.getByRole("button").classList).toContain(
      variantClass("button", "variant", "outline"),
    );
  });

  it("opens the menu around it", async () => {
    await drawn(triggered());

    expect(screen.getByRole("button").getAttribute("aria-haspopup")).toBe("menu");
  });
});
