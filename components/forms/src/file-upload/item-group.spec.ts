import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { composed, picked, RECEIPT, STATEMENT } from "#file-upload/file-upload.fixtures.tsx";

describe("ItemGroup", () => {
  it("renders a list", async () => {
    await drawn(composed({ defaultAcceptedFiles: [STATEMENT] }));

    expect(screen.getAllByRole("list")[0]?.tagName).toBe("UL");
  });

  it("marks the list of accepted files by default", async () => {
    await drawn(composed({ defaultAcceptedFiles: [STATEMENT] }));

    expect(screen.getAllByRole("list")[0]?.dataset["type"]).toBe("accepted");
  });

  it("renders the refused files for type rejected", async () => {
    const { container } = await drawn(composed({ accept: "application/pdf" }));

    await picked(container, [RECEIPT]);

    expect(container.querySelector("[data-type='rejected'] li")?.textContent).toContain(
      "receipt.png",
    );
  });
});
