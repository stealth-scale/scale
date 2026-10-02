/**
 * Connects the Zag progress machine and provides its API to the parts.
 *
 * @remarks
 *   A `null` value is a value the machine does not know. The track then leaves out `aria-valuenow`,
 *   and the range sets `data-state="indeterminate"`. The machine formats the value with
 *   `Intl.NumberFormat` in `locale`, as a percentage unless `formatOptions` states otherwise.
 */

import { useId } from "react";

import * as progress from "@zag-js/progress";
import { normalizeProps, useMachine } from "@zag-js/react";
import { createSplitProps } from "@zag-js/utils";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * API returned by `progress.connect`: a prop getter per part, the value, its percentage and its
 * setters.
 *
 * @remarks
 *   The type derives from `connect`, so it follows the installed machine version. The derived type
 *   references `@zag-js/types`, so the package declares that package as a dependency.
 */
export type ProgressApi = ReturnType<typeof progress.connect>;

/**
 * Machine settings a caller passes to the root, `id` included, all optional.
 *
 * @remarks
 *   `translations` is omitted, because a component's words are props with English defaults.
 *   `orientation` is omitted, because the recipe styles a horizontal track only.
 */
export type ProgressOptions = Omit<Partial<progress.Props>, "orientation" | "translations">;

/**
 * Describes the running machine: its connected API and the ID its label element takes.
 */
export interface Running {
  /**
   * The connected API.
   */
  readonly api: ProgressApi;

  /**
   * ID of the label element, which names the track once a label renders.
   */
  readonly labelId: string;
}

/**
 * Context through which the root provides the connected API to its parts.
 *
 * @remarks
 *   `useProgress` throws when no `Progress.Root` is mounted above the calling part.
 */
export const [ApiProvider, useProgress] = createRequiredContext<ProgressApi>("Progress");

/**
 * Starts the progress machine and returns its connected API and the label's ID.
 *
 * @remarks
 *   The label's ID is fixed here and passed to the machine in `ids`, so the track can name the
 *   element the machine writes the ID on. A caller's `ids.label` replaces the generated ID.
 * @param options - Machine settings split from the root's props. A generated ID is used when `id`
 *   is absent.
 */
export function useProgressMachine(options: ProgressOptions): Running {
  const generated = useId();
  const id = options.id ?? generated;
  const labelId = options.ids?.label ?? `progress-${id}-label`;
  const service = useMachine(progress.machine, {
    ...omitUndefined(options),
    id,
    ids: { ...options.ids, label: labelId },
  });

  return { api: progress.connect(service, normalizeProps), labelId };
}

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list is `progress.props` without `orientation` and `translations`, so it follows the
 *   installed machine version. The machine's own splitter types `id` as required, and the root
 *   generates the ID after splitting, so the splitter is rebuilt over `ProgressOptions`.
 */
export const splitProgressProps = splitEnumerable(
  createSplitProps<ProgressOptions>(
    progress.props.filter(
      (key): key is keyof ProgressOptions => key !== "orientation" && key !== "translations",
    ),
  ),
);
