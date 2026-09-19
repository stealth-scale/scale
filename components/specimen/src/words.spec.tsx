import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NAMESPACE, useWords } from "#words.ts";

function Labelled(): ReactElement {
  const { t } = useWords("rail");

  return <output>{t("label")}</output>;
}

describe("useWords", () => {
  it("names the one namespace every word of the catalogue is in", () => {
    expect(NAMESPACE).toBe("specimen");
  });

  it("reads a word by the rest of its key under the prefix named", () => {
    const { getByRole } = render(<Labelled />);

    expect(getByRole("status").textContent).toBe("Components");
  });
});
