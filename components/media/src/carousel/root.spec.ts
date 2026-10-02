import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn, pressed, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, laidOut } from "#carousel/carousel.fixtures.tsx";
import { recipe } from "#carousel/recipe.ts";
import { type RootProps } from "#carousel/root.tsx";
import { reducedMotion } from "#reduced-motion.fixtures.ts";

function live(container: HTMLElement): null | string {
  return slotElement(container, "carousel", "itemGroup").getAttribute("aria-live");
}

describe("Root", () => {
  it("renders a region with the role description carousel", async () => {
    await drawn(composed());

    expect(
      screen.getByRole("region", { name: "Pictures" }).getAttribute("aria-roledescription"),
    ).toBe("carousel");
  });

  it("rotates while the root asks for autoplay", async () => {
    const { container } = await drawn(composed({ autoplay: true }));

    expect(live(container)).toBe("off");
  });

  it("does not rotate without autoplay", async () => {
    const { container } = await drawn(composed());

    expect(live(container)).toBe("polite");
  });

  it("does not rotate under reduced motion", async () => {
    reducedMotion(true);
    const { container } = await drawn(composed({ autoplay: true }));

    expect(live(container)).toBe("polite");
  });

  it("pauses the rotation while the pointer is over the carousel", async () => {
    const { container } = await drawn(composed({ autoplay: true }));

    fireEvent.pointerEnter(screen.getByRole("region"));
    await settled();

    expect(live(container)).toBe("polite");
  });

  it("keeps the rotation control's name while the pointer pauses the rotation", async () => {
    await drawn(composed({ autoplay: true }));

    fireEvent.pointerEnter(screen.getByRole("region"));
    await settled();

    expect(screen.getByRole("button", { name: "Stop slide rotation" })).toBeDefined();
  });

  it("resumes the rotation once the pointer leaves", async () => {
    const { container } = await drawn(composed({ autoplay: true }));

    fireEvent.pointerEnter(screen.getByRole("region"));
    await settled();
    fireEvent.pointerLeave(screen.getByRole("region"));
    await settled();

    expect(live(container)).toBe("off");
  });

  it("stops the rotation when keyboard focus enters the carousel", async () => {
    const { container } = await drawn(composed({ autoplay: true }));

    act(() => {
      screen.getByRole("button", { name: "Next slide" }).focus();
    });
    await settled();

    expect(live(container)).toBe("polite");
  });

  it("keeps the rotation stopped after focus leaves the carousel", async () => {
    await drawn(composed({ autoplay: true }));

    act(() => {
      screen.getByRole("button", { name: "Next slide" }).focus();
    });
    act(() => {
      screen.getByRole("button", { name: "Next slide" }).blur();
    });
    await settled();

    expect(screen.getByRole("button", { name: "Start slide rotation" })).toBeDefined();
  });

  it("keeps rotating when a pointer press moves focus into the carousel", async () => {
    const { container } = await drawn(composed({ autoplay: true }));

    fireEvent.focus(screen.getByRole("button", { name: "Next slide" }));
    await settled();

    expect(live(container)).toBe("off");
  });

  it("keeps rotating while keyboard focus moves between its controls after a start", async () => {
    const { container } = await drawn(composed());
    const control = screen.getByRole("button", { name: "Start slide rotation" });

    act(() => {
      control.focus();
    });
    await pressed(control);
    act(() => {
      screen.getByRole("button", { name: "Next slide" }).focus();
    });
    await settled();

    expect(live(container)).toBe("off");
  });

  it("loops the triggers while the root asks for autoplay", async () => {
    laidOut();
    await drawn(composed({ autoplay: true }));

    expect(
      screen.getByRole("button", { name: "Previous slide" }).getAttribute("aria-disabled"),
    ).toBeNull();
  });

  it("stops the triggers at the ends without autoplay", async () => {
    laidOut();
    await drawn(composed());

    expect(
      screen.getByRole("button", { name: "Previous slide" }).getAttribute("aria-disabled"),
    ).toBe("true");
  });

  it("keeps the caller's loop", async () => {
    laidOut();
    await drawn(composed({ autoplay: true, loop: false }));

    expect(
      screen.getByRole("button", { name: "Previous slide" }).getAttribute("aria-disabled"),
    ).toBe("true");
  });

  it("applies the class of every variant value", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: Partial<RootProps>) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("passes the recipe's gap to the machine as the slide spacing", async () => {
    const { container } = await drawn(composed());

    expect(
      slotElement(container, "carousel", "root").style.getPropertyValue("--slide-spacing"),
    ).toBe("var(--carousel-gap)");
  });

  it("passes the caller's spacing to the machine", async () => {
    const { container } = await drawn(composed({ spacing: "12px" }));

    expect(
      slotElement(container, "carousel", "root").style.getPropertyValue("--slide-spacing"),
    ).toBe("12px");
  });

  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });
});
