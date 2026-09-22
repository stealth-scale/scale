import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  useGroupAbout,
  useGroupName,
  useSectionAbout,
  useSectionName,
  useWording,
  useWordings,
} from "#catalogue/wording.ts";

function Worded({ named, of }: { named: string | undefined; of: string }): ReactElement {
  const word = useWording(named);

  return <output>{word(of)}</output>;
}

function Grouped({ of }: { of: string }): ReactElement {
  const named = useGroupName();

  return <output>{named(of)}</output>;
}

function Wordings({ named, of }: { named: string | undefined; of: string }): ReactElement {
  const word = useWordings();

  return <output>{word(named, of)}</output>;
}

function GroupAbout({ of }: { of: string }): ReactElement {
  const about = useGroupAbout();

  return <output>{about(of)}</output>;
}

function Sectioned({ of }: { of: string }): ReactElement {
  const named = useSectionName();

  return <output>{named(of)}</output>;
}

function SectionAbout({ of }: { of: string }): ReactElement {
  const about = useSectionAbout();

  return <output>{about(of)}</output>;
}

describe("useWording", () => {
  it("resolves a key through any namespace named at the call", () => {
    const { getByRole } = render(<Wordings named="specimen" of="rail.label" />);

    expect(getByRole("status").textContent).toBe("Catalogue");
  });

  it("resolves a key in the catalogue's own namespace where the call names none", () => {
    const { getByRole } = render(<Wordings named={undefined} of="rail.label" />);

    expect(getByRole("status").textContent).toBe("Catalogue");
  });

  it("resolves a key in the catalogue's own namespace where the page names none", () => {
    const { getByRole } = render(<Worded named={undefined} of="rail.label" />);

    expect(getByRole("status").textContent).toBe("Catalogue");
  });

  it("resolves a key in the catalogue's own namespace where the page names an empty one", () => {
    const { getByRole } = render(<Worded named="" of="rail.label" />);

    expect(getByRole("status").textContent).toBe("Catalogue");
  });

  it("resolves a key through the namespace the page names", () => {
    const { getByRole } = render(<Worded named="specimen" of="rail.label" />);

    expect(getByRole("status").textContent).toBe("Catalogue");
  });

  it("returns a key the namespace has no entry for as written", () => {
    const { getByRole } = render(<Worded named={undefined} of="A plain title" />);

    expect(getByRole("status").textContent).toBe("A plain title");
  });
});

describe("useGroupName", () => {
  it("heads a group nobody translated by its name", () => {
    const { getByRole } = render(<Grouped of="Actions" />);

    expect(getByRole("status").textContent).toBe("Actions");
  });

  it("heads the pages that name no group with the catalogue's own words", () => {
    const { getByRole } = render(<Grouped of="" />);

    expect(getByRole("status").textContent).toBe("Other");
  });
});

describe("useGroupAbout", () => {
  it("opens a group's index with the sentence written for it", () => {
    const { getByRole } = render(<GroupAbout of="a11y" />);

    expect(getByRole("status").textContent).toContain("The parts a reader never sees");
  });

  it("leaves a group nobody wrote a sentence for without one", () => {
    const { getByRole } = render(<GroupAbout of="Actions" />);

    expect(getByRole("status").textContent).toBe("");
  });

  it("leaves the pages that name no group without one", () => {
    const { getByRole } = render(<GroupAbout of="" />);

    expect(getByRole("status").textContent).toBe("");
  });
});

describe("useSectionName", () => {
  it("heads a section with the words written for it", () => {
    const { getByRole } = render(<Sectioned of="components" />);

    expect(getByRole("status").textContent).toBe("Components");
  });

  it("heads a section nobody translated by its name", () => {
    const { getByRole } = render(<Sectioned of="patterns" />);

    expect(getByRole("status").textContent).toBe("patterns");
  });

  it("names no section for a page that sits in none", () => {
    const { getByRole } = render(<Sectioned of="" />);

    expect(getByRole("status").textContent).toBe("");
  });
});

describe("useSectionAbout", () => {
  it("opens a section's index with the sentence written for it", () => {
    const { getByRole } = render(<SectionAbout of="components" />);

    expect(getByRole("status").textContent).toContain("Every control and surface");
  });

  it("leaves a section nobody wrote a sentence for without one", () => {
    const { getByRole } = render(<SectionAbout of="patterns" />);

    expect(getByRole("status").textContent).toBe("");
  });

  it("leaves a page that sits in no section without one", () => {
    const { getByRole } = render(<SectionAbout of="" />);

    expect(getByRole("status").textContent).toBe("");
  });
});
