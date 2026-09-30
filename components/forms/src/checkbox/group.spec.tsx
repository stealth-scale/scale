import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { AFTER_PARENT, recipe } from "#checkbox/checkbox-group.recipe.ts";
import { listed, pressed } from "#checkbox/checkbox.fixtures.tsx";
import { Control } from "#checkbox/control.tsx";
import { Group } from "#checkbox/group.tsx";
import { Label } from "#checkbox/label.tsx";
import { Root } from "#checkbox/root.tsx";

/**
 * Returns the input of the box a label names.
 */
function box(name: string): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("checkbox", { name });
}

/**
 * Returns the group's element.
 */
function groupOf(container: HTMLElement): HTMLElement {
  const found = container.querySelector<HTMLElement>(".checkbox-group");

  if (found === null) throw new TypeError("The group did not render.");

  return found;
}

describe("Group", () => {
  it("passes the component conformance checks as a div element", () => {
    expect(violations(Group, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation inside a fieldset", async () => {
    await expect(
      accessibilityViolations(() => listed({ defaultValue: ["sms"] })),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Group {...props} />).container),
    ).toStrictEqual([]);
  });

  it("writes the vertical orientation by default", () => {
    const { container } = render(listed());

    expect(groupOf(container).dataset["orientation"]).toBe("vertical");
  });

  it("writes the orientation it is given", () => {
    const { container } = render(listed({ orientation: "horizontal" }));

    expect(groupOf(container).dataset["orientation"]).toBe("horizontal");
  });

  it("checks the boxes of the default value", async () => {
    await drawn(listed({ defaultValue: ["email"] }));

    expect([box("email").checked, box("sms").checked]).toStrictEqual([true, false]);
  });

  it("calls onValueChange with the new value on a press", async () => {
    const heard = vi.fn<(value: string[]) => void>();

    await drawn(listed({ defaultValue: ["email"], onValueChange: heard }));
    await pressed(box("sms"));

    expect(heard).toHaveBeenLastCalledWith(["email", "sms"]);
  });

  it("keeps the value the caller controls", async () => {
    await drawn(listed({ value: ["email"] }));
    await pressed(box("sms"));

    expect(box("sms").checked).toBe(false);
  });

  it("submits every checked value under the group's name", async () => {
    const { container } = await drawn(
      <form>{listed({ defaultValue: ["email", "push"], name: "channel" })}</form>,
    );
    const form = container.querySelector("form");

    expect(form === null ? [] : new FormData(form).getAll("channel")).toStrictEqual([
      "email",
      "push",
    ]);
  });

  it("reports the invalid state of the fieldset around it on every box", async () => {
    await drawn(listed({}, { invalid: true }));

    expect(
      screen.getAllByRole("checkbox").map((each) => each.getAttribute("aria-invalid")),
    ).toStrictEqual(["true", "true", "true", "true"]);
  });

  it("keeps its own invalid state over the fieldset's", async () => {
    await drawn(listed({ invalid: false }, { invalid: true }));

    expect(box("email").getAttribute("aria-invalid")).toBe("false");
  });

  it("takes the size of the fieldset around it", async () => {
    const { container } = await drawn(listed({}, { size: "sm" }));

    expect([...groupOf(container).classList]).toContain(
      variantClass("checkbox-group", "size", "sm"),
    );
  });

  it("gives every box its size", async () => {
    const { container } = await drawn(listed({ size: "lg" }));

    expect([...slotElement(container, "checkbox", "control").classList]).toContain(
      variantClass("checkbox__control", "size", "lg"),
    );
  });

  it("disables the unchecked boxes at the maximum", async () => {
    await drawn(listed({ defaultValue: ["email", "sms"], maxSelectedValues: 2 }));

    expect([box("email").disabled, box("push").disabled]).toStrictEqual([false, true]);
  });

  it("turns the parent partly on while some values are checked", async () => {
    await drawn(listed({ defaultValue: ["sms"] }));

    expect(box("All channels").indeterminate).toBe(true);
  });

  it("checks every box on a press of the parent", async () => {
    await drawn(listed({ defaultValue: ["sms"] }));
    await pressed(box("All channels"));

    expect(["email", "sms", "push"].map((name) => box(name).checked)).toStrictEqual([
      true,
      true,
      true,
    ]);
  });

  it("clears every box on a press of a parent that is on", async () => {
    await drawn(listed({ defaultValue: ["email", "sms", "push"] }));
    await pressed(box("All channels"));

    expect(["email", "sms", "push"].map((name) => box(name).checked)).toStrictEqual([
      false,
      false,
      false,
    ]);
  });

  it("marks the parent's row with data-parent", async () => {
    await drawn(listed());

    expect(box("All channels").closest("label")?.dataset["parent"]).toBe("");
  });

  it("matches the row after the parent with the recipe's indent selector", async () => {
    const { container } = await drawn(listed());
    const indented = groupOf(container).querySelector(AFTER_PARENT.replace("&", ":scope"));

    expect(indented?.textContent).toBe("email");
  });

  it("leaves a box without a value to its own state", async () => {
    await drawn(
      <Group defaultValue={["email"]}>
        <Root defaultChecked>
          <Control />
          <Label>Weekly summary</Label>
        </Root>
      </Group>,
    );

    expect(box("Weekly summary").checked).toBe(true);
  });
});
