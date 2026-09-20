import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { Board } from "#board/board.tsx";
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
      slotVariantClass("grid", "root", "columns", "fill-xs"),
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
});
