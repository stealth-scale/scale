# @stealthscale/component-messaging

A conversation in this package is a transcript that follows the latest message, turns with a sender
and a bubble per message, the reactions and the attachments under them, and the composer the reader
writes the next message in. An application's compiler reads the recipes from the preset under
`./theme`.

## Install

```bash
pnpm add @stealthscale/component-messaging
```

The package peers on `react`, `react-dom`, `@stealthscale/hooks`, `@stealthscale/theme`,
`@stealthscale/component-disclosure` and `@stealthscale/component-primitives`. It depends on
`@stealthscale/component-actions` and on `use-stick-to-bottom` 1.1.6, which scrolls the transcript.

| Export         | What it renders                                                                   |
| -------------- | --------------------------------------------------------------------------------- |
| `Conversation` | The transcript: a log that follows the latest message, and a control to return    |
| `Message`      | One turn of a conversation: the sender, a bubble per message and a status row     |
| `Reactions`    | A row of reaction toggles under a message, and a picker that adds one             |
| `Attachment`   | A file attached to a message or waiting to be sent, alone or in a list            |
| `Composer`     | The box a reader writes a message in, with mentions, attachments, send and stop   |
| `groupTurns`   | Nothing: it groups a transcript into days, and each day into turns, for rendering |

## Conversation

`Conversation` renders a transcript that opens at its end and follows each message that arrives or
grows, until the reader scrolls up. A control then brings the reader back to the latest message.

```tsx
import { ArrowDownIcon } from "lucide-react";

import { Divider } from "@stealthscale/component-layout";
import { Conversation, groupTurns } from "@stealthscale/component-messaging";

const conversation = Conversation.useConversation();

<Conversation.Root conversation={conversation} label="Conversation with Ada" maxHeight="xs">
  <Conversation.Content>
    {groupTurns(messages, { self: "me", timeZone }).map((day) => (
      <Fragment key={day.key}>
        <Divider
          label={<Timestamp options={{ dateStyle: "medium", timeZone }} value={day.day} />}
        />
        {day.turns.map(renderTurn)}
      </Fragment>
    ))}
    {typing ? <Conversation.Typing>Ada is typing</Conversation.Typing> : null}
  </Conversation.Content>
  <Conversation.JumpTrigger label="Jump to the latest message">
    <ArrowDownIcon />
  </Conversation.JumpTrigger>
</Conversation.Root>;
```

| Part          | Element | What it renders                                                           |
| ------------- | ------- | ------------------------------------------------------------------------- |
| `Root`        | `div`   | The primitives scroll area's root, with the vertical bar after its parts  |
| `Content`     | `div`   | The scroll area's viewport as the `log`, around the content of turns      |
| `JumpTrigger` | `div`   | The actions `Button` over the transcript's bottom edge, away from the end |
| `Typing`      | `div`   | Three pulsing dots and the caller's words                                 |

- `useConversation()` runs the scroll engine and returns `atEnd`, `scrollToEnd()` and
  `scrollToMessage(id)`. Pass the result to `Root` as `conversation` to scroll the transcript from
  outside it, such as from the composer's send. A root without `conversation` runs its own engine.
- The engine is use-stick-to-bottom. While the view is within 70px of the end, a message that
  arrives or grows scrolls the view with it. A wheel, a key or a drag that scrolls up stops the
  follow. Under reduced motion every scroll is instant.
- `scrollToEnd()` scrolls to the end and follows again. `scrollToMessage(id)` puts the element with
  that `id` at the top of the view and stops the follow, for a jump to the first unread message.
- `Root` takes the scroll area's props. A transcript scrolls only in a bounded height: `maxHeight`,
  from `xs` at 20rem to `lg` at 32rem, or a parent of a definite height. `inset` pads the turns.
- `JumpTrigger` renders nothing while the view is at the end. A press moves focus to the log first,
  so focus remains in the conversation when the control goes. The caller passes the glyph.
- `Typing`'s dots pulse at the theme's 1.2s ambient pace, 200ms apart, and rest under reduced
  motion. Under forced colors they fill with `CanvasText`. Render it inside `Content`, after the
  last turn, while someone types.
- Render a day as the layout `Divider` with the date as its `label`. A labelled line has no
  `separator` role, so a screen reader reads the date.

### Accessibility

- The viewport is the `log`, named by `label`, "Messages" by default. A log is a polite live region,
  so a screen reader reads each turn once as it is added, and `aria-relevant="additions"` leaves out
  text that changes inside a turn.
- Pass `aria-busy` on a turn while its words still arrive, and on `Content` while older messages
  load. A screen reader then reads the finished turn once.
- While the transcript overflows, the log is in the tab order and the arrow keys, Page Up, Page
  Down, Home and End scroll it.
- Write the turns oldest first. A screen reader reads them in the order they are written.

## groupTurns

`groupTurns(messages, { self, timeZone, window })` returns the days of a transcript, each with its
turns.

| Returns   | Fields                                                                              |
| --------- | ----------------------------------------------------------------------------------- |
| `TurnDay` | `day`, midnight at the start of the day, `key`, and `turns`                         |
| `Turn`    | `author`, `first`, `last`, `messages` oldest first, and `own` for the `self` author |

- A turn is the run of messages one author sent within `window` of the one before, 5 minutes by
  default. A new day always starts a new turn.
- A message reads `author`, `id` and `sentAt`: a `Date`, epoch milliseconds or a string `Date`
  parses. A message without a readable `sentAt` joins the turn and the day before it.
- A day starts at midnight in `timeZone`, an IANA zone, or in the runtime's zone, the reader's own
  calendar in a browser. Pass the zone the times are formatted in, and format the day's label in it
  too, so a label names the day its messages were sent. Where a daylight saving change skips
  midnight, the day starts at its first instant.

## Message

A turn is the run of messages one person sent together. It renders the sender's avatar, a header
with the name and the time, a bubble per message, and a footer with the delivery status and the
actions.

```tsx
import { Message } from "@stealthscale/component-messaging";

<Message.Root>
  <Message.Avatar>
    <Avatar.Root aria-hidden name="Ada Okafor" size="sm">
      <Avatar.Fallback />
    </Avatar.Root>
  </Message.Avatar>
  <Message.Content>
    <Message.Header>
      <Strong>Ada Okafor</Strong>
      <Timestamp options={{ timeStyle: "short" }} value={sentAt} />
    </Message.Header>
    <Message.Bubble>The invoice from Northwind is in.</Message.Bubble>
    <Message.Bubble>Can you approve it before five?</Message.Bubble>
  </Message.Content>
</Message.Root>;
<Message.Root align="end" aria-label="You" look="solid" palette="primary">
  <Message.Content>
    <Message.Bubble>Approved. I'll send it to finance.</Message.Bubble>
    <Message.Footer>
      <Message.Status status="read">
        <CheckCheckIcon aria-hidden />
        Read
      </Message.Status>
    </Message.Footer>
  </Message.Content>
</Message.Root>;
```

| Part      | Element   | What it renders                                                        |
| --------- | --------- | ---------------------------------------------------------------------- |
| `Root`    | `article` | The turn. It takes the variants                                        |
| `Avatar`  | `div`     | The box around the sender's avatar, at the top of the turn             |
| `Content` | `div`     | The column of the header, the bubbles and the footer                   |
| `Header`  | `div`     | The row above the bubbles, with the sender's name and the time         |
| `Bubble`  | `div`     | One message. `failed` paints it in the error palette                   |
| `Footer`  | `div`     | The row under the bubbles, with the status and the actions             |
| `Status`  | `span`    | How far a message has got, from `status`, and the caller's glyph       |
| `Actions` | `div`     | The turn's controls, transparent until a pointer or focus reaches them |

| Axis      | Values                                                                             | Default   |
| --------- | ---------------------------------------------------------------------------------- | --------- |
| `align`   | `start`, `end`                                                                     | `start`   |
| `look`    | `solid`, `subtle`, `surface`, `outline`, `plain`                                   | `subtle`  |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error` | `neutral` |
| `size`    | `sm`, `md`, `lg`                                                                   | `md`      |
| `reveal`  | `hover`, `always`                                                                  | `hover`   |

- `align="end"` puts a turn at the end of the line, for the reader's own messages. The row runs the
  other way, so the avatar is at the end, and the column aligns the bubbles to the end.
- A bubble is at most 80% of the column wide. `look` paints every bubble of the turn in one of the
  flat looks, which do not repaint under a pointer. `plain` has no fill and no padding and gives the
  bubble the whole column, for an answer that reads as a document or a comment in a thread.
- `palette` colors the bubbles. Give the reader's own turns `primary` and every other sender
  `neutral`, so the two sides differ by more than their place.
- `size` sets the text style of the bubbles, the header and the footer, the padding inside a bubble,
  and the gap between the avatar and the column.
- `Bubble failed` writes `data-failed` and paints the bubble in the error palette. Pair it with
  `Status status="failed"` and a control that sends the message again.
- `Status status` writes `data-status`: `sending`, `sent`, `delivered`, `read` or `failed`. The
  status of a read message is in the primary palette's ink, and a failed one in the error ink.
- `reveal="hover"` makes the actions transparent until a pointer is over the turn or focus is inside
  it. A coarse pointer cannot hover, so under one the actions are opaque at rest. `reveal="always"`
  shows them at rest, for the last turn of a conversation.
- Under forced colors a bubble has a `CanvasText` hairline outline, except in the plain look.
- A mention in a message is the typography `Mark` with `palette="primary"`, and `warning` for a
  mention of the reader.

### Accessibility

- Each turn is an `article`, so a screen reader's article command moves from turn to turn.
- Name a turn whose header does not show its sender with `aria-label`, such as "You" on the reader's
  own turns.
- Set `aria-hidden` on an avatar beside the same name in words, so a screen reader reads the name
  once.
- A screen reader does not read a glyph's shape or color. Hide the status glyph with `aria-hidden`
  and keep the words, visually hidden where the glyph is enough to see.
- The actions are in the tab order under both `reveal` values. Name each icon button.

## Reactions

`Reactions` renders a toggle per reaction under a message, with the number of people who reacted,
and a picker that adds a reaction.

```tsx
import { SmilePlusIcon } from "lucide-react";

import { Reactions } from "@stealthscale/component-messaging";

<Reactions.Root label="Reactions">
  <Reactions.Item count={3} label="Thumbs up, 3 people, including you" onClick={toggle} pressed>
    👍
  </Reactions.Item>
  <Reactions.Picker icon={<SmilePlusIcon />} label="Add a reaction" onSelect={add}>
    <Reactions.Choice label="Party popper" value="party">
      🎉
    </Reactions.Choice>
  </Reactions.Picker>
</Reactions.Root>;
```

| Part     | Element    | What it renders                                                                   |
| -------- | ---------- | --------------------------------------------------------------------------------- |
| `Root`   | `fieldset` | The row, named by `label`, "Reactions" by default                                 |
| `Item`   | `button`   | The actions `Button`: the glyph and the count, pressed while the reader took part |
| `Picker` | `div`      | The disclosure `Popover`: its trigger and its portalled panel of choices          |
| `Choice` | `button`   | One reaction in the panel, named by `label`, reported by `value`                  |

- The caller keeps each reaction's state and toggles `pressed` and `count` from `onClick`. A pressed
  reaction takes the primary palette, and `aria-pressed` states it.
- `Item` renders `count` after the glyph whenever it is stated, in tabular figures.
- `Picker` calls `onSelect` with the chosen value and closes, and the popover returns focus to its
  trigger. `choicesLabel` names the panel, "Choose a reaction" by default.

### Accessibility

- The row is a `fieldset`, so a screen reader announces the reactions as one set.
- The glyph and the count are `aria-hidden`, and `label` names the reaction in their place. State
  the reaction, the count and the reader's part in it: "Thumbs up, 3 people, including you".

## Attachment

`Attachment` renders a file with a media square, its name over a line of detail, and its actions.
The square shows the type's icon, a thumbnail or a spinner. `Attachment.Group` lists the files of a
message.

```tsx
import { FileSpreadsheetIcon } from "lucide-react";

import { Attachment } from "@stealthscale/component-messaging";

<Attachment.Group aria-label="Attachments" size="sm">
  <Attachment.Root>
    <Attachment.Media>
      <FileSpreadsheetIcon aria-hidden />
    </Attachment.Media>
    <Attachment.Content>
      <Attachment.Title>payouts-september.csv</Attachment.Title>
      <Attachment.Description>CSV, 18 kB</Attachment.Description>
    </Attachment.Content>
    <Attachment.Actions>{download}</Attachment.Actions>
  </Attachment.Root>
</Attachment.Group>;
```

| Part          | Element       | What it renders                                               |
| ------------- | ------------- | ------------------------------------------------------------- |
| `Group`       | `ul`          | The list. Its `size` and `orientation` are the files' default |
| `Root`        | `div` or `li` | One file, an `li` inside a group                              |
| `Media`       | `div`         | The square with the icon, the spinner or a cropped thumbnail  |
| `Content`     | `div`         | The column of the title and the description                   |
| `Title`       | `span`        | The file's name, on one line                                  |
| `Description` | `span`        | The detail, such as the type and the size, on one line        |
| `Actions`     | `div`         | The file's controls, over the media's corner on a tile        |

| Axis          | Values                   | Default      |
| ------------- | ------------------------ | ------------ |
| `orientation` | `horizontal`, `vertical` | `horizontal` |
| `size`        | `xs`, `sm`, `md`         | `md`         |

- `horizontal` renders a row, and a group stacks rows. `vertical` renders a tile with the media
  across its top, and a group wraps tiles.
- `state` on `Root` writes `data-state`. `idle` marks a file not yet sent with a dashed edge.
  `uploading` and `processing` mark a file that transfers or that the server checks. `error` takes
  the error edge and inks, and `done` is the default.
- The title and the description end in an ellipsis, so a long file name never widens the list.

### Accessibility

- A group is a list, so a screen reader announces the number of files. Name it with `aria-label`.
- State the file's state in the description. A screen reader does not read an edge or an ink.
- Give a thumbnail `alt=""` beside a title with the file's name, so the name is read once.

## Composer

`Composer` renders the box a reader writes a message in. Above the text it shows the message it
replies to or edits and the files waiting to be sent. The text grows with its content, and a row of
controls under it attaches files and sends.

```tsx
import { ArrowUpIcon, PaperclipIcon, SquareIcon } from "lucide-react";

import { Composer } from "@stealthscale/component-messaging";

<Composer.Root busy={answering} onAttach={attach} onStop={stop} onSubmit={send}>
  <Composer.Input label="Message" placeholder="Write a message" />
  <Composer.Toolbar>
    <Composer.AttachTrigger label="Attach files">
      <PaperclipIcon />
    </Composer.AttachTrigger>
    <Composer.Submit label="Send" stopIcon={<SquareIcon />} stopLabel="Stop the answer">
      <ArrowUpIcon />
    </Composer.Submit>
  </Composer.Toolbar>
</Composer.Root>;
```

| Part            | Element    | What it renders                                                        |
| --------------- | ---------- | ---------------------------------------------------------------------- |
| `Root`          | `form`     | The box, whose edge, focus ring and states come from the textarea      |
| `Context`       | `div`      | The strip above the text for the message the composer replies to       |
| `Attachments`   | `div`      | The row above the text for an `Attachment.Group` of files to send      |
| `Input`         | `textarea` | The text, and the list of mention suggestions while one is typed       |
| `Toolbar`       | `div`      | The row of controls under the text, with the submit control at its end |
| `AttachTrigger` | `button`   | The actions `Button` that opens the file picker, and a hidden input    |
| `Submit`        | `button`   | The actions `Button` that sends, or stops a running answer             |

| Axis      | Values                         | Default   |
| --------- | ------------------------------ | --------- |
| `variant` | `outline`, `subtle`, `flushed` | `outline` |
| `size`    | `sm`, `md`, `lg`               | `md`      |

- `Root` keeps the text, controlled through `value` and `onValueChange` or from `defaultValue`.
  `onSubmit` receives the text trimmed, the root clears a text it keeps, and focus returns to the
  textarea. Whitespace alone is not a message, and files alone are, where `attached` is true.
- `busy` stops every send. While `busy` and with `onStop`, `Submit` is the stop control on the same
  element, named by `stopLabel`, so focus remains on it across the swap. With nothing to send,
  `Submit` is `aria-disabled` and keeps focus.
- `Input` grows line by line through `field-sizing: content` up to `maxRows`, 8 by default, and then
  scrolls. It takes a `ref`, so a control outside the composer can focus it.
- `onAttach` receives the files a reader picks, drops on the box or pastes. The box takes the focus
  edge while files are dragged over it. `AttachTrigger accept` limits the files the picker offers.
- `triggers` on `Input`, such as `["@"]`, opens a mention. `onQueryChange` reports the query at the
  caret, the caller passes the matching `suggestions`, and `onMention` reports the one inserted. The
  text keeps the name the reader sees, such as `@Ada Okafor`, and a space after it. A trigger opens
  a query only at the start of the text or after whitespace, so an email address is not a mention.

| Key                   | What it does                                                        |
| --------------------- | ------------------------------------------------------------------- |
| Enter                 | Sends, under `submitOn="enter"`, the default                        |
| Shift+Enter           | Starts a new line, under `submitOn="enter"`                         |
| Ctrl+Enter, Cmd+Enter | Sends, under `submitOn="modEnter"`, where Enter starts a new line   |
| Escape                | Calls `onCancelContext`, which dismisses a reply or leaves an edit  |
| ArrowUp               | Calls `onEditLast` from an empty textarea, to edit the last message |
| ArrowDown, ArrowUp    | Move the highlight in an open list of suggestions                   |
| Enter, Tab            | Insert the highlighted suggestion                                   |
| Escape                | Closes the list of suggestions, and nothing else                    |

- A key pressed while an input method composes text belongs to the input method, so Enter never
  sends a candidate a reader of Japanese or Chinese is choosing.

### Accessibility

- The textarea is named by `label`, "Message" by default. A placeholder disappears with the first
  character, so the textarea takes its name from `label` alone.
- With `triggers` the textarea states `aria-autocomplete="list"`. While suggestions are open,
  `aria-controls` points at the list and `aria-activedescendant` at the highlighted suggestion.
  Focus remains in the textarea.
- The file input is `hidden`, so neither a screen reader nor Tab finds a second, unnamed control.

## Types

| Type             | Props of                                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `Conversation.*` | `RootProps`, `ContentProps`, `JumpTriggerProps`, `TypingProps`, `ConversationApi`                                 |
| `Message.*`      | `RootProps`, `BubbleProps`, `StatusProps`, `MessageStatus`, and the parts                                         |
| `Reactions.*`    | `RootProps`, `ItemProps`, `PickerProps`, `ChoiceProps`                                                            |
| `Attachment.*`   | `RootProps`, `GroupProps`, `AttachmentState`, and the parts                                                       |
| `Composer.*`     | `RootProps`, `InputProps`, `SubmitProps`, `AttachTriggerProps`, `SubmitKey`, `Query`, `Suggestion`, and the parts |
| `groupTurns`     | `GroupTurnsOptions`, `Turn`, `TurnDay`, `TurnMessage`                                                             |

## Not offered

- An emoji picker. `Reactions.Picker` offers the caller's choices.
- A component for a mention inside a sent message, a reasoning panel, a tool call card, a comment
  thread or a list of conversations. The catalogue composes each from the library's parts: the
  typography `Mark`, the disclosure `Details`, the content `JsonTreeView` and `Markdown`, and the
  collections `Listbox`.

## Licence

MIT. See [LICENSE](LICENSE).
