/**
 * Lists the hierarchies the sunburst chart's page renders: a month's cloud bill by team, service
 * and resource, the same bill with a credit, a file server's folders and subfolders, and a team
 * with a long tail of small services.
 */

import { type Part } from "#treemap-chart/examples/spend.ts";

export { labelled, TAIL } from "#treemap-chart/examples/spend.ts";

/**
 * Lists the platform team's spend for September: compute 38,400, storage 21,100 and the network
 * 9,300, 68,800 in all.
 */
const PLATFORM: Part = {
  children: [
    {
      children: [
        { key: "vms", value: 26_000 },
        { key: "gpus", value: 12_400 },
      ],
      key: "compute",
    },
    {
      children: [
        { key: "blobs", value: 15_800 },
        { key: "backups", value: 5300 },
      ],
      key: "storage",
    },
    { key: "network", value: 9300 },
  ],
  key: "platform",
};

/**
 * Lists the product team's spend for September: the web app 14,200 and the mobile app 11,600,
 * 25,800 in all.
 */
const PRODUCT: Part = {
  children: [
    { key: "web", value: 14_200 },
    { key: "mobile", value: 11_600 },
  ],
  key: "product",
};

/**
 * Lists the data team's services for September: the warehouse 12,800 and the pipelines 7,100.
 */
const DATA: readonly Part[] = [
  { key: "warehouse", value: 12_800 },
  { key: "pipelines", value: 7100 },
];

/**
 * Lists September's cloud bill in euros by team, service and resource: the platform team 68,800,
 * the product team 25,800 and the data team 19,900, 114,500 in all.
 */
export const SPEND: readonly Part[] = [PLATFORM, PRODUCT, { children: DATA, key: "data" }];

/**
 * Lists the bill with a committed-use credit of 3,000 posted to the data team.
 */
export const CREDITED: readonly Part[] = [
  PLATFORM,
  PRODUCT,
  { children: [...DATA, { key: "credit", value: -3000 }], key: "data" },
];

/**
 * Lists a file server's folders and subfolders in gigabytes: 6,980 in all, design and video 4,300
 * of it.
 */
export const STORAGE: readonly Part[] = [
  {
    children: [
      { key: "screens", value: 1500 },
      { key: "brand", value: 900 },
    ],
    key: "design",
  },
  {
    children: [
      { key: "footage", value: 1300 },
      { key: "edits", value: 600 },
    ],
    key: "video",
  },
  {
    children: [
      { key: "daily", value: 800 },
      { key: "weekly", value: 500 },
    ],
    key: "archive",
  },
  { key: "photos", value: 860 },
  { key: "builds", value: 520 },
];
