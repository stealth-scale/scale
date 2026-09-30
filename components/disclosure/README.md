# @stealthscale/component-disclosure

React components that show and hide content, styled by the theme's recipes.

| Component     | Renders                                                         |
| ------------- | --------------------------------------------------------------- |
| `Collapsible` | A trigger that shows and hides the content beneath it           |
| `Details`     | A native `details` element the browser opens and closes         |
| `Accordion`   | A column of headings whose triggers show and hide their content |
| `Tabs`        | A list of tabs and the panel of the selected tab                |
| `Steps`       | A flow in steps, the current step's content and its buttons     |
| `Popover`     | A panel anchored to its trigger                                 |
| `Tooltip`     | A short label shown on hover and focus                          |
| `Truncate`    | Text clipped to its lines, with the whole text in a tooltip     |
| `ToggleTip`   | A short note beside its trigger, opened by a press              |
| `HoverCard`   | A card beside a link that previews what the link leads to       |
| `Menu`        | A list of actions and options opened from a trigger             |
| `Menubar`     | A row of menus along the top of an application                  |

Every value a theme can change is an axis of a component's recipe. Set it as a prop, and write no
style. Change the element a component renders with `as`. A component with parts is exported as a
namespace, such as `Menu.Root`.

## Install

```bash
pnpm add @stealthscale/component-disclosure
```

The package peers on `react`, `@stealthscale/hooks`, `@stealthscale/theme`,
`@stealthscale/component-a11y` and `@stealthscale/component-primitives`, and depends on the Zag
state machines. List the preset under `./theme` among the presets your compiler installs.

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

## Details

`Details` renders a native `details` element, which the browser opens and closes without a script.

```tsx
import { ChevronRightIcon } from "lucide-react";

import { Details } from "@stealthscale/component-disclosure";

<Details.Root>
  <Details.Summary>
    <Details.Indicator>
      <ChevronRightIcon />
    </Details.Indicator>
    How long does a refund take?
  </Details.Summary>
  <Details.Content>A refund reaches the card within 5 to 10 business days.</Details.Content>
</Details.Root>;
```

| Axis      | Values                                                            | Default   |
| --------- | ----------------------------------------------------------------- | --------- |
| `variant` | `subtle`, `surface`, `outline`, `plain`                           | `outline` |
| `size`    | `xs` to `4xl`                                                     | `md`      |
| `palette` | `primary`, `secondary`, `accent`, `neutral` and the four statuses | `neutral` |

| Part        | Element   | What it renders                               |
| ----------- | --------- | --------------------------------------------- |
| `Root`      | `details` | The root, which the browser opens             |
| `Summary`   | `summary` | The line that names it and opens it           |
| `Indicator` | `span`    | The mark that turns while the details is open |
| `Content`   | `div`     | The content                                   |

- The root takes the element's own props. `open` sets the state on the first render and whenever it
  changes, `onToggle` reports every change, and details with the same `name` form an exclusive
  group, in which opening one closes the others.
- The browser gives the summary its role, its name from its text and its expanded state, and opens
  it on a press, Enter and Space. It also opens a closed details to show a fragment the address
  points into.
- The indicator sets `aria-hidden`, goes before the words and turns a quarter clockwise while the
  details is open, a quarter the other way under `dir="rtl"`. Pass a chevron that points to the end.
  An `svg` in the indicator fills it, so the glyph scales with the size.
- The looks and the palette are the collapsible's. A one-line summary is a collapsible trigger's
  height at the same size, and a longer one grows by its lines. The plain look draws no box and pads
  no side, so its summary and content line up with the text around them. Under forced colors the
  subtle box takes a `CanvasText` outline.
- Use `Collapsible` for open state the application controls or animates. `Details` has no
  `onOpenChange` and no motion.

## Accordion

`Accordion` renders a column of headings. Each heading contains a trigger that shows and hides the
content under it.

```tsx
import { ChevronDownIcon } from "lucide-react";

import { Accordion } from "@stealthscale/component-disclosure";

<Accordion.Root collapsible defaultValue={["delivery"]}>
  <Accordion.Item value="delivery">
    <Accordion.ItemHeading>
      <Accordion.ItemTrigger>
        How long does delivery take?
        <Accordion.ItemIndicator>
          <ChevronDownIcon size="100%" />
        </Accordion.ItemIndicator>
      </Accordion.ItemTrigger>
    </Accordion.ItemHeading>
    <Accordion.ItemContent>
      <Accordion.ItemBody>Orders arrive in one to three working days.</Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
</Accordion.Root>;
```

| Axis      | Values                                                            | Default   |
| --------- | ----------------------------------------------------------------- | --------- |
| `variant` | `subtle`, `surface`, `outline`, `flushed`, `plain`                | `flushed` |
| `size`    | `sm`, `md`, `lg`                                                  | `md`      |
| `palette` | `primary`, `secondary`, `accent`, `neutral` and the four statuses | `neutral` |
| `motion`  | `slide`, `fade`, `none`                                           | `slide`   |

| Part            | Element  | What it renders                                     |
| --------------- | -------- | --------------------------------------------------- |
| `Root`          | `div`    | The root, and the machine its items share           |
| `Item`          | `div`    | One item, and the machine that animates its content |
| `ItemHeading`   | `h3`     | The heading that contains the trigger               |
| `ItemTrigger`   | `button` | The button that opens and closes the item           |
| `ItemIndicator` | `span`   | The mark that turns while the item is open          |
| `ItemContent`   | `div`    | The region the trigger shows and hides              |
| `ItemBody`      | `div`    | The padded block inside the content                 |

- The root takes the machine's settings: `value`, `defaultValue`, `onValueChange`, `multiple`,
  `collapsible`, `disabled`, `onFocusChange`, `ids`, `id` and `dir`. `value` is an array of the
  values of the open items.
- One item is open at a time. `multiple` keeps the other items open when one opens. `collapsible`
  lets a press close the open item, so that no item is open.
- The trigger sets `aria-expanded` and `aria-controls`. The content is a `region` named by its
  trigger and is `hidden` while closed, so a control inside a closed item leaves the tab order.
- ArrowDown and ArrowUp move focus to the next and the previous trigger, and Home and End move it to
  the first and the last. The keys skip a disabled trigger.
- `disabled` on the root disables every item, whatever an item sets. `disabled` on an item disables
  that item alone.
- An item's value may contain a space. The IDs built from it are percent-encoded.
- The heading is an `h3`. Pass another level through `as` to fit the page's outline.
- A button after the trigger inside the heading, such as a download action, renders at the end of
  the row and outside the trigger. The heading's accessible name then includes the button's name.
- The content animates to the height the machine measures. `ItemBody` has the padding, so put the
  words inside it. An item that starts open does not animate in, and reduced motion removes the
  animation.
- The trigger is at least a control's height and grows with a title that wraps. It sizes a leading
  `svg` one icon size smaller than the indicator.
- The subtle, surface and outline looks inset the trigger and the body from the box's edges. The
  flushed and plain looks align both with the text around the accordion.
- The machine's `orientation` is not offered, because the recipe lays the items out in a column.
  Closed content remains in the document under `hidden`.

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

## Steps

`Steps` renders a flow in steps: an ordered list of the steps, the content of the current step and
the buttons that move between steps.

```tsx
import { CheckIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Steps } from "@stealthscale/component-disclosure";

<Steps.Root count={2}>
  <Steps.List>
    <Steps.Item index={0}>
      <Steps.Trigger>
        <Steps.Indicator>
          <Steps.Status complete={<CheckIcon />} />
        </Steps.Indicator>
        <Steps.Title>Account</Steps.Title>
      </Steps.Trigger>
      <Steps.Separator />
    </Steps.Item>
    <Steps.Item index={1}>
      <Steps.Trigger>
        <Steps.Indicator />
        <Steps.Title>Amount</Steps.Title>
      </Steps.Trigger>
    </Steps.Item>
  </Steps.List>
  <Steps.Content index={0}>The account the payout leaves from.</Steps.Content>
  <Steps.Content index={1}>The amount and the invoices it pays.</Steps.Content>
  <Steps.CompletedContent>Payout queued.</Steps.CompletedContent>
  <Steps.PrevTrigger as={Button}>Back</Steps.PrevTrigger>
  <Steps.NextTrigger as={Button}>Next</Steps.NextTrigger>
</Steps.Root>;
```

| Axis             | Values                                                            | Default   |
| ---------------- | ----------------------------------------------------------------- | --------- |
| `variant`        | `solid`, `subtle`                                                 | `solid`   |
| `size`           | `sm`, `md`, `lg`                                                  | `md`      |
| `palette`        | `primary`, `secondary`, `accent`, `neutral` and the four statuses | `neutral` |
| `labelPlacement` | `beside`, `below`                                                 | `beside`  |

| Part               | Element  | What it renders                                               |
| ------------------ | -------- | ------------------------------------------------------------- |
| `Root`             | `div`    | The root, and the machine its parts share                     |
| `List`             | `ol`     | The ordered list of the steps                                 |
| `Item`             | `li`     | One step                                                      |
| `Trigger`          | `button` | The button that moves the flow to the step                    |
| `Indicator`        | `span`   | The disc, with the step's number unless it has children       |
| `Status`           | none     | The node for the step's state, or the step's number           |
| `Title`            | `span`   | The step's name, after hidden words for its state             |
| `Description`      | `span`   | The line under the title                                      |
| `Separator`        | `span`   | The rule to the next step                                     |
| `Content`          | `div`    | The content of one step, shown while the step is current      |
| `CompletedContent` | `div`    | The content shown once every step is completed                |
| `NextTrigger`      | `button` | The button that moves to the next step, and past the last one |
| `PrevTrigger`      | `button` | The button that moves to the previous step                    |

- The root takes the machine's settings: `count`, `step`, `defaultStep`, `onStepChange`,
  `onStepComplete`, `linear`, `isStepValid`, `isStepSkippable`, `onStepInvalid`, `orientation`,
  `ids`, `id` and `dir`. `step` counts from zero, and `count` marks the flow as completed.
- The list is an `ol`, and `Title` renders "Completed: " or "Current: " visually hidden before the
  name, as the W3C's tutorial on multi-page forms marks a progress list. Pass other words through
  `completedLabel` and `currentLabel`. Render a `Title` in every item, because it contains the words
  for the state.
- The machine's tab semantics are dropped: the list is not a `tablist`, a trigger is not a `tab` and
  a content is not a `tabpanel`. Every trigger is in the tab order, and Tab moves between them.
- A press on a trigger moves to its step. Moving past the current step asks `isStepValid` first, and
  a refusal calls `onStepInvalid`.
- With `linear`, a trigger moves back to a completed step, and the trigger of a later step is
  disabled.
- `NextTrigger` and `PrevTrigger` set `aria-disabled` at the ends of the flow in place of
  `disabled`, so the button keeps focus after the press that ended the flow. Pass the library's
  `Button` through `as` for a button's look.
- `Steps.Status` swaps the disc's number by state. Pass `complete={<CheckIcon />}` for a check on
  completed steps. An item without a trigger shows progress without navigation.
- `orientation="vertical"` stacks the steps in a column beside the content, with a rule under each
  disc.
- `labelPlacement="below"` centres each title under its disc and shares the row equally between the
  steps. With `beside`, the list measures its steps at their natural width whenever its size
  changes, and places the titles below the discs while they do not fit.
- The discs measure 36, 40 and 44px at `sm`, `md` and `lg`. Under forced colors a completed disc
  fills with `Highlight` and the current disc takes a `Highlight` ring.
- The machine's `getProgressProps` is not offered. Render the feedback package's `Progress` beside
  the steps for a bar.

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
- The panel is not in the document until it first opens, and leaves once its exit animation ends.
  `lazyMount` and `unmountOnExit` are true by default. Pass `false` to keep the closed panel
  rendered under `hidden`. The panel is `inert` while it leaves. `skipAnimationOnMount` and
  `onExitComplete` go to the root as well.
- The trigger sets `aria-expanded` and `aria-controls`. While a `Title` is mounted the panel sets
  `aria-labelledby` to it, and while a `Description` is mounted `aria-describedby`, in a panel that
  mounts on opening too. A panel without a title takes `aria-label`.
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
- The content is not in the document until it first opens, and leaves once its exit animation ends.
  `lazyMount` and `unmountOnExit` are true by default, and the content is `inert` while it leaves.
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

## Truncate

`Truncate` clips text to a number of lines with an ellipsis, and shows the whole text in a tooltip
while something is cut off.

```tsx
import { Truncate } from "@stealthscale/component-disclosure";

<Truncate>{shipment.note}</Truncate>;
<Truncate focusable lines={2}>
  {ticket.description}
</Truncate>;
```

| Prop        | Values                   | Default  |
| ----------- | ------------------------ | -------- |
| `children`  | the whole text, a string | required |
| `lines`     | a positive whole number  | `1`      |
| `focusable` | `true`, `false`          | `false`  |

- The text is measured whenever it or its parent resizes. While something is cut off the text takes
  `data-truncated` and the tooltip opens on hover. Text that fits renders no tooltip and no tab
  stop.
- `focusable` gives clipped text a tab stop, and keyboard focus opens the tooltip.
- A clamp clips the paint and not the document, so a screen reader reads the whole text once. The
  text drops the tooltip's `aria-describedby`, and the tooltip's content is `aria-hidden`.
- The tooltip opens under the start of the text, in a portal. A scroll does not close it, because a
  Tab onto text below the fold scrolls the page as it opens the tooltip.
- In a flex row the text shrinks to the room its siblings leave and clips there. A word longer than
  the line breaks and clips as well.
- The root is a `span`, which is valid inside a paragraph or a table cell. The text is a block box,
  because a clamp does not apply to an inline one.
- The recipe has no axis. The text takes its size from the text around it, and the focus ring of a
  tab stop is outside the text.
- A touch screen does not open the tooltip. Where a touch reader needs the whole text, show it in
  full or behind a control.

Not offered: an expand control and a clamp at the start of the text.

## ToggleTip

`ToggleTip` renders a short note beside its trigger, opened and closed by a press. It looks like a
tooltip and opens like a popover, so it works on a touch screen and can contain a link.

```tsx
import { InfoIcon } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { ToggleTip } from "@stealthscale/component-disclosure";
import { Portal } from "@stealthscale/component-primitives";

<ToggleTip.Root>
  <ToggleTip.Trigger as={IconButton} aria-label="About chargebacks">
    <InfoIcon />
  </ToggleTip.Trigger>
  <Portal>
    <ToggleTip.Positioner>
      <ToggleTip.Content>
        <ToggleTip.Arrow>
          <ToggleTip.ArrowTip />
        </ToggleTip.Arrow>
        A payment the cardholder's bank takes back after a dispute.
      </ToggleTip.Content>
    </ToggleTip.Positioner>
  </Portal>
</ToggleTip.Root>;
```

| Axis      | Values                | Default    |
| --------- | --------------------- | ---------- |
| `variant` | `inverted`, `surface` | `inverted` |
| `size`    | `xs` to `4xl`         | `md`       |

| Part         | Element  | What it renders                                          |
| ------------ | -------- | -------------------------------------------------------- |
| `Root`       | `span`   | A `display: contents` element that provides the variants |
| `Trigger`    | `button` | The button that opens and closes the note                |
| `Positioner` | `div`    | The element the machine positions beside the trigger     |
| `Content`    | `div`    | The note                                                 |
| `Arrow`      | `div`    | The element the machine places against the note's edge   |
| `ArrowTip`   | `div`    | The arrow's rotated square                               |

- The root takes the popover machine's settings: `open`, `defaultOpen`, `onOpenChange`, `autoFocus`,
  `initialFocusEl`, `finalFocusEl`, `closeOnEscape`, `closeOnInteractOutside`, `positioning` and
  `id`.
- A press on the trigger opens the note, and a second press closes it. Escape and a press outside
  close it too. Opening another toggle tip, popover or menu closes this note.
- The trigger keeps focus as the note opens, because `autoFocus` is false by default. The note
  announces its text through the document's polite live region each time it opens, so a screen
  reader user hears it without leaving the trigger.
- The trigger sets `aria-expanded` and `aria-controls`. The note has no role, because a note is not
  a dialog: the trigger drops the machine's `aria-haspopup="dialog"` and the note its `dialog` role.
- Tab from the trigger moves into the note while it contains a link, and Tab out of the note closes
  it. A link inside the note takes the note's ink and an underline.
- The note is not in the document until it first opens, and leaves once its exit animation ends.
  `lazyMount` and `unmountOnExit` are true by default. `skipAnimationOnMount` and `onExitComplete`
  go to the root as well.
- The note is at most 320px wide at the default scale, and narrower where the room beside the
  trigger is less. The size sets its padding on the inset scale and its text on the label role.
- Use `Tooltip` for a control's label, `ToggleTip` for a note a reader asks for, and `Popover` for a
  panel with a title and controls.
- The root is a `span`, which is valid inside a table cell or a heading. Wrap the positioner in a
  portal there, because phrasing content cannot contain its `div`.

## HoverCard

`HoverCard` renders a card beside a link that previews what the link leads to. The card opens while
a pointer rests on the link or the link has keyboard focus.

```tsx
import { HoverCard } from "@stealthscale/component-disclosure";
import { Portal } from "@stealthscale/component-primitives";

<HoverCard.Root>
  <HoverCard.Trigger href="/people/ada">@ada</HoverCard.Trigger>
  <Portal>
    <HoverCard.Positioner>
      <HoverCard.Content>
        <HoverCard.Arrow>
          <HoverCard.ArrowTip />
        </HoverCard.Arrow>
        Ada Lovelace, staff engineer on the compiler team.
      </HoverCard.Content>
    </HoverCard.Positioner>
  </Portal>
</HoverCard.Root>;
```

| Axis      | Values                         | Default   |
| --------- | ------------------------------ | --------- |
| `variant` | `surface`, `elevated`, `glass` | `surface` |
| `size`    | `xs`, `sm`, `md`, `lg`         | `md`      |

| Part         | Element | What it renders                                          |
| ------------ | ------- | -------------------------------------------------------- |
| `Root`       | `span`  | A `display: contents` element that provides the variants |
| `Trigger`    | `a`     | The link the card previews                               |
| `Positioner` | `div`   | The element the machine positions beside the trigger     |
| `Content`    | `div`   | The card                                                 |
| `Arrow`      | `div`   | The element the machine places against the card's edge   |
| `ArrowTip`   | `div`   | The arrow's rotated square                               |

- The root takes the machine's settings: `open`, `defaultOpen`, `onOpenChange`, `openDelay`,
  `closeDelay`, `disabled`, `positioning`, `triggerValue`, `defaultTriggerValue`,
  `onTriggerValueChange`, `ids`, `id` and `dir`, and the dismiss handlers `onInteractOutside`,
  `onPointerDownOutside` and `onFocusOutside`.
- The card opens 600 ms after a pointer comes to rest on the link or the link takes focus. It closes
  300 ms after the pointer leaves both the link and the card, and at once when the link loses focus
  while no pointer rests on it. `openDelay` and `closeDelay` set the two waits.
- A pointer can move from the link onto the card without closing it, so a reader can select the
  card's text. Escape and a press outside close the card. The machine ignores touch input, so a tap
  follows the link.
- The trigger is an `a`. Give it an `href`, because an `a` without one takes no keyboard focus and
  its card never opens from the keyboard. The machine does not set an ARIA attribute on the link.
- The card has no role and is outside the tab order. The machine moves no focus into it and
  announces nothing, so a screen reader user does not learn that it opened. Put nothing in the card
  that the linked page does not show, and no control a reader needs.
- Two or more links can share one card. Give each `Trigger` a `value`. The root reports the value of
  the link that opened the card through `onTriggerValueChange`, and the machine places the card
  against that link. A pointer that moves to another link moves the open card at once. Place the
  card beside a column of links, because a card below one link covers the next.
- The card is not in the document until it first opens, and leaves once its exit animation ends.
  `lazyMount` and `unmountOnExit` are true by default, and the card is `inert` while it leaves.
  `skipAnimationOnMount` and `onExitComplete` go to the root as well.
- The root is a `span`, so a card can open from a link inside a paragraph. Pass `as="div"` when the
  root contains block content, such as a list of links.
- The link is in the link ink and underlined at rest. The card slides in from the side of the link
  it opens on. It is at most `sizes.xs` wide, 320px at the default scale, and narrower where the
  room beside the link is less. The size sets the card's padding on the inset scale: 8, 12, 16 and
  20px from `xs` to `lg`. The text reads the body role at the same size.
- The package does not portal. Wrap the positioner in a portal when the link is inside a paragraph
  or an ancestor clips the card. A paragraph cannot contain the positioner's `div`.

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
| `Content`         | `div`    | The panel, around a scroll area whose viewport is the `menu` |
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
- The panel is not in the document until it first opens, and leaves once its exit animation ends.
  `lazyMount` and `unmountOnExit` are true by default. The panel is `inert` while it leaves, so a
  highlight and Escape pressed in one frame leave focus on the trigger.
- The trigger sets `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`. The panel takes
  focus as it opens and keeps it. `aria-activedescendant` points a screen reader at the highlighted
  row.
- The up and down arrows, Home and End move the highlight, and typing the start of a row's text
  moves it to that row. Enter and Space select the highlighted row. Escape closes the menu and its
  submenus and returns focus to the trigger.
- A menu that closes returns focus to its trigger while focus is in a menu's panel or on the body. A
  press outside the panel that moves focus to another element leaves focus on that element, with
  `open` controlled or not.
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
  height stops at the room left in the window, and its rows scroll inside it.
- The rows scroll in the primitives package's scroll area inside the panel, with the theme's thin
  bar at the panel's end edge, which follows the menu's `dir`. The scroll area's viewport is the
  `menu`, so the element that has focus is the element that scrolls. A row the keys highlight
  scrolls into view by the least distance, and a row the pointer highlights does not move. A
  `Menu.Arrow` that is a direct child of `Menu.Content` renders outside the scroll area.
- `as` and `style` on `Menu.Content` go to the panel. Every other prop goes to the `menu`.
- The panel takes the `dropdown` z-index plus its depth in the nest, so a submenu renders above its
  parent.
- The package does not portal. Wrap `Menu.Positioner` in a portal when an ancestor clips the panel.
  Wrap a submenu's positioner in a portal too, because the parent's panel scrolls and clips a
  submenu rendered inside it.

## Menubar

`Menubar` renders a row of menus along the top of an application, such as an editor's File, Edit and
View. The bar is one tab stop. The arrow keys move along it. At most one menu is open.

```tsx
import { Menu, Menubar } from "@stealthscale/component-disclosure";
import { Portal } from "@stealthscale/component-primitives";

<Menubar.Root aria-label="Editor">
  <Menubar.Menu value="file">
    <Menubar.Trigger>File</Menubar.Trigger>
    <Portal>
      <Menubar.Content>
        <Menu.Item value="new">New file</Menu.Item>
        <Menu.Item value="open">Open…</Menu.Item>
      </Menubar.Content>
    </Portal>
  </Menubar.Menu>
  <Menubar.Menu value="edit">
    <Menubar.Trigger>Edit</Menubar.Trigger>
    <Portal>
      <Menubar.Content>
        <Menu.Item value="undo">Undo</Menu.Item>
        <Menu.Item value="redo">Redo</Menu.Item>
      </Menubar.Content>
    </Portal>
  </Menubar.Menu>
</Menubar.Root>;
```

| Axis      | Values                                                            | Default   |
| --------- | ----------------------------------------------------------------- | --------- |
| `size`    | `sm`, `md`, `lg`                                                  | `md`      |
| `palette` | `primary`, `secondary`, `accent`, `neutral` and the four statuses | `neutral` |

The root passes `size`, `palette`, `variant` and `highlight` to every menu. The last two are axes of
the menu, with the menu's values and defaults.

| Part      | Element  | What it renders                                                |
| --------- | -------- | -------------------------------------------------------------- |
| `Root`    | `div`    | The row that contains the bar of names and the fold trigger    |
| `Menu`    | `div`    | A `display: contents` element around one menu of the bar       |
| `Trigger` | `button` | A name of the bar, with `role="menuitem"`, that opens its menu |
| `Content` | `div`    | The positioner and the panel of a menu, with `role="menu"`     |

A panel's rows are `Menu` parts, such as `Menu.Item`, `Menu.OptionItem` and `Menu.Separator`. A
submenu is a `Menu.Root` around a `Menu.TriggerItem`.

- The bar is a `div` with `role="menubar"`. The root requires `aria-label`, the bar's accessible
  name. `value`, `defaultValue` and `onValueChange` on the root read and set the `value` of the open
  menu. The value is an empty string while every menu is closed.
- The bar is one tab stop. ArrowLeft and ArrowRight move focus along the names. Home and End move it
  to the ends. A letter moves it to the next name that starts with that letter. `loop`, true by
  default, continues a step past one end at the other.
- ArrowDown, Enter and Space on a name open its menu with the first row highlighted, and ArrowUp
  opens it with the last. A press on a name opens its menu, and a press on the name of the open menu
  closes it. While a menu is open, a mouse that moves onto another name opens that name's menu.
- ArrowRight in a panel opens the next menu with its first row highlighted, and ArrowLeft opens the
  one before. While the highlighted row opens a submenu, the arrow towards the submenu opens it.
- Tab and Shift+Tab in a panel close the menu and move focus to the element after or before the bar.
  Escape closes the menu and returns focus to its name.
- `dir="rtl"` lays the bar out from the right, swaps the arrows along the bar and in its panels, and
  opens submenus to the left.
- The root measures its row. While the names do not fit at their natural width, the root sets
  `data-crowded`, hides the bar and shows one trigger in its place: `foldIcon`, then `fold`, which
  reads `Menu` by default. Its menu has one row per menu of the bar, which opens that menu as a
  submenu and ends with `foldIndicator`.
- A name has the padding and text of a row of its menu, 27, 33 and 40px tall at `sm`, `md` and `lg`
  at the default scale. It fills in the palette's subtle role under the pointer and in its muted
  role while its menu is open, the fill of a highlighted row. Under forced colors an open name fills
  with `Highlight`.
- `Menubar.Menu` takes the props of `Menu.Root` except `open`, `defaultOpen` and `onOpenChange`,
  which the bar keeps. A variant set on a menu overrides the bar's.
- The package does not portal. Wrap each `Menubar.Content` in a portal, and each submenu's
  positioner too.
- The menubar is not built on Zag's `@zag-js/menubar`, which is published only as 2.0 prereleases.
  It does not open a menu on hover while every menu is closed, and a crowded bar folds rather than
  scrolls.

## Licence

MIT. See [LICENSE](LICENSE).
