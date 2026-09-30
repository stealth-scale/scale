import { Accessibility, AutoScroller, Cursor, Feedback, PreventSelection } from "@dnd-kit/dom";
import { describe, expect, it } from "vitest";

import { pluginsOf } from "#sortable/plugins.ts";
import { stateOf } from "#sortable/sortable.fixtures.tsx";

const DEFAULTS = [Accessibility, AutoScroller, Cursor, Feedback, PreventSelection];

describe("plugins", () => {
  it("configures the accessibility plugin with the kit's announcements", () => {
    const [accessibility] = pluginsOf(() => stateOf())(DEFAULTS);

    expect(accessibility).toMatchObject({ plugin: Accessibility });
  });

  it("asks the feedback plugin for a copy of the row it leaves", () => {
    const plugins = pluginsOf(() => stateOf())(DEFAULTS);

    expect(plugins[3]).toMatchObject({ options: { feedback: "clone" }, plugin: Feedback });
  });

  it("keeps the other plugins as dnd-kit gives them", () => {
    const plugins = pluginsOf(() => stateOf())(DEFAULTS);

    expect([plugins[1], plugins[2], plugins[4]]).toStrictEqual([
      AutoScroller,
      Cursor,
      PreventSelection,
    ]);
  });
});
