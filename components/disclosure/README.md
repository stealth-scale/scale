# @stealthscale/component-disclosure

React components that show and hide content, styled by the theme's recipes.

| Component     | Renders                                               |
| ------------- | ----------------------------------------------------- |
| `Collapsible` | A trigger that shows and hides the content beneath it |
| `Tabs`        | A list of tabs and the panel of the selected tab      |
| `Popover`     | A panel anchored to its trigger                       |
| `Tooltip`     | A short label shown on hover and focus                |
| `Menu`        | A list of actions and options opened from a trigger   |

Every value a theme can change is an axis of a component's recipe. Set it as a prop, and write no
style. Change the element a component renders with `as`. A component with parts is exported as a
namespace, such as `Menu.Root`.

## Install

```bash
pnpm add @stealthscale/component-disclosure
```

The package peers on `react`, `@stealthscale/hooks` and `@stealthscale/theme`, and depends on the
Zag state machines. List the preset under `./theme` among the presets your compiler installs.

## Collapsible

`Collapsible` renders a trigger that shows and hides the content beneath it.

```tsx
import { ChevronDownIcon } from "lucide-react";

import { Collapsible } from "@stealthscale/component-disclosure";

<Collapsible.Root variant="outline">
  <Collapsible.Trigger>
    Delivery details
    <Collapsible.Indicator>
      <ChevronDownIcon size="100%" />
    </Collapsible.Indicator>
  </Collapsible.Trigger>
  <Collapsible.Content>Arrives Thursday.</Collapsible.Content>
</Collapsible.Root>;
```

| Axis      | Values                                                            | Default   |
| --------- | ----------------------------------------------------------------- | --------- |
| `variant` | `subtle`, `surface`, `outline`, `plain`                           | `plain`   |
| `size`    | `xs` to `4xl`                                                     | `md`      |
| `palette` | `primary`, `secondary`, `accent`, `neutral` and the four statuses | `neutral` |
| `motion`  | `slide`, `fade`, `none`                                           | `slide`   |

| Part        | Element  | What it renders                               |
| ----------- | -------- | --------------------------------------------- |
| `Root`      | `div`    | The root, and the machine its parts share     |
| `Trigger`   | `button` | The button that shows and hides the content   |
| `Content`   | `div`    | The content                                   |
| `Indicator` | `span`   | The mark that turns while the content is open |

- The root takes the machine's settings: `open`, `defaultOpen`, `onOpenChange`, `disabled`,
  `collapsedHeight`, `onExitComplete`, `id` and `dir`.
- `collapsedHeight` keeps part of the closed content visible, such as `"2lh"` for two lines.
- Pass `id` to the root for a stable id in tests or server rendering. The machine derives the
  trigger's `aria-controls` from it, so the root takes no element `id`.
- The machine sets `aria-expanded` and `aria-controls` on the trigger, and `hidden` on closed
  content, so a control inside closed content leaves the tab order.
- The indicator sets `aria-hidden` and turns 180 degrees while the content is open. Reduced motion
  removes the transition.
- Content that starts open does not animate in, because the machine sets its open state from the
  first animation frame.
- The size sets the trigger on the control scale, so its height matches a button of the same size.
  The palette tints the subtle, surface and outline looks.

## Tabs

`Tabs` renders a list of tabs and the panel of the selected tab.

```tsx
import { Tabs } from "@stealthscale/component-disclosure";

<Tabs.Root defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="overview">The balance and the owners of the account.</Tabs.Content>
  <Tabs.Content value="activity">The payments of the last thirty days.</Tabs.Content>
</Tabs.Root>;
```

| Axis      | Values                                                            | Default |
| --------- | ----------------------------------------------------------------- | ------- |
| `variant` | `line`, `enclosed`, `subtle`, `plain`                             | `line`  |
| `size`    | `xs` to `4xl`                                                     | `md`    |
| `palette` | `primary`, `secondary`, `accent`, `neutral` and the four statuses | none    |
| `justify` | `start`, `center`, `end`, `between`, `around`, `evenly`           | none    |
| `fitted`  | `true`                                                            | off     |

| Part        | Element  | What it renders                           |
| ----------- | -------- | ----------------------------------------- |
| `Root`      | `div`    | The root, and the machine its parts share |
| `List`      | `div`    | The list of tabs, with `role="tablist"`   |
| `Trigger`   | `button` | One tab, with `role="tab"`                |
| `Indicator` | `div`    | The indicator of the selected tab         |
| `Content`   | `div`    | One panel, with `role="tabpanel"`         |

- A tab and its panel take the same `value`. The machine sets every role, id and ARIA reference.
  Name the list with `aria-label` on `Tabs.List`.
- The root takes the machine's settings: `value`, `defaultValue`, `onValueChange`, `orientation`,
  `activationMode`, `loopFocus`, `deselectable` and `id`.
- `orientation` is the machine's option, not an axis. When it is `vertical`, the list turns into a
  column, the indicator moves to the inline start and the up and down arrows move between tabs.
- `activationMode="automatic"`, the default, selects a tab on focus. `manual` moves focus with the
  arrows and selects on a press, for panels that are slow to render.
- Only the selected tab is in the tab order. A panel takes `tabIndex={0}`, so Tab from the list
  lands on the selected panel, and a panel that is not selected is `hidden`.
- The machine measures the selected tab and positions the indicator. The indicator is `hidden` until
  the first measurement.
- `fitted` shares the list's width equally between the tabs. `justify` distributes the tabs in a
  list wider than they are.
- The palette colours the line indicator, the subtle indicator and the selected tab's text.

## Popover

`Popover` renders a panel beside its trigger, with a title, a description and a close button.

```tsx
import { ChevronDownIcon, XIcon } from "lucide-react";

import { Popover } from "@stealthscale/component-disclosure";

<Popover.Root>
  <Popover.Trigger>
    Filters
    <Popover.Indicator>
      <ChevronDownIcon size="1em" />
    </Popover.Indicator>
  </Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content>
      <Popover.Arrow>
        <Popover.ArrowTip />
      </Popover.Arrow>
      <Popover.Title>Filter the list</Popover.Title>
      <Popover.Description>Only rows matching all of these are shown.</Popover.Description>
      <Popover.CloseTrigger aria-label="Close the filters">
        <XIcon />
      </Popover.CloseTrigger>
    </Popover.Content>
  </Popover.Positioner>
</Popover.Root>;
```

| Axis      | Values                         | Default   |
| --------- | ------------------------------ | --------- |
| `variant` | `surface`, `elevated`, `glass` | `surface` |
| `size`    | `xs` to `4xl`                  | `md`      |

| Part           | Element  | What it renders                                                 |
| -------------- | -------- | --------------------------------------------------------------- |
| `Root`         | `div`    | A `display: contents` element that provides the variants        |
| `Anchor`       | `div`    | The element the panel is positioned against, if not the trigger |
| `Trigger`      | `button` | The button that opens and closes the panel                      |
| `Indicator`    | `span`   | The mark that turns while the panel is open                     |
| `Positioner`   | `div`    | The element the machine positions beside the trigger            |
| `Content`      | `div`    | The panel, with `role="dialog"`                                 |
| `Title`        | `h2`     | The heading that names the panel                                |
| `Description`  | `p`      | The text that describes the panel                               |
| `CloseTrigger` | `button` | The button that closes the panel                                |
| `Arrow`        | `div`    | The element the machine places against the panel's edge         |
| `ArrowTip`     | `div`    | The arrow's rotated square                                      |

- The root takes the machine's settings: `open`, `defaultOpen`, `onOpenChange`, `modal`,
  `autoFocus`, `initialFocusEl`, `finalFocusEl`, `closeOnEscape`, `closeOnInteractOutside`,
  `persistentElements`, `positioning` and `id`.
- The trigger sets `aria-expanded` and `aria-controls`. The panel sets `aria-labelledby` to the
  title and `aria-describedby` to the description.
- The panel takes focus as it opens and returns it to the trigger as it closes. Escape and a press
  outside close it. `modal` traps focus and hides the rest of the page from a screen reader.
- The close trigger's accessible name is "close" unless you pass `aria-label`.
- The title is an `h2`. Pass another heading level through `as` to fit the page's outline.
- The size sets the panel's padding, the title and the description, and the panel is at least as
  wide as the trigger.
- A press on the trigger of another popover or menu closes this panel and opens the other. A popover
  opened from inside another popover's panel closes with it.
- The package does not portal. Wrap `Popover.Positioner` in a portal when an ancestor clips the
  panel.

## Tooltip

`Tooltip` renders a short label beside a control, shown on hover and on keyboard focus.

```tsx
import { SaveIcon } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { Tooltip } from "@stealthscale/component-disclosure";

<Tooltip.Root>
  <Tooltip.Trigger as={IconButton} aria-label="Save">
    <SaveIcon />
  </Tooltip.Trigger>
  <Tooltip.Positioner>
    <Tooltip.Content>
      <Tooltip.Arrow>
        <Tooltip.ArrowTip />
      </Tooltip.Arrow>
      Saves without closing
    </Tooltip.Content>
  </Tooltip.Positioner>
</Tooltip.Root>;
```

| Axis      | Values                | Default    |
| --------- | --------------------- | ---------- |
| `variant` | `inverted`, `surface` | `inverted` |
| `size`    | `xs` to `4xl`         | `md`       |

| Part         | Element  | What it renders                                           |
| ------------ | -------- | --------------------------------------------------------- |
| `Root`       | `div`    | A `display: contents` element that provides the variants  |
| `Trigger`    | `button` | The control the tooltip describes                         |
| `Positioner` | `div`    | The element the machine positions beside the trigger      |
| `Content`    | `div`    | The label, with `role="tooltip"`                          |
| `Arrow`      | `div`    | The element the machine places against the content's edge |
| `ArrowTip`   | `div`    | The arrow's rotated square                                |

- The root takes the machine's settings: `open`, `defaultOpen`, `onOpenChange`, `openDelay`,
  `closeDelay`, `disabled`, `interactive`, `closeOnClick`, `closeOnEscape`, `closeOnScroll`,
  `closeOnPointerDown`, `positioning` and `id`.
- The trigger sets `aria-describedby` to the content's id, so a screen reader reads the label as the
  control's description.
- Keyboard focus opens the tooltip, and pointer focus does not. Escape, a scroll and a press on the
  control close it.
- The trigger is a `button` by default, so it takes keyboard focus. Pass another control with `as`.
- Set `interactive` when the content contains a link, so a pointer can move into it.
- The content sets `--tooltip-surface`, and the arrow tip reads it.
- The package does not portal. Wrap the positioner in a portal when an ancestor clips it:

```tsx
import { Portal } from "@stealthscale/component-primitives";

<Portal>
  <Tooltip.Positioner>…</Tooltip.Positioner>
</Portal>;
```

## Menu

`Menu` renders a panel of actions and options, opened from a button, from a right click on a region,
or from a row of another menu.

```tsx
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Menu } from "@stealthscale/component-disclosure";

<Menu.Root>
  <Menu.Trigger as={Button}>
    Actions
    <Menu.Indicator>
      <ChevronDownIcon size="1em" />
    </Menu.Indicator>
  </Menu.Trigger>
  <Menu.Positioner>
    <Menu.Content>
      <Menu.Item value="rename">Rename</Menu.Item>
      <Menu.Item value="duplicate">Duplicate</Menu.Item>
      <Menu.Separator />
      <Menu.Item tone="critical" value="delete">
        Delete
      </Menu.Item>
    </Menu.Content>
  </Menu.Positioner>
</Menu.Root>;
```

| Axis        | Values                                                            | Default   |
| ----------- | ----------------------------------------------------------------- | --------- |
| `variant`   | `surface`, `elevated`, `glass`                                    | `surface` |
| `size`      | `sm`, `md`, `lg`                                                  | `md`      |
| `highlight` | `tint`, `fill`, `bar`                                             | `tint`    |
| `palette`   | `primary`, `secondary`, `accent`, `neutral` and the four statuses | `neutral` |
| `inset`     | `true`                                                            | off       |

| Part              | Element  | What it renders                                              |
| ----------------- | -------- | ------------------------------------------------------------ |
| `Root`            | `div`    | A `display: contents` element that provides the variants     |
| `Trigger`         | `button` | The button that opens and closes the menu                    |
| `ContextTrigger`  | `div`    | The region that opens the menu on a right click              |
| `Indicator`       | `span`   | The mark that turns while the menu is open                   |
| `Positioner`      | `div`    | The element the machine positions beside the trigger         |
| `Content`         | `div`    | The panel, with `role="menu"`                                |
| `Item`            | `div`    | A row, with `role="menuitem"`                                |
| `OptionItem`      | `div`    | A checkbox or radio row                                      |
| `TriggerItem`     | `button` | A row that opens a submenu                                   |
| `ItemGroup`       | `div`    | A group of rows, with `role="group"`                         |
| `ItemGroupLabel`  | `div`    | The label that names a group                                 |
| `ItemMark`        | `span`   | The square at a row's start that shows an initial or an icon |
| `ItemLines`       | `span`   | The column that stacks a row's text over its description     |
| `ItemText`        | `span`   | The text of a row                                            |
| `ItemDescription` | `span`   | The line under a row's text                                  |
| `ItemIndicator`   | `span`   | The check at the end of a checked row                        |
| `ItemCommand`     | `kbd`    | The shortcut at the end of a row                             |
| `Separator`       | `div`    | The rule between two rows, with `role="separator"`           |
| `Arrow`           | `div`    | The element the machine places against the panel's edge      |
| `ArrowTip`        | `div`    | The arrow's rotated square                                   |

- The root takes the machine's settings: `open`, `defaultOpen`, `onOpenChange`, `onSelect`,
  `highlightedValue`, `defaultHighlightedValue`, `onHighlightChange`, `closeOnSelect`, `loopFocus`,
  `typeahead`, `navigate`, `positioning`, `triggerValue`, `onTriggerValueChange`, `aria-label`, `id`
  and `dir`, and the dismiss handlers such as `onEscapeKeyDown`.
- The trigger sets `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`. The panel takes
  focus as it opens and keeps it. `aria-activedescendant` points a screen reader at the highlighted
  row.
- The up and down arrows, Home and End move the highlight, and typing the start of a row's text
  moves it to that row. Enter and Space select the highlighted row. Escape closes the menu and its
  submenus and returns focus to the trigger.
- A checkbox row keeps the menu open when selected, and every other row closes it. `closeOnSelect`
  on a row overrides either.
- `Menu.OptionItem` takes `type`, `checked` and `onCheckedChange`. The caller keeps the checked
  state and updates it in `onCheckedChange`.
- `Menu.ItemIndicator` renders at the row's end in any source order, and keeps its room while the
  row is unchecked, so checking a row does not change the panel's width.
- `Menu.ItemGroup` and `Menu.ItemGroupLabel` take the same `value`, and the group sets
  `aria-labelledby` to the label. `Menu.ItemMark` sets `aria-hidden`.
- `tone="critical"` sets a row in the error palette. The panel sets the `palette`, and every row and
  the highlight inherit it.
- A row sizes the `svg` it starts with to the icon size one size smaller than the row. `inset` pads
  a row that starts with neither an icon nor a `Menu.ItemMark` by the room an icon and its gap take,
  so its text starts where the text of an icon row starts.
- A `Menu.Root` inside another menu's content is a submenu, and its `Menu.TriggerItem` is a row of
  the parent. The submenu takes the parent's variants and `dir` unless it sets its own.
  `Menu.TriggerItem` throws outside a submenu.
- A submenu opens beside the parent's panel, level with its row, at `right-start` in a left-to-right
  document and at `left-start` in a right-to-left one. The machine sets that placement over the
  submenu's own `positioning.placement`. `Menu.Indicator` mirrors in a right-to-left menu, so a
  submenu row's chevron points to the side the submenu opens on.
- A press on the trigger of another menu or popover closes this menu and opens the other. A submenu
  closes with its menu.
- `Menu.ContextTrigger` opens the menu at the pointer on a right click, and on a 700 ms press from
  touch or a pen. It stops the browser's own menu. The machine positions a context menu once, as it
  opens. Give the region `tabIndex={0}` or render it as a focusable element, so Shift+F10 opens the
  menu from the keyboard.
- The panel is at least `sizes.44` wide and grows to its widest row. Pass
  `positioning={{ sameWidth: true }}` to size the positioner to the trigger's width. The panel's
  height stops at the room left in the window, and the panel scrolls.
- The panel takes the `dropdown` z-index plus its depth in the nest, so a submenu renders above its
  parent.
- The package does not portal. Wrap `Menu.Positioner` in a portal when an ancestor clips the panel.
  Wrap a submenu's positioner in a portal too, because the parent's panel scrolls and clips a
  submenu rendered inside it.

## Licence

MIT. See [LICENSE](LICENSE).
