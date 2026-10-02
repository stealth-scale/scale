/**
 * Builds the conversations the part specs render, lays out their transcripts, and waits for the
 * frames the scroll engine steps in.
 */

import { type ReactElement } from "react";

import { act, screen } from "@testing-library/react";
import { vi } from "vitest";

import { Content, type ContentProps } from "#conversation/content.tsx";
import { JumpTrigger, type JumpTriggerProps } from "#conversation/jump-trigger.tsx";
import { Root, type RootProps } from "#conversation/root.tsx";
import { useConversation } from "#conversation/use-conversation.ts";

/**
 * Height of every element's box, in pixels.
 */
const HEIGHT = 100;

/**
 * Height of every element's content, four boxes tall, so a viewport overflows.
 */
const TALL = HEIGHT * 4;

/**
 * Describes the parts a case sets props on, and whether the root runs its own engine.
 */
interface Parts {
  /**
   * The props of the transcript.
   */
  readonly content?: ContentProps;

  /**
   * The props of the jump trigger.
   */
  readonly jump?: Partial<JumpTriggerProps>;

  /**
   * Whether the root runs its own engine, leaving the controls' engine attached to nothing.
   */
  readonly owned?: boolean;

  /**
   * The props of the root.
   */
  readonly root?: RootProps;
}

/**
 * Renders a conversation of two messages whose engine the application runs, and outside it the
 * buttons a case presses to scroll through the engine and the view's place.
 *
 * @param parts - The props the case sets on the root, the transcript and the jump trigger.
 * @returns The conversation, the buttons and an `output` with `end` or `away`.
 */
// eslint-disable-next-line react/only-export-components -- a fixture renders the component through `transcript`
function Conversing(parts: Parts): ReactElement {
  const conversation = useConversation();

  return (
    <>
      <Root conversation={parts.owned === true ? undefined : conversation} {...parts.root}>
        <Content {...parts.content}>
          <p id="first">The invoice from Northwind is in.</p>
          <p id="second">Approved. I will send it to finance.</p>
        </Content>
        <JumpTrigger {...parts.jump}>
          <span aria-hidden="true">↓</span>
        </JumpTrigger>
      </Root>
      <button
        onClick={() => {
          conversation.scrollToMessage("first");
        }}
        type="button"
      >
        First
      </button>
      <button
        onClick={() => {
          conversation.scrollToMessage("missing");
        }}
        type="button"
      >
        Missing
      </button>
      <button onClick={conversation.scrollToEnd} type="button">
        End
      </button>
      <output>{conversation.atEnd ? "end" : "away"}</output>
    </>
  );
}

/**
 * Renders the conversation fixture.
 *
 * @param parts - The props the case sets on the root, the transcript and the jump trigger.
 * @returns The conversation and its controls.
 */
export function transcript(parts: Parts = {}): ReactElement {
  return <Conversing {...parts} />;
}

/**
 * Lays every element out 100 pixels tall around content 400 pixels tall.
 *
 * @remarks
 *   Happy-dom lays out nothing, so a viewport never overflows and the engine's target is 0. The
 *   shared test preset restores the spies after every case.
 */
export function laidOut(): void {
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(HEIGHT);
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(TALL);
}

/**
 * Returns the transcript's log.
 */
export function log(): HTMLElement {
  return screen.getByRole("log");
}

/**
 * Presses one of the controls inside `act`.
 *
 * @param name - The control's name.
 */
export function pressed(name: "End" | "First" | "Missing"): void {
  act(() => {
    screen.getByRole("button", { name }).click();
  });
}

/**
 * Waits inside `act` for the next animation frame and the tasks it schedules.
 */
export async function framed(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 5);
      });
    });
  });
}
