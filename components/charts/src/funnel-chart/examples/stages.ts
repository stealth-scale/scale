/**
 * Lists the funnels the funnel chart's page renders: a shop's checkout, the same checkout with one
 * stage counted from another query, a hiring pipeline, an advert's funnel and a trial.
 */

/**
 * Describes one stage of an example funnel: its key, which also keys its name in the page's words,
 * and its count.
 */
export interface Stage {
  /**
   * Key of the stage, and of its name under `stages` in the page's words.
   */
  readonly key: string;

  /**
   * Count at the stage.
   */
  readonly value: number;
}

/**
 * Lists a shop's checkout over a month, 48,200 visits down to 5,960 payments. The biggest loss,
 * 18,500 people, is before the basket.
 */
export const CHECKOUT: readonly Stage[] = [
  { key: "visited", value: 48_200 },
  { key: "viewed", value: 31_400 },
  { key: "basket", value: 12_900 },
  { key: "checkout", value: 8150 },
  { key: "paid", value: 5960 },
];

/**
 * Lists the checkout with its fourth stage counted from the orders of every month, so more people
 * start checkout than added a product to a basket.
 */
export const WIDENING: readonly Stage[] = [
  { key: "visited", value: 48_200 },
  { key: "viewed", value: 31_400 },
  { key: "basket", value: 12_900 },
  { key: "checkout", value: 19_400 },
  { key: "paid", value: 5960 },
];

/**
 * Lists a hiring pipeline over a quarter, 1,280 applications down to 12 hires.
 */
export const HIRING: readonly Stage[] = [
  { key: "applied", value: 1280 },
  { key: "screened", value: 410 },
  { key: "interviewed", value: 96 },
  { key: "offered", value: 18 },
  { key: "hired", value: 12 },
];

/**
 * Lists an advert's funnel over a week, 2.4 million impressions down to 3,900 sign-ups.
 */
export const ADVERT: readonly Stage[] = [
  { key: "impressions", value: 2_400_000 },
  { key: "clicks", value: 86_000 },
  { key: "visits", value: 41_000 },
  { key: "signups", value: 3900 },
];

/**
 * Lists a trial's two stages: 2,400 trials, 312 of which became paying accounts.
 */
export const TRIAL: readonly Stage[] = [
  { key: "trials", value: 2400 },
  { key: "customers", value: 312 },
];
