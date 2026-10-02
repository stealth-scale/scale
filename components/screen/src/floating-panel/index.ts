/**
 * Exports the floating panel's thirteen parts, composed as `FloatingPanel.Root` around a trigger
 * and a positioner that places the panel, and the types of the machine's details.
 */

export type {
  AnchorPositionDetails,
  OpenChangeDetails,
  Point,
  PositionChangeDetails,
  ResizeTriggerAxis,
  Size,
  SizeChangeDetails,
  Stage,
  StageChangeDetails,
} from "@zag-js/floating-panel";

export { Body, type BodyProps } from "#floating-panel/body.tsx";
export { CloseTrigger, type CloseTriggerProps } from "#floating-panel/close-trigger.tsx";
export { Content, type ContentProps } from "#floating-panel/content.tsx";
export { Control, type ControlProps } from "#floating-panel/control.tsx";
export { DragTrigger, type DragTriggerProps } from "#floating-panel/drag-trigger.tsx";
export { Header, type HeaderProps } from "#floating-panel/header.tsx";
export { Positioner, type PositionerProps } from "#floating-panel/positioner.tsx";
export { ResizeTrigger, type ResizeTriggerProps } from "#floating-panel/resize-trigger.tsx";
export { ResizeTriggers, type ResizeTriggersProps } from "#floating-panel/resize-triggers.tsx";
export { Root, type RootProps } from "#floating-panel/root.tsx";
export { StageTrigger, type StageTriggerProps } from "#floating-panel/stage-trigger.tsx";
export { Title, type TitleProps } from "#floating-panel/title.tsx";
export { Trigger, type TriggerProps } from "#floating-panel/trigger.tsx";
