/**
 * Renders the region a toaster raises its toasts into, and each toast through a render function.
 *
 * @remarks
 *   The machine makes the element a `region` landmark named `<label>, <placement> (alt+T)`, fixes
 *   it to the placement's edge of the window, and announces each new toast through
 *   `aria-live="polite"`. Alt+T moves focus to the region. A pointer resting on the region, or
 *   focus inside it, pauses every toast. The machine derives the region's id from the placement, so
 *   a page renders one region per placement. While the toaster's `pauseOnPageIdle` is true, the
 *   region pauses every toast when the page is hidden and resumes them when it shows again, because
 *   the machine sends that pause to no handler.
 */

import { type ComponentProps, type ReactElement, type ReactNode, useEffect } from "react";

import { mergeProps } from "@zag-js/react";

import { Actor } from "#toast/actor.tsx";
import { withProvider } from "#toast/context.ts";
import { type Toaster, type ToastOptions, useRegionMachine } from "#toast/machine.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "region");

/**
 * Describes the props of the region: the toaster, the landmark's name, the text direction, the
 * render function and the props of a `div`.
 */
export interface RegionProps extends Omit<ComponentProps<typeof Framed>, "children" | "dir"> {
  /**
   * Renders one toast, which the region wraps in the toast's own machine.
   */
  readonly children: (toast: ToastOptions) => ReactNode;

  /**
   * The text direction, which mirrors the start and end placements.
   */
  readonly dir?: "ltr" | "rtl" | undefined;

  /**
   * The landmark's name, before the placement and the hotkey. `Notifications` by default.
   */
  readonly label?: string | undefined;

  /**
   * The store the region renders the toasts of.
   */
  readonly toaster: Toaster;
}

/**
 * Pauses every toast of a toaster while the page is hidden.
 *
 * @param toaster - The store whose toasts pause.
 */
function useIdlePause(toaster: Toaster): void {
  useEffect(() => {
    /**
     * Pauses the toasts as the page hides and resumes them as it shows.
     */
    function changed(): void {
      if (document.visibilityState === "hidden") toaster.pause();
      else toaster.resume();
    }

    if (toaster.attrs.pauseOnPageIdle) document.addEventListener("visibilitychange", changed);

    return (): void => {
      document.removeEventListener("visibilitychange", changed);
    };
  }, [toaster]);
}

/**
 * Renders the region with the group machine's props merged over the caller's, and each toast.
 *
 * @param props - The toaster, the name, the direction, the render function and the props of a
 *   `div`.
 * @returns The `div` element.
 */
export function Region({
  children,
  dir,
  label = "Notifications",
  toaster,
  ...props
}: RegionProps): ReactElement {
  const { api, service } = useRegionMachine(toaster, dir);

  useIdlePause(toaster);

  return (
    <Framed {...mergeProps(api.getGroupProps({ label }), props)}>
      {api.getToasts().map((value, index) => (
        <Actor index={index} key={value.id} parent={service} render={children} value={value} />
      ))}
    </Framed>
  );
}
