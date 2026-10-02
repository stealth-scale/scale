import { type MouseEvent } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { stepped } from "#date-picker/steps.ts";

describe("stepped", () => {
  it("names the button by label in place of the machine's words", () => {
    render(
      <button type="button" {...stepped({ "aria-label": "Switch to next month" }, "Next month")} />,
    );

    expect(screen.getByRole("button", { name: "Next month" })).toBeDefined();
  });

  it("drops disabled at the end", () => {
    render(<button type="button" {...stepped({ disabled: true }, "Next month")} />);

    expect(screen.getByRole("button").hasAttribute("disabled")).toBe(false);
  });

  it("reports aria-disabled at the end", () => {
    render(<button type="button" {...stepped({ disabled: true }, "Next month")} />);

    expect(screen.getByRole("button").getAttribute("aria-disabled")).toBe("true");
  });

  it("leaves out aria-disabled before the end", () => {
    render(<button type="button" {...stepped({ disabled: false }, "Next month")} />);

    expect(screen.getByRole("button").hasAttribute("aria-disabled")).toBe(false);
  });

  it("cancels a press at the end", () => {
    render(<button type="button" {...stepped({ disabled: true }, "Next month")} />);

    expect(fireEvent.click(screen.getByRole("button"))).toBe(false);
  });

  it("lets a press through before the end", () => {
    render(<button type="button" {...stepped({ disabled: false }, "Next month")} />);

    expect(fireEvent.click(screen.getByRole("button"))).toBe(true);
  });

  it("cancels the press before the machine's handler runs", () => {
    const seen: boolean[] = [];

    render(
      <button
        type="button"
        {...stepped(
          {
            disabled: true,
            onClick: (event: MouseEvent<HTMLButtonElement>): void => {
              seen.push(event.defaultPrevented);
            },
          },
          "Next month",
        )}
      />,
    );
    fireEvent.click(screen.getByRole("button"));

    expect(seen).toStrictEqual([true]);
  });
});
