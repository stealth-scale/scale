/**
 * Renders the image croppers the part specifications test, and loads their picture into a viewport
 * of a measured size.
 */

import { type ReactElement } from "react";

import { fireEvent } from "@testing-library/react";
import { vi } from "vitest";

import { settled } from "@stealthscale/testing-react";

import {
  Grid,
  Handle,
  handles,
  Image,
  type ImageCropperOptions,
  Root,
  type RootProps,
  Selection,
  type SelectionProps,
  useImageCropper,
  Viewport,
} from "#image-cropper/index.ts";

/**
 * Describes what a fixture cropper takes: the machine's settings and the props of the root and
 * the selection.
 */
export interface Fixture {
  /**
   * Machine settings `useImageCropper` takes.
   */
  readonly options?: ImageCropperOptions | undefined;

  /**
   * Props of the root, apart from the api.
   */
  readonly root?: Omit<RootProps, "cropper"> | undefined;

  /**
   * Props of the selection.
   */
  readonly selection?: SelectionProps | undefined;
}

/**
 * Renders a cropper with a picture, every handle and both grids.
 *
 * @param props - The machine's settings and the root's and the selection's props.
 * @returns The cropper.
 */
// eslint-disable-next-line react/only-export-components -- a component runs the machine hook, and the fixtures export the element it renders
function Cropper({ options, root, selection }: Fixture): ReactElement {
  const cropper = useImageCropper(options);

  return (
    <Root cropper={cropper} {...root}>
      <Viewport>
        <Image src="/photo.webp" />
        <Selection {...selection}>
          {handles.map((position) => (
            <Handle key={position} position={position} />
          ))}
          <Grid axis="horizontal" />
          <Grid axis="vertical" />
        </Selection>
      </Viewport>
    </Root>
  );
}

/**
 * Renders a cropper with a picture, every handle and both grids.
 *
 * @param fixture - The machine's settings and the root's and the selection's props.
 * @returns The cropper.
 */
export function cropped(fixture: Fixture = {}): ReactElement {
  return <Cropper {...fixture} />;
}

/**
 * Loads a 960 by 640 picture into a viewport measured at 480 by 320, as a browser lays it out.
 *
 * @remarks
 *   Happy-dom lays out nothing and loads no picture, so the case stubs the box every element
 *   reports and the picture's natural size, then fires the picture's `load`.
 * @param container - The container the cropper rendered into.
 */
export async function loaded(container: HTMLElement): Promise<void> {
  const image = container.querySelector("img");

  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    DOMRect.fromRect({ height: 320, width: 480, x: 0, y: 0 }),
  );

  if (image !== null) {
    Object.defineProperty(image, "naturalWidth", { configurable: true, value: 960 });
    Object.defineProperty(image, "naturalHeight", { configurable: true, value: 640 });
    Object.defineProperty(image, "complete", { configurable: true, value: true });
    fireEvent.load(image);
  }

  await settled();
}
