import { type ReactElement } from "react";

import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { refusing, written } from "#form/form.fixtures.tsx";
import { GroupFrame } from "#form/group-frame.tsx";

/**
 * Renders an application's own group in a frame labelled "Channel".
 */
function ownGroup(required?: boolean): ReactElement {
  return (
    <GroupFrame label="Channel" required={required}>
      {(group) => (
        <fieldset aria-labelledby={group["aria-labelledby"]} name={group.name}>
          <input aria-label="Email" type="checkbox" />
        </fieldset>
      )}
    </GroupFrame>
  );
}

describe("GroupFrame", () => {
  it("renders the label as a span", async () => {
    await drawn(written("channel", { channel: "" }, () => ownGroup()));

    expect(screen.getByText("Channel").tagName).toBe("SPAN");
  });

  it("names the group by the label", async () => {
    await drawn(written("channel", { channel: "" }, () => ownGroup()));

    expect(screen.getByRole("group", { name: "Channel" }).tagName).toBe("FIELDSET");
  });

  it("hands the group the field's path as its name", async () => {
    await drawn(written("channel", { channel: "" }, () => ownGroup()));

    expect(screen.getByRole("group", { name: "Channel" }).getAttribute("name")).toBe("channel");
  });

  it("marks a required group's label with an asterisk", async () => {
    await drawn(written("channel", { channel: "" }, () => ownGroup(true)));

    expect(screen.getByText("*").getAttribute("aria-hidden")).toBe("true");
  });

  it("shows the field's error after a refused submit", async () => {
    await drawn(refusing(() => ownGroup()));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await settled();

    expect(screen.getByText("Write a note").getAttribute("role")).toBe("alert");
  });
});
