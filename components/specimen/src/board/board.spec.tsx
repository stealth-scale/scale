import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { Board } from "#board/board.tsx";
import { FramedProvider } from "#framed/context.ts";
import { REPORTED } from "#framed/report.ts";
import { Sample } from "#sample/sample.tsx";

describe("Board", () => {
  it("lays its samples out on the library's grid", () => {
    const { container } = render(
      <Board>
        <Sample of="sm">Publish</Sample>
      </Board>,
    );

    expect(slotClasses(container, "grid", "root")).toContain("grid__root");
  });

  it("draws as many columns of the smallest measure as the room holds", () => {
    const { container } = render(<Board>One</Board>);

    expect(slotClasses(container, "grid", "root")).toContain(
      slotVariantClass("grid", "root", "columns", "fit-xs"),
    );
  });

  it("takes the columns a caller asks for instead", () => {
    const { container } = render(<Board columns="3">One</Board>);

    expect(slotClasses(container, "grid", "root")).toContain(
      slotVariantClass("grid", "root", "columns", "3"),
    );
  });

  it("sets the look of every sample on it", () => {
    const { container } = render(
      <Board variant="outline">
        <Sample of="sm">Publish</Sample>
      </Board>,
    );

    expect(slotClasses(container, "sample", "body")).toContain(
      slotVariantClass("sample", "body", "variant", "outline"),
    );
  });

  it("holds what it is given", () => {
    expect(render(<Board>Publish</Board>).container.textContent).toBe("Publish");
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Board, { props: { children: "Publish" } }),
    ).resolves.toStrictEqual([]);
  });

  it("draws the one sample a framed document was asked for and nothing round it", () => {
    const { container } = render(
      <FramedProvider value={{ sample: 1 }}>
        <Board>
          <Sample of="sm">One</Sample>
          <Sample of="md">Two</Sample>
        </Board>
      </FramedProvider>,
    );

    expect(container.textContent).toBe("Two");
    expect(container.querySelector("[data-recipe]")).toBeNull();
  });

  it("draws the first sample where a framed document picks none, and nothing past the last", () => {
    const first = render(
      <FramedProvider value={{}}>
        <Board>
          <Sample of="sm">One</Sample>
        </Board>
      </FramedProvider>,
    );
    const past = render(
      <FramedProvider value={{ sample: 4 }}>
        <Board>
          <Sample of="sm">One</Sample>
        </Board>
      </FramedProvider>,
    );

    expect(first.container.textContent).toBe("One");
    expect(past.container.textContent).toBe("");
  });

  it("tells the page holding a framed document which samples it offers, each by its caption or by its position where it has none", () => {
    const nameless: string | undefined = undefined;
    const posted = vi.fn();
    const parent = new Proxy(window, {
      get: (target, key): unknown => (key === "postMessage" ? posted : Reflect.get(target, key)),
    });
    const held = vi.spyOn(window, "parent", "get").mockReturnValue(parent);

    render(
      <FramedProvider value={{}}>
        <Board>
          <Sample knob="span" of="2">
            1
          </Sample>
          <Sample of="wide">2</Sample>
          <Sample of={nameless}>3</Sample>
          four
        </Board>
      </FramedProvider>,
    );

    expect(posted).toHaveBeenCalledWith(
      {
        address: window.location.hash,
        choices: [{ names: ["span = 2", "wide", "3", "4"], part: "sample" }],
        type: REPORTED,
      },
      window.location.origin,
    );

    held.mockRestore();
  });
});
