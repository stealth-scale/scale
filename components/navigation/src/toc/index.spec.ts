import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#toc/index.ts";
import { Indicator } from "#toc/indicator.tsx";
import { Item } from "#toc/item.tsx";
import { Link } from "#toc/link.tsx";
import { List } from "#toc/list.tsx";
import { Title } from "#toc/title.tsx";

describe("index", () => {
  it("names every part and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Indicator",
      "Item",
      "Link",
      "List",
      "Root",
      "Title",
    ]);
  });

  it("publishes neither the recipe nor the binding nor the machine", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|split|ApiProvider|PropsProvider)/u);
    }
  });

  it("refuses every part drawn outside the root that holds it together", () => {
    expect(
      rootedViolations(
        { Indicator, Item, Link, List, Title },
        "A part of Toc was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
