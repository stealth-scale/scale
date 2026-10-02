import { type ReactElement, type ReactNode } from "react";

import { type RoutedProps, type TargetedProps } from "@stealthscale/sdk-core";
import { Slot } from "@stealthscale/sdk-plugin";

import { shopContract } from "#shop.fixtures.ts";

export interface AisleProps {
  readonly aisle: string;
}

export function CartPage(): ReactElement {
  return (
    <>
      <h1>Cart</h1>
      <Slot props={{ aisle: "fruit" }} slot={shopContract.slots.aisle} />
    </>
  );
}

export function CartFallback(): ReactElement {
  return <h1>Cart unavailable</h1>;
}

export function CrashPage(): ReactNode {
  throw new Error("crashed");
}

export function BlindPage(): ReactElement {
  // eslint-disable-next-line jsx-a11y/alt-text -- the page renders an image without a name for the audit to report
  return <img src="cart.png" />;
}

export function HiddenPage(): ReactElement {
  return <h1>Hidden</h1>;
}

export function StockPage(): ReactElement {
  return <h1>Stock</h1>;
}

export function Banner({ aisle }: AisleProps & TargetedProps): ReactElement {
  return <p>{`aisle ${aisle}`}</p>;
}

export function Wrapper({ children }: { readonly children?: ReactNode }): ReactElement {
  return <div>{children}</div>;
}

export function Broken(): ReactNode {
  throw new Error("broken");
}

export function Linked({ routeId }: RoutedProps & TargetedProps): ReactElement {
  return <p>{`linked to ${routeId}`}</p>;
}

export function Notice(): ReactElement {
  return <p>Notice settings</p>;
}
