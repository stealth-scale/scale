import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("names every component the package publishes and nothing beside them", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Breadcrumb",
      "Link",
      "LinkPropsProvider",
      "NavList",
      "NavigationMenu",
      "Pagination",
      "Toc",
    ]);
  });

  it("publishes the navigation menu as a namespace of its parts", () => {
    expect(Object.keys(barrel.NavigationMenu).toSorted()).toStrictEqual([
      "Content",
      "Indicator",
      "Item",
      "Link",
      "List",
      "Root",
      "Trigger",
      "Viewport",
      "ViewportPositioner",
    ]);
  });

  it("publishes the pagination as a namespace of its parts", () => {
    expect(Object.keys(barrel.Pagination).toSorted()).toStrictEqual([
      "Ellipsis",
      "FirstTrigger",
      "Item",
      "Items",
      "LastTrigger",
      "NextTrigger",
      "PageText",
      "PrevTrigger",
      "Root",
    ]);
  });

  it("publishes the rail of headings as a namespace of its parts", () => {
    expect(Object.keys(barrel.Toc).toSorted()).toStrictEqual([
      "Indicator",
      "Item",
      "Link",
      "List",
      "Root",
      "Title",
    ]);
  });

  it("publishes a component with parts as a namespace of its short names", () => {
    expect(Object.keys(barrel.NavList).toSorted()).toStrictEqual([
      "Action",
      "Badge",
      "Branch",
      "Content",
      "Indicator",
      "Item",
      "Link",
      "PropsProvider",
      "Root",
      "Skeleton",
      "Trigger",
    ]);
  });

  it("publishes neither a recipe nor a binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
