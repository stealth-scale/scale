import { type ReactElement } from "react";

import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Autoplay, useRotation } from "#carousel/rotation.ts";

function Harness(props: { readonly reduced: boolean; readonly requested: Autoplay }): ReactElement {
  const rotation = useRotation(props.requested, props.reduced);

  return (
    <div
      data-autoplay={JSON.stringify(rotation.autoplay)}
      data-testid="carousel"
      data-wanted={String(rotation.wanted)}
      {...rotation.handlers}
    >
      <button onClick={rotation.toggle} type="button">
        Toggle
      </button>
      <button type="button">Other</button>
    </div>
  );
}

function state(): { readonly autoplay: string | undefined; readonly wanted: string | undefined } {
  const { autoplay, wanted } = screen.getByTestId("carousel").dataset;

  return { autoplay, wanted };
}

describe("useRotation", () => {
  it("rotates while the root asks for autoplay", () => {
    render(<Harness reduced={false} requested />);

    expect(state()).toStrictEqual({ autoplay: "true", wanted: "true" });
  });

  it("passes the root's delay to the machine", () => {
    render(<Harness reduced={false} requested={{ delay: 3000 }} />);

    expect(state().autoplay).toBe('{"delay":3000}');
  });

  it("does not rotate without autoplay", () => {
    render(<Harness reduced={false} requested={undefined} />);

    expect(state()).toStrictEqual({ autoplay: "false", wanted: "false" });
  });

  it("does not rotate under reduced motion", () => {
    render(<Harness reduced requested />);

    expect(state()).toStrictEqual({ autoplay: "false", wanted: "false" });
  });

  it("starts on a toggle under reduced motion", () => {
    render(<Harness reduced requested />);

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));

    expect(state()).toStrictEqual({ autoplay: "true", wanted: "true" });
  });

  it("pauses while the pointer is over the carousel", () => {
    render(<Harness reduced={false} requested />);

    fireEvent.pointerEnter(screen.getByTestId("carousel"));

    expect(state()).toStrictEqual({ autoplay: "false", wanted: "true" });
  });

  it("resumes once the pointer leaves", () => {
    render(<Harness reduced={false} requested />);

    fireEvent.pointerEnter(screen.getByTestId("carousel"));
    fireEvent.pointerLeave(screen.getByTestId("carousel"));

    expect(state().autoplay).toBe("true");
  });

  it("keeps rotating under the pointer after the reader starts it", () => {
    render(<Harness reduced={false} requested={false} />);

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    fireEvent.pointerEnter(screen.getByTestId("carousel"));

    expect(state().autoplay).toBe("true");
  });

  it("stops when keyboard focus enters the carousel", () => {
    render(<Harness reduced={false} requested />);

    act(() => {
      screen.getByRole("button", { name: "Other" }).focus();
    });

    expect(state()).toStrictEqual({ autoplay: "false", wanted: "false" });
  });

  it("keeps rotating when keyboard focus moves within the carousel after a start", () => {
    render(<Harness reduced={false} requested />);

    act(() => {
      screen.getByRole("button", { name: "Toggle" }).focus();
    });
    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    act(() => {
      screen.getByRole("button", { name: "Other" }).focus();
    });

    expect(state().wanted).toBe("true");
  });

  it("keeps rotating when focus arrives without keyboard focus", () => {
    render(<Harness reduced={false} requested />);

    fireEvent.focus(screen.getByRole("button", { name: "Other" }));

    expect(state().wanted).toBe("true");
  });

  it("stops on a toggle while rotating", () => {
    render(<Harness reduced={false} requested />);

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));

    expect(state()).toStrictEqual({ autoplay: "false", wanted: "false" });
  });
});
