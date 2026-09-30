---
"@stealthscale/component-charts": minor
---

- Add the package over `recharts` 3.10.1.
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
