/**
 * Fixtures for the action bar specs: a button in place of the selection, and the bar with a toolbar
 * of one action and the close trigger.
 */

import { type ReactElement, type ReactNode } from "react";

import { act } from "@testing-library/react";

import {
  CloseTrigger,
  Content,
  type ContentProps,
  Positioner,
  Root,
  type RootProps,
} from "#action-bar/index.ts";
import * as Toolbar from "#toolbar/index.ts";

/**
 * Renders the button in place of the selection and the bar, with the root's props.
 *
 * @param props - The root's props, open by default.
 * @param inside - Extra content inside the toolbar.
 * @param content - The content's props.
 * @returns The page.
 */
export function barred(
  props: Partial<RootProps> = {},
  inside?: ReactNode,
  content: ContentProps = {},
): ReactElement {
  return (
    <>
      <button type="button">Select invoices</button>
      <Root open {...props}>
        <Positioner>
          <Content {...content}>
            <Toolbar.Root aria-label="Actions for the selected invoices">
              <Toolbar.Action>Download</Toolbar.Action>
              {inside}
              <CloseTrigger aria-label="Clear selection">x</CloseTrigger>
            </Toolbar.Root>
          </Content>
        </Positioner>
      </Root>
    </>
  );
}

/**
 * Renders the page again inside `act`, and waits one task there, so the presence and the updates a
 * moved focus queues commit before the case reads the page.
 *
 * @param rerender - The render's `rerender`.
 * @param ui - The page to render.
 */
export async function redrawn(
  rerender: (ui: ReactElement) => void,
  ui: ReactElement,
): Promise<void> {
  await act(async () => {
    rerender(ui);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
  });
}

/**
 * Returns the polite live region the announcement is written to.
 */
export function region(): HTMLElement | null {
  return document.querySelector('[role="status"][aria-live="polite"]');
}

/**
 * Waits for the next animation frame inside `act`, in which the presence reads the closed bar's
 * animation and the live region writes its message.
 */
export async function framed(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
    await Promise.resolve();
  });
}
