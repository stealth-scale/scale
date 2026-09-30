import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { opened, picked } from "#date-picker/date-picker.fixtures.tsx";

describe("Positioner", () => {
  it("renders nothing before the panel first opens", async () => {
    const { container } = await drawn(picked());

    expect(container.querySelector(".date-picker__positioner")).toBeNull();
  });

  it("renders a div once the panel opens", async () => {
    const { container } = await drawn(picked());

    await opened();

    expect(container.querySelector(".date-picker__positioner")?.tagName).toBe("DIV");
  });

  it("renders the ID the panel's layer finds it by", async () => {
    const { container } = await drawn(picked({ id: "trip" }));

    await opened();

    expect(container.querySelector(".date-picker__positioner")?.id).toBe(
      "datepicker:trip:positioner",
    );
  });
});
