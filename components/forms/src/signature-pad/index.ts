/**
 * Exports the signature pad's parts, composed as `SignaturePad.Root` around a label and a control
 * that contains the strokes, the guide and the clear trigger, and the types its callbacks receive.
 */

export { ClearTrigger, type ClearTriggerProps } from "#signature-pad/clear-trigger.tsx";
export { Control, type ControlProps } from "#signature-pad/control.tsx";
export { Guide, type GuideProps } from "#signature-pad/guide.tsx";
export { Label, type LabelProps } from "#signature-pad/label.tsx";
export {
  type DataUrlType,
  type DrawDetails,
  type DrawEndDetails,
  type DrawingOptions,
} from "#signature-pad/machine.ts";
export { Root, type RootProps } from "#signature-pad/root.tsx";
export { Segment, type SegmentProps } from "#signature-pad/segment.tsx";
