/**
 * Fixtures for the toast specs: a toaster made for one case, a region that renders every part, a
 * toast raised inside `act`, and the wait for the machines' animation frames.
 */

import { type ReactElement } from "react";

import { act } from "@testing-library/react";
import { type StoreProps } from "@zag-js/toast";

import {
  ActionTrigger,
  CloseTrigger,
  Content,
  createToaster,
  Description,
  Indicator,
  Region,
  type RegionProps,
  Root,
  Title,
  type Toaster,
  type ToastOptions,
} from "#toast/index.ts";

/**
 * Creates a toaster at the bottom end of the window, with the options the case sets.
 *
 * @param options - The options the case sets on the store.
 * @returns The toaster.
 */
export function toasterOf(options: StoreProps = {}): Toaster {
  return createToaster({ placement: "bottom-end", ...options });
}

/**
 * Renders a region whose toasts render every part, with the props the case sets on the region.
 *
 * @param toaster - The store the region renders.
 * @param props - The props the case sets on the region.
 * @returns The region.
 */
export function regioned(
  toaster: Toaster,
  props: Partial<Omit<RegionProps, "children" | "toaster">> = {},
): ReactElement {
  return (
    <Region toaster={toaster} {...props}>
      {(toast) => (
        <Root>
          <Indicator>!</Indicator>
          <Content>
            <Title>{toast.title}</Title>
            <Description>{toast.description}</Description>
          </Content>
          {toast.action === undefined ? null : <ActionTrigger>{toast.action.label}</ActionTrigger>}
          <CloseTrigger>x</CloseTrigger>
        </Root>
      )}
    </Region>
  );
}

/**
 * Waits two animation frames inside `act`, in which the toast's machine mounts it and measures it.
 */
export async function framed(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });
  });
}

/**
 * Raises a toast inside `act` and waits for its machine to mount it.
 *
 * @param toaster - The store to raise the toast into.
 * @param options - The toast.
 * @returns The toast's id.
 */
export async function raised(toaster: Toaster, options: ToastOptions): Promise<string> {
  let id = "";

  await act(async () => {
    id = toaster.create(options);
    await Promise.resolve();
  });
  await framed();

  return id;
}
