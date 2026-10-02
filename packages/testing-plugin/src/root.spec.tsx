import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScopeProbe } from "#probes.fixtures.tsx";
import { rootOf } from "#root.tsx";

function Marker(): string {
  return "frame ";
}

describe("rootOf", () => {
  it("renders the frame before the element in the plugin's scope", () => {
    const Root = rootOf(Marker, "notes", <ScopeProbe />);

    expect(render(<Root />).container.textContent).toBe("frame scope notes");
  });

  it("renders the frame alone where no plugin is given", () => {
    const Root = rootOf(Marker);

    expect(render(<Root />).container.textContent).toBe("frame ");
  });
});
