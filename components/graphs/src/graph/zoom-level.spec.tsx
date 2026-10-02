import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { inside, scoped } from "#graph/graph.fixtures.tsx";
import * as Graph from "#graph/index.ts";

describe("ZoomLevel", () => {
  it("writes the canvas's zoom as a percentage", () => {
    const { getByRole } = render(inside(<Graph.ZoomLevel />));

    expect(getByRole("status").textContent).toBe("100%");
  });

  it("renders an output", () => {
    const { getByRole } = render(inside(<Graph.ZoomLevel />));

    expect(getByRole("status").tagName).toBe("OUTPUT");
  });

  it("writes the percentage in the locale it is given", () => {
    const { getByRole } = render(inside(<Graph.ZoomLevel locale="de-DE" />));

    expect(getByRole("status").textContent).toBe("100 %");
  });

  it("writes the percentage in the nearest locale provider's locale", () => {
    const { getByRole } = render(scoped("de-DE", inside(<Graph.ZoomLevel />)));

    expect(getByRole("status").textContent).toBe("100 %");
  });

  it("writes the percentage in the locale it is given over the provider's", () => {
    const { getByRole } = render(scoped("de-DE", inside(<Graph.ZoomLevel locale="en-US" />)));

    expect(getByRole("status").textContent).toBe("100%");
  });
});
