/**
 * Runs the color picker machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the field, the
 *   area, the sliders, the inputs and the swatches report one color. The machine derives every
 *   element's identifier from `id`. A caller passes the color as a `Color` or as any CSS color
 *   string, which the hook parses.
 */

import { useId } from "react";

import * as colorPicker from "@zag-js/color-picker";
import { type Color, parseColor } from "@zag-js/color-utils";
import { normalizeProps, useMachine } from "@zag-js/react";
import { createSplitProps } from "@zag-js/utils";

import {
  createRequiredContext,
  omitUndefined,
  type Presence,
  splitEnumerable,
} from "@stealthscale/hooks";

/**
 * Describes the api `colorPicker.connect` returns: a prop getter per part, and the machine's
 * color, format and the methods that change them.
 *
 * @remarks
 *   The type is the return type of `connect`, so it follows the installed machine. It references
 *   `@zag-js/color-utils` and `@zag-js/types`, so the package declares both dependencies.
 */
export type ColorPickerApi = ReturnType<typeof colorPicker.connect>;

/**
 * Describes the machine options, every one optional, with the color as a `Color` or a string.
 */
export interface ColorPickerOptions extends Omit<
  Partial<colorPicker.Props>,
  "defaultValue" | "value"
> {
  /**
   * Color the picker starts with, as a `Color` or any CSS color string. Defaults to `#000000`.
   */
  readonly defaultValue?: Color | string | undefined;

  /**
   * Color the caller keeps, as a `Color` or any CSS color string.
   */
  readonly value?: Color | string | undefined;
}

/**
 * Describes what `onValueChange` and `onValueChangeEnd` receive: the color and its string in the
 * format in force.
 */
export type ValueChangeDetails = colorPicker.ValueChangeDetails;

/**
 * Describes what `onOpenChange` receives: whether the panel opens, and the color.
 */
export type OpenChangeDetails = colorPicker.OpenChangeDetails;

/**
 * Describes what `onFormatChange` receives: the format in force.
 */
export type FormatChangeDetails = colorPicker.FormatChangeDetails;

/**
 * Describes what `onInteractOutside` receives: the press or the focus outside the panel, whether
 * its target takes focus, and whether it opens a context menu.
 */
type InteractOutsideEvent = Parameters<NonNullable<colorPicker.Props["onInteractOutside"]>>[0];

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useColorPicker` throws for a part rendered outside `ColorPicker.Root`.
 */
export const [ApiProvider, useColorPicker] = createRequiredContext<ColorPickerApi>("ColorPicker");

/**
 * Provides the panel's presence to the positioner and the content, and reads it back.
 */
export const [PresenceProvider, usePanelPresence] = createRequiredContext<Presence>("ColorPicker");

/**
 * Describes the IDs the parts name and find each other by.
 */
export interface Ids {
  /**
   * ID of the panel.
   */
  readonly content: string;

  /**
   * ID of the text input in the control.
   */
  readonly field: string;

  /**
   * ID of the hidden input a form submits.
   */
  readonly hiddenInput: string;

  /**
   * ID the machine gives `ColorPicker.Label`.
   */
  readonly label: string;

  /**
   * ID of the trigger.
   */
  readonly trigger: string;
}

/**
 * Describes what the root needs from the machine: the api, the IDs and the function a slider's
 * thumb sets the color through.
 */
export interface ColorPickerMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: ColorPickerApi;

  /**
   * Sets the color in the format it is passed in, unless the picker is disabled or read-only.
   *
   * @remarks
   *   A drag keeps the color in the format of the channel it moves, so a grey keeps the hue a
   *   person gave it. A key on a slider's thumb sets the color the same way.
   */
  readonly change: (color: Color) => void;

  /**
   * IDs the parts name and find each other by.
   */
  readonly ids: Ids;
}

/**
 * Returns a color passed as a string as a `Color`, and anything else unchanged.
 *
 * @param color - A `Color`, a CSS color string, or nothing.
 * @returns The `Color`, or nothing.
 * @throws {@link Error} When the string is not a color.
 */
export function colorOf(color?: Color | string): Color | undefined {
  return typeof color === "string" ? parseColor(color) : color;
}

/**
 * Returns the IDs of the parts: the caller's where it states one, else one built from the
 * machine's ID.
 *
 * @remarks
 *   Inside a field the hidden input takes the field's control ID, so the field's label points at
 *   it and the input moves focus on to the text input or the trigger.
 * @param id - The machine's ID.
 * @param stated - The IDs the caller passes, or nothing.
 * @param control - ID the field around the picker gives its control, or nothing outside a field.
 * @returns The IDs of the panel, the text input, the hidden input, the label and the trigger.
 */
export function idsOf(id: string, stated?: colorPicker.ElementIds, control?: string): Ids {
  return {
    content: stated?.content ?? `color-picker:${id}:content`,
    field: `color-picker:${id}:field`,
    hiddenInput: stated?.hiddenInput ?? control ?? `color-picker:${id}:hidden-input`,
    label: stated?.label ?? `color-picker:${id}:label`,
    trigger: stated?.trigger ?? `color-picker:${id}:trigger`,
  };
}

/**
 * Starts the color picker machine and returns its connected api and the IDs of the parts.
 *
 * @remarks
 *   An ID or an option the caller passes replaces each. The panel opens under the trigger with its
 *   end on the trigger's end, which is the end of a field that ends with its trigger. The machine
 *   sets its `restoreFocus` flag on a press or a focus outside and reads it one render later, so
 *   the hook closes the panel on either. It leaves focus on a control a person moved it to, and
 *   returns focus to the trigger after a press on anything else. Escape closes the panel through
 *   the machine, which returns focus to the trigger.
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @param control - ID the field around the picker gives its control, or nothing outside a field.
 * @returns The connected api, the IDs, and the function that sets the color in its own format.
 */
export function useColorPickerMachine(
  options: ColorPickerOptions,
  control: string | undefined,
): ColorPickerMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const ids = idsOf(id, options.ids, control);
  const { field: _field, ...machineIds } = ids;
  const service = useMachine(colorPicker.machine, {
    ...omitUndefined({
      ...options,
      defaultValue: colorOf(options.defaultValue),
      value: colorOf(options.value),
    }),
    id,
    ids: { ...options.ids, ...machineIds },
    onInteractOutside: (event: InteractOutsideEvent): void => {
      options.onInteractOutside?.(event);

      if (event.defaultPrevented) return;

      event.preventDefault();

      if (!event.detail.focusable && !event.detail.contextmenu) {
        service.scope.getById(ids.trigger)?.focus({ preventScroll: true });
      }

      service.send({ type: "CLOSE" });
    },
    positioning: { placement: "bottom-end", ...options.positioning },
  });

  /**
   * Sets the color without converting it to the format in force, as the machine's drag does.
   */
  function change(color: Color): void {
    if (service.computed("interactive")) service.context.set("value", color);
  }

  return { api: colorPicker.connect(service, normalizeProps), change, ids };
}

/**
 * Splits the root's props into the machine's options and the element's props.
 *
 * @remarks
 *   The key list is the machine's own `props`, so it follows the installed machine. The machine's
 *   splitter types the color as a `Color`, and the root takes a string too, so the splitter is
 *   rebuilt over `ColorPickerOptions` with `createSplitProps`.
 */
export const splitColorPickerProps = splitEnumerable(
  createSplitProps<ColorPickerOptions>(colorPicker.props),
);
