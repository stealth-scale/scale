# @stealthscale/component-modals

Renders what the page waits for: a dialog, a drawer, a palette, a tour. Every component binds a
recipe and sets no styles of its own, so a theme restyles all of them by extending the recipe. The
preset under `./theme` registers the recipes with an application's compiler.

## Install

```bash
pnpm add @stealthscale/component-modals
```

The package peers on `react`, `@stealthscale/hooks`, `@stealthscale/theme` and
`@stealthscale/component-collections`. An application lists the preset under `./theme` among the
presets its compiler installs.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component renders with `as`.

## Command

`Command` renders a palette that filters a list of commands as the reader types, and runs the
command the reader picks.

```tsx
import { SearchIcon, XIcon } from "lucide-react";

import { Command } from "@stealthscale/component-modals";

<Command.Root actions={actions} aria-label="Commands" onRun={run}>
  <Command.Input indicator={<SearchIcon size="100%" />} placeholder="Type a command">
    <Command.Clear aria-label="Clear the query">
      <XIcon size="100%" />
    </Command.Clear>
  </Command.Input>
  <Command.List>
    <Command.Empty>No command matches</Command.Empty>
  </Command.List>
</Command.Root>;
```

| Axis      | Values                                                            | Default   |
| --------- | ----------------------------------------------------------------- | --------- |
| `size`    | `sm`, `md`, `lg`                                                  | `md`      |
| `palette` | `primary`, `secondary`, `accent`, `neutral` and the four statuses | `neutral` |

| Part    | Element  | What it renders                                                 |
| ------- | -------- | --------------------------------------------------------------- |
| `Root`  | `div`    | The panel, the palette state and the listbox machine            |
| `Input` | `div`    | The query bar: the glyph, the field and the controls after it   |
| `Clear` | `button` | The control that empties the query, while the field has one     |
| `List`  | `div`    | The scrolling list of matching commands, grouped by heading     |
| `Empty` | `p`      | The message the list shows in place of the rows when none match |

Actions go in as data, because the palette filters and regroups them on every keystroke. An action
has these members:

| Member     | What it is                                                             |
| ---------- | ---------------------------------------------------------------------- |
| `label`    | The text of the row, which the query matches and a screen reader reads |
| `value`    | The value `onRun` receives when the action runs                        |
| `group`    | The heading the action is listed under                                 |
| `icon`     | The glyph before the label                                             |
| `keywords` | Extra terms the query matches, so `add` finds `New document`           |
| `shortcut` | The keystroke that runs the action without the palette                 |
| `disabled` | Whether the action is listed and cannot run                            |

- The root takes `actions`, `aria-label` for the list, `onRun`, `query` to open with a query, and
  `count`, which formats the number of matches the palette announces after each keystroke. `count`
  writes English by default.
- The field keeps focus. The up and down arrows move the highlight, the machine points
  `aria-activedescendant` at the highlighted row, and Enter runs it. Home and End move the caret.
- Matching ignores case and accents, so `jose` finds `José`, and reads `keywords` beside `label`.
- Headings keep the order of their first action, so the caller orders the groups by ordering the
  actions. An action without a group is listed without a heading.
- `Command.Empty` goes inside `Command.List`, which renders it in place of the rows only while no
  action matches.
- `Command.Clear` renders only while the field has a query. Pressing it empties the query and moves
  focus back to the field.
- The bar draws the focus ring inside its edge while the field has keyboard focus. The palette sets
  the `palette`, which the highlighted row and the ring read.
- The listbox renders the rows, and the root passes its `size` to the listbox, so the rows follow
  the palette's size.
- The package renders the panel alone. Place it in a dialog to open it over the page.
