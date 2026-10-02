import { act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { picked, trigger } from "#select/select.fixtures.tsx";

/**
 * Returns the hidden select inside a render.
 */
function hidden(container: HTMLElement): HTMLSelectElement {
  const found = container.querySelector("select");

  if (found === null) throw new Error("No hidden select rendered.");

  return found;
}

describe("HiddenSelect", () => {
  it("hides the select from assistive technology", async () => {
    const { container } = await drawn(picked());

    expect(hidden(container).getAttribute("aria-hidden")).toBe("true");
  });

  it("leaves the select out of the tab order", async () => {
    const { container } = await drawn(picked());

    expect(hidden(container).tabIndex).toBe(-1);
  });

  it("renders an empty first option before one option per item", async () => {
    const { container } = await drawn(picked());

    expect([...hidden(container).options].map((option) => option.value)).toStrictEqual([
      "",
      "bridge",
      "halden",
      "perrin partners",
      "voss",
    ]);
  });

  it("renders no empty option for several choices", async () => {
    const { container } = await drawn(picked({ multiple: true }));

    expect(hidden(container).options[0]?.value).toBe("bridge");
  });

  it("disables the option of a disabled item", async () => {
    const { container } = await drawn(picked());

    expect(hidden(container).options[4]?.disabled).toBe(true);
  });

  it("selects the option of the value", async () => {
    const { container } = await drawn(picked({ defaultValue: ["halden"] }));

    expect(hidden(container).value).toBe("halden");
  });

  it("submits the value under its name", async () => {
    const { container } = await drawn(
      <form>{picked({ defaultValue: ["halden"], name: "account" })}</form>,
    );
    const form = container.querySelector("form");

    expect(form === null ? null : new FormData(form).get("account")).toBe("halden");
  });

  it("moves focus to the trigger when it takes focus", async () => {
    const { container } = await drawn(picked());

    act(() => {
      hidden(container).focus();
    });
    await settled();

    expect(document.activeElement).toBe(trigger());
  });
});
