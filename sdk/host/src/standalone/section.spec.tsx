import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { standaloneWorded } from "#standalone.fixtures.ts";
import { PlaceholderSection } from "#standalone/section.tsx";

describe("PlaceholderSection", () => {
  it("names the section's plugin", () => {
    standaloneWorded();

    const view = render(<PlaceholderSection sectionId="identity/photo" />);

    expect(view.container.textContent).toBe(
      "Identity is installed from its contract alone, so this section is a placeholder.",
    );
  });
});
