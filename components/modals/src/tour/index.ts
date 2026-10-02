/**
 * Exports the tour: `useTour` for the machine an application starts, the thirteen parts, composed
 * as `Tour.Root` around a backdrop, a spotlight and a positioner that places the card, and
 * `Actions`, which renders the current step's actions.
 */

export {
  type StatusChangeDetails,
  type StepAction,
  type StepChangeDetails,
  type StepDetails,
  type StepEffectArgs,
} from "@zag-js/tour";

export { ActionTrigger, type ActionTriggerProps } from "#tour/action-trigger.tsx";
export { Actions, type ActionsProps } from "#tour/actions.ts";
export { ArrowTip, type ArrowTipProps } from "#tour/arrow-tip.tsx";
export { Arrow, type ArrowProps } from "#tour/arrow.tsx";
export { Backdrop, type BackdropProps } from "#tour/backdrop.tsx";
export { CloseTrigger, type CloseTriggerProps } from "#tour/close-trigger.tsx";
export { Content, type ContentProps } from "#tour/content.tsx";
export { Control, type ControlProps } from "#tour/control.ts";
export { Description, type DescriptionProps } from "#tour/description.tsx";
export { type TourApi, type TourOptions, useTour } from "#tour/machine.ts";
export { Positioner, type PositionerProps } from "#tour/positioner.tsx";
export { ProgressText, type ProgressTextProps } from "#tour/progress-text.tsx";
export { Root, type RootProps } from "#tour/root.tsx";
export { Spotlight, type SpotlightProps } from "#tour/spotlight.tsx";
export { Title, type TitleProps } from "#tour/title.tsx";
