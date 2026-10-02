import { renderToString } from "react-dom/server";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { Portal } from "#portal/portal.ts";

describe("Portal", () => {
  it("returns no accessibility violation for the content it moves", async () => {
    await expect(
      accessibilityViolations(Portal, { props: { children: <p>Elsewhere</p> } }),
    ).resolves.toStrictEqual([]);
  });

  it("renders its children into document.body when given no container", () => {
    const { container } = render(<Portal>Elsewhere</Portal>);

    expect(container.textContent).toBe("");
    expect(document.body.textContent).toContain("Elsewhere");
  });

  it("renders its children into the container the caller passes", () => {
    const elsewhere = document.createElement("section");

    document.body.append(elsewhere);
    render(<Portal container={elsewhere}>Elsewhere</Portal>);

    expect(elsewhere.textContent).toBe("Elsewhere");
    elsewhere.remove();
  });

  it("renders its children in place when disabled", () => {
    const { container } = render(<Portal disabled>Here</Portal>);

    expect(container.textContent).toBe("Here");
  });

  it("removes its children from the body on unmount", () => {
    const { unmount } = render(<Portal>Elsewhere</Portal>);

    unmount();

    expect(document.body.textContent).not.toContain("Elsewhere");
  });

  it("renders nothing when given no children", () => {
    const { container } = render(<Portal />);

    expect(container.textContent).toBe("");
  });

  it("renders an empty string on the server", () => {
    expect(renderToString(<Portal>Elsewhere</Portal>)).toBe("");
  });

  it("renders its children on the server when disabled", () => {
    expect(renderToString(<Portal disabled>Here</Portal>)).toBe("Here");
  });
});
