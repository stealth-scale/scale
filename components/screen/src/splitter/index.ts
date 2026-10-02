/**
 * Exports the splitter: `useSplitter` for the machine an application starts, and the parts,
 * composed as `Splitter.Root` around panels with a resize trigger between each two.
 */

export {
  type ExpandCollapseDetails,
  type PanelData,
  type PanelSize,
  type ResizeDetails,
  type ResizeEndDetails,
} from "@zag-js/splitter";

export { type SplitterApi, type SplitterOptions, useSplitter } from "#splitter/machine.ts";
export { Panel, type PanelProps } from "#splitter/panel.tsx";
export {
  ResizeTriggerIndicator,
  type ResizeTriggerIndicatorProps,
} from "#splitter/resize-trigger-indicator.tsx";
export {
  ResizeTriggerSeparator,
  type ResizeTriggerSeparatorProps,
} from "#splitter/resize-trigger-separator.tsx";
export { ResizeTrigger, type ResizeTriggerProps } from "#splitter/resize-trigger.tsx";
export { Root, type RootProps } from "#splitter/root.tsx";
