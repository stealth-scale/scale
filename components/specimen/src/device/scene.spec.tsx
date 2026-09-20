import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ViewportProvider } from "@stealthscale/provider-viewport";

import { PHONE } from "#device/devices.ts";
import { type SceneAddress, SceneProvider, useDevice, useScene } from "#device/scene.ts";

const SCENE: SceneAddress = { page: "actions/button", path: "framed", scene: 1, title: "Sizes" };

function Read(): ReactElement {
  return <output>{JSON.stringify({ device: useDevice(), scene: useScene() })}</output>;
}

/**
 * Reads what the hooks answer under a scene and a viewport width.
 */
function read(scene?: SceneAddress, width?: number): unknown {
  const { container } = render(
    <ViewportProvider width={width}>
      {scene === undefined ? <Read /> : <SceneProvider value={scene}>{<Read />}</SceneProvider>}
    </ViewportProvider>,
  );

  return JSON.parse(container.textContent);
}

describe("useScene", () => {
  it("answers nothing outside a page", () => {
    expect(read()).toStrictEqual({});
  });

  it("answers the scene being drawn", () => {
    expect(read(SCENE)).toMatchObject({ scene: SCENE });
  });
});

describe("useDevice", () => {
  it("answers nothing while the window decides", () => {
    expect(read(SCENE)).not.toHaveProperty("device");
  });

  it("answers nothing outside a page whatever the width", () => {
    expect(read(undefined, PHONE.min)).toStrictEqual({});
  });

  it("answers nothing where the application serves no framed page", () => {
    expect(read({ ...SCENE, path: undefined }, PHONE.min)).not.toHaveProperty("device");
  });

  it("answers the device picked and the scene to show in it", () => {
    expect(read(SCENE, PHONE.min)).toStrictEqual({
      device: { device: { height: 568, name: "phone", width: 320 }, scene: SCENE },
      scene: SCENE,
    });
  });
});
