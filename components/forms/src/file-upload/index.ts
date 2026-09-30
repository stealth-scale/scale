/**
 * Exports the file upload's parts, composed as `FileUpload.Root` around its label, a dropzone or a
 * trigger, and lists of files, and the types its callbacks receive.
 */

export { ClearTrigger, type ClearTriggerProps } from "#file-upload/clear-trigger.tsx";
export { Dropzone, type DropzoneProps } from "#file-upload/dropzone.tsx";
export { ItemContent, type ItemContentProps } from "#file-upload/item-content.ts";
export {
  ItemDeleteTrigger,
  type ItemDeleteTriggerProps,
} from "#file-upload/item-delete-trigger.tsx";
export { ItemGroup, type ItemGroupProps } from "#file-upload/item-group.tsx";
export { ItemName, type ItemNameProps } from "#file-upload/item-name.tsx";
export { ItemPreviewImage, type ItemPreviewImageProps } from "#file-upload/item-preview-image.tsx";
export { ItemPreview, type ItemPreviewProps } from "#file-upload/item-preview.tsx";
export { ItemSizeText, type ItemSizeTextProps } from "#file-upload/item-size-text.tsx";
export { Item, type ItemProps } from "#file-upload/item.tsx";
export { Items, type ItemsProps } from "#file-upload/items.tsx";
export { Label, type LabelProps } from "#file-upload/label.tsx";
export {
  type FileAcceptDetails,
  type FileChangeDetails,
  type FileError,
  type FileRejectDetails,
  type FileRejection,
  type FileValidateDetails,
  type ItemType,
} from "#file-upload/machine.ts";
export { Root, type RootProps } from "#file-upload/root.tsx";
export { Trigger, type TriggerProps } from "#file-upload/trigger.tsx";
