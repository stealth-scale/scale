/**
 * Lists the hierarchies the treemap chart's page renders: a month's cloud bill by team and service,
 * the same bill with a credit, a platform team with a long tail of small services, and a file
 * share's folders.
 */

import { type ChartColor } from "#chart/index.ts";
import { type HierarchyNode } from "#hierarchy/index.ts";

/**
 * Describes one part of an example hierarchy: its key, which also keys its name under `names` in
 * the page's words, and its value or its parts.
 */
export interface Part {
  /**
   * Parts the part is made of.
   */
  readonly children?: readonly Part[];

  /**
   * Key of the part, and of its name under `names` in the page's words.
   */
  readonly key: string;

  /**
   * Value of a part without parts.
   */
  readonly value?: number;
}

/**
 * Lists the data team's services for September: 38,500 in all.
 */
const DATA: Part = {
  children: [
    { key: "postgres", value: 18_400 },
    { key: "kafka", value: 9700 },
    { key: "objects", value: 6300 },
    { key: "redis", value: 4100 },
  ],
  key: "data",
};

/**
 * Lists the platform team's services for September: 36,600 in all.
 */
const PLATFORM: readonly Part[] = [
  { key: "kubernetes", value: 21_800 },
  { key: "logs", value: 7600 },
  { key: "nat", value: 3900 },
  { key: "balancers", value: 2400 },
  { key: "firewall", value: 900 },
];

/**
 * Lists the product team's services for September: 20,300 in all.
 */
const PRODUCT: Part = {
  children: [
    { key: "search", value: 8900 },
    { key: "functions", value: 5200 },
    { key: "cdn", value: 4400 },
    { key: "gateway", value: 1800 },
  ],
  key: "product",
};

/**
 * Lists September's cloud bill in euros: the data team 38,500, the platform team 36,600 and the
 * product team 20,300, 95,400 in all. Kubernetes and Postgres are the two largest services.
 */
export const SPEND: readonly Part[] = [DATA, { children: PLATFORM, key: "platform" }, PRODUCT];

/**
 * Lists the bill with a reserved-capacity credit of 6,200 posted to the platform team.
 */
export const CREDITED: readonly Part[] = [
  DATA,
  { children: [...PLATFORM, { key: "credit", value: -6200 }], key: "platform" },
  PRODUCT,
];

/**
 * Keys of the platform team's fourteen small services, largest first.
 */
const SMALL = [
  "cron",
  "mailer",
  "webhooks",
  "metrics",
  "tracing",
  "secrets",
  "dns",
  "registry",
  "snapshots",
  "scanner",
  "queue",
  "status",
  "flags",
  "proxy",
];

/**
 * Lists the platform team's spend: Kubernetes at 48,000 and fourteen services from 900 down to 185,
 * 7,595 in all.
 */
export const TAIL: readonly Part[] = [
  {
    children: [
      { key: "kubernetes", value: 48_000 },
      ...SMALL.map((key, at) => ({ key, value: 900 - at * 55 })),
    ],
    key: "platform",
  },
];

/**
 * Lists a file share's folders in gigabytes, one level: 7,465 in all, design and video 4,300 of it.
 */
export const STORAGE: readonly Part[] = [
  { key: "design", value: 2400 },
  { key: "video", value: 1900 },
  { key: "backups", value: 1300 },
  { key: "photos", value: 860 },
  { key: "builds", value: 520 },
  { key: "documents", value: 210 },
  { key: "audio", value: 180 },
  { key: "archive", value: 95 },
];

/**
 * Returns the parts as nodes named through a function, such as the page's words, each with the
 * palette a map states for its key.
 *
 * @param parts - The hierarchy to name, top level first.
 * @param name - Returns a part's name from its key.
 * @param colors - The palette of each part that states one, by key.
 */
export function labelled(
  parts: readonly Part[],
  name: (key: string) => string,
  colors: Readonly<Record<string, ChartColor>> = {},
): HierarchyNode[] {
  return parts.map((part) => ({
    children: part.children === undefined ? undefined : labelled(part.children, name, colors),
    color: colors[part.key],
    key: part.key,
    label: name(part.key),
    value: part.value,
  }));
}
