import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { marked } from "#catalogue/marked.tsx";

describe("marked", () => {
  it("draws the span between a pair of backticks as code", () => {
    const { container } = render(<p>{marked("The `glass` look.")}</p>);

    expect(container.querySelector("code")?.textContent).toBe("glass");
    expect(container.querySelector("p")?.textContent).toBe("The glass look.");
  });

  it("draws every pair in the sentence", () => {
    const { container } = render(<p>{marked("`size` beside `variant`, and `size` again.")}</p>);

    expect(
      Array.from(container.querySelectorAll("code"), (code) => code.textContent),
    ).toStrictEqual(["size", "variant", "size"]);
  });

  it("leaves a sentence with no backticks as it was", () => {
    const { container } = render(<p>{marked("Plain words.")}</p>);

    expect(container.querySelector("code")).toBeNull();
    expect(container.querySelector("p")?.textContent).toBe("Plain words.");
  });

  it("keeps a backtick with no partner in the words as written", () => {
    const { container } = render(<p>{marked("An odd ` mark.")}</p>);

    expect(container.querySelector("code")).toBeNull();
    expect(container.querySelector("p")?.textContent).toBe("An odd ` mark.");
  });
});
