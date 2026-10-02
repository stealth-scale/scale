/**
 * Fixtures for the splitter specs: two panels with a trigger between them, the root's measured
 * size, and a key a person presses on a focused trigger.
 */

import { type ReactElement, type ReactNode } from "react";

import { act, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

import { settled } from "@stealthscale/testing-react";

import {
  Panel,
  type PanelData,
  ResizeTrigger,
  type ResizeTriggerProps,
  Root,
  type RootProps,
  type SplitterOptions,
  useSplitter,
} from "#splitter/index.ts";

/**
 * Panels of the fixture: a collapsible list of files a fifth to three fifths of the root wide, and
 * an editor.
 */
export const PANELS: PanelData[] = [
  { collapsedSize: 0, collapsible: true, id: "files", maxSize: 60, minSize: 20 },
  { id: "editor" },
];

/**
 * Describes the props of the fixture layout.
 */
interface LayoutProps {
  /**
   * The children of the trigger, which replace its line and pill.
   */
  readonly children?: ReactNode;

  /**
   * The machine's options, which replace the fixture's where they name the same option.
   */
  readonly options?: Partial<SplitterOptions> | undefined;

  /**
   * The root's props.
   */
  readonly root?: Omit<RootProps, "splitter"> | undefined;

  /**
   * The trigger's props.
   */
  readonly trigger?: Partial<ResizeTriggerProps> | undefined;
}

/**
 * Renders the files and the editor with a trigger between them.
 *
 * @param props - The trigger's children, the machine's options, the root's and the trigger's
 *   props.
 * @returns The splitter.
 */
// eslint-disable-next-line react/only-export-components -- the specifications render the machine through this layout, and fast refresh never loads a fixture
function Layout({ children, options, root, trigger }: LayoutProps): ReactElement {
  const splitter = useSplitter({ defaultSize: [30, 70], panels: PANELS, ...options });

  return (
    <Root splitter={splitter} {...root}>
      <Panel id="files">Files</Panel>
      <ResizeTrigger id="files:editor" {...trigger}>
        {children}
      </ResizeTrigger>
      <Panel id="editor">Editor</Panel>
    </Root>
  );
}

/**
 * Renders the fixture splitter: the files at 30% and the editor at 70% by default.
 *
 * @param props - The trigger's children, the machine's options, the root's and the trigger's
 *   props.
 * @returns The splitter.
 */
export function split(props: LayoutProps = {}): ReactElement {
  return <Layout {...props} />;
}

/**
 * Gives every element the box of a root the machine can size its panels in.
 *
 * @param width - Width of the box in pixels.
 * @param height - Height of the box in pixels.
 */
export function measured(width = 800, height = 400): void {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, width, height),
  );
}

/**
 * Focuses a trigger, which the machine moves only in its focused state, and presses a key on it.
 *
 * @param element - The trigger.
 * @param key - The key's name.
 * @param shiftKey - Whether Shift is held.
 */
export async function keyed(element: HTMLElement, key: string, shiftKey = false): Promise<void> {
  act(() => {
    element.focus();
  });
  await settled();
  fireEvent.keyDown(element, { key, shiftKey });
  await settled();
}
