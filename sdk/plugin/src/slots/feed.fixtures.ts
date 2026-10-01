import { createElement, type ReactNode } from "react";

import { act, render, type RenderResult } from "@testing-library/react";

import {
  defineContract,
  definePlugin,
  extension,
  installed,
  type Product,
  props,
  type ResolvedExtension,
  resource,
  slot,
} from "@stealthscale/sdk-core";

import { type FixtureHost } from "#host/host.fixtures.tsx";
import { lazy, productOf } from "#host/product.fixtures.ts";
import { routedWrapper } from "#host/routed.fixtures.tsx";
import {
  Book,
  Border,
  Broken,
  Chip,
  Cover,
  Edge,
  First,
  Glow,
  Halo,
  Hint,
  type Item,
  Lead,
  Mark,
  Mended,
  Outline,
  Restock,
  Ring,
  Second,
  Tail,
} from "#slots/parts.fixtures.tsx";
import { type ExtensionStatus } from "#slots/statuses.ts";

export const BOOK: Item = { stock: 0, title: "Dune", type: "book" };

export const feedContract = defineContract("feed", (self) => ({
  resources: { item: resource({ description: "resources.item" }) },
  slots: {
    badge: slot({ arity: "one" }),
    frame: slot(),
    item: slot({
      ...props<{ readonly record: Item }>(),
      keyed: true,
      record: self.resource("item"),
      sample: { record: BOOK },
    }),
    panel: slot({ ...props<{ readonly label: string }>(), sample: { label: "Panel" } }),
  },
  version: "1.0.0",
}));

export const notesContract = defineContract("notes", (self) => ({
  extensions: {
    book: extension({ match: "book", position: "replace", target: feedContract.slots.item }),
    border: extension({ position: "wrap", target: feedContract.slots.panel }),
    broken: extension({ position: "replace", target: feedContract.slots.frame }),
    chip: extension({ position: "after", target: self.extension("tail") }),
    cover: extension({ position: "replace", target: self.extension("lead") }),
    first: extension({ position: "after", target: feedContract.slots.badge }),
    hint: extension({
      position: "after",
      target: self.extension("tail"),
      when: { authenticated: false },
    }),
    lead: extension({ position: "before", target: feedContract.slots.panel }),
    mark: extension({ position: "before", target: self.extension("tail") }),
    restock: extension({
      match: "book",
      position: "after",
      target: feedContract.slots.item,
      when: { field: { equals: 0, path: "stock" } },
    }),
    ring: extension({ position: "wrap", target: self.extension("tail") }),
    second: extension({ position: "after", target: feedContract.slots.badge }),
    tail: extension({ position: "after", target: feedContract.slots.panel }),
  },
  version: "1.0.0",
}));

export const framesContract = defineContract("frames", () => ({
  extensions: {
    edge: extension({ position: "wrap", target: { every: "slot" } }),
    glow: extension({ position: "wrap", target: { every: "extension" } }),
    halo: extension({ position: "wrap", target: { every: "extension" } }),
    outline: extension({ position: "wrap", target: { every: "slot" } }),
  },
  version: "1.0.0",
}));

export const feed = definePlugin(feedContract, {});

export const notes = definePlugin(notesContract, {
  extensions: {
    book: { component: lazy({ Book }) },
    border: { component: lazy({ Border }) },
    broken: { component: lazy({ Broken }), fallback: lazy({ Mended }) },
    chip: { component: lazy({ Chip }) },
    cover: { component: lazy({ Cover }) },
    first: { component: lazy({ First }) },
    hint: { component: lazy({ Hint }) },
    lead: { component: lazy({ Lead }) },
    mark: { component: lazy({ Mark }) },
    restock: { component: lazy({ Restock }) },
    ring: { component: lazy({ Ring }) },
    second: { component: lazy({ Second }) },
    tail: { component: lazy({ Tail }) },
  },
});

export const frames = definePlugin(framesContract, {
  extensions: {
    edge: { component: lazy({ Edge }) },
    glow: { component: lazy({ Glow }) },
    halo: { component: lazy({ Halo }) },
    outline: { component: lazy({ Outline }) },
  },
});

export const FEED_PACKAGES = {
  feed: { directory: "/plugins/feed", name: "@acme/plugin-feed" },
  frames: { directory: "/plugins/frames", name: "@acme/plugin-frames" },
  notes: { directory: "/plugins/notes", name: "@acme/plugin-notes" },
};

export const FED: Product = productOf([installed(feed), installed(notes)], FEED_PACKAGES);

export const FRAMED: Product = productOf(
  [installed(feed), installed(notes), installed(frames)],
  FEED_PACKAGES,
);

export function extensionIn(product: Product, id: string): ResolvedExtension {
  const found = product.extensions.find((one) => one.id === id);

  if (found === undefined) throw new Error(`The fixture product has no extension ${id}.`);

  return found;
}

export const DECORATORS: readonly ResolvedExtension[] = [
  "notes/chip",
  "notes/cover",
  "notes/mark",
  "notes/ring",
].map((id) => extensionIn(FED, id));

export function disabledIn(product: Product, id: string): Product {
  return {
    ...product,
    extensions: product.extensions.map((one) => (one.id === id ? { ...one, disabled: true } : one)),
  };
}

export function loaded(
  ui: ReactNode,
  wrapper: (given: { readonly children?: ReactNode }) => ReactNode,
): Promise<RenderResult> {
  return act(async () => {
    const view = render(createElement(wrapper, null, ui));

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });

    return view;
  });
}

export async function slotted(ui: ReactNode, host: FixtureHost): Promise<RenderResult> {
  return loaded(ui, await routedWrapper(host));
}

export function statusIn(
  statuses: readonly ExtensionStatus[],
  id: string,
): ExtensionStatus | undefined {
  return statuses.find((one) => one.extension.id === id);
}

export function contributedTo(
  host: FixtureHost,
  slotId: string,
): ReadonlyArray<readonly [ReactNode, number]> {
  return (host.pages.get().get(slotId) ?? []).map(({ content, order }) => [content, order]);
}
