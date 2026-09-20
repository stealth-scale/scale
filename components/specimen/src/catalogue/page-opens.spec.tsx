import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { Opens } from "#catalogue/page-opens.tsx";

describe("Opens", () => {
  it("names itself by what it shows", async () => {
    const { getByRole } = await drawn(
      <Opens id="panel" onPress={vi.fn<() => void>()} open={false} />,
    );

    expect(getByRole("button", { name: "Source" })).toBeDefined();
  });

  it("says the panel it controls is shut while it is", async () => {
    const { getByRole } = await drawn(
      <Opens id="panel" onPress={vi.fn<() => void>()} open={false} />,
    );

    expect(getByRole("button").getAttribute("aria-expanded")).toBe("false");
  });

  it("says the panel it controls is open while it is", async () => {
    const { getByRole } = await drawn(<Opens id="panel" onPress={vi.fn<() => void>()} open />);

    expect(getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("points at the panel it controls", async () => {
    const { getByRole } = await drawn(
      <Opens id="panel" onPress={vi.fn<() => void>()} open={false} />,
    );

    expect(getByRole("button").getAttribute("aria-controls")).toBe("panel");
  });

  it("keeps its words whichever way the panel is", async () => {
    const { getByRole } = await drawn(<Opens id="panel" onPress={vi.fn<() => void>()} open />);

    expect(getByRole("button", { name: "Source" })).toBeDefined();
  });

  it("reports a press", async () => {
    const heard = vi.fn<() => void>();
    const { getByRole } = await drawn(<Opens id="panel" onPress={heard} open={false} />);

    await pressed(getByRole("button"));

    expect(heard).toHaveBeenCalledTimes(1);
  });
});
