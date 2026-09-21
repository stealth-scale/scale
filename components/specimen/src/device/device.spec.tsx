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
 * Reads the frame a device drew.
 */
function framed(container: HTMLElement): HTMLIFrameElement {
  const frame = slotElement(container, "device", "frame");

  if (!(frame instanceof HTMLIFrameElement)) throw new TypeError("no frame");

  return frame;
}

/**
 * Reads the size the root wrote for the frame.
 */
function sized(container: HTMLElement): readonly [width: string, height: string] {
  const { style } = slotElement(container, "device", "root");

  return [style.getPropertyValue(WIDTH), style.getPropertyValue(HEIGHT)];
}

/**
 * Posts a report to the page, as the framed document at an address would: from the device's own
 * frame, at the page's origin.
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

  it("names the frame after the scene and sizes it as the device", () => {
    const { container } = render(<Device device={PHONE} scene={SCENE} />);

    expect(framed(container).title).toBe("Sizes");
    expect(sized(container)).toStrictEqual(["320px", "568px"]);
    expect(container.textContent).toContain("320 × 568");
  });

  it("neither defers nor sandboxes the frame", () => {
    const { container } = render(<Device device={PHONE} scene={SCENE} />);

    expect(framed(container).hasAttribute("loading")).toBe(false);
    expect(framed(container).hasAttribute("sandbox")).toBe(false);
  });

  it("draws no picker until the document reports the axes the scene offers", async () => {
    const { container, queryAllByRole } = await drawn(<Device device={PHONE} scene={SCENE} />);

    expect(queryAllByRole("button")).toHaveLength(0);

    reported("#actions/button/2", CHOICES);

    expect(queryAllByRole("button").map((control) => control.textContent)).toStrictEqual([
      "sizesm",
      "sampleoutline",
    ]);
    expect(slotElement(container, "device", "bar").querySelectorAll("button")).toHaveLength(2);
  });

  it("ignores a report from a document at another address", async () => {
    const { queryAllByRole } = await drawn(<Device device={PHONE} scene={SCENE} />);

    reported("#actions/button/3", CHOICES);

    expect(queryAllByRole("button")).toHaveLength(0);
  });

  it("frames the sample the pickers name", async () => {
    const { container, getByRole } = await drawn(<Device device={PHONE} scene={SCENE} />);

    reported("#actions/button/2", CHOICES);

    await pressed(getByRole("button", { name: "size sm" }));
    await pressed(getByRole("menuitemradio", { name: "lg" }));

    expect(framed(container).getAttribute("src")).toBe("/framed#actions/button/2?v=2");

    await pressed(getByRole("button", { name: "sample outline" }));
    await pressed(getByRole("menuitemradio", { name: "solid" }));

    expect(framed(container).getAttribute("src")).toBe("/framed#actions/button/2?v=2&x=1");
  });

  it("loads the framed page under the base the router serves the application at", async () => {
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
