import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#toc/index.ts";
import { Indicator } from "#toc/indicator.tsx";
import { Item } from "#toc/item.tsx";
import { Link } from "#toc/link.tsx";
import { List } from "#toc/list.tsx";
import { Title } from "#toc/title.tsx";

describe("index", () => {
  it("exports the six parts only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Indicator",
      "Item",
      "Link",
      "List",
      "Root",
      "Title",
    ]);
  });

  it("exports no recipe binding or machine hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|split|ApiProvider|PropsProvider)/u);
    }
  });

  it("throws for every part rendered outside Toc.Root", () => {
    expect(
      rootedViolations(
        { Indicator, Item, Link, List, Title },
        "A part of Toc was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
