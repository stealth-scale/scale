/**
 * Catalogue page for the roving focus group.
 *
 * @remarks
 *   Three hand-written scenes render the `orientation` axis, because each orientation needs its own
 *   layout and an example cannot read `props.orientation`. The toolbar scene renders the group at
 *   rest and inside `Focused`, which renders the focus ring on the item with the tab stop without
 *   taking focus. The arrow keys and `wrap` only act under a keyboard, so each scene names the
 *   keys. Every scene renders a component from `examples/` and shows that file as its source. The
 *   words are keys under `roving-focus` in `locales/en/specimen/roving-focus.json`.
 */

import { type ReactElement } from "react";

import { Board, Focused, Room, Sample, type Scene, specimen } from "@stealthscale/specimen";

import * as filters from "#roving-focus/examples/filters.example.tsx";
import * as formatting from "#roving-focus/examples/formatting.example.tsx";
import * as tools from "#roving-focus/examples/tools.example.tsx";

/**
 * Renders the formatting toolbar at rest and in the keyboard-focus state.
 */
function Toolbar(): ReactElement {
  return (
    <Board>
      <Sample knob="state" of="rest">
        <formatting.Formatting />
      </Sample>
      <Sample knob="state" of="focus">
        <Focused>
          <formatting.Formatting />
        </Focused>
      </Sample>
    </Board>
  );
}

/**
 * Renders the vertical toolbar at its own width in a sample.
 */
function Vertical(): ReactElement {
  return (
    <Sample>
      <tools.Tools />
    </Sample>
  );
}

/**
 * Renders the filters in a 320px room, where they wrap onto three lines.
 */
function Both(): ReactElement {
  return (
    <Room size="xs">
      <filters.Filters />
    </Room>
  );
}

/**
 * Hand-written scene for a horizontal group that wraps at its ends.
 */
export const toolbar: Scene = {
  about: "roving-focus.toolbar.about",
  axes: ["orientation"],
  draw: Toolbar,
  example: formatting,
  title: "roving-focus.toolbar.title",
};

/**
 * Hand-written scene for a vertical group.
 */
export const vertical: Scene = {
  about: "roving-focus.vertical.about",
  axes: ["orientation"],
  draw: Vertical,
  example: tools,
  title: "roving-focus.vertical.title",
};

/**
 * Hand-written scene for a group that responds to both arrow axes.
 */
export const both: Scene = {
  about: "roving-focus.both.about",
  axes: ["orientation"],
  draw: Both,
  example: filters,
  title: "roving-focus.both.title",
};

export default specimen({
  about: "roving-focus.about",
  id: "components/a11y/roving-focus",
  imports: 'import { RovingFocus } from "@stealthscale/component-a11y";',
  scenes: [toolbar, vertical, both],
  title: "roving-focus.title",
});
