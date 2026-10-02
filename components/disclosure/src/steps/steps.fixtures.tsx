/**
 * Fixtures for the steps specs: a root around one item, a whole flow of three steps, and a stub of
 * `ResizeObserver` that a case triggers by hand.
 */

import { type ReactElement, type ReactNode } from "react";

import { vi } from "vitest";

import { CompletedContent } from "#steps/completed-content.tsx";
import { Content } from "#steps/content.tsx";
import { Indicator } from "#steps/indicator.tsx";
import { Item } from "#steps/item.tsx";
import { List } from "#steps/list.tsx";
import { NextTrigger } from "#steps/next-trigger.tsx";
import { PrevTrigger } from "#steps/prev-trigger.tsx";
import { Root, type RootProps } from "#steps/root.tsx";
import { Separator } from "#steps/separator.tsx";
import { Title } from "#steps/title.tsx";
import { Trigger } from "#steps/trigger.tsx";

/**
 * Titles of the composed flow's steps.
 */
export const TITLES = ["Account", "Amount", "Confirm"] as const;

/**
 * Renders parts inside a root of three steps and the item of the step at the index given.
 *
 * @param children - The parts under test.
 * @param props - The props the case sets on the root.
 * @param index - Index of the item around the parts.
 * @returns The root with the item around the parts.
 */
export function itemed(children: ReactNode, props: RootProps = {}, index = 0): ReactElement {
  return (
    <Root count={TITLES.length} {...props}>
      <List>
        <Item index={index}>{children}</Item>
      </List>
    </Root>
  );
}

/**
 * Renders a flow of three steps, each a trigger with a disc and a title, with the content of each,
 * the completed content and the two buttons, with the props the case sets on the root.
 *
 * @param props - The props the case sets on the root.
 * @returns The flow.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root count={TITLES.length} {...props}>
      <List>
        {TITLES.map((title, index) => (
          <Item index={index} key={title}>
            <Trigger>
              <Indicator />
              <Title>{title}</Title>
            </Trigger>
            <Separator />
          </Item>
        ))}
      </List>
      {TITLES.map((title, index) => (
        <Content index={index} key={title}>{`About ${title}`}</Content>
      ))}
      <CompletedContent>Done</CompletedContent>
      <PrevTrigger>Back</PrevTrigger>
      <NextTrigger>Next</NextTrigger>
    </Root>
  );
}

/**
 * Describes the stub of `ResizeObserver`: how to run its callback and whether it stopped.
 */
export interface Observed {
  /**
   * Returns whether the observer disconnected.
   */
  readonly disconnected: () => boolean;

  /**
   * Runs the observer's callback, as a change of size does.
   */
  readonly resize: () => void;
}

/**
 * Replaces `ResizeObserver` with a stub whose callback a case runs by hand.
 *
 * @remarks
 *   The shared test preset unstubs globals after every case.
 * @returns The handles on the stub.
 */
export function observer(): Observed {
  const held = { callback: (): void => undefined, disconnected: false };

  /**
   * Replaces `ResizeObserver`, keeping its callback.
   */
  class Stub {
    /**
     * Keeps the callback the observer runs on a change of size.
     *
     * @param callback - The callback.
     */
    constructor(callback: () => void) {
      held.callback = callback;
    }

    /**
     * Records that the observer stopped.
     */
    disconnect(): void {
      held.disconnected = true;
    }

    /**
     * Accepts an element, as the real observer does.
     */
    observe(): void {
      held.disconnected = false;
    }
  }

  vi.stubGlobal("ResizeObserver", Stub);

  return {
    disconnected: () => held.disconnected,
    resize: () => {
      held.callback();
    },
  };
}
