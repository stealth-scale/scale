import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { accounts, framed, opened, picked } from "#combobox/combobox.fixtures.tsx";

/**
 * Words of the empty message the cases render.
 */
const NONE = "No account matches.";

describe("Empty", () => {
  it("renders nothing while a row matches", async () => {
    await drawn(picked({}, { empty: NONE }));
    await opened();

    expect(screen.queryByText(NONE)).toBeNull();
  });

  it("renders its words as an option while no row matches", async () => {
    const { container } = await drawn(picked({ collection: accounts([]) }, { empty: NONE }));

    await opened();

    expect(within(container).getByText(NONE).getAttribute("role")).toBe("option");
  });

  it("disables the option it renders", async () => {
    const { container } = await drawn(picked({ collection: accounts([]) }, { empty: NONE }));

    await opened();

    expect(within(container).getByText(NONE).getAttribute("aria-disabled")).toBe("true");
  });

  it("announces its words as it appears", async () => {
    await drawn(picked({ collection: accounts([]) }, { empty: "Nothing matches the text." }));
    await opened();
    await framed();

    expect(document.querySelector('[aria-live="polite"]')?.textContent).toBe(
      "Nothing matches the text.",
    );
  });
});
