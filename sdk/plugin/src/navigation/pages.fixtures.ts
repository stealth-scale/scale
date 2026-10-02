import { type FunctionComponent } from "react";

import { within } from "@testing-library/react";

import { timeOffContract } from "#host/product.fixtures.ts";
import { RequestPage, RequestsPage } from "#navigation/navigation.fixtures.tsx";

export const TITLED: Readonly<Record<string, FunctionComponent>> = {
  [timeOffContract.routes.overview.id]: RequestsPage,
  [timeOffContract.routes.request.id]: RequestPage,
};

export function linksOf(container: HTMLElement): ReadonlyArray<readonly [string, string]> {
  return within(container)
    .queryAllByRole("link")
    .map((link) => [link.textContent, link.getAttribute("href") ?? ""] as const);
}
