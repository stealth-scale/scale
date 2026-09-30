/**
 * Lists the flow graphs the sankey chart's page renders: a month's visitors by channel and
 * outcome, a year's income statement, a checkout with refunds that come back to the cart, and a
 * support queue that loses tickets.
 */

import { type ChartColor } from "#chart/index.ts";
import { type SankeyFlow, type SankeyNode } from "#sankey-chart/index.ts";

/**
 * Keys of the visitors' nodes: four channels, the sign-up, the trial and four outcomes.
 */
export const STEPS: readonly string[] = [
  "organic",
  "paid",
  "social",
  "email",
  "signup",
  "trial",
  "left",
  "free",
  "subscribed",
  "cancelled",
];

/**
 * Lists September's 25,900 visitors: 7,000 signed up, 4,200 of them started a trial and 1,500
 * subscribed.
 */
export const VISITORS: readonly SankeyFlow[] = [
  { from: "organic", to: "signup", value: 3100 },
  { from: "organic", to: "left", value: 9300 },
  { from: "paid", to: "signup", value: 2000 },
  { from: "paid", to: "left", value: 4800 },
  { from: "social", to: "signup", value: 700 },
  { from: "social", to: "left", value: 3400 },
  { from: "email", to: "signup", value: 1200 },
  { from: "email", to: "left", value: 1400 },
  { from: "signup", to: "trial", value: 4200 },
  { from: "signup", to: "free", value: 2800 },
  { from: "trial", to: "subscribed", value: 1500 },
  { from: "trial", to: "cancelled", value: 2700 },
];

/**
 * Keys of the income statement's nodes: three lines of revenue, the revenue, its cost, the gross
 * profit and where the gross profit went.
 */
export const LINES: readonly string[] = [
  "subscriptions",
  "services",
  "hardware",
  "revenue",
  "cost",
  "gross",
  "research",
  "sales",
  "admin",
  "operating",
];

/**
 * Lists a year's income statement in euros: €11.7M of revenue, €7.4M of gross profit and €1.5M of
 * operating profit.
 */
export const INCOME: readonly SankeyFlow[] = [
  { from: "subscriptions", to: "revenue", value: 8_200_000 },
  { from: "services", to: "revenue", value: 2_100_000 },
  { from: "hardware", to: "revenue", value: 1_400_000 },
  { from: "revenue", to: "cost", value: 4_300_000 },
  { from: "revenue", to: "gross", value: 7_400_000 },
  { from: "gross", to: "research", value: 2_600_000 },
  { from: "gross", to: "sales", value: 2_200_000 },
  { from: "gross", to: "admin", value: 1_100_000 },
  { from: "gross", to: "operating", value: 1_500_000 },
];

/**
 * Keys of the checkout's nodes.
 */
export const CHECKOUT: readonly string[] = ["cart", "checkout", "ordered", "abandoned", "refunded"];

/**
 * Lists a week's carts: 900 went to the checkout, 620 ordered, 40 were refunded, and 25 of those
 * came back to the cart, which closes a loop.
 */
export const LOOPED: readonly SankeyFlow[] = [
  { from: "cart", to: "checkout", value: 900 },
  { from: "checkout", to: "ordered", value: 620 },
  { from: "checkout", to: "abandoned", value: 280 },
  { from: "ordered", to: "refunded", value: 40 },
  { from: "refunded", to: "cart", value: 25 },
];

/**
 * Keys of the support queue's nodes.
 */
export const QUEUE: readonly string[] = ["email", "chat", "phone", "triage", "solved", "escalated"];

/**
 * Lists a week's tickets: triage receives 1,200 and sends on 1,050, so 150 are lost there.
 */
export const LEAKY: readonly SankeyFlow[] = [
  { from: "email", to: "triage", value: 640 },
  { from: "chat", to: "triage", value: 410 },
  { from: "phone", to: "triage", value: 150 },
  { from: "triage", to: "solved", value: 860 },
  { from: "triage", to: "escalated", value: 190 },
];

/**
 * Returns the keys as nodes named through a function, such as the page's words, each with the
 * palette a map states for its key.
 *
 * @param keys - The nodes' keys in the walk's order.
 * @param name - Returns a node's name from its key.
 * @param colors - The palette of each node that states one, by key.
 */
export function named(
  keys: readonly string[],
  name: (key: string) => string,
  colors: Readonly<Record<string, ChartColor>> = {},
): SankeyNode[] {
  return keys.map((key) => ({ color: colors[key], key, label: name(key) }));
}
