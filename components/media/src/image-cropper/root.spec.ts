import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { cropped, loaded } from "#image-cropper/image-cropper.fixtures.tsx";
import { recipe } from "#image-cropper/recipe.ts";
import { type DescriptionDetails, type RootProps } from "#image-cropper/root.tsx";

describe("Root", () => {
  it("renders a group named Image cropper by default", async () => {
    await drawn(cropped());

    expect(screen.getByRole("group", { name: "Image cropper" })).toBeDefined();
  });

  it("takes the caller's aria-label", async () => {
    await drawn(cropped({ root: { "aria-label": "Crop your profile picture" } }));

    expect(screen.getByRole("group", { name: "Crop your profile picture" })).toBeDefined();
  });

  it("renders a div", async () => {
    const { container } = await drawn(cropped());

    expect(slotElement(container, "image-cropper", "root").tagName).toBe("DIV");
  });

  it("applies the class of every variant value", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: Omit<RootProps, "cropper">) =>
          (await drawn(cropped({ root: props }))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("marks the root busy while the picture loads", async () => {
    await drawn(cropped());

    expect(screen.getByRole("group").getAttribute("aria-busy")).toBe("true");
  });

  it("describes the loading picture with loadingDescription", async () => {
    await drawn(cropped({ root: { loadingDescription: "Loading the photo" } }));

    expect(screen.getByRole("group").getAttribute("aria-description")).toBe("Loading the photo");
  });

  it("describes the loaded picture with description", async () => {
    const description = vi.fn<(details: DescriptionDetails) => string>(() => "Cropped photo");
    const { container } = await drawn(cropped({ root: { description } }));

    await loaded(container);

    expect(screen.getByRole("group").getAttribute("aria-description")).toBe("Cropped photo");
  });

  it("passes details with the rounded crop to description", async () => {
    const description = vi.fn<(details: DescriptionDetails) => string>(() => "Cropped photo");
    const { container } = await drawn(
      cropped({
        options: { initialCrop: { height: 255.6, width: 383.4, x: 47.6, y: 32.4 } },
        root: { description },
      }),
    );

    await loaded(container);

    expect(description).toHaveBeenLastCalledWith({
      crop: { height: 256, width: 383, x: 48, y: 32 },
      rotation: 0,
      zoom: 1,
    });
  });

  it("keeps the machine's English description without description", async () => {
    const { container } = await drawn(cropped());

    await loaded(container);

    expect(screen.getByRole("group").getAttribute("aria-description")).toContain("1.00x zoom");
  });

  it("returns no accessibility violation while the picture loads", async () => {
    await expect(accessibilityViolations(() => cropped())).resolves.toStrictEqual([]);
  });
});
