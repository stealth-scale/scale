/**
 * Starts the splitter machine in application code and provides its api to the parts.
 *
 * @remarks
 *   An application calls `useSplitter` and passes the api to `Splitter.Root`, so a control outside
 *   the root, such as a toolbar button that collapses a panel, calls the api. The machine builds
 *   the ids of the panels and the triggers from the caller's ids, so the hook encodes them, and a
 *   panel id with a space still makes a valid `aria-controls`. Enter on a trigger collapses a
 *   collapsible panel before it and restores the size the panel had before the collapse, as the
 *   WAI-ARIA window splitter pattern describes.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as splitter from "@zag-js/splitter";

import { createRequiredContext, omitUndefined } from "@stealthscale/hooks";

/**
 * Describes the api `useSplitter` returns: the sizes, the methods that change them and a prop
 * getter per part.
 *
 * @remarks
 *   The type is the return type of `connect`, so it follows the installed machine version. That
 *   type references `@zag-js/types`, so the package declares that package as a dependency.
 */
export type SplitterApi = ReturnType<typeof splitter.connect>;

/**
 * Describes the machine settings a caller passes to `useSplitter`: the panels, their sizes and the
 * callbacks.
 */
export interface SplitterOptions extends Omit<splitter.Props, "id" | "ids"> {
  /**
   * Base of the ids of the root, the panels and the triggers. A generated id is used when absent.
   */
  readonly id?: string | undefined;
}

/**
 * Creates the context through which the root provides the api to its parts.
 *
 * @remarks
 *   `useSplitterContext` throws when no `Splitter.Root` is mounted above the calling part.
 */
export const [ApiProvider, useSplitterContext] = createRequiredContext<SplitterApi>("Splitter");

/**
 * Creates the context through which a trigger provides its id and its disabled state to the line
 * and the pill inside it.
 */
export const [TriggerProvider, useTriggerContext] =
  createRequiredContext<splitter.ResizeTriggerProps>("Splitter.ResizeTrigger");

/**
 * Runs the splitter machine with an Enter that restores a collapsed panel to its size before the
 * collapse.
 *
 * @remarks
 *   The machine's own Enter expands a collapsed panel to its minimum size. The api's collapse
 *   records the size before the collapse and its expansion restores it, so Enter sends their
 *   events for the panel before the focused trigger.
 */
const MACHINE: typeof splitter.machine = {
  ...splitter.machine,
  implementations: {
    ...splitter.machine.implementations,
    actions: {
      ...splitter.machine.implementations?.actions,
      /**
       * Collapses the collapsible panel before the focused trigger, or expands it to its size
       * before the collapse.
       */
      collapseOrExpandPanel({ context, send }) {
        const before = context.get("keyboardState")?.resolvedResizeTriggerId?.split(":")[0];
        const panels = context.get("panels");
        const index = panels.findIndex((panel) => panel.id === before);
        const panel = panels[index];

        if (panel?.collapsible !== true) return;

        const collapsed =
          context.get("size")[index]?.toFixed(10) === (panel.collapsedSize ?? 0).toFixed(10);

        send({ id: panel.id, type: collapsed ? "PANEL.EXPAND" : "PANEL.COLLAPSE" });
      },
    },
  },
};

/**
 * Returns the ids of the panels and the triggers, each built from its encoded id.
 *
 * @param id - Base of the ids.
 */
function idsOf(id: string): splitter.ElementIds {
  return {
    panel: (panel) => `splitter:${id}:panel:${encodeURIComponent(String(panel))}`,
    resizeTrigger: (trigger) => `splitter:${id}:trigger:${encodeURIComponent(trigger)}`,
  };
}

/**
 * Starts the splitter machine and returns its connected api.
 *
 * @param options - The machine settings. A generated id is used when `id` is absent.
 * @returns The api the root provides to its parts.
 */
export function useSplitter(options: SplitterOptions): SplitterApi {
  const generated = useId();
  const id = options.id ?? generated;
  const service = useMachine(MACHINE, { ...omitUndefined(options), id, ids: idsOf(id) });

  return splitter.connect(service, normalizeProps);
}
