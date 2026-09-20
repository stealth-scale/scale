import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useWording, useWordings } from "#catalogue/wording.ts";

function Worded({ named, of }: { named: string | undefined; of: string }): ReactElement {
  const word = useWording(named);

  return <output>{word(of)}</output>;
}

function Wordings({ named, of }: { named: string | undefined; of: string }): ReactElement {
  const word = useWordings();

  return <output>{word(named, of)}</output>;
}

describe("useWording", () => {
  it("resolves a key through any namespace named at the call", () => {
    const { getByRole } = render(<Wordings named="specimen" of="rail.label" />);

    expect(getByRole("status").textContent).toBe("Components");
  });

  it("resolves a key in the catalogue's own namespace where the call names none", () => {
    const { getByRole } = render(<Wordings named={undefined} of="rail.label" />);

    expect(getByRole("status").textContent).toBe("Components");
  });

  it("resolves a key in the catalogue's own namespace where the page names none", () => {
    const { getByRole } = render(<Worded named={undefined} of="rail.label" />);

    expect(getByRole("status").textContent).toBe("Components");
  });

  it("resolves a key in the catalogue's own namespace where the page names an empty one", () => {
    const { getByRole } = render(<Worded named="" of="rail.label" />);

    expect(getByRole("status").textContent).toBe("Components");
  });

  it("resolves a key through the namespace the page names", () => {
    const { getByRole } = render(<Worded named="specimen" of="rail.label" />);

    expect(getByRole("status").textContent).toBe("Components");
  });

  it("returns a key the namespace has no entry for as written", () => {
    const { getByRole } = render(<Worded named={undefined} of="A plain title" />);

    expect(getByRole("status").textContent).toBe("A plain title");
  });
});
