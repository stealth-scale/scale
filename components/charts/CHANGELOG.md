# @stealthscale/component-charts

## 0.2.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`fa339b8`](https://github.com/stealth-scale/scale/commit/fa339b8b07d9bba0709028c89abe4c3ddbf37f26) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add the package over `recharts` 3.10.1.
  - Add the `Chart` kit: `useChart`, `Root`, `Plot`, `Empty`, `Legend`, `Caption`, `Tooltip`,
    `Crosshair`, `Key`, `KeyItem`, `colorOf`.
  - Color series from the theme's `series.1` to `series.8` and each palette's `chart` role.
  - Add `LineChart`, `StepLineChart`, `AreaChart`, `StackedAreaChart`, `BarChart`, `StackedBarChart`,
    `PercentStackedBar` and `HorizontalBarChart`.
  - Add `target` and `zones` to `BarChart` and `HorizontalBarChart`.
  - Add `annotations` to the cartesian presets.
  - Add `alignPeriods` and a series' `previousOf`.
  - Add `ComboChart`, `RangeChart`, `ParetoChart`, `BurndownChart`, `StreamGraph` and
    `WaterfallChart`.
  - Add `ScatterPlot`, `BubbleChart` and `RegressionOverlay`, with `quadrants`, `labelKey`, `xEnds`,
    `yEnds` and `spreadPoints`.
  - Add `HistogramChart`, `DistributionChart`, `BoxPlot`, `ViolinPlot` and `CandlestickChart`.
  - Add `PieChart`, `DonutChart`, `RadarChart`, `RadialBarChart`, `PolarAreaChart`, `GaugeChart` and
    `FunnelChart`.
  - Add `TreemapChart`, `SunburstChart`, `SankeyChart` and `ChordDiagram`, walked by the keyboard.
  - Add `Heatmap`, with `calendarCells`, `cohortCells`, `cohortAverages`, `retentionRate`,
    `retentionSeries` and `cohortSeriesKey`.
  - Add `TimelineChart` and `layoutEvents`.
  - Add `Sparkline` and `Sparkbar`.
  - Export the statistics helpers, among them `linearRegression`, `boxStats`, `quantile`,
    `kernelDensity` and `binValues`.
  - Depend on `@internationalized/date`, `component-collections` and `component-data`.
  - Peer on `react-is`, `component-primitives`, `hooks` and `provider-locale`.

### Patch Changes

- Updated dependencies [[`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf), [`e4af4b0`](https://github.com/stealth-scale/scale/commit/e4af4b04bef831df838cd56ee3401ce8a7222204), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/component-collections@0.1.0
  - @stealthscale/component-data@0.2.0
  - @stealthscale/component-primitives@0.2.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0
  - @stealthscale/provider-locale@0.1.0
