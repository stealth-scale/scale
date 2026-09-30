import { type MouseEvent } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { mergeProps } from "@zag-js/react";
import { describe, expect, it, vi } from "vitest";

import { type CarouselMachine } from "#carousel/machine.ts";
import { stepping } from "#carousel/stepping.ts";

function machine(
  controls: CarouselMachine["controls"] = "outside",
): Pick<CarouselMachine, "controls" | "instant" | "send"> {
  return { controls, instant: true, send: vi.fn<CarouselMachine["send"]>() };
}

describe("stepping", () => {
  it("sets aria-disabled in place of disabled at an end", () => {
    const props = stepping(machine(), { disabled: true }, true, "PAGE.NEXT");

    expect([props["aria-disabled"], props.disabled]).toStrictEqual([true, undefined]);
  });

  it("leaves aria-disabled off before an end", () => {
    expect(stepping(machine(), {}, false, "PAGE.NEXT")["aria-disabled"]).toBeUndefined();
  });

  it("sends the page event with instant on a press", () => {
    const running = machine();
    const { onClick } = stepping(running, {}, false, "PAGE.PREV");

    render(
      <button onClick={onClick} type="button">
        Back
      </button>,
    );
    fireEvent.click(screen.getByRole("button"));

    expect(running.send).toHaveBeenLastCalledWith({
      instant: true,
      src: "trigger",
      type: "PAGE.PREV",
    });
  });

  it("sends nothing on a press at an end", () => {
    const running = machine();
    const { onClick } = stepping(running, {}, true, "PAGE.PREV");

    render(
      <button onClick={onClick} type="button">
        Back
      </button>,
    );
    fireEvent.click(screen.getByRole("button"));

    expect(running.send).not.toHaveBeenCalled();
  });

  it("sends nothing when the caller cancels the press", () => {
    const running = machine();
    const { onClick } = stepping(running, {}, false, "PAGE.NEXT");
    const cancelled = {
      onClick: (event: MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
      },
    };

    render(
      <button {...mergeProps({ onClick }, cancelled)} type="button">
        On
      </button>,
    );
    fireEvent.click(screen.getByRole("button"));

    expect(running.send).not.toHaveBeenCalled();
  });

  it("sets the ghost look for controls beside the slides", () => {
    expect(stepping(machine("outside"), {}, false, "PAGE.NEXT").variant).toBe("ghost");
  });

  it("sets the surface look for controls over the slides", () => {
    expect(stepping(machine("overlay"), {}, false, "PAGE.NEXT").variant).toBe("surface");
  });
});
