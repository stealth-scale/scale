/**
 * Exports the components that show a picture of a person or a thing, crop a picture, show slides,
 * play a clip or a sound and frame another document: the avatar, the image cropper, the carousel,
 * the video, the audio element and the sandboxed frame. Each binds a recipe that the preset at
 * `./theme` registers with an application's style compiler.
 *
 * @packageDocumentation
 */

export * from "#audio/index.ts";
export * as Avatar from "#avatar/index.ts";
export * as Carousel from "#carousel/index.ts";
export * from "#iframe/index.ts";
export * as ImageCropper from "#image-cropper/index.ts";
export * from "#video/index.ts";
