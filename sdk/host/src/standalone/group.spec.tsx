import { render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Group } from "#standalone/group.tsx";

describe("Group", () => {
  it("names the group by its legend", () => {
    const view = render(
      <Group title="Session">
        <p>controls</p>
      </Group>,
    );

    expect(within(view.container).getByRole("group", { name: "Session" })).toBeTruthy();
  });

  it("renders the controls inside the group", () => {
    const view = render(
      <Group title="Session">
        <p>controls</p>
      </Group>,
    );
    const group = within(view.container).getByRole("group", { name: "Session" });

    expect(within(group).getByText("controls")).toBeTruthy();
  });
});
