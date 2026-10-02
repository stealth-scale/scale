import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { Opens } from "#catalogue/page-opens.tsx";

/**
 * The line a scene carries where it carries one at all.
 */
const CODE = "<Button>Publish</Button>";

describe("Opens", () => {
  it("names itself by what it shows", async () => {
    const { getByRole } = await drawn(
      <Opens code={CODE} id="panel" onPress={vi.fn<() => void>()} open={false} />,
    );

    expect(getByRole("button", { name: "Source" })).toBeDefined();
  });

  it("says the panel it controls is shut while it is", async () => {
    const { getByRole } = await drawn(
      <Opens code={CODE} id="panel" onPress={vi.fn<() => void>()} open={false} />,
    );

    expect(getByRole("button").getAttribute("aria-expanded")).toBe("false");
  });

  it("says the panel it controls is open while it is", async () => {
    const { getByRole } = await drawn(
      <Opens code={CODE} id="panel" onPress={vi.fn<() => void>()} open />,
    );

    expect(getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("points at the panel it controls", async () => {
    const { getByRole } = await drawn(
      <Opens code={CODE} id="panel" onPress={vi.fn<() => void>()} open={false} />,
    );

    expect(getByRole("button").getAttribute("aria-controls")).toBe("panel");
  });

  it("keeps its words whichever way the panel is", async () => {
    const { getByRole } = await drawn(
      <Opens code={CODE} id="panel" onPress={vi.fn<() => void>()} open />,
    );

    expect(getByRole("button", { name: "Source" })).toBeDefined();
  });

  it("reports a press", async () => {
    const heard = vi.fn<() => void>();
    const { getByRole } = await drawn(
      <Opens code={CODE} id="panel" onPress={heard} open={false} />,
    );

    await pressed(getByRole("button"));

    expect(heard).toHaveBeenCalledTimes(1);
  });

  it("says a scene carries no line rather than drawing a control", async () => {
    const { getByText, queryByRole } = await drawn(
      <Opens code={null} id="panel" onPress={vi.fn<() => void>()} open={false} />,
    );

    expect(getByText("No source for this scene")).toBeDefined();
    expect(queryByRole("button")).toBeNull();
  });
});
