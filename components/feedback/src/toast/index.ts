/**
 * Exports the toast: `createToaster` for the store an application raises toasts into, and the
 * parts, composed as `Toast.Region` around a render function that returns a `Toast.Root`.
 */

export { createStore as createToaster } from "@zag-js/toast";

export { ActionTrigger, type ActionTriggerProps } from "#toast/action-trigger.tsx";
export { CloseTrigger, type CloseTriggerProps } from "#toast/close-trigger.tsx";
export { Content, type ContentProps } from "#toast/content.ts";
export { Description, type DescriptionProps } from "#toast/description.tsx";
export { Indicator, type IndicatorProps } from "#toast/indicator.ts";
export { type Toaster, type ToastOptions } from "#toast/machine.ts";
export { Region, type RegionProps } from "#toast/region.tsx";
export { Root, type RootProps } from "#toast/root.tsx";
export { Title, type TitleProps } from "#toast/title.tsx";
