import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotClasses, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { FramedProvider } from "#framed/context.ts";
import { DisplayProvider } from "#sample/display.ts";
import { Sample } from "#sample/sample.tsx";

describe("Sample", () => {
  it("draws what it is given", () => {
    const { container } = render(<Sample of="sm">Publish</Sample>);

    expect(slotElement(container, "sample", "body")?.textContent).toBe("Publish");
  });

  it("captions the value the component was drawn for", () => {
    const { container } = render(<Sample of="sm">Publish</Sample>);

    expect(slotElement(container, "sample", "caption")?.textContent).toBe("sm");
  });

  it("writes the prop before the value when one is given", () => {
    const { container } = render(
      <Sample knob="size" of="sm">
        Publish
      </Sample>,
    );

    expect(slotElement(container, "sample", "caption")?.textContent).toBe("size = sm");
  });

  it("draws no caption for a cell a row or a column names already", () => {
    const { container } = render(<Sample>Publish</Sample>);

    expect(container.querySelector(".sample__caption")).toBeNull();
  });

  it("takes the look the container set", () => {
    const { container } = render(
      <DisplayProvider value={{ variant: "outline" }}>
        <Sample of="sm">Publish</Sample>
      </DisplayProvider>,
    );

    expect(slotClasses(container, "sample", "body")).toContain(
      slotVariantClass("sample", "body", "variant", "outline"),
    );
  });

  it("states its own look over the container's", () => {
    const { container } = render(
      <DisplayProvider value={{ variant: "outline" }}>
        <Sample of="sm" variant="subtle">
          Publish
        </Sample>
      </DisplayProvider>,
    );

    expect(slotClasses(container, "sample", "body")).toContain(
      slotVariantClass("sample", "body", "variant", "subtle"),
    );
  });

  it("places the drawing where the container asked for it", () => {
    const { container } = render(
      <DisplayProvider value={{ place: "center" }}>
        <Sample of="sm">Publish</Sample>
      </DisplayProvider>,
    );

    expect(slotClasses(container, "sample", "body")).toContain(
      slotVariantClass("sample", "body", "place", "center"),
    );
  });

  it("reaches across a board's columns when it states a span", () => {
    const { container } = render(
      <Sample of="sm" span="full">
        Publish
      </Sample>,
    );

    expect(slotClasses(container, "sample", "root")).toContain(
      slotVariantClass("sample", "root", "span", "full"),
    );
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Sample, { props: { children: "Publish", knob: "size", of: "sm" } }),
    ).resolves.toStrictEqual([]);
  });

  it("draws what it holds and nothing round it in a framed document", () => {
    const { container } = render(
      <FramedProvider value={{}}>
        <Sample knob="size" of="sm">
          Publish
        </Sample>
      </FramedProvider>,
    );

    expect(container.textContent).toBe("Publish");
    expect(container.querySelector("[data-recipe]")).toBeNull();
  });
});
