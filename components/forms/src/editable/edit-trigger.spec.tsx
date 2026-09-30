import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { Area } from "#editable/area.tsx";
import { Control } from "#editable/control.tsx";
import { EditTrigger } from "#editable/edit-trigger.tsx";
import { composed, opened } from "#editable/editable.fixtures.tsx";
import { Input } from "#editable/input.tsx";
import { Preview } from "#editable/preview.tsx";
import { Root } from "#editable/root.tsx";

describe("EditTrigger", () => {
  it("is named Edit by default", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Edit" }).tagName).toBe("BUTTON");
  });

  it("takes its name from label", async () => {
    await drawn(
      <Root defaultValue="Bridge Ledger">
        <Area>
          <Preview />
          <Input aria-label="Workspace name" />
        </Area>
        <Control>
          <EditTrigger label="Rename the workspace" />
        </Control>
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Rename the workspace" })).toBeDefined();
  });

  it("opens the field on a press", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    await settled();

    expect(screen.getByRole("textbox").hidden).toBe(false);
  });

  it("hides itself while the field is open", async () => {
    await drawn(composed());
    await opened();

    expect(screen.queryByRole("button", { name: "Edit" })).toBeNull();
  });

  it("hides itself in a read-only editable", async () => {
    await drawn(composed({ readOnly: true }));

    expect(screen.queryByRole("button", { name: "Edit" })).toBeNull();
  });
});
