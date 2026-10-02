import { type ReactElement } from "react";

import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { generated, refusing, written } from "#form/form.fixtures.tsx";
import { Frame } from "#form/frame.tsx";
import { WIDTH } from "#form/recipe.ts";

const PROFILE: Schema = {
  properties: { name: { description: "As on your passport", minLength: 2, type: "string" } },
  required: ["name"],
  type: "object",
};

/**
 * Types a name and submits the form.
 */
async function submittedAs(name: string): Promise<void> {
  fireEvent.change(screen.getByRole("textbox", { name: "Name" }), { target: { value: name } });
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

/**
 * Renders an application's own text box in a frame labelled "Note".
 */
function ownBox(required?: boolean): ReactElement {
  return (
    <Frame label="Note" required={required}>
      {(control) => <input {...control} type="text" />}
    </Frame>
  );
}

/**
 * Reads the identifiers that describe the text box named "Note".
 */
function describersOfNote(): readonly string[] {
  return (
    screen.getByRole("textbox", { name: "Note" }).getAttribute("aria-describedby") ?? ""
  ).split(" ");
}

describe("Frame", () => {
  it("marks a required field's label with an asterisk hidden from assistive technology", async () => {
    await drawn(generated(PROFILE));

    expect(screen.getByText("*").getAttribute("aria-hidden")).toBe("true");
  });

  it("describes the control by its help text", async () => {
    await drawn(generated(PROFILE));

    expect(
      screen.getByRole("textbox", { name: "Name" }).getAttribute("aria-describedby")?.split(" "),
    ).toContain(screen.getByText("As on your passport").id);
  });

  it("replaces the help text with the error after a refused submit", async () => {
    await drawn(
      generated(PROFILE, { translate: translateFrom({ "errors.minLength": "Too short" }) }),
    );
    await submittedAs("A");

    expect([
      screen.queryByText("As on your passport"),
      screen.getByText("Too short").tagName,
    ]).toStrictEqual([null, "P"]);
  });

  it("names the control after the field's path", async () => {
    await drawn(generated(PROFILE));

    expect(screen.getByRole("textbox", { name: "Name" }).getAttribute("name")).toBe("name");
  });

  it("names an application's own control by the field's label", async () => {
    await drawn(written("note", { note: "" }, () => ownBox()));

    expect(screen.getByRole("textbox", { name: "Note" })).toBeDefined();
  });

  it("hands an application's own control the field's path as its name", async () => {
    await drawn(written("note", { note: "" }, () => ownBox()));

    expect(screen.getByRole("textbox", { name: "Note" }).getAttribute("name")).toBe("note");
  });

  it("marks an application's own control required when the field requires a value", async () => {
    await drawn(written("note", { note: "" }, () => ownBox(true)));

    expect(screen.getByRole("textbox", { name: "Note" }).hasAttribute("required")).toBe(true);
  });

  it("marks an application's own control invalid while the field shows an error", async () => {
    await drawn(refusing(() => ownBox()));
    await submitted();

    expect(screen.getByRole("textbox", { name: "Note" }).getAttribute("aria-invalid")).toBe("true");
  });

  it("describes an application's own control by the field's error", async () => {
    await drawn(refusing(() => ownBox()));
    await submitted();

    expect(describersOfNote()).toContain(screen.getByText("Write a note").id);
  });

  it("writes the width it is given on the field's root", async () => {
    const { container } = await drawn(
      written("note", { note: "" }, () => (
        <Frame label="Note" width="medium">
          {(control) => <input {...control} type="text" />}
        </Frame>
      )),
    );

    expect(container.querySelector(`[${WIDTH}]`)?.getAttribute(WIDTH)).toBe("medium");
  });

  it("writes no width without one", async () => {
    const { container } = await drawn(written("note", { note: "" }, () => ownBox()));

    expect(container.querySelector(`[${WIDTH}]`)).toBeNull();
  });

  it("floats the label of a text box in a form whose labels float", async () => {
    const { container } = await drawn(generated(PROFILE, { orientation: "floating" }));

    expect(container.querySelector(".field__root")?.className).toContain("field__root--floating");
  });

  it("hands a floating text box a placeholder of one space without one in the catalogue", async () => {
    await drawn(generated(PROFILE, { orientation: "floating" }));

    expect(screen.getByRole("textbox", { name: "Name" }).getAttribute("placeholder")).toBe(" ");
  });

  it("keeps the catalogue's placeholder on a floating text box", async () => {
    await drawn(
      generated(PROFILE, {
        orientation: "floating",
        translate: translateFrom({ "profile.fields.name.placeholder": "Ada Okafor" }),
      }),
    );

    expect(screen.getByRole("textbox", { name: "Name" }).getAttribute("placeholder")).toBe(
      "Ada Okafor",
    );
  });

  it("keeps the label above a control that is not a text box in a form whose labels float", async () => {
    const { container } = await drawn(
      generated(
        { properties: { seats: { type: "number" } }, type: "object" },
        { orientation: "floating" },
      ),
    );

    expect(container.querySelector(".field__root")?.className).toContain("field__root--vertical");
  });

  it("hands a text box no placeholder in a form with labels above the controls", async () => {
    await drawn(generated(PROFILE));

    expect(screen.getByRole("textbox", { name: "Name" }).hasAttribute("placeholder")).toBe(false);
  });
});
