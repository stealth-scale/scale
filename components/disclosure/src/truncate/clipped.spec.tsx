import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { recipeElement } from "@stealthscale/testing-theme";

import { Content } from "#tooltip/content.tsx";
import { Positioner } from "#tooltip/positioner.tsx";
import { Root } from "#tooltip/root.tsx";
import { Clipped } from "#truncate/clipped.tsx";

const NOTE = "Held at Emmerich for a customs count";

describe("Clipped", () => {
  it("renders a span with the truncate class", async () => {
    const { container } = await drawn(
      <Root>
        <Clipped clipped={false} focusable={false} lines={1}>
          {NOTE}
        </Clipped>
      </Root>,
    );

    expect(recipeElement(container, "truncate").tagName).toBe("SPAN");
  });

  it("writes lines to --truncate-lines", async () => {
    const { container } = await drawn(
      <Root>
        <Clipped clipped={false} focusable={false} lines={3}>
          {NOTE}
        </Clipped>
      </Root>,
    );

    expect(recipeElement(container, "truncate").style.getPropertyValue("--truncate-lines")).toBe(
      "3",
    );
  });

  it("keeps a style the caller passes beside the line count", async () => {
    const { container } = await drawn(
      <Root>
        <Clipped clipped={false} focusable={false} lines={1} style={{ opacity: 0.5 }}>
          {NOTE}
        </Clipped>
      </Root>,
    );

    expect(recipeElement(container, "truncate").style.opacity).toBe("0.5");
  });

  it("sets data-truncated when clipped", async () => {
    const { container } = await drawn(
      <Root>
        <Clipped clipped focusable={false} lines={1}>
          {NOTE}
        </Clipped>
      </Root>,
    );

    expect(recipeElement(container, "truncate").dataset["truncated"]).toBe("");
  });

  it("leaves data-truncated unset when the text fits", async () => {
    const { container } = await drawn(
      <Root>
        <Clipped clipped={false} focusable={false} lines={1}>
          {NOTE}
        </Clipped>
      </Root>,
    );

    expect(recipeElement(container, "truncate").dataset["truncated"]).toBeUndefined();
  });

  it("takes a tab stop when focusable and clipped", async () => {
    const { container } = await drawn(
      <Root>
        <Clipped clipped focusable lines={1}>
          {NOTE}
        </Clipped>
      </Root>,
    );

    expect(recipeElement(container, "truncate").tabIndex).toBe(0);
  });

  it("takes no tab stop when focusable and the text fits", async () => {
    const { container } = await drawn(
      <Root>
        <Clipped clipped={false} focusable lines={1}>
          {NOTE}
        </Clipped>
      </Root>,
    );

    expect(recipeElement(container, "truncate").hasAttribute("tabindex")).toBe(false);
  });

  it("takes no tab stop when clipped and not focusable", async () => {
    const { container } = await drawn(
      <Root>
        <Clipped clipped focusable={false} lines={1}>
          {NOTE}
        </Clipped>
      </Root>,
    );

    expect(recipeElement(container, "truncate").hasAttribute("tabindex")).toBe(false);
  });

  it("leaves aria-describedby unset while the tooltip is open", async () => {
    const { container } = await drawn(
      <Root defaultOpen>
        <Clipped clipped focusable lines={1}>
          {NOTE}
        </Clipped>
        <Positioner>
          <Content>{NOTE}</Content>
        </Positioner>
      </Root>,
    );

    expect(recipeElement(container, "truncate").hasAttribute("aria-describedby")).toBe(false);
  });
});
