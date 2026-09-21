import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  createAppRootRoute,
  createMemoryHistory,
  createRouter,
  routeMap,
  routerOptions,
  RouterProvider,
} from "@stealthscale/provider-router";
import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Device } from "#device/device.tsx";
import { HEIGHT, WIDTH } from "#device/recipe.ts";
import { type Framable } from "#device/scene.ts";
import { type Report, REPORTED } from "#framed/report.ts";

const SCENE: Framable = { page: "actions/button", path: "framed", scene: 2, title: "Sizes" };

const PHONE = { height: 568, name: "phone", width: 320 };

const CHOICES: Report["choices"] = [
  { knob: "size", names: ["sm", "md", "lg"], part: "value" },
  { names: ["outline", "solid"], part: "across" },
];

/**
 * Reads the iframe out of a rendered device, throwing where the frame slot holds anything else.
 */
function framed(container: HTMLElement): HTMLIFrameElement {
  const frame = slotElement(container, "device", "frame");

  if (!(frame instanceof HTMLIFrameElement)) throw new TypeError("no frame");

  return frame;
}

/**
 * Reads the width and height the root wrote as custom properties.
 */
function sized(container: HTMLElement): readonly [width: string, height: string] {
  const { style } = slotElement(container, "device", "root");

  return [style.getPropertyValue(WIDTH), style.getPropertyValue(HEIGHT)];
}

/**
 * Dispatches the report message the framed document at an address would send, from the device's
 * iframe and at the page's origin.
 */
function reported(address: string, choices: Report["choices"]): void {
  act(() => {
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { address, choices, type: REPORTED },
        origin: window.location.origin,
        source: document.querySelector("iframe")?.contentWindow ?? null,
      }),
    );
  });
}

describe("Device", () => {
  it("loads the application's framed page at the scene's address", () => {
    const { container } = render(<Device device={PHONE} scene={SCENE} />);

    expect(framed(container).getAttribute("src")).toBe("/framed#actions/button/2");
  });

  it("titles the frame with the scene title", () => {
    const { container } = render(<Device device={PHONE} scene={SCENE} />);

    expect(framed(container).title).toBe("Sizes");
  });

  it("sets the root width and height to the device size", () => {
    const { container } = render(<Device device={PHONE} scene={SCENE} />);

    expect(sized(container)).toStrictEqual(["320px", "568px"]);
  });

  it("renders the device size as a caption", () => {
    const { container } = render(<Device device={PHONE} scene={SCENE} />);

    expect(container.textContent).toContain("320 × 568");
  });

  it("sets no loading attribute on the frame", () => {
    const { container } = render(<Device device={PHONE} scene={SCENE} />);

    expect(framed(container).hasAttribute("loading")).toBe(false);
  });

  it("sets no sandbox attribute on the frame", () => {
    const { container } = render(<Device device={PHONE} scene={SCENE} />);

    expect(framed(container).hasAttribute("sandbox")).toBe(false);
  });

  it("renders no picker before a document reports its choices", async () => {
    const { queryAllByRole } = await drawn(<Device device={PHONE} scene={SCENE} />);

    expect(queryAllByRole("button")).toHaveLength(0);
  });

  it("renders a picker per choice the document reports", async () => {
    const { queryAllByRole } = await drawn(<Device device={PHONE} scene={SCENE} />);

    reported("#actions/button/2", CHOICES);

    expect(queryAllByRole("button").map((control) => control.textContent)).toStrictEqual([
      "sizesm",
      "sampleoutline",
    ]);
  });

  it("renders the pickers into the device's bar", async () => {
    const { container } = await drawn(<Device device={PHONE} scene={SCENE} />);

    reported("#actions/button/2", CHOICES);

    expect(slotElement(container, "device", "bar").querySelectorAll("button")).toHaveLength(2);
  });

  it("ignores a report from a document at another address", async () => {
    const { queryAllByRole } = await drawn(<Device device={PHONE} scene={SCENE} />);

    reported("#actions/button/3", CHOICES);

    expect(queryAllByRole("button")).toHaveLength(0);
  });

  it("sets the frame source to the sample the pickers name", async () => {
    const { container, getByRole } = await drawn(<Device device={PHONE} scene={SCENE} />);

    reported("#actions/button/2", CHOICES);

    await pressed(getByRole("button", { name: "size sm" }));
    await pressed(getByRole("menuitemradio", { name: "lg" }));

    expect(framed(container).getAttribute("src")).toBe("/framed#actions/button/2?v=2");

    await pressed(getByRole("button", { name: "sample outline" }));
    await pressed(getByRole("menuitemradio", { name: "solid" }));

    expect(framed(container).getAttribute("src")).toBe("/framed#actions/button/2?v=2&x=1");
  });

  it("prefixes the frame source with the router basepath", async () => {
    const root = createAppRootRoute()({
      component: () => <Device device={PHONE} scene={SCENE} />,
    });
    const router = createRouter({
      ...routerOptions({ routes: routeMap(root) }),
      basepath: "/docs",
      history: createMemoryHistory({ initialEntries: ["/docs/"] }),
      routeTree: root,
    });

    await router.load();

    const { container } = await drawn(<RouterProvider router={router} />);

    expect(framed(container).getAttribute("src")).toBe("/docs/framed#actions/button/2");
  });
});
