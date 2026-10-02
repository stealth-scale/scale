import { within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { Toggle } from "#standalone/toggle.tsx";

describe("Toggle", () => {
  it("names the switch by its words", async () => {
    const view = await drawn(
      <Toggle checked label="Signed in" onCheckedChange={vi.fn<(checked: boolean) => void>()} />,
    );

    expect(within(view.container).getByRole("switch", { name: "Signed in" })).toBeTruthy();
  });

  it("passes the state a press asks for", async () => {
    const changed = vi.fn<(checked: boolean) => void>();
    const view = await drawn(
      <Toggle checked={false} label="Signed in" onCheckedChange={changed} />,
    );

    await pressed(within(view.container).getByRole("switch", { name: "Signed in" }));

    expect(changed).toHaveBeenCalledExactlyOnceWith(true);
  });
});
