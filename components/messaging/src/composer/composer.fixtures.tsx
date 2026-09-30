/**
 * Builds the composers the part specs render, and reads and drives their parts.
 */

import { type ReactElement, useState } from "react";

import { act, fireEvent, screen } from "@testing-library/react";

import { AttachTrigger, type AttachTriggerProps } from "#composer/attach-trigger.tsx";
import { Attachments } from "#composer/attachments.ts";
import { Context } from "#composer/context-strip.ts";
import { Input, type InputProps } from "#composer/input.tsx";
import { type Query } from "#composer/mentions.ts";
import { Root, type RootProps } from "#composer/root.tsx";
import { Submit, type SubmitProps } from "#composer/submit.tsx";
import { Toolbar } from "#composer/toolbar.ts";
import { type Suggestion } from "#composer/use-mentions.ts";

/**
 * People the mention fixture suggests.
 */
export const PEOPLE: readonly Suggestion[] = [
  { description: "Finance", id: "ada", label: "Ada Okafor" },
  { id: "adil", label: "Adil Rahman" },
  { description: "Sales", id: "ben", label: "Ben Carter" },
];

/**
 * Describes the parts a case sets props on.
 */
interface Parts {
  /**
   * The props of the attach control.
   */
  readonly attach?: Partial<AttachTriggerProps>;

  /**
   * The props of the textarea.
   */
  readonly input?: InputProps;

  /**
   * The props of the root.
   */
  readonly root?: RootProps;

  /**
   * The props of the submit control.
   */
  readonly submit?: Partial<SubmitProps>;
}

/**
 * Renders a composer with a reply strip, an attachments row, the textarea, and a row with the
 * attach and submit controls.
 *
 * @param parts - The props the case sets on the root, the textarea and the two controls.
 * @returns The composer.
 */
export function composed(parts: Parts = {}): ReactElement {
  return (
    <Root {...parts.root}>
      <Context>Replying to Ada</Context>
      <Attachments>notes.txt</Attachments>
      <Input {...parts.input} />
      <Toolbar>
        <AttachTrigger {...parts.attach}>
          <span aria-hidden="true">+</span>
        </AttachTrigger>
        <Submit stopIcon={<span aria-hidden="true">■</span>} {...parts.submit}>
          <span aria-hidden="true">↑</span>
        </Submit>
      </Toolbar>
    </Root>
  );
}

/**
 * Renders a composer with a submit control and no textarea.
 *
 * @param root - The props the case sets on the root.
 * @returns The composer.
 */
export function bare(root: RootProps = {}): ReactElement {
  return (
    <Root {...root}>
      <Submit>
        <span aria-hidden="true">↑</span>
      </Submit>
    </Root>
  );
}

/**
 * Describes the props of the mention fixture.
 */
interface MentioningProps {
  /**
   * The props of the textarea.
   */
  readonly input?: InputProps;

  /**
   * The most suggestions the fixture passes, all of them unless stated.
   */
  readonly limit?: number | undefined;

  /**
   * The props of the root.
   */
  readonly root?: RootProps;
}

/**
 * Renders a composer whose `@` suggests the people whose names contain the term.
 *
 * @param props - The limit and the props of the root and the textarea.
 * @returns The composer.
 */
// eslint-disable-next-line react/only-export-components -- a fixture renders the component through `mentioning`
function Mentioning({ input, limit, root }: MentioningProps): ReactElement {
  const [query, setQuery] = useState<Query | undefined>();
  const term = query?.term.toLowerCase() ?? "";
  const found = PEOPLE.filter((person) => person.label.toLowerCase().includes(term));

  return (
    <Root {...root}>
      <Input
        onQueryChange={setQuery}
        suggestions={query === undefined ? [] : found.slice(0, limit)}
        suggestionsLabel="People"
        triggers={["@"]}
        {...input}
      />
      <Toolbar>
        <Submit>
          <span aria-hidden="true">↑</span>
        </Submit>
      </Toolbar>
    </Root>
  );
}

/**
 * Renders the mention fixture.
 *
 * @param props - The limit and the props of the root and the textarea.
 * @returns The composer.
 */
export function mentioning(props: MentioningProps = {}): ReactElement {
  return <Mentioning {...props} />;
}

/**
 * Types text into the textarea with the caret at its end, the way a browser reports a keystroke.
 *
 * @param text - The whole text after the keystroke.
 */
export function keyedIn(text: string): void {
  const textarea = field();

  act(() => {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set?.call(
      textarea,
      text,
    );
    textarea.setSelectionRange(text.length, text.length);
    fireEvent(textarea, new InputEvent("input", { bubbles: true, inputType: "insertText" }));
  });
}

/**
 * Returns the textarea.
 */
export function field(): HTMLTextAreaElement {
  const found = screen.getByRole("textbox");

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the composer's only textbox is its textarea
  return found as HTMLTextAreaElement;
}

/**
 * Types text into the textarea the way a change event reports it.
 *
 * @param text - The whole text after the edit.
 */
export function typed(text: string): void {
  fireEvent.change(field(), { target: { value: text } });
}

/**
 * Presses a control by its name inside `act`.
 *
 * @param name - The control's accessible name.
 */
export function pressed(name: string): void {
  act(() => {
    screen.getByRole("button", { name }).click();
  });
}

/**
 * Returns a small text file.
 *
 * @param name - The file's name.
 */
export function fileOf(name = "notes.txt"): File {
  return new File(["Draft for Friday"], name, { type: "text/plain" });
}
