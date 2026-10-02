/**
 * Collects the line chart's example modules, each under its file's name, for the specimen to import
 * as one module.
 *
 * @remarks
 *   The revenue example is left out. The specimen imports it directly, because the props reader
 *   follows a specimen's own imports and the example files they name, not the modules a barrel
 *   re-exports.
 */

export * as anomalies from "#line-chart/examples/anomalies.example.tsx";
export * as budget from "#line-chart/examples/budget.example.tsx";
export * as comparison from "#line-chart/examples/comparison.example.tsx";
export * as controlled from "#line-chart/examples/controlled.example.tsx";
export * as guide from "#line-chart/examples/guide.example.tsx";
export * as latency from "#line-chart/examples/latency.example.tsx";
export * as peak from "#line-chart/examples/peak.example.tsx";
export * as quiet from "#line-chart/examples/quiet.example.tsx";
export * as releases from "#line-chart/examples/releases.example.tsx";
export * as replay from "#line-chart/examples/replay.example.tsx";
export * as retention from "#line-chart/examples/retention.example.tsx";
export * as uptime from "#line-chart/examples/uptime.example.tsx";
