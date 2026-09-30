import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Items } from "#tags-input/items.tsx";
import { Root, type RootProps } from "#tags-input/root.tsx";

/**
 * Renders a root whose items write each tag and its position as text.
 *
 * @param props - The props of the root.
 * @returns The tags input.
 */
function listed(props: RootProps): ReactElement {
  return (
    <Root {...props}>
      <Items>
        {(value, index) => <span data-testid="tag">{`${String(index)} ${value}`}</span>}
      </Items>
    </Root>
  );
}

describe("Items", () => {
  it("calls the render function once per tag with its position", async () => {
    await drawn(listed({ defaultValue: ["Bridge Ledger", "Halden & Co"] }));

    expect(screen.getAllByTestId("tag").map((tag) => tag.textContent)).toStrictEqual([
      "0 Bridge Ledger",
      "1 Halden & Co",
    ]);
  });

  it("renders a repeated tag once per occurrence", async () => {
    await drawn(listed({ allowDuplicates: true, defaultValue: ["Pinecrest", "Pinecrest"] }));

    expect(screen.getAllByTestId("tag")).toHaveLength(2);
  });

  it("renders nothing while there are no tags", async () => {
    await drawn(listed({}));

    expect(screen.queryAllByTestId("tag")).toStrictEqual([]);
  });
});
