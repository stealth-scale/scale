import { type ReactElement, useRef, useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useFocusing } from "#sidebar/focusing.ts";

/**
 * Renders a button that moves focus to a field, which renders only once `expand` has run.
 */
function Rail(): ReactElement {
  const [iconic, setIconic] = useState(true);
  const field = useRef<HTMLDivElement>(null);
  const focus = useFocusing(field, !iconic, () => {
    setIconic(false);
  });

  return (
    <>
      <button onClick={focus} type="button">
        Search
      </button>
      <div ref={field}>{iconic ? null : <input aria-label="Search pages" type="search" />}</div>
    </>
  );
}

/**
 * Renders a button that moves focus to a field in a closed panel, which the field is reachable in
 * only once `expand` has run.
 */
function Closed(): ReactElement {
  const [open, setOpen] = useState(false);
  const field = useRef<HTMLDivElement>(null);
  const focus = useFocusing(field, open, () => {
    setOpen(true);
  });

  return (
    <>
      <button onClick={focus} type="button">
        Search
      </button>
      <div data-open={open ? "" : undefined} ref={field}>
        <input aria-label="Search pages" type="search" />
      </div>
    </>
  );
}

/**
 * Renders a button that moves focus to a field that is already there.
 */
function Full(): ReactElement {
  const field = useRef<HTMLDivElement>(null);
  const focus = useFocusing(field, true, () => {});

  return (
    <>
      <button onClick={focus} type="button">
        Search
      </button>
      <div ref={field}>
        <input aria-label="Search pages" type="search" />
      </div>
    </>
  );
}

describe("useFocusing", () => {
  it("moves focus to a field that is already there", () => {
    render(<Full />);

    fireEvent.click(screen.getByRole("button"));

    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("expands and moves focus to the field once it renders", () => {
    render(<Rail />);

    fireEvent.click(screen.getByRole("button"));

    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("expands a closed panel before it moves focus to the field inside", () => {
    const { container } = render(<Closed />);

    fireEvent.click(screen.getByRole("button"));

    expect(container.querySelector("[data-open]")).not.toBeNull();
  });

  it("moves focus to the field once the closed panel opens", () => {
    render(<Closed />);

    fireEvent.click(screen.getByRole("button"));

    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });
});
