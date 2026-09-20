import { createContext, type ReactElement, use, useEffect, useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, hovered, pressed, rootedViolations, settled, unhovered } from "#machine.ts";

const Held = createContext<string | undefined>(undefined);

/**
 * Draws a control whose state settles on a microtask, the way a machine's does.
 *
 * @returns The control, saying what it holds.
 */
function Scheduled(): ReactElement {
  const [held, setHeld] = useState("closed");

  return (
    <button
      onClick={() => {
        queueMicrotask(() => {
          setHeld("open");
        });
      }}
      type="button"
    >
      {held}
    </button>
  );
}

/**
 * Draws a component that commits its first state on a microtask after it mounts, the way a
 * machine's root does.
 *
 * @returns The control, saying what it holds.
 */
function Committing(): ReactElement {
  const [held, setHeld] = useState("starting");

  useEffect(() => {
    queueMicrotask(() => {
      setHeld("running");
    });
  }, []);

  return <button type="button">{held}</button>;
}

/**
 * Draws a control that reports only where the pointer went down on it first, the way a menu row
 * does.
 *
 * @returns The control, saying what it heard.
 */
function Sequenced(): ReactElement {
  const [held, setHeld] = useState("none");
  const [armed, setArmed] = useState(false);

  return (
    <button
      onClick={() => {
        setHeld(armed ? "chosen" : "none");
      }}
      onPointerDown={() => {
        setArmed(true);
      }}
      type="button"
    >
      {held}
    </button>
  );
}

/**
 * Draws a box that reports a pointer arriving on the control inside it and leaving it again, the
 * way a panel opened by a pointer does.
 *
 * @returns The box, saying what it heard.
 */
function Entered(): ReactElement {
  const [held, setHeld] = useState("away");

  return (
    <div
      onPointerEnter={() => {
        setHeld("over");
      }}
      onPointerLeave={() => {
        setHeld("gone");
      }}
    >
      <button type="button">{held}</button>
    </div>
  );
}

/**
 * Draws what a root above it holds, and throws where none does.
 *
 * @returns The value.
 */
function Part(): ReactElement {
  const held = use(Held);

  if (held === undefined) throw new Error("A part of Probe was drawn outside its root.");

  return <span>{held}</span>;
}

/**
 * Draws a part that needs nothing above it.
 *
 * @returns The part.
 */
function Loose(): ReactElement {
  return <span>fine</span>;
}

/**
 * Draws a part that throws something else entirely.
 *
 * @returns Nothing. It throws.
 */
function Wrong(): ReactElement {
  throw new Error("something else");
}

/**
 * Draws a part that throws a value rather than an error.
 *
 * @returns Nothing. It throws.
 */
function Bare(): ReactElement {
  // A library that throws a plain value is the case this covers.
  // eslint-disable-next-line no-throw-literal, typescript/only-throw-error -- as above
  throw "A part of Probe was drawn outside its root.";
}

describe("settled", () => {
  it("waits for a state change the interaction only scheduled", async () => {
    render(<Scheduled />);
    fireEvent.click(screen.getByRole("button"));
    await settled();

    expect(screen.getByRole("button").textContent).toBe("open");
  });

  it("leaves a component that changed nothing alone", async () => {
    render(<Scheduled />);
    await settled();

    expect(screen.getByRole("button").textContent).toBe("closed");
  });
});

describe("drawn", () => {
  it("waits for the state the machine commits after it mounts", async () => {
    await drawn(<Committing />);

    expect(screen.getByRole("button").textContent).toBe("running");
  });

  it("reports no update outside an act scope where a bare render would", async () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});

    await drawn(<Committing />);

    expect(quiet).not.toHaveBeenCalled();

    quiet.mockRestore();
  });

  it("hands back the container the render produced", async () => {
    const { container } = await drawn(<Committing />);

    expect(container.querySelector("button")).not.toBeNull();
  });
});

describe("pressed", () => {
  it("puts the pointer down before it clicks", async () => {
    await drawn(<Sequenced />);
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("chosen");
  });

  it("leaves nothing for the caller to settle afterwards", async () => {
    await drawn(<Scheduled />);
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("open");
  });
});

describe("hovered", () => {
  it("reaches a handler set on an element above the one the pointer arrives on", async () => {
    await drawn(<Entered />);
    await hovered(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("over");
  });
});

describe("unhovered", () => {
  it("reaches a handler set on an element above the one the pointer leaves", async () => {
    await drawn(<Entered />);
    await hovered(screen.getByRole("button"));
    await unhovered(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("gone");
  });
});

describe("rootedViolations", () => {
  it("accepts a part that throws what it is expected to", () => {
    expect(rootedViolations({ Part }, "drawn outside its root")).toStrictEqual([]);
  });

  it("accepts a part whose throw matches a pattern", () => {
    expect(rootedViolations({ Part }, /outside its root/u)).toStrictEqual([]);
  });

  it("names a part that draws without the root it needs", () => {
    expect(rootedViolations({ Loose }, "drawn outside its root")).toStrictEqual([
      "Loose draws outside the root it needs above it",
    ]);
  });

  it("names a part that throws something else", () => {
    expect(rootedViolations({ Wrong }, "drawn outside its root")).toStrictEqual([
      "Wrong throws Error: something else, which is not what it says",
    ]);
  });

  it("reads a part that throws a value rather than an error", () => {
    expect(rootedViolations({ Bare }, "drawn outside its root")).toStrictEqual([]);
  });

  it("reads every part it is given", () => {
    expect(rootedViolations({ Loose, Part }, "drawn outside its root")).toStrictEqual([
      "Loose draws outside the root it needs above it",
    ]);
  });

  it("accepts being given no parts at all", () => {
    expect(rootedViolations({}, "drawn outside its root")).toStrictEqual([]);
  });
});
