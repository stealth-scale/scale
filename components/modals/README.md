# @stealthscale/component-modals

Renders what the page waits for: a palette, a dialog, a drawer and a tour. `createOverlay` opens a
dialog or a drawer from code. Every component binds a recipe and sets no styles of its own, so a
theme restyles all of them by extending the recipe. The preset under `./theme` registers the recipes
with an application's compiler.

## Install

```bash
pnpm add @stealthscale/component-modals
```

The package peers on `react`, `@stealthscale/hooks`, `@stealthscale/theme`,
`@stealthscale/component-collections` and `@stealthscale/component-primitives`. An application lists
the preset under `./theme` among the presets its compiler installs, with the primitives package's
preset, which styles the scroll areas in the palette's list and in a dialog's or a drawer's body.

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
| `List`  | `div`    | The matching commands, grouped by heading, in a scroll area     |
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
- The bar has no focus ring: the panel is the edge, and the caret and the highlighted row show where
  the keys go. The root sets the `palette`, which the highlighted row reads.
- The listbox renders the rows, and the root passes its `size` to the listbox, so the rows follow
  the palette's size.
- The rows scroll in the listbox's scroll area, with the theme's thin bar, while the palette is
  shorter than its rows. The scroll area is outside the tab order, because focus remains in the
  field, and a row the arrow keys highlight scrolls into view by the least distance.
- The package renders the panel alone. Place it in a `Dialog` with `variant="plain"` to open it over
  the page.

## Dialog

`Dialog` renders a panel over a dimmed page and keeps focus in it until the reader closes it: a
confirmation, a form, or anything else the page waits on.

```tsx
import { createPortal } from "react-dom";

import { XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Dialog } from "@stealthscale/component-modals";

<Dialog.Root>
  <Dialog.Trigger as={Button}>Invite teammate</Dialog.Trigger>
  {createPortal(
    <>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Invite a teammate</Dialog.Title>
            <Dialog.Description>They get an email with a link to join.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>{fields}</Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger as={Button}>Cancel</Dialog.ActionTrigger>
          </Dialog.Footer>
          <Dialog.CloseTrigger aria-label="Close">
            <XIcon />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </>,
    document.body,
  )}
</Dialog.Root>;
```

| Axis             | Values                                        | Default    |
| ---------------- | --------------------------------------------- | ---------- |
| `size`           | `xs`, `sm`, `md`, `lg`, `xl`, `cover`, `full` | `md`       |
| `placement`      | `top`, `center`, `bottom`                     | `top`      |
| `scrollBehavior` | `inside`, `outside`                           | `outside`  |
| `variant`        | `elevated`, `plain`                           | `elevated` |

| Part            | Element  | What it renders                                                |
| --------------- | -------- | -------------------------------------------------------------- |
| `Root`          | `div`    | The machine and the presence of the panel and the backdrop     |
| `Trigger`       | `button` | A control that opens the dialog                                |
| `Backdrop`      | `div`    | The layer that dims the page under the panel                   |
| `Positioner`    | `div`    | The layer that covers the window and places the panel          |
| `Content`       | `div`    | The panel, in the `dialog` or `alertdialog` role               |
| `Header`        | `div`    | The band at the top, with the title over the description       |
| `Title`         | `h2`     | The heading that names the panel                               |
| `Description`   | `p`      | The sentence that describes the panel                          |
| `Body`          | `div`    | The band with the dialog's main content, in a scroll area      |
| `Footer`        | `div`    | The band at the bottom, with the actions at the end            |
| `CloseTrigger`  | `button` | The button in the panel's top corner that closes the dialog    |
| `ActionTrigger` | `button` | A footer button that closes the dialog, such as Cancel or Done |

- The root takes the machine's options: `open`, `defaultOpen`, `onOpenChange`, `role` (`dialog` or
  `alertdialog`), `modal`, `closeOnEscape`, `closeOnInteractOutside`, `initialFocusEl`,
  `finalFocusEl`, `restoreFocus`, `preventScroll`, `trapFocus`, `persistentElements` and
  `aria-label`, the accessible name of a panel without a title. It takes `lazyMount` and
  `unmountOnExit`, both true, `skipAnimationOnMount` and `onExitComplete`.
- A modal dialog, the default, traps focus in the panel, stops the page from scrolling, hides the
  rest of the page from assistive technology and takes every pointer event outside the panel. Escape
  and a press outside the panel close it. A press outside an alert dialog leaves it open.
- On opening, focus moves to the element marked `data-autofocus`, else to the first element that
  takes focus, else to the panel. An alert dialog focuses its close trigger before any of these, so
  one without a close trigger focuses its first footer button. Place the least destructive action
  first. On closing, focus returns to the trigger that opened the dialog. `finalFocusEl` names
  another element.
- The package renders no portal. Render the backdrop and the positioner in one, with `createPortal`
  or the `Portal` of `@stealthscale/component-primitives`. A clipping or stacking ancestor then does
  not reach the fixed layers.
- `Dialog.CloseTrigger` requires `aria-label`, and its glyph is the caller's. It is centred on the
  title's first line, and its glyph is on the panel's padding edge. The header keeps its text clear
  of it. `Dialog.ActionTrigger` closes the dialog as the close trigger does. It takes no id from the
  machine, so a panel with both has one element per id. A handler that calls `preventDefault` keeps
  the dialog open.
- More than one trigger can open a dialog. Each passes its own `value`, the root reports the pressed
  one as `triggerValue` through `onTriggerValueChange`, and focus returns to that trigger.
- `scrollBehavior="inside"` keeps the header and the footer in view and scrolls the body. `outside`
  scrolls the window around the panel.
- The body is the primitives package's scroll area, so its bar is the theme's thin bar, at the
  panel's edge. While the content overflows, the viewport is a region in the tab order, named by the
  title, and the arrow keys scroll it. Its focus ring is inside the panel. The body's props and `as`
  apply to the padded element inside the scroll area.
- `variant="plain"` renders no panel, for a child with a background and an edge of its own:
  `Command.Root` or a picture.
- The backdrop and the positioner stack on the modal level plus the layer index the machine writes,
  so the backdrop of a dialog opened from another dims the first one.
- The panel scales and fades in and out, and the backdrop fades. Neither is in the document before
  the dialog first opens or after its exit animation ends.

## Drawer

`Drawer` renders a panel attached to one edge of the window over a dimmed page: filters, a form, a
share sheet, or anything else a page opens beside its content.

```tsx
import { createPortal } from "react-dom";

import { XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Drawer } from "@stealthscale/component-modals";

<Drawer.Root placement="end" size="sm">
  <Drawer.Trigger as={Button}>Filters</Drawer.Trigger>
  {createPortal(
    <>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Filter invoices</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>{fields}</Drawer.Body>
          <Drawer.Footer>
            <Drawer.ActionTrigger as={Button}>Apply filters</Drawer.ActionTrigger>
          </Drawer.Footer>
          <Drawer.CloseTrigger aria-label="Close">
            <XIcon />
          </Drawer.CloseTrigger>
        </Drawer.Content>
      </Drawer.Positioner>
    </>,
    document.body,
  )}
</Drawer.Root>;
```

| Axis        | Values                               | Default |
| ----------- | ------------------------------------ | ------- |
| `placement` | `start`, `end`, `top`, `bottom`      | `end`   |
| `size`      | `xs`, `sm`, `md`, `lg`, `xl`, `full` | `xs`    |
| `contained` | `true`                               | off     |

The parts are the dialog's twelve, under `Drawer`, and each renders the element the dialog's part of
the same name renders.

- The drawer runs the dialog machine, so the root takes the dialog's options, and focus, Escape, a
  press outside the panel, the trigger's `value` and the action trigger behave as in the dialog.
- A panel at the start or the end is as tall as the window, and one at the top or the bottom is as
  wide. The body scrolls, so the header remains at the top and the footer at the bottom. The body is
  a scroll area, as in the dialog.
- `size` is the panel's width at the start and the end: 20, 28, 32, 42 and 56rem, and `full` for the
  whole window. At the top and the bottom it is the panel's greatest height.
- `contained` insets the panel from the window by the middle inset and gives it the roundest corner.
- The panel slides the whole way in from its edge and out again with a fade, and the backdrop fades.
  Start and end swap edges in a right-to-left document.
- The drawer has no swipe dismissal and no snap points. Zag's `drawer` machine offers both, and the
  drawer runs the dialog machine instead.

## Overlay

`createOverlay` opens a dialog or a drawer from code, and `open` returns a promise of the value the
dialog closes with. A handler awaits the answer in the statement that asked for it.

```tsx
import { createPortal } from "react-dom";

import { Button } from "@stealthscale/component-actions";
import { createOverlay, Dialog } from "@stealthscale/component-modals";

const confirmation = createOverlay<{ title: string }, boolean>(({ close, title, ...props }) => (
  <Dialog.Root role="alertdialog" {...props}>
    {createPortal(
      <>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Footer>
              <Dialog.ActionTrigger as={Button}>Cancel</Dialog.ActionTrigger>
              <Button onClick={() => close(true)}>Delete</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </>,
      document.body,
    )}
  </Dialog.Root>
));

<confirmation.Viewport />;

const deleted = await confirmation.open("delete", { title: "Delete the Q3 report?" });
```

| Member              | What it does                                                                      |
| ------------------- | --------------------------------------------------------------------------------- |
| `Viewport`          | Renders every overlay the store keeps, in the order their ids were first opened   |
| `open(id, props)`   | Renders the component under `id` and returns a promise of the result              |
| `close(id, value)`  | Closes the overlay, settles its promise with `value`, and resolves once it leaves |
| `update(id, props)` | Merges `props` into the overlay's props, and does nothing for an unknown `id`     |
| `remove(id)`        | Removes the overlay without its exit motion and settles its promise               |
| `removeAll()`       | Removes every overlay without its exit motion and settles each promise            |
| `get(id)`           | Returns the overlay's props, and throws for an unknown `id`                       |
| `has(id)`           | Returns true while the store keeps `id`, its exit motion included                 |
| `getSnapshot()`     | Returns the props of every overlay the store keeps                                |
| `waitForExit(id)`   | Returns a promise that resolves once the overlay leaves the store                 |

| Prop the component receives | What it is                                                                      |
| --------------------------- | ------------------------------------------------------------------------------- |
| `open`                      | True until the overlay closes                                                   |
| `onOpenChange`              | Closes the overlay with no result on Escape, a press outside or a close trigger |
| `onExitComplete`            | Removes the overlay from the store once its exit motion ends                    |
| `close`                     | Closes the overlay with a result                                                |

- The component spreads `open`, `onOpenChange` and `onExitComplete` onto `Dialog.Root` or
  `Drawer.Root`. It takes `close` out of its props first, because React warns about a function prop
  on the root's `div`.
- The promise settles once. It resolves with the value `close` passes, and with `undefined` when the
  overlay is dismissed, removed, or opened again under its id. Opening an open id renders the new
  props in the same overlay.
- The overlay mounts open, and the dialog plays its entry motion. Focus returns to the element that
  had focus when the dialog opened: the button whose handler called `open`.
- An application renders each viewport once, inside the providers its overlays read.
- Not offered: the `options.props` defaults of Chakra's `createOverlay`. The component states its
  own defaults.

## Tour

`Tour` walks a person through a page one step at a time: a card centred over a dimmed page, a card
beside a ringed element, or a card fixed to a corner of the window.

```tsx
import { createPortal } from "react-dom";

import { XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Tour } from "@stealthscale/component-modals";

const tour = Tour.useTour({ steps });

<Button onClick={() => tour.start()}>Take the tour</Button>
<Tour.Root tour={tour}>
  {createPortal(
    <>
      <Tour.Backdrop />
      <Tour.Spotlight />
      <Tour.Positioner>
        <Tour.Content>
          <Tour.Arrow>
            <Tour.ArrowTip />
          </Tour.Arrow>
          <Tour.Title />
          <Tour.Description />
          <Tour.Control>
            <Tour.ProgressText />
            <Tour.Actions>
              {(actions) =>
                actions.map((action) => (
                  <Tour.ActionTrigger action={action} as={Button} key={action.label} />
                ))
              }
            </Tour.Actions>
          </Tour.Control>
          <Tour.CloseTrigger aria-label="End the tour">
            <XIcon />
          </Tour.CloseTrigger>
        </Tour.Content>
      </Tour.Positioner>
    </>,
    document.body,
  )}
</Tour.Root>;
```

A step is data: an `id`, a `title`, a `description`, and a `target` function that returns the
element the step points at.

```ts
const steps: Tour.StepDetails[] = [
  {
    actions: [{ action: "next", label: "Start" }],
    description: "Four stops, about a minute.",
    id: "welcome",
    title: "Welcome to invoicing",
    type: "dialog",
  },
  {
    actions: [
      { action: "prev", label: "Back" },
      { action: "next", label: "Next" },
    ],
    description: "Search by customer, invoice number or amount.",
    id: "search",
    target: () => document.getElementById("search"),
    title: "Find an invoice",
  },
];
```

| Axis      | Values                                                            | Default    |
| --------- | ----------------------------------------------------------------- | ---------- |
| `size`    | `sm`, `md`, `lg`                                                  | `md`       |
| `variant` | `elevated`, `surface`                                             | `elevated` |
| `palette` | `primary`, `secondary`, `accent`, `neutral` and the four statuses | `primary`  |

| Part            | Element  | What it renders                                                     |
| --------------- | -------- | ------------------------------------------------------------------- |
| `Root`          | `div`    | The api `useTour` returns and the presence of the card and backdrop |
| `Backdrop`      | `div`    | The layer that dims the page, with the target cut out of it         |
| `Spotlight`     | `div`    | The ring around the step's target, in the `palette`                 |
| `Positioner`    | `div`    | The layer that places the card beside the target or in the window   |
| `Content`       | `div`    | The card, in the `dialog` role                                      |
| `Arrow`         | `div`    | The element the machine places against the card's edge              |
| `ArrowTip`      | `div`    | The rotated square that points at the target                        |
| `Title`         | `h2`     | The heading that names the card, the step's `title` by default      |
| `Description`   | `p`      | The text under the title, the step's `description` by default       |
| `ProgressText`  | `div`    | How far through the tour the step is, `2 of 4` by default           |
| `Control`       | `div`    | The row at the foot of the card, with the buttons at its end        |
| `ActionTrigger` | `button` | A button that runs one of the step's actions                        |
| `CloseTrigger`  | `button` | The button in the card's top corner that ends the tour              |

`Tour.Actions` renders no element. It calls its children with the current step's actions.

- `Tour.useTour` takes the machine's options: `steps`, `onStepChange`, `onStepsChange`,
  `onStatusChange`, `closeOnEscape` and `closeOnInteractOutside`, both true, `keyboardNavigation`,
  true, `preventInteraction`, false, `spotlightOffset`, 10px on each side, `spotlightRadius`, 4px,
  `id`, `ids`, `dir` and the handlers for a press or focus outside the card. It returns the api:
  `start`, `next`, `prev`, `setStep`, `addStep`, `removeStep`, `updateStep` and `setSteps`, beside
  `open`, `step`, `stepIndex`, `totalSteps`, `firstStep` and `lastStep`. The root takes the api as
  `tour`, `lazyMount` and `unmountOnExit`, both true, `skipAnimationOnMount` and `onExitComplete`.
- A step with a `target` is a `tooltip` beside it, and a step without one is a `dialog` centred in
  the window. A `floating` step is fixed to the corner of the window its `placement` names,
  `bottom-end` by default, without a backdrop or an arrow. A `wait` step hides the card, and the
  tour waits on it until its `effect` calls `next`, `goto` or `dismiss`. A step also sets
  `placement`, `offset`, `arrow`, `backdrop` and `actions`. A target that is missing for 3 seconds
  ends the tour with the status `not-found`.
- A step with an `effect` shows once the effect calls `show`. The effect returns its cleanup and
  receives `show`, `next`, `goto`, `dismiss`, `update` and the `target`, so a step can open a tab
  before it shows, or wait for the person to type and then move on.
- An action is `next`, `prev`, `dismiss`, `skip`, or a function that receives the same methods.
  `Tour.ActionTrigger` renders the action's `label` and takes it as its accessible name. A `prev`
  action on the first step and a `next` action on the last are `aria-disabled`, do nothing on a
  press and keep focus. The trigger has a control's cursor, focus ring and disabled look, so a
  caller passes a button through `as`.
- The card is a `dialog` named by its title and described by its description. It is modal on a
  dialog step only, so a screen reader reads the target of a tooltip step. It is a polite live
  region, so the next step is read out while focus remains on the button that moved to it.
- Focus moves to the card's first control when the tour starts. Tab moves through the card's
  controls and the controls inside the target, so point a step at a field's wrapper to let the
  keyboard reach the field. ArrowRight and ArrowLeft move to the next and the previous step, swapped
  in a right-to-left document, and Escape ends the tour. When the tour ends, focus returns to the
  element that had it when the tour started, unless the person moved focus outside the card.
- On a tooltip step the machine cuts the target out of the backdrop, so the target takes the
  pointer. A press anywhere else ends the tour unless `closeOnInteractOutside` is false.
  `preventInteraction` makes the target inert.
- The machine places a tooltip step's card, ring and cutout in the document's coordinates, and the
  backdrop is as tall as the document, so the page is dimmed however far it scrolls. The ring moves
  between targets at the theme's `move` pace.
- The card is `sizes.sm` wide beside a target, or as wide as the room the machine measures on its
  side where that is less. It is `sizes.md` wide in a dialog step and `sizes.sm` in a floating one,
  within the window. The card scales and fades in and out, and the backdrop and the ring fade. None
  of them is in the document before the tour first starts or after its exit animation ends.
- The words are the caller's. `Tour.CloseTrigger` requires `aria-label`, an action's `label` names
  its button, and `Tour.ProgressText` renders its children in place of the English count. The
  machine's `translations` are not offered.
- The package renders no portal. Render the backdrop, the spotlight and the positioner in one.
- The api has no method that ends the tour. A person ends it through the close trigger, a `dismiss`
  or `skip` action, Escape or a press outside the card.
