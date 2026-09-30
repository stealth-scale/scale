import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  type AvatarOptions,
  splitAvatarProps,
  useAvatar,
  useAvatarMachine,
} from "#avatar/machine.ts";

/**
 * Starts a machine and renders its load state through the hook the parts use.
 */
function Running(props: AvatarOptions): ReactElement {
  const api = useAvatarMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Renders the root's props and whether the machine reports the picture as loaded.
 */
function Reader(): ReactElement {
  const api = useAvatar();

  return (
    <span {...api.getRootProps()} data-testid="state">
      {api.loaded ? "loaded" : "waiting"}
    </span>
  );
}

describe("splitAvatarProps", () => {
  it("returns the machine's own settings in the first half", () => {
    const [options] = splitAvatarProps({ id: "ada", name: "Ada Okafor" });

    expect(options).toStrictEqual({ id: "ada" });
  });

  it("returns every other prop in the second half", () => {
    const [, rest] = splitAvatarProps({ id: "ada", name: "Ada Okafor" });

    expect(rest).toStrictEqual({ name: "Ada Okafor" });
  });
});

describe("useAvatarMachine", () => {
  it("reports no picture loaded before one loads", async () => {
    await drawn(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("waiting");
  });

  it("derives the root's id from the id the caller passes", async () => {
    await drawn(<Running id="ada" />);

    expect(screen.getByTestId("state").id).toContain("ada");
  });

  it("derives the root's id from a generated id without one", async () => {
    await drawn(<Running />);

    expect(screen.getByTestId("state").id).not.toBe("");
  });
});
