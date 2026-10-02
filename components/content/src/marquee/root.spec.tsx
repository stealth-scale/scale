import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { Root } from "#marquee/index.ts";
import { composed, region, type Staged } from "#marquee/marquee.fixtures.tsx";
import { recipe } from "#marquee/recipe.ts";

describe("Root", () => {
  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: Staged) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("takes its name from aria-label over the machine's name", async () => {
    await drawn(composed());

    expect(region().getAttribute("aria-label")).toBe("Customers");
  });

  it("takes its name from aria-labelledby", async () => {
    await drawn(
      <>
        <h2 id="partners">Partners</h2>
        <Root aria-labelledby="partners">x</Root>
      </>,
    );

    expect(screen.getByRole("region", { name: "Partners" }).hasAttribute("aria-label")).toBe(false);
  });

  it("drops the machine's role description", async () => {
    await drawn(composed());

    expect(region().getAttribute("aria-roledescription")).toBeNull();
  });

  it("turns the live region off", async () => {
    await drawn(composed());

    expect(region().getAttribute("aria-live")).toBe("off");
  });

  it("keeps the machine's timing and direction variables inline", async () => {
    await drawn(composed({ delay: 2, loopCount: 3 }));
    const { style } = region();

    expect(
      ["--marquee-delay", "--marquee-loop-count", "--marquee-translate"].map((name) =>
        style.getPropertyValue(name),
      ),
    ).toStrictEqual(["2s", "3", "-100%"]);
  });

  it("drops the machine's inline layout and spacing", async () => {
    await drawn(composed());
    const { style } = region();

    expect([
      style.display,
      style.overflow,
      style.getPropertyValue("--marquee-spacing"),
    ]).toStrictEqual(["", "", ""]);
  });

  it("renders a div with the root class", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "marquee", "root")).toBe(region());
  });
});
