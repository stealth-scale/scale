# @stealthscale/component-charts

`@stealthscale/component-charts` renders data as charts over recharts. The presets render line, area
and bar charts from declared series, bars and lines on two value axes, a forecast band, Pareto,
burndown, stream and waterfall charts, scatter and bubble charts with a trend line or four named
quadrants, histograms, distributions compared on shared bins, box plots and violins of groups,
candlesticks of prices, a pie or a donut from slices, a radar of dimensions, measures as rings
against a full turn, a rose of a cycle, one value on a dial against its zones, the stages of a
funnel with their rates, a hierarchy of parts as nested tiles or as rings, flows between stages as
bands, flows between peers as ribbons around a circle, a value for every pair of two sets of
categories as a grid of colored cells, moments on one time window across lanes, and a run of values
the size of a word. The presets are built on `Chart`, which renders a figure around recharts' own
chart with a measured plot, a tooltip, a legend that shows and hides series, a caption and an empty
state. A line, area or bar chart also marks moments, periods and points on its categories, and plots
an earlier period behind the current one. The heatmap renders an HTML grid in the figure in place of
a recharts chart. A caller who needs another chart writes it inside `Chart`. Each series takes its
color from the theme. The preset under `./theme` registers the recipes with an application's
compiler.

## Install

```bash
pnpm add @stealthscale/component-charts recharts react-is
```

The package depends on `recharts` 3.10.1, pinned exactly, because the recipe restyles the classes
recharts puts on its SVG. It depends on `@stealthscale/component-data` for `ColorSwatch` and on
`@stealthscale/component-collections` for the funnel's table and the heatmap's scroll area. It peers
on `react`, `react-is`, which recharts asks for, `@stealthscale/component-primitives`, whose scroll
area the table renders in, `@stealthscale/theme`, `@stealthscale/hooks` and
`@stealthscale/provider-locale`.

## Presets

A preset takes the rows, the field the category axis reads and the series, and renders the whole
chart:

```tsx
import { BarChart } from "@stealthscale/component-charts";

<BarChart
  caption="Growth sign-ups passed Starter in September, 158 to 152."
  categoryKey="month"
  data={months}
  label="Sign-ups per plan per month"
  labelOptions={{ month: "short", timeZone: "UTC" }}
  series={[
    { key: "starter", label: "Starter" },
    { key: "growth", label: "Growth" },
  ]}
/>;
```

| Preset               | Renders                                                    | Own props                                  |
| -------------------- | ---------------------------------------------------------- | ------------------------------------------ |
| `LineChart`          | A line per series                                          | `curve`                                    |
| `StepLineChart`      | A line per series, flat from each point to the next        |                                            |
| `AreaChart`          | An area per series, each fading to the axis                | `curve`                                    |
| `StackedAreaChart`   | The series stacked into one total                          | `curve`, `percent`                         |
| `BarChart`           | A bar per series, side by side in each category            | `zones`, `targetLabel`, a series' `target` |
| `StackedBarChart`    | Each category's total as one bar, split into the series    |                                            |
| `PercentStackedBar`  | Each category as one bar of 100%, split into shares        |                                            |
| `HorizontalBarChart` | A bar per series on its side, the categories down the edge | `zones`, `targetLabel`, a series' `target` |

`curve` is `monotone` unless stated, or `linear` for straight lines between the points. With
`percent` every point of a `StackedAreaChart` sums to 100%.

| Prop                                                    | Takes                                                                      | Default                            |
| ------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------- |
| `data`                                                  | The rows, in order                                                         | Required                           |
| `categoryKey`                                           | The field of each row the category axis reads                              | Required                           |
| `series`                                                | `{ key, label, color, dashed, previousOf }` per series, in legend order    | Required                           |
| `annotations`                                           | `{ key, at, label, color, until, value }` per mark on the categories       | None                               |
| `label`                                                 | The chart's accessible name, recharts' `title`                             | Required                           |
| `caption`                                               | The finding in words, which names the figure                               | None                               |
| `labelOptions`                                          | `Intl.DateTimeFormatOptions` for the category ticks and the tooltip's head | The category as it is              |
| `valueOptions`                                          | `Intl.NumberFormatOptions` for the value ticks and the tooltip's values    | A number in the locale             |
| `valueDomain`                                           | recharts' domain of the value axis, such as `[0.99, 1]`                    | From zero                          |
| `grid`                                                  | Whether lines cross the plot at the value ticks                            | `true`                             |
| `legend`                                                | Whether the legend renders                                                 | Two or more series, and rows       |
| `legendLabel`                                           | The legend's accessible name                                               | `Series`                           |
| `defaultIndex`                                          | The row the tooltip shows on the first render                              | None                               |
| `animate`                                               | Whether the marks animate in, which they never do under reduced motion     | `false`                            |
| `empty`                                                 | The message in the plot's place while the chart has no rows                | `No data`                          |
| `ratio`                                                 | The plot's aspect ratio                                                    | `video`                            |
| `hiddenKeys`, `defaultHiddenKeys`, `onHiddenKeysChange` | The hidden series, controlled or from a first value                        | None hidden                        |
| `locale`                                                | The locale the values are written in                                       | The provider's, else the runtime's |
| `children`                                              | recharts elements rendered after the marks, such as a `ReferenceLine`      | None                               |

Any other prop goes to the `figure`.

### Marks

- A line and an area's edge are 2px wide and have no dots. The point the tooltip is at takes a dot
  of radius 5 inside an edge in the panel's color.
- A series with `dashed` renders its line in 6px dashes 4px apart, for a target or a projection. A
  series with `previousOf` renders dashed the same way.
- An unstacked area fills with a gradient from 0.3 opacity at its top to transparent at the axis, so
  overlapping areas show through each other. A stacked area fills flat at 0.85 opacity.
- An unstacked bar rounds its end by 4px. A stacked bar keeps square ends, and a hairline edge in
  the panel's color parts the segments of a stack.
- In a stack summed to 100% the value ticks read in percent, and the tooltip writes each series' own
  value, not its share.
- The value axis labels every tick, and the grid renders a line at every label.

### A reference line

A child renders inside the chart after the marks. `Chart.colorOf` returns the chart color of a
palette for its stroke, and the recipe sets its label in the chart's muted ink:

```tsx
import { ReferenceLine } from "recharts";

import { Chart, LineChart } from "@stealthscale/component-charts";

<LineChart categoryKey="day" data={days} label="Cloud spend per day" series={[{ key: "spend" }]}>
  <ReferenceLine
    label={{ position: "insideTopRight", value: "Budget" }}
    stroke={Chart.colorOf("error")}
    strokeDasharray="6 4"
    y={1200}
  />
</LineChart>;
```

The recipe's muted ink applies over any `fill` a caller passes to a `Label`.

### Annotations

`annotations` marks moments, periods and points on the category axis. The fields of each annotation
decide its mark:

```tsx
import { LineChart } from "@stealthscale/component-charts";

<LineChart
  annotations={[
    { at: "2026-09-17", key: "4.12", label: "Release 4.12" },
    { at: "2026-09-20", color: "info", key: "freeze", label: "Change freeze", until: "2026-09-22" },
    { at: "2026-09-18", color: "error", key: "outage", label: "Processor outage", value: 312 },
  ]}
  categoryKey="day"
  data={days}
  label="p95 latency per day"
  series={[{ key: "p95", label: "p95 latency" }]}
/>;
```

| Fields           | Mark                                                                            |
| ---------------- | ------------------------------------------------------------------------------- |
| `at`             | A moment: a rule across the plot in 4px dashes 3px apart                        |
| `at` and `until` | A period: a wash from `at` to `until` at 0.12 opacity, without an edge          |
| `at` and `value` | A point: a ring of radius 5 around `value` at `at`, 2px wide and without a fill |

- `at` and `until` are categories of the chart, in the values the category axis reads. A period's
  ends may come in either order.
- A mark takes its annotation's `color`, the neutral palette's chart color unless stated.
- recharts renders a wash under the series and a rule and a ring over them. A ring widens the value
  axis to its value. On a chart of bars on their side the marks run along the category axis, down
  the plot.
- The words start 4px inside the top of a rule or a wash, or centre 4px above a ring, in the label
  ink inside a halo in the panel's color. Words that leave the plot's sides, or meet the words of an
  annotation earlier in the list, are hidden.
- The tooltip lists the annotations at its category after the series' rows, each with a swatch in
  its color. The arrows move the tooltip through every category, so the live region reads each
  annotation, hidden words included.

### Two periods

`alignPeriods(current, previous, options)` returns a row per row of the current period, with the
fields of the previous period's row at the same position. A series with `previousOf` is the earlier
period of the series it names:

```tsx
import { alignPeriods, LineChart } from "@stealthscale/component-charts";

const days = alignPeriods(thisWeek, lastWeek, { categoryKey: "day", keys: ["revenue"] });

<LineChart
  categoryKey="day"
  data={days}
  label="Revenue per day"
  series={[
    { key: "revenue", label: "This week" },
    { key: "revenuePrevious", label: "Last week", previousOf: "revenue" },
  ]}
/>;
```

- The periods match by position, the first row against the first row. A previous period that is
  shorter leaves the last rows without its values.
- Each copied field takes the suffix `Previous` unless `suffix` states another, and the previous
  period's own category is copied too, as `dayPrevious`.
- A series with `previousOf` renders dashed, in the neutral palette's chart color unless it states a
  `color`.
- The tooltip writes the change from the earlier period after the current value, as a signed
  percentage to one decimal after the locale's list separator: "€26,300, +8.2%". A row without a
  finite earlier value, or with an earlier value of zero, writes the value alone.

### Zooming a long series

A preset plots the rows it receives, so a range picked in another control zooms it. The forms
`Slider` picks the range with two thumbs over the rows' indices. Each thumb takes its own `label`,
and `getAriaValueText` writes its date for a screen reader. The arrow keys, Page Up, Page Down, Home
and End move the focused thumb:

```tsx
import { useState } from "react";

import { AreaChart } from "@stealthscale/component-charts";
import { Slider } from "@stealthscale/component-forms";

const [range, setRange] = useState([days.length - 91, days.length - 1]);
const [from = 0, to = 0] = range;

<>
  <AreaChart
    categoryKey="day"
    data={days.slice(from, to + 1)}
    label="Visitors per day"
    series={[{ key: "visitors", label: "Visitors" }]}
  />
  <Slider.Root
    getAriaValueText={({ value }) => dateOf(value)}
    max={days.length - 1}
    minStepsBetweenThumbs={6}
    onValueChange={({ value }) => {
      setRange(value);
    }}
    value={range}
  >
    <Slider.Label>Days shown</Slider.Label>
    <Slider.Control>
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      <Slider.Thumb index={0} label="From" />
      <Slider.Thumb index={1} label="To" />
    </Slider.Control>
  </Slider.Root>
</>;
```

### Targets and zones

A bar chart's series with `target` reads each row's target from that field and marks it with a tick
across the row's bar. `zones` fill each bar's row with the zones of the value axis. With both, each
bar is a bullet graph, and the rows compare their measures and their targets on one scale.

```tsx
import { HorizontalBarChart } from "@stealthscale/component-charts";

<HorizontalBarChart
  caption="Two of six teams passed their plan, and Borealis is behind at 64%."
  categoryKey="team"
  data={teams}
  label="Plan attainment per team"
  series={[{ key: "done", label: "Attainment", target: "plan" }]}
  targetLabel="Plan"
  valueDomain={[0, 1.2]}
  valueOptions={{ style: "percent" }}
  zones={[
    { color: "error", label: "Behind", upTo: 0.7 },
    { color: "warning", label: "Close", upTo: 0.9 },
    { color: "success", label: "On plan", upTo: 1.2 },
  ]}
/>;
```

- The tick is 2px wide and 76% of the bar's thickness, in the ink inside a halo in the panel's
  color. A target past either end of the value axis is placed at that end. A row whose target is not
  a finite number renders no tick.
- `zones` take the gauge's `GaugeZone`: where each zone ends, its palette and its name. They resolve
  against the value axis' ends, which `valueDomain` states, and every row shares them.
- Each zone fills the whole row, tinted at 40% of its palette over the panel, and the part of the
  axis no zone covers takes the track's fill. With zones the measure is 42% of the row's thickness,
  centred.
- The tooltip writes the value, then the target after `targetLabel`, "Target" unless stated, then
  the name of the zone the value is in, where the name is text.
- A key under the plot labels the tick with `targetLabel` and lists each zone with a `label`.
- The zones and the tick keep their places while the bars animate in.

### Keys

recharts' keyboard layer inverts the arrows in a sideways layout. ArrowLeft moves the tooltip down a
`HorizontalBarChart`, and ArrowRight moves it up.

## Mixed marks

`ComboChart`, `RangeChart`, `ParetoChart` and `BurndownChart` render marks of different kinds on one
plot. They take the preset props, and each adds its own:

```tsx
import { ComboChart } from "@stealthscale/component-charts";

<ComboChart
  caption="Revenue rose to €254K in September at a 62% gross margin."
  categoryKey="month"
  data={months}
  endDomain={[0, 1]}
  endOptions={{ style: "percent" }}
  label="Revenue and gross margin per month"
  series={[
    { key: "revenue", label: "Revenue", mark: "bar" },
    { axis: "end", key: "margin", label: "Gross margin", mark: "line" },
  ]}
/>;
```

| Preset          | Renders                                                           | Own props                                                                                    |
| --------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `ComboChart`    | Each series as the mark it states: `bar`, `line` or `area`        | `curve`, `endDomain`, `endOptions`                                                           |
| `RangeChart`    | A band between two fields of each row, and lines plotted over it  | `band`, `curve`                                                                              |
| `ParetoChart`   | Bars sorted largest first, and their running share on an end axis | `valueKey`, `valueLabel`, `cumulativeLabel`, `threshold`, `thresholdLabel`                   |
| `BurndownChart` | The work left per period, the ideal line and the projection       | `points`, `periods`, `total`, `projection`, `remainingLabel`, `idealLabel`, `projectedLabel` |

- A combo series takes `mark` and `axis`. `axis: "end"` puts a series on a second value axis at the
  plot's end edge, which renders while a series reads it. `endOptions` writes its ticks and its
  series' tooltip values, and `endDomain` sets its range, from zero unless stated.
- recharts renders areas behind bars and bars behind lines, whatever the series' order. A combo
  chart's cursor is a line, because only recharts' `BarChart` renders the band cursor.
- A range chart's `band` takes `{ key, label, color, low, high }`. It fills the space between its
  two fields at 0.2 opacity with no edge, and the tooltip writes it as a range, such as
  "15,500–19,500". The low field must be below the high field in every row.
- A Pareto chart sorts the rows largest first. `paretoRows` returns the sorted rows with each row's
  `share` and running `cumulative` share, and `paretoCutoff(rows, threshold)` counts the rows it
  takes to add up to the threshold, so a caption can state the count. The dashed threshold line is
  at 80% unless `threshold` states otherwise, and `0` renders none.
- A burndown chart takes `{ at, remaining }` per period, with `remaining` missing for a period to
  come. The ideal line runs straight from `total`, else the first reading, to zero over `periods`,
  else over the points. The projection continues the least-squares trend of the readings from the
  last reading and never goes below zero. A trend that does not fall has no projection.
- `burndownFinish` returns the period the projection falls to zero, as a fractional index, and
  `burndownRows` returns the rows the chart plots. The ideal line and the projection take fractional
  values. The burndown writes its values to one decimal unless `valueOptions` states otherwise.

## Stream and waterfall

`StreamGraph` stacks many series about a moving baseline. Each band's rise and fall reads across a
long span:

- `baseline` is `wiggle` unless stated, or `silhouette`, which centres the stack on a straight line.
  The graph renders no value axis and no grid, and the stack fills the plot's height.
- The bands stack inside out. The series are sorted by onset, the centre of each series' mass, and
  dealt onto the lighter of two piles, so a series that arrives late is outside and moves no band
  beneath it. `insideOut={false}` keeps the series' order, the first at the bottom.
- The stack's order changes neither a series' color nor its place in the legend and the tooltip.
  `insideOutOrder` and `streamOnset` return the order and the onsets.
- The legend renders while the series fit the theme's eight series colors.

`WaterfallChart` renders the steps that take a running total from one number to another:

```tsx
import { WaterfallChart } from "@stealthscale/component-charts";

<WaterfallChart
  caption="MRR grew from €120K in August to €135.9K in September."
  label="MRR bridge from August to September"
  steps={[
    { key: "august", label: "August", total: true, value: 120_000 },
    { key: "new", label: "New", value: 18_400 },
    { key: "churn", label: "Churn", value: -7600 },
    { key: "september", label: "September", total: true },
  ]}
  valueOptions={{ currency: "EUR", notation: "compact", style: "currency" }}
/>;
```

- A change floats from the running total before it to the total after it, in the success palette's
  chart color when it rises and the error palette's when it falls. A total rises from zero in the
  neutral palette's chart color.
- A total with a `value` sets the running total, for an opening balance. A total without one shows
  the running total.
- A dashed connector joins each bar to the next at the running total. The chart writes each bar's
  signed change or total above the bar and keeps 20px free above the tallest bar for it.
- The values show while the widest one fits a step, at 8px a character, and hide together in a
  narrower plot.
- The tooltip writes the same value as the bar, and its swatch takes the bar's color.
- The value axis rounds its range to whole ticks and runs through zero where the running total goes
  below it. `waterfallBars` returns the bars the chart renders, with each step's `start`, `end` and
  `change`.

| Prop                                                                      | Takes                                                               | Default  |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------- |
| `steps`                                                                   | `{ key, label, value, total }` per step, in the order they happened | Required |
| `label`                                                                   | The chart's accessible name, recharts' `title`                      | Required |
| `caption`                                                                 | The finding in words, which names the figure                        | None     |
| `valueLabel`                                                              | The name of the values in the tooltip                               | `Amount` |
| `valueLabels`                                                             | Whether each bar's value is written above it                        | `true`   |
| `connectors`                                                              | Whether dashed connectors join the bars                             | `true`   |
| `valueOptions`                                                            | `Intl.NumberFormatOptions` for the ticks, the tooltip and the bars  | A number |
| `grid`, `defaultIndex`, `animate`, `empty`, `locale`, `ratio`, `children` | As the cartesian presets take them                                  |          |

## Points

`ScatterPlot` renders a point per thing at two measures, and `BubbleChart` also sizes each point by
a third:

```tsx
import { ScatterPlot } from "@stealthscale/component-charts";

<ScatterPlot
  caption="Mid-market deals close within 50 days, while enterprise deals take 88 to 178 days."
  label="Days to close by deal size"
  series={[
    { key: "mid", label: "Mid-market", points: midMarket },
    { key: "enterprise", label: "Enterprise", points: enterprise },
  ]}
  xKey="size"
  xLabel="Deal size"
  yKey="days"
  yLabel="Days to close"
/>;
```

- Each series takes its own `points`, because a scatter's series do not share a category. `xKey` and
  `yKey` are the fields of a point.
- `xLabel` and `yLabel` are required titles, because neither axis of a scatter explains itself. The
  x title renders under the ticks and the y title along the start edge. `xOptions`, `yOptions`,
  `xDomain` and `yDomain` format and range each axis.
- A point is 60 square pixels unless `size` states otherwise. `BubbleChart` takes `sizeKey` and
  `sizeLabel`, and recharts scales each point's area over `sizeRange`, 40 to 1600 square pixels
  unless stated. Both axes are padded by the largest point's radius, so no point crosses the plot's
  edge.
- The tooltip's heading is the label of the point's series. Each row writes a value in its axis'
  format beside the axis' title. `defaultIndex` opens it at a point of the first series.
- recharts' keyboard layer walks the first series' points only, measured in Firefox and Chromium, so
  the series a reader walks goes first.
- `RegressionOverlay` is a recharts child that renders the least-squares line through `data` as a
  dashed segment over the x range the points cover. The fit leaves out a point whose x or y is not a
  finite number. `linearRegression(points, xKey, yKey)` returns the line's `slope`, `intercept` and
  `r2`. A caption states r², and a page leaves the line out where r² is low.
- With `series`, the line takes the series' color, hides while the legend hides the series, and
  fades with the series' points. Without it, the line takes the neutral palette's chart color and
  ignores the legend, for a fit across series.
- recharts' own fitted line, `lineType="fitting"` on a `Scatter`, fits a point without a value at
  pixel (0, 0), the top-left corner of the chart's `svg`, and returns no r².

### Quadrants

A quadrant chart divides the plot into four named quadrants and writes each point's name beside it:

```tsx
import { ScatterPlot } from "@stealthscale/component-charts";

<ScatterPlot
  caption="Alder and Cedar lead on both vision and execution."
  label="Vendors by vision and execution"
  labelKey="name"
  quadrants={{
    names: {
      bottomEnd: "Visionaries",
      bottomStart: "Niche players",
      topEnd: "Leaders",
      topStart: "Challengers",
    },
  }}
  series={[{ key: "vendors", label: "Vendors", points: vendors }]}
  xEnds={["Low", "High"]}
  xKey="vision"
  xLabel="Vision"
  yEnds={["Low", "High"]}
  yKey="execution"
  yLabel="Execution"
/>;
```

- `quadrants` takes the name of each quadrant, keyed `topStart`, `topEnd`, `bottomStart` and
  `bottomEnd` in the reading direction, and `x` and `y`, the values the plot divides at. Unless they
  are stated, the plot divides at the middle of each axis' span: the axis' domain where it states
  two numbers, 0 to 1 for an axis with named ends, else the points' own values.
- Two dashed lines in the emphasized border ink divide the plot, and each name is written in its
  corner in the muted ink. A point on a line belongs to the upper or the end side, and
  `quadrantOf(x, y, division)` returns a point's quadrant.
- `labelKey` names a field of each point whose words are written beside the point and head its
  tooltip. The words run toward the middle past 72% of the plot's width. Words that leave the plot,
  or meet the words of a point earlier in the series, are hidden, and the tooltip still names the
  point.
- With `quadrants`, the tooltip's heading names the point's quadrant after the point, joined by the
  locale's list separator: "Alder, Leaders".
- `xEnds` and `yEnds` name an axis' two ends, such as "Rare" and "Certain", in place of its ticks.
  The axis spans `xDomain` or `yDomain`, 0 to 1 unless it states two numbers, and the grid renders
  the plot's two edges alone along it.
- `spreadPoints(points, options)` moves points closer than `distance` apart, 0.06 of each axis' span
  unless stated, along a golden-angle spiral around each point's place. Each point keeps its
  quadrant, and every call places the points the same way. The function moves the plotted values, so
  the tooltip writes the moved values: it suits scores read by quadrant, never measurements.

## Distributions

`HistogramChart` renders the shape of one distribution: its values counted into bins that touch
along a numeric axis.

```tsx
import { HistogramChart } from "@stealthscale/component-charts";

<HistogramChart
  caption="107 of 140 requests finish under 60ms, and a slow tail runs to 460ms."
  countLabel="Requests"
  label="Response times of the checkout API"
  valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
  values={latencies}
/>;
```

- The chart takes `values`, one number per thing measured, not rows. A value that is not a finite
  number is left out.
- `binCount(values)` returns Freedman–Diaconis' count, or Sturges' where the middle half of the
  values ties, at most 30. `binValues(values, { bins, domain })` counts the values into bins whose
  width snaps to the nearest of 1, 2 or 5 times a power of ten, as d3's and Vega's bins do, and one
  step coarser where the bins would pass 30.
- `bins` aims for a number of bins. `domain` bins a range from its lower edge and leaves out the
  values outside the bins. When every value is equal, the chart counts them in one bin a tenth of
  the value wide.
- A bin runs from its lower edge up to its upper edge and leaves the upper edge to the next bin. The
  last bin includes its upper edge, so the largest value is counted.
- The bars touch, parted by the recipe's hairline in the panel's color. Each bar runs from its lower
  edge to its upper edge at the axis' own pixels, where recharts rounds a bar's width to a whole
  pixel.
- The axis labels every edge, else every second or every fifth, so at most eight even steps show.
  The tooltip heads each bar with its range, such as "20–40ms", and writes its count.

| Prop                                                                      | Takes                                                              | Default                  |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------ |
| `values`                                                                  | The values to count, one per thing measured                        | Required                 |
| `label`                                                                   | The chart's accessible name, recharts' `title`                     | Required                 |
| `caption`                                                                 | The finding in words, which names the figure                       | None                     |
| `bins`                                                                    | The number of bins to aim for, at most 30                          | Freedman–Diaconis' count |
| `domain`                                                                  | The range to bin, from its lower edge                              | The values' range        |
| `countLabel`                                                              | The name of the counts in the tooltip                              | `Count`                  |
| `color`                                                                   | A hue or a palette for the bars                                    | `series.1`               |
| `valueOptions`                                                            | `Intl.NumberFormatOptions` for the edges and the tooltip's heading | A number in the locale   |
| `grid`, `defaultIndex`, `animate`, `empty`, `locale`, `ratio`, `children` | As the cartesian presets take them                                 |                          |

`DistributionChart` compares two or more distributions on one set of bins:

```tsx
import { DistributionChart } from "@stealthscale/component-charts";

<DistributionChart
  caption="Three in four Free sessions end within 10 minutes, against one in ten Pro sessions."
  label="Session lengths by plan"
  normalize
  series={[
    { key: "free", label: "Free", values: freeSessions },
    { key: "pro", label: "Pro", values: proSessions },
  ]}
  valueOptions={{ style: "unit", unit: "minute", unitDisplay: "short" }}
/>;
```

- The chart chooses the bins from every series' values together, so the series' bars start at the
  same edges. Histograms binned apart put their bars at different edges and widths.
- `normalize` counts each bin as a share of its own series' total, so series of different sizes
  compare. The value axis and the tooltip then write percents.
- The bars of a bin are side by side in the series' order, each a share of the bin's width. A series
  the legend hides gives its share to the series shown.
- A series takes `{ key, label, color, values }`. The chart takes the histogram's `bins`,
  `valueOptions`, `grid`, `defaultIndex`, `animate`, `empty`, `locale`, `ratio` and `children`, and
  the cartesian presets' legend props.

`BoxPlot` compares the distributions of groups: each group's median, middle half, whiskers and
outliers.

```tsx
import { BoxPlot } from "@stealthscale/component-charts";

<BoxPlot
  caption="Singapore's median of 165ms is more than twice Frankfurt's 61ms."
  countLabel="Requests"
  groups={[
    { key: "frankfurt", label: "Frankfurt", values: frankfurt },
    { key: "singapore", label: "Singapore", values: singapore },
  ]}
  label="Response times of the checkout API by region"
  valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
/>;
```

- A group takes `{ key, label, values }`, or a `summary` in place of its values, for values
  summarised elsewhere. `boxStats(values, whisker)` returns the summary the chart renders.
  `quantile(sorted, share)` reads its quartiles by type 7, the rule of SQL's `PERCENTILE_CONT`, so a
  query that summarises the values matches the chart.
- The box runs from the first quartile to the third, and the median crosses it in the ink. Each
  whisker extends to the furthest value within `whisker` interquartile ranges of the box, and ends
  at the box's edge when no value is within that distance.
- Every value past a whisker renders as a hollow point in the box's color, and outliers of equal
  value share one point. `outliers={false}` leaves the points out.
- The value axis is rounded around the values, because a box plot compares where values fall.
  `valueDomain` sets another range, such as one scale for every week.
- A box is at most 72px wide. The box under the pointer or the keyboard fills at 0.6 of its color
  inside an edge 2px wide, and the rest fill at 0.35.
- The key under the plot labels the box, the median, the whiskers and the outliers beside a glyph of
  each in the chart's inks, because a box plot is read by convention. `legend={false}` leaves it
  out.
- The tooltip heads a group with its name and writes its median, middle half, whiskers, outliers and
  count. `animate` grows each box from the axis with the bar's entrance.

| Prop                                                                            | Takes                                                             | Default                                                  |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------- |
| `groups`                                                                        | `{ key, label, values, summary }` per group, in the axis' order   | Required                                                 |
| `label`                                                                         | The chart's accessible name, recharts' `title`                    | Required                                                 |
| `caption`                                                                       | The finding in words, which names the figure                      | None                                                     |
| `whisker`                                                                       | The whiskers' reach in interquartile ranges                       | `1.5`                                                    |
| `outliers`                                                                      | Whether each outlier renders as a point                           | `true`                                                   |
| `legend`                                                                        | Whether the key renders                                           | `true`, while a group has values                         |
| `color`                                                                         | A hue or a palette for the boxes                                  | `series.1`                                               |
| `valueDomain`                                                                   | recharts' domain of the value axis                                | Rounded around the values                                |
| `valueOptions`                                                                  | `Intl.NumberFormatOptions` for the ticks and the tooltip's values | A number in the locale                                   |
| `medianLabel`, `quartilesLabel`, `whiskersLabel`, `outliersLabel`, `countLabel` | The names in the tooltip and the key                              | `Median`, `Middle half`, `Whiskers`, `Outliers`, `Count` |
| `grid`, `defaultIndex`, `animate`, `empty`, `locale`, `ratio`, `children`       | As the cartesian presets take them                                |                                                          |

`ViolinPlot` renders the density of each group's values, mirrored about the middle of its band, with
its quartiles inside.

```tsx
import { ViolinPlot } from "@stealthscale/component-charts";

<ViolinPlot
  caption="Search requests peak at 22ms and at 167ms."
  countLabel="Requests"
  groups={[
    { key: "search", label: "Search", values: search },
    { key: "checkout", label: "Checkout", values: checkout },
  ]}
  label="Response times of the shop's API by endpoint"
  valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
/>;
```

- A group takes `{ key, label, values }`. The chart takes the values themselves, because no summary
  gives a density back.
- `kernelDensity(values, { bandwidth, resolution })` returns a Gaussian kernel density sampled at
  `resolution` even steps, 64 unless stated, from the smallest value to the largest. The outline
  stops at those values, because a kernel puts mass past the data, such as below zero for a
  duration.
- Each group's kernel is as wide as `silvermanBandwidth(values)` returns, unless `bandwidth` states
  one width for every group. Silverman's rule takes 0.9 times the smaller of the standard deviation
  and the interquartile range over 1.34, times the count to the power of −1/5.
- A kernel wider than the gap between two peaks merges them, and a narrow one shows sampling noise
  as peaks.
- Each violin is as wide as its bar, 110px at most, at its own densest value. Its width compares
  within the group only.
- Inside each violin, a line runs between the whiskers `boxStats` returns, a narrow bar in the ink
  spans the middle half, and a hollow point marks the median. `quartiles={false}` leaves the three
  out.
- The violin under the pointer or the keyboard fills at 0.5 of its color inside an edge 2px wide,
  and the rest fill at 0.28.
- `densityPeaks(density)` returns the values a density peaks at, each at least 5% of the tallest
  peak's height.
- A violin's tooltip lists its median, middle half, range, peaks and count. Each peak takes the
  decimals of the density's sampling step, because a peak is one of the sampled values.
- The key labels the density. While `quartiles` is on, it also labels the middle half and the
  median.

| Prop                                                                                      | Takes                                                                 | Default                                                       |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------- |
| `groups`                                                                                  | `{ key, label, values }` per group, in the axis' order                | Required                                                      |
| `label`                                                                                   | The chart's accessible name, recharts' `title`                        | Required                                                      |
| `caption`                                                                                 | The finding in words, which names the figure                          | None                                                          |
| `bandwidth`                                                                               | The kernel's standard deviation for every group, in the values' units | Silverman's, per group                                        |
| `resolution`                                                                              | The number of points each density is sampled at                       | `64`                                                          |
| `quartiles`                                                                               | Whether the line, the bar and the point render inside each violin     | `true`                                                        |
| `legend`                                                                                  | Whether the key renders                                               | `true`, while a group has values                              |
| `color`, `valueDomain`, `valueOptions`                                                    | As the box plot takes them                                            |                                                               |
| `medianLabel`, `quartilesLabel`, `rangeLabel`, `peaksLabel`, `countLabel`, `densityLabel` | The names in the tooltip and the key                                  | `Median`, `Middle half`, `Range`, `Peaks`, `Count`, `Density` |
| `grid`, `defaultIndex`, `animate`, `empty`, `locale`, `ratio`, `children`                 | As the cartesian presets take them                                    |                                                               |

`CandlestickChart` renders each period's open, high, low and close as a body inside a wick:

```tsx
import { CandlestickChart } from "@stealthscale/component-charts";

<CandlestickChart
  caption="ACME rose 12.7% over September, from $156.22 to $176.03."
  categoryKey="day"
  data={days}
  label="Daily prices of ACME"
  labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
  valueOptions={{ currency: "USD", style: "currency" }}
/>;
```

- Each row takes `open`, `high`, `low` and `close`. A row without four finite prices is left out.
- The body runs from the open to the close, and the wick from the low to the high.
- `candleDirection(candle)` compares the close with the candle's own open. A rising candle takes the
  success palette's chart color, a falling one the error palette's, and a flat one the neutral
  palette's.
- `candleChange(candle)` returns the change and its share of the open. The share is `undefined` for
  an open of 0.
- A doji, a period that closed at its open, has a body 1.5px high. A candle is at most 28px wide,
  and the candle under the pointer or the keyboard takes a wick and an edge 2px wide.
- The category axis is ordinal, so a weekend takes no room. `labelOptions` formats the periods on
  the ticks and in the tooltip's heading.
- The value axis is rounded around the prices and does not start at zero, because a price is read
  for its movement. Its ticks step by 1, 2, 2.5 or 5 times a power of ten, recharts' `snap125` rule.
- A candle's tooltip lists its open, high, low and close, then the change with its sign and its
  percentage of the open to two decimals.
- The key labels the rising color and the falling color with the data package's `ColorSwatch`. It
  labels the flat color while the chart has a flat candle, and then the body and the wick.

| Prop                                                                      | Takes                                                                         | Default                                              |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------- |
| `data`                                                                    | The rows, each with `open`, `high`, `low` and `close`                         | Required                                             |
| `categoryKey`                                                             | The field of each row the category axis reads                                 | Required                                             |
| `label`                                                                   | The chart's accessible name, recharts' `title`                                | Required                                             |
| `caption`                                                                 | The finding in words, which names the figure                                  | None                                                 |
| `labelOptions`                                                            | `Intl.DateTimeFormatOptions` for the category ticks and the tooltip's heading | The category as it is                                |
| `valueOptions`                                                            | `Intl.NumberFormatOptions` for the ticks, the prices and the change           | A number in the locale                               |
| `valueDomain`                                                             | recharts' domain of the value axis                                            | Rounded around the prices                            |
| `legend`                                                                  | Whether the key renders                                                       | `true`, while a row has prices                       |
| `openLabel`, `highLabel`, `lowLabel`, `closeLabel`, `changeLabel`         | The names in the tooltip                                                      | `Open`, `High`, `Low`, `Close`, `Change`             |
| `upLabel`, `downLabel`, `flatLabel`, `bodyLabel`, `wickLabel`             | The names in the key                                                          | `Up`, `Down`, `Flat`, `Open to close`, `Low to high` |
| `grid`, `defaultIndex`, `animate`, `empty`, `locale`, `ratio`, `children` | As the cartesian presets take them                                            |                                                      |

## Pie and donut

`PieChart` and `DonutChart` render the parts of one whole from slices:

```tsx
import { DonutChart } from "@stealthscale/component-charts";

<DonutChart
  caption="Video takes 60% of the 195.5 GB in use."
  center="195.5 GB"
  centerLabel="in use"
  label="Storage per kind of file"
  slices={[
    { key: "video", label: "Video", value: 118 },
    { key: "images", label: "Images", value: 42 },
    { key: "archives", label: "Archives", value: 26 },
  ]}
/>;
```

- The chart renders the slices largest first, from 12 o'clock and clockwise, because a reader
  compares each slice with its neighbours.
- The chart writes each slice's share of the slices shown on the slice, in the chart's locale, in
  the ink inside a halo in the panel's color, which reads on a slice of any color. The pointer
  passes through a share to its slice. `shares={false}` leaves the shares out.
- `maxSlices` gathers the slices past it into one slice named by `otherLabel`, keyed `other`, in the
  neutral palette's chart color.
- A slice the legend hides leaves the pie, and the shares are of the slices shown. The pointer or
  focus on a legend button fades every other slice.
- `DonutChart` cuts a hole of 58% of the chart's radius and renders `center` and `centerLabel` in
  it. The chart does not sum the slices, because the figure in the hole is as often the largest
  share or a change as the total.

| Prop                                                                                                                             | Takes                                                   | Default                    |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------- |
| `slices`                                                                                                                         | `{ key, label, value, color }` per slice, in any order  | Required                   |
| `label`                                                                                                                          | The chart's accessible name, recharts' `title`          | Required                   |
| `caption`                                                                                                                        | The finding in words, which names the figure            | None                       |
| `shares`                                                                                                                         | Whether each slice's share is written on it             | `true`                     |
| `maxSlices`                                                                                                                      | The largest number of slices the pie renders            | Every slice                |
| `otherLabel`                                                                                                                     | The name of the slice the tail gathers into             | `Other`                    |
| `valueOptions`                                                                                                                   | `Intl.NumberFormatOptions` for the tooltip's values     | A number in the locale     |
| `legend`                                                                                                                         | Whether the legend renders                              | `true`, while slices exist |
| `ratio`                                                                                                                          | The plot's aspect ratio                                 | `square`                   |
| `legendLabel`, `defaultIndex`, `animate`, `empty`, `hiddenKeys`, `defaultHiddenKeys`, `onHiddenKeysChange`, `locale`, `children` | As the cartesian presets take them                      |                            |
| `center`, `centerLabel`                                                                                                          | `DonutChart` only: the figure in the hole and its words | None                       |

## Radial charts

`RadarChart` renders each series' values across three or more dimensions as a polygon on one spoke
per dimension:

```tsx
import { RadarChart } from "@stealthscale/component-charts";

<RadarChart
  caption="Cost is the only score that fell this quarter, from 6 to 4."
  categoryKey="dimension"
  data={scores}
  label="Checkout service scores out of 10"
  series={[
    { key: "current", label: "This quarter" },
    { key: "previous", label: "Last quarter" },
  ]}
  valueDomain={[0, 10]}
/>;
```

- Each row is a spoke named by `categoryKey`, and each series is a polygon. The chart takes the
  cartesian presets' props.
- The spokes share one radius axis, so the dimensions must share a scale. `valueDomain` states it,
  such as `[0, 10]` for scores out of ten. recharts rounds the axis from zero around the values
  unless it is stated.
- The web's rings follow six radius ticks, which step a top of 1, 5, 10 or 100 evenly. `scale`
  writes the ticks up the spoke at 12 o'clock, each hanging from its ring inside a halo in the
  panel's color.
- A polygon fills at 0.25 of its color inside an edge 2px wide. `filled: false` on a series leaves
  the outline, for three series or more.
- The web's radius is 72% of the largest circle the plot fits, which leaves the spokes' names room
  beside it. The plot's ratio is `landscape` unless stated.
- The polygon's shape follows the order of the rows, so two orders of the same scores render two
  shapes. Compare radars only with their spokes in one order.
- The tooltip's heading is the spoke's name, with a row per series. The arrows walk the spokes, and
  the cursor is a line along the spoke under the pointer.

| Prop                                                                                                                                                                                                 | Takes                                                             | Default     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------- |
| `series`                                                                                                                                                                                             | `{ key, label, color, filled }` per series, in the legend's order | Required    |
| `scale`                                                                                                                                                                                              | Whether the radius ticks are written up the top spoke             | `false`     |
| `ratio`                                                                                                                                                                                              | The plot's aspect ratio                                           | `landscape` |
| `data`, `categoryKey`, `label`, `caption`, `labelOptions`, `valueOptions`, `valueDomain`, `grid`, `legend`, `legendLabel`, `defaultIndex`, `animate`, `empty`, the hidden keys, `locale`, `children` | As the cartesian presets take them                                |             |

`RadialBarChart` renders each measure as a ring read against the value of a full turn, the first
ring outermost:

```tsx
import { RadialBarChart } from "@stealthscale/component-charts";

<RadialBarChart
  bars={[
    { key: "storage", label: "Storage", value: 0.82 },
    { key: "seats", label: "Seats", value: 0.61 },
    { key: "api", label: "API calls", value: 0.34 },
  ]}
  caption="Storage is at 82% of the plan's quota, and nothing else is past two thirds."
  label="Plan usage"
  max={1}
  valueOptions={{ style: "percent" }}
/>;
```

- A ring shows one measure against its own track, such as the use of a quota. A bar chart compares
  measures with each other.
- `max` is the value of a full turn, such as a quota, a target or a capacity. Without it the largest
  value shown closes its track, and every other ring is measured against that value.
- A ring past `max` closes its track, and the other rings keep their share of `max`. A ring below
  zero renders no arc. The legend and the tooltip write each ring's own value.
- A ring's length is its angle times its radius, so the same value renders a longer arc further out.
  The legend writes each ring's value beside its name, because an arc is not read for a quantity.
  `values={false}` leaves the names alone.
- Each ring's track is the rest of its full turn in the neutral palette's `subtle` fill.
  `track={false}` leaves the tracks out. Under forced colors a track fills with `Canvas` inside a
  `GrayText` edge.
- The rings turn clockwise from 12 o'clock. `startAngle` and `endAngle` take recharts' degrees,
  where 90 is 12 o'clock and clockwise is negative, so `225` and `-45` turn three quarters with the
  gap at the bottom.
- The hole in the middle is 30% of the largest circle the plot fits. The plot's ratio is `square`
  unless stated.
- The tooltip writes the ring's name and value without a heading, and no cursor renders. The arrows
  walk the rings from the outermost.
- A ring the legend hides leaves the chart. With `max` the other rings keep their turn.

| Prop                                                                                     | Takes                                                                | Default                  |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------ |
| `bars`                                                                                   | `{ key, label, value, color }` per ring, the outermost first         | Required                 |
| `label`                                                                                  | The chart's accessible name, recharts' `title`                       | Required                 |
| `caption`                                                                                | The finding in words, which names the figure                         | None                     |
| `max`                                                                                    | The value of a full turn                                             | The largest value shown  |
| `track`                                                                                  | Whether the rest of each ring's turn renders behind it               | `true`                   |
| `values`                                                                                 | Whether the legend writes each ring's value beside its name          | `true`                   |
| `valueOptions`                                                                           | `Intl.NumberFormatOptions` for the legend's and the tooltip's values | A number in the locale   |
| `startAngle`, `endAngle`                                                                 | The angles the rings start and end at, in recharts' degrees          | `90`, `-270`             |
| `legend`                                                                                 | Whether the legend renders                                           | `true`, while bars exist |
| `ratio`                                                                                  | The plot's aspect ratio                                              | `square`                 |
| `legendLabel`, `defaultIndex`, `animate`, `empty`, the hidden keys, `locale`, `children` | As the cartesian presets take them                                   |                          |

`PolarAreaChart` renders a rose: each category of a cycle as a wedge of the same angle, whose area
follows its value:

```tsx
import { PolarAreaChart } from "@stealthscale/component-charts";

<PolarAreaChart
  caption="The load builds from 06:00, peaks at noon and falls by 21:00."
  label="Requests a minute by hour"
  slices={[
    { key: "00", label: "00:00", value: 120 },
    { key: "06", label: "06:00", value: 210 },
    { key: "12", label: "12:00", value: 1180 },
    { key: "18", label: "18:00", value: 640 },
  ]}
/>;
```

- The wedges run clockwise from 12 o'clock in the slices' order, so twelve months read like a clock
  face. A rose suits categories that wrap, such as hours, months or compass points. A bar chart
  compares values on their own.
- A wedge's radius is √(value / `max`) of the full radius, so its area follows its value. A wedge
  worth four times another is twice as long and covers four times the area, where a radius in
  proportion to the value would cover sixteen times. `areaRadius(value, max)` returns the share of
  the full radius.
- `max` is the value of a full radius, such as a capacity. Without it the wedge of the largest value
  shown extends to the full radius. A wedge past `max` extends to the full radius too, and a value
  below zero renders no wedge.
- Every wedge takes `color`, the theme's first series color unless stated, or the palette its slice
  states. The fill rises from 0.45 of the color at zero to the whole color at `max`, so the shade
  repeats the radius.
- The chart writes the names on one circle around the rose, each centred on its wedge. Names of five
  characters, such as 00:00, clear a room 20rem wide by 10px. `names={false}` leaves them out, and
  the wedges fill the whole circle.
- The legend writes each value beside its name, because a radius is not read for a quantity.
  `values={false}` leaves the names alone.
- A wedge the legend hides keeps its place with no radius, so no category moves into another's
  place. The other wedges are measured against the largest value shown.
- The tooltip writes the wedge's name and value without a heading. The arrows walk the wedges
  clockwise from 12 o'clock.

| Prop                                                                                     | Takes                                                                | Default                    |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------- |
| `slices`                                                                                 | `{ key, label, value, color }` per category, in the cycle's order    | Required                   |
| `label`                                                                                  | The chart's accessible name, recharts' `title`                       | Required                   |
| `caption`                                                                                | The finding in words, which names the figure                         | None                       |
| `max`                                                                                    | The value of a full radius                                           | The largest value shown    |
| `color`                                                                                  | A hue, a palette or a series color for every wedge                   | `series.1`                 |
| `names`                                                                                  | Whether the names render around the rose                             | `true`                     |
| `values`                                                                                 | Whether the legend writes each value beside its name                 | `true`                     |
| `valueOptions`                                                                           | `Intl.NumberFormatOptions` for the legend's and the tooltip's values | A number in the locale     |
| `legend`                                                                                 | Whether the legend renders                                           | `true`, while slices exist |
| `ratio`                                                                                  | The plot's aspect ratio                                              | `square`                   |
| `legendLabel`, `defaultIndex`, `animate`, `empty`, the hidden keys, `locale`, `children` | As the cartesian presets take them                                   |                            |

`GaugeChart` renders one value on a dial from a range's minimum to its maximum, with the zones that
name what the value means:

```tsx
import { GaugeChart } from "@stealthscale/component-charts";

<GaugeChart
  caption="p99 latency is 740ms, inside the 900ms error budget."
  label="Checkout p99 latency"
  max={1200}
  value={740}
  valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
  zones={[
    { color: "success", label: "Healthy", upTo: 600 },
    { color: "warning", label: "Watch", upTo: 900 },
    { color: "error", label: "Critical", upTo: 1200 },
  ]}
/>;
```

- A gauge shows where one value is in a range, such as a latency against its error budget. A bar
  chart compares values with each other.
- The dial turns clockwise from `startAngle` to `endAngle`, `225` to `-45` in recharts' degrees
  unless stated: three quarters of a turn with the gap at the bottom.
- The reading fills the dial from `min` in its zone's color, and the rest of the range renders as
  the track in the neutral palette's `subtle` fill. Under forced colors the track fills with
  `Canvas` inside a `GrayText` edge.
- The chart writes the value in the middle of the dial and the zone's name under it, because an arc
  is not read for a quantity. `centerLabel` replaces the zone's name, such as with a unit.
- A zone takes `{ upTo, label, color }` and starts where the zone before it ends. The zones form a
  thin ring outside the reading, each at 40% of its color over the panel, a degree apart. A zone
  without a color takes the neutral palette.
- The part of the range past the last zone renders as the track in the zones' ring. A reading there,
  or in a zone without a color, takes `color`, the theme's first series color unless stated.
- `gaugeBands(zones, min, max)` returns the bands the ring renders: sorted, clamped to the range,
  and with the range's uncovered part marked `uncovered`. A zone that ends past `max`, `Infinity`
  included, ends at `max`. `gaugeBandAt(bands, value)` returns the band a value is in, the lower one
  on a boundary.
- A value past the range fills the dial to its end or leaves it empty, and the figure and the
  meter's text write the value itself. A value that is not a finite number renders the empty state.
- The range's two ends are written under the dial's ends. `limits={false}` leaves them out, for a
  gauge in a small tile.
- The plot is a `meter` named by `label`. Its text is the value and the zone's name, such as "740ms,
  Watch", and includes a zone's `label` only when the label is a string. The chart has no keyboard
  layer and no tooltip, because the meter reports its one value.

| Prop                     | Takes                                                                            | Default                |
| ------------------------ | -------------------------------------------------------------------------------- | ---------------------- |
| `value`                  | The value the gauge shows                                                        | Required               |
| `max`                    | The value the dial ends at                                                       | Required               |
| `label`                  | The meter's accessible name                                                      | Required               |
| `min`                    | The value the dial starts at                                                     | `0`                    |
| `zones`                  | `{ upTo, label, color }` per zone, in any order                                  | None                   |
| `caption`                | The finding in words, which names the figure                                     | None                   |
| `centerLabel`            | The words under the figure                                                       | The zone's name        |
| `color`                  | A hue, a palette or a series color for a reading no zone colors                  | `series.1`             |
| `limits`                 | Whether the range's ends are written under the dial                              | `true`                 |
| `valueOptions`           | `Intl.NumberFormatOptions` for the figure, the range's ends and the meter's text | A number in the locale |
| `startAngle`, `endAngle` | The angles the dial starts and ends at, in recharts' degrees                     | `225`, `-45`           |
| `animate`                | Whether the dial fills in, which it never does under reduced motion              | `false`                |
| `empty`                  | The message in the plot's place while the value is not a finite number           | `No data`              |
| `ratio`                  | The plot's aspect ratio                                                          | `square`               |
| `locale`, `children`     | As the cartesian presets take them                                               |                        |

## Funnel

`FunnelChart` renders the stages one set passes through, each a trapezoid as wide as its count,
above a table of each stage's count and both of its rates:

```tsx
import { FunnelChart } from "@stealthscale/component-charts";

<FunnelChart
  caption="The biggest loss is before “Added to basket”: 18,500 people."
  label="Checkout funnel for September"
  stages={[
    { key: "visited", label: "Visited the shop", value: 48_200 },
    { key: "viewed", label: "Viewed a product", value: 31_400 },
    { key: "basket", label: "Added to basket", value: 12_900 },
    { key: "paid", label: "Paid", value: 5960 },
  ]}
/>;
```

- A funnel shows which step of a process loses people. Its stages are nested sets, each a subset of
  the one before it. A bar chart compares values that are not nested.
- The stages run from the top in their order. Each stage narrows to the next, and the last is a
  rectangle. A stage's width is its count's share of the first stage's count.
- Each stage's count is written on it in the ink inside a halo in the panel's color, and the pointer
  passes through the count to the stage. `values={false}` leaves the counts out.
- The table under the plot writes each stage's count, its share of the stage before and its share of
  the first stage. The first stage's share of the stage before is empty. `steps={false}` leaves the
  table out.
- The table is the collections package's `Table.Simple` at the small size, and each stage's name
  follows a swatch of its fill. In a room too narrow for it the table scrolls sideways, and its
  scroll area is then a region in the tab order named by `stepsLabel`.
- A rate is written to two significant digits, such as 0.16%, 12% or 150%, because a whole percent
  writes a 0.3% conversion as 0%.
- The stages take one palette, `color`, from the whole color at the top down to 35% of it over the
  panel at the bottom, because the stages are ordered.
- `funnelSteps(stages)` returns each stage with its count, its two rates and the count lost before
  it. `biggestDrop(steps)` returns the step that loses the most people, by count rather than by
  rate, and `funnelWidenings(stages)` returns the stages whose count is above the stage before. A
  caption states the findings they return.
- A stage whose count is above the stage before renders as it is, and its share of the stage before
  is above 100%. It means the counts come from sets that are not nested, such as two queries
  filtered apart.
- A value that is not a finite number or is below zero counts as 0, and a stage after a stage of 0
  converts at 0.
- The tooltip heads a stage with its name and writes its count and both rates. The arrows walk the
  stages from the top.
- The chart has no legend, because hiding a stage would change both rates of the stage after it.
- A pyramid, curved or stepped sections and names beside the stages are not offered. The table
  writes the names.

| Prop                                                     | Takes                                                                              | Default                                     |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------- |
| `stages`                                                 | `{ key, label, value }` per stage, from the top                                    | Required                                    |
| `label`                                                  | The chart's accessible name, recharts' `title`                                     | Required                                    |
| `caption`                                                | The finding in words, which names the figure                                       | None                                        |
| `color`                                                  | A hue, a palette or a series color for the stages                                  | `series.1`                                  |
| `values`                                                 | Whether each stage's count is written on it                                        | `true`                                      |
| `steps`                                                  | Whether the table of the stages' counts and rates renders under the plot           | `true`                                      |
| `valueOptions`                                           | `Intl.NumberFormatOptions` for the counts on the stages, the table and the tooltip | A number in the locale                      |
| `stageLabel`, `valueLabel`, `stepLabel`, `overallLabel`  | The headings of the table's columns and the tooltip's rows                         | `Stage`, `Count`, `Of previous`, `Of first` |
| `stepsLabel`                                             | The accessible name of the table's scroll area                                     | `Conversion by stage`                       |
| `ratio`                                                  | The plot's aspect ratio                                                            | `video`                                     |
| `defaultIndex`, `animate`, `empty`, `locale`, `children` | As the cartesian presets take them                                                 |                                             |

## Treemap

`TreemapChart` renders a hierarchy of parts as nested tiles whose areas follow their sizes, such as
spend by team and then by service:

```tsx
import { TreemapChart } from "@stealthscale/component-charts";

<TreemapChart
  caption="Kubernetes and Postgres are 42% of the bill."
  label="Cloud spend for September by team and service"
  nodes={[
    {
      children: [
        { key: "postgres", label: "Postgres", value: 18_400 },
        { key: "kafka", label: "Kafka", value: 9700 },
      ],
      key: "data",
      label: "Data",
    },
    {
      children: [
        { key: "kubernetes", label: "Kubernetes", value: 21_800 },
        { key: "logs", label: "Log ingest", value: 7600 },
      ],
      key: "platform",
      label: "Platform",
    },
  ]}
  valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
/>;
```

- A treemap shows where the mass of many parts is, in two levels. An area is read less precisely
  than a length, so a bar chart compares values, and a pie or a donut shows two or three parts.
- A parent's size is its children's sum, and its own `value` is ignored. A value that is not a
  finite number or is below zero counts as 0 and has no tile, because an area cannot be negative.
- Each level runs largest first from the top left. The tiles are 2px apart, and the panel shows
  between them.
- Each top-level node is a family of tiles in its `color`, else in the series color at its place.
  Its parts mix that color over the panel, from the whole color for the largest part down to 45% for
  the smallest.
- Each tile writes its name, and under the name its value and its share of the whole, where the tile
  is tall enough. The tile measures each line after layout and hides a line wider than itself,
  because a clipped word reads as another word. `values={false}` leaves the value and the share out.
- The legend lists each top-level node with its total. A node the legend hides leaves the layout,
  and each share is of the nodes shown.
- The tooltip heads a tile with its name and writes its value and its share of the total to two
  significant digits.
- The chart's `svg` is one tab stop named by `label`. The left and right arrows walk the tiles depth
  first, a family before its parts, Home and End go to the first tile and the last, and each step
  opens the tooltip at the tile. `defaultIndex` is a place in that walk.
- `hierarchyLeaves(nodes)` returns every leaf depth first with its top-level group, its value as
  given and its share of the total of every tile. A ranking sorts the leaves, and a leaf with a
  value below zero is one the chart leaves out. A caption states the findings they return.
- recharts' drill-down, `type="nest"`, is not offered, because its breadcrumbs take no key.

| Prop                                                    | Takes                                                                                 | Default                |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------- |
| `nodes`                                                 | `HierarchyNode`s, `{ key, label, value, color, children }`, top level first           | Required               |
| `label`                                                 | The accessible name of the chart's keyboard layer                                     | Required               |
| `caption`                                               | The finding in words, which names the figure                                          | None                   |
| `values`                                                | Whether each tile writes its value and share, and the legend each family's total      | `true`                 |
| `valueOptions`                                          | `Intl.NumberFormatOptions` for the values on the tiles, in the legend and the tooltip | A number in the locale |
| `valueLabel`, `shareLabel`                              | The names of the tooltip's rows                                                       | `Value`, `Of total`    |
| `legend`, `legendLabel`                                 | Whether the legend renders, and the name of its group of buttons                      | `true`, `Series`       |
| `defaultIndex`                                          | The place in the walk of the tile the tooltip opens at first                          | None                   |
| `hiddenKeys`, `defaultHiddenKeys`, `onHiddenKeysChange` | The top-level nodes the legend hides                                                  |                        |
| `ratio`                                                 | The plot's aspect ratio                                                               | `video`                |
| `animate`, `empty`, `locale`, `children`                | As the cartesian presets take them                                                    |                        |

## Sunburst

`SunburstChart` renders a hierarchy of parts as rings around a middle, one ring per level, such as
spend by team, then by service, then by resource:

```tsx
import { SunburstChart } from "@stealthscale/component-charts";

<SunburstChart
  caption="The platform team is 65% of the bill."
  center="€73,500"
  centerLabel="September"
  label="Cloud spend for September by team, service and resource"
  nodes={[
    {
      children: [
        {
          children: [
            { key: "vms", label: "Virtual machines", value: 26_000 },
            { key: "gpus", label: "GPUs", value: 12_400 },
          ],
          key: "compute",
          label: "Compute",
        },
        { key: "network", label: "Network", value: 9300 },
      ],
      key: "platform",
      label: "Platform",
    },
    {
      children: [
        { key: "web", label: "Web app", value: 14_200 },
        { key: "mobile", label: "Mobile app", value: 11_600 },
      ],
      key: "product",
      label: "Product",
    },
  ]}
  valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
/>;
```

- A sunburst shows how a whole divides level by level and which parent each part belongs to. An arc
  is read less precisely than a length or an area, so a bar chart compares values and a treemap
  compares the sizes of many parts.
- The rings run from the middle out, one per level. Each ring renders its nodes in their parents'
  order, largest first, from 12 o'clock and clockwise, so a part's arc is inside its parent's arc. A
  leaf that ends above the outer rings leaves a gap of its size in each ring beyond it, and a gap
  takes no pointer.
- The rings split the room from a hole of 36% of the radius to 96% of it evenly. The hole renders
  `center` and `centerLabel`.
- Sizes and families follow the treemap's rules. A parent's size is its children's sum, a value
  below zero or not finite has no arc, and each top-level node is a family in its `color`, else in
  the series color at its place.
- Each ring is paler than the ring inside it. A part mixes its family's color over the panel by its
  place among its siblings, from the whole color down to 45%, times 0.82 for each level below the
  top: 82% to 37% in the second ring, 67% to 30% in the third.
- No arc is labelled. The tooltip heads an arc with its name and writes its value and its share of
  the total to two significant digits. The legend lists each top-level node with its total, and a
  node it hides leaves the rings.
- The chart's `svg` is one tab stop named by `label`. The left and right arrows walk the arcs depth
  first, a family before its parts, Home and End go to the first arc and the last, and each step
  opens the tooltip at the arc. `defaultIndex` is a place in that walk.
- The chart renders a recharts `Pie` per ring inside a `PieChart`, so `children` are recharts
  elements of a pie chart.

| Prop                                                    | Takes                                                                       | Default                |
| ------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------- |
| `nodes`                                                 | `HierarchyNode`s, `{ key, label, value, color, children }`, top level first | Required               |
| `label`                                                 | The accessible name of the chart's keyboard layer                           | Required               |
| `caption`                                               | The finding in words, which names the figure                                | None                   |
| `center`, `centerLabel`                                 | The figure in the hole and its words                                        | None                   |
| `values`                                                | Whether the legend writes each family's total                               | `true`                 |
| `valueOptions`                                          | `Intl.NumberFormatOptions` for the values in the legend and the tooltip     | A number in the locale |
| `valueLabel`, `shareLabel`                              | The names of the tooltip's rows                                             | `Value`, `Of total`    |
| `legend`, `legendLabel`                                 | Whether the legend renders, and the name of its group of buttons            | `true`, `Series`       |
| `defaultIndex`                                          | The place in the walk of the arc the tooltip opens at first                 | None                   |
| `hiddenKeys`, `defaultHiddenKeys`, `onHiddenKeysChange` | The top-level nodes the legend hides                                        |                        |
| `ratio`                                                 | The plot's aspect ratio                                                     | `square`               |
| `animate`, `empty`, `locale`, `children`                | As the cartesian presets take them                                          |                        |

## Sankey

`SankeyChart` renders flows between the stages of a process as bands whose widths follow their
values, such as a month's visitors by channel, then by what they did:

```tsx
import { SankeyChart } from "@stealthscale/component-charts";

<SankeyChart
  caption="27% of visitors signed up."
  flows={[
    { from: "organic", to: "signup", value: 3100 },
    { from: "organic", to: "left", value: 9300 },
    { from: "paid", to: "signup", value: 2000 },
    { from: "paid", to: "left", value: 4800 },
  ]}
  label="Visitors for September by channel and outcome"
  nodes={[
    { key: "organic", label: "Organic search" },
    { key: "paid", label: "Paid search" },
    { key: "signup", label: "Signed up" },
    { key: "left", label: "Left" },
  ]}
/>;
```

- A sankey shows where a quantity goes as it splits and merges between stages. A funnel is the
  better chart for one path.
- `nodes` are `{ key, label, color }` and `flows` are `{ from, to, value }` by key, where recharts
  takes indexes. A flow is rendered between two known nodes with a finite value above zero, and
  flows between the same two nodes add up to one band. The chart leaves out a node without a
  rendered flow.
- `sankeyCycles(flows)` returns the flows that close a loop against the flows before them. A sankey
  shows flow in one direction and recharts throws on a loop, so the chart leaves those flows out,
  and a caption states them.
- `flowBalance(nodes, flows)` returns each node's inflow and outflow. A node that sends less than it
  receives loses flow the chart does not show, and a caption states the difference.
- Each node is a bar in its `color`, else in the series color at its place, as tall as the larger of
  its inflow and outflow. Each flow is a band in its source's color at the backdrop opacity.
  recharts places each node in a column by the longest path to it, and a node that sends nothing in
  the last column.
- Each node writes its name after its bar, or before it in the last column, and its value under the
  name where the bar is two lines tall (`values`). A line that would meet a line of a node earlier
  in `nodes`, or leave the plot, is hidden. The tooltip and the walk name every node.
- The tooltip writes a node's inflow and outflow, and a flow's value and its share of what its
  source sends to two significant digits. The tooltip at a flow lifts it, and at a node lifts every
  flow of the node, while the other marks fade.
- The chart's `svg` is one tab stop named by `label`. The left and right arrows walk each node in
  the order of `nodes`, then the flows it sends. Home and End go to the first mark and the last, and
  each step opens the tooltip at the mark. `defaultIndex` is a place in that walk.

| Prop                          | Takes                                                                         | Default                |
| ----------------------------- | ----------------------------------------------------------------------------- | ---------------------- |
| `nodes`                       | `SankeyNode`s, `{ key, label, color }`, in the walk's order                   | Required               |
| `flows`                       | `SankeyFlow`s, `{ from, to, value }` by key                                   | Required               |
| `label`                       | The accessible name of the chart's keyboard layer                             | Required               |
| `caption`                     | The finding in words, which names the figure                                  | None                   |
| `values`                      | Whether each node writes its value under its name                             | `true`                 |
| `valueOptions`                | `Intl.NumberFormatOptions` for the values beside the nodes and in the tooltip | A number in the locale |
| `inflowLabel`, `outflowLabel` | The names of a node's rows in the tooltip                                     | `In`, `Out`            |
| `valueLabel`, `shareLabel`    | The names of a flow's rows in the tooltip                                     | `Value`, `Of source`   |
| `defaultIndex`                | The place in the walk of the mark the tooltip opens at first                  | None                   |
| `ratio`                       | The plot's aspect ratio                                                       | `video`                |
| `empty`, `locale`, `children` | As the cartesian presets take them                                            |                        |

## Chord diagram

`ChordDiagram` renders flows between peers around a circle, such as calls between services. Each
node is an arc as long as what it sends, and each pair of nodes is one ribbon whose two ends are as
wide as the two directions:

```tsx
import { ChordDiagram } from "@stealthscale/component-charts";

<ChordDiagram
  caption="api sends the most calls."
  flows={[
    { from: "api", to: "auth", value: 2600 },
    { from: "auth", to: "api", value: 1900 },
    { from: "api", to: "billing", value: 1400 },
    { from: "billing", to: "api", value: 700 },
  ]}
  label="Calls between services in the last hour"
  nodes={[
    { key: "api", label: "api" },
    { key: "auth", label: "auth" },
    { key: "billing", label: "billing" },
  ]}
/>;
```

- A chord diagram shows the flows a sankey leaves out: flows both ways between two nodes, flows
  around a loop, and a node's flow to itself. A sankey is the better chart for flow through stages.
- `nodes` and `flows` are the sankey's `SankeyNode` and `SankeyFlow`, so the same arrays render as
  either chart. A flow counts between two known nodes with a finite value above zero, and flows
  between the same two nodes add up. Only the nodes a counted flow touches have arcs.
- `chordLayout(nodes, flows, pad)` returns the arcs and the ribbons in radians from 12 o'clock,
  clockwise, as d3-chord's. An arc is as long as what its node sends, so a node that only receives
  has an arc of no length and its ribbons end in points. The arcs are 0.06 radians apart unless
  `pad` states another space, and the spaces take at most half the circle.
- Each arc is in its node's `color`, else in the series color at its place. Each ribbon is wider at
  the node that sends more and takes that node's color, so its color is the pair's net direction. A
  ribbon rests at the backdrop opacity.
- Each node writes its name outside the ring at its arc's middle. A name that would meet the name of
  a node earlier in `nodes`, or leave the plot's sides, is hidden. The readout and the walk name
  every node.
- The readout in the middle of the ring is the kit's tooltip. It writes what an arc's node sends and
  receives, and both directions of a ribbon, including a direction of 0. The readout at a ribbon
  lifts it, and at an arc every ribbon of its node, while the other marks fade.
- The chart's `svg` is one tab stop named by `label`. The left and right arrows walk each arc in the
  order of `nodes`, then the ribbons that start on it. Home and End go to the first mark and the
  last, and each step moves the readout to the mark. `defaultIndex` is a place in that walk.

| Prop                          | Takes                                                                       | Default                |
| ----------------------------- | --------------------------------------------------------------------------- | ---------------------- |
| `nodes`                       | `SankeyNode`s, `{ key, label, color }`, in the order their arcs follow      | Required               |
| `flows`                       | `SankeyFlow`s, `{ from, to, value }` by key, both ways and to a node itself | Required               |
| `label`                       | The accessible name of the chart's keyboard layer                           | Required               |
| `caption`                     | The finding in words, which names the figure                                | None                   |
| `valueOptions`                | `Intl.NumberFormatOptions` for the amounts in the readout                   | A number in the locale |
| `inflowLabel`, `outflowLabel` | The names of an arc's rows in the readout                                   | `In`, `Out`            |
| `defaultIndex`                | The place in the walk of the mark the readout opens at first                | None                   |
| `ratio`                       | The plot's aspect ratio                                                     | `square`               |
| `empty`, `locale`, `children` | As the cartesian presets take them                                          |                        |

## Heatmap

`Heatmap` renders a value for every pair of a row and a column as a grid of cells colored from their
values, such as card authorisations per weekday and hour:

```tsx
import { Heatmap } from "@stealthscale/component-charts";

<Heatmap
  caption="Tuesday at 17:00 is the busiest hour, with 405 authorisations."
  cells={[
    { column: "09", row: "mon", value: 128 },
    { column: "17", row: "mon", value: 342 },
    { column: "09", row: "tue", value: 116 },
    { column: "17", row: "tue", value: 405 },
  ]}
  columns={[
    { key: "09", label: "09:00" },
    { key: "17", label: "17:00" },
  ]}
  corner="Weekday"
  label="Card authorisations per hour, by weekday"
  rows={[
    { key: "mon", label: "Mon" },
    { key: "tue", label: "Tue" },
  ]}
  valueLabel="Authorisations"
/>;
```

- A reader finds a dark block in a heatmap faster than the largest number in a table, and reads the
  exact value in the readout or printed in the cell.
- The grid is an HTML `table` in the `grid` role, named by `label`. Each heading is a `th` with its
  scope, so a screen reader reads a cell's value with its row and its column.
- `cells` are `{ row, column, value }`. Every pair of a row and a column is a cell. A pair without a
  reading, a `null` value and a value that is not a finite number are missing: the cell has no fill,
  a dashed edge and the words of `missingLabel`. Of two readings for one pair, the later applies.
- `rows` and `columns` list the headings in order. An axis without them takes each key in the order
  the cells first name it. A reading whose row or column is not on a stated axis is left out.
- `sparse` renders a pair without a reading as an empty place: no fill, no edge, no words, and the
  walk passes over it. A `null` value is still a missing reading. A calendar's days outside its
  window and the periods past a cohort's last count are empty places.
- `groups` lists the headings of groups of columns, and a column states its group's key in `group`.
  A group's heading spans the consecutive columns that name it in a row above the column headings.
  Its words start at the group's first column, never widen the columns, and are hidden from sight
  while they are wider than the group.
- A heading with `hidden` renders its words for a screen reader alone, such as a calendar's weeks.
- A reading's `label` names it: the readout writes it as its heading in place of the row's and the
  column's words, and a screen reader reads it before the value, after the locale's list separator.
  A reading's `text` is what the cell prints and reads for its value, such as a head count while the
  fill is a rate.
- `shape` renders each cell as a `block`, which widens to a printed value, or a `square` with a 2px
  corner, which does not print its value. Beside squares the row headings take no height of their
  own, so the rows are as far apart as the columns. A square keeps its side while its column's
  heading fits it.
- The cell type is the caller's: `onSelect` receives the reading as it was passed, with any fields
  the caller added, such as a calendar day's `date`. A pair without a reading calls nothing.
- A `sequential` scale mixes `color` over the panel from 12% at the domain's minimum to the whole
  color at its maximum, so the lowest value keeps a tint. A `diverging` scale mixes
  `colors.negative` under `midpoint` and `colors.positive` over it, from the panel at the midpoint
  to the whole color at the further end of the domain, with one reach on both sides. A value past
  the domain takes the color of its end.
- The domain is the values' span unless `domain` pins it. `heatmapDomain(cells)` returns the span of
  the readings of two or more grids, so grids read against each other take one domain.
- `values` prints each value in its cell in black or white, whichever `contrast-color()` finds
  contrasts more with the cell: at least 4.56:1 on every fill of the ten themes. A browser without
  `contrast-color()` writes the values in the ink.
- The key under the grid writes `valueLabel` and the domain's ends on either side of a bar of the
  scale's colors, and a diverging scale's midpoint under the bar. The bar is hidden from assistive
  technology.
- The grid is one tab stop. The arrow keys move to the next cell, Home and End to the row's ends,
  and Control or Command with Home or End to the grid's first and last cell. Enter, Space and a
  press call `onSelect` with the cell's reading.
- The readout over the cell under the pointer, else over the focused cell, writes the reading's
  `label`, else the row's and the column's headings, and the value. Escape hides it until the
  pointer or focus moves.
- A grid wider than its container scrolls sideways, with the row headings sticky at its start. The
  cell at `defaultIndex` is scrolled into the grid's view when the heatmap mounts, and the page does
  not move.

| Prop              | Takes                                                                                       | Default                                       |
| ----------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `cells`           | `HeatmapCell`s, `{ row, column, value, label, text }`, in any order                         | Required                                      |
| `label`           | The grid's accessible name                                                                  | Required                                      |
| `rows`, `columns` | `HeatmapHeading`s, `{ key, label, group, hidden }`, in order                                | Each key in the order the cells first name it |
| `groups`          | `HeatmapHeading`s of the groups of columns                                                  | None                                          |
| `sparse`          | Whether a pair without a reading is an empty place                                          | `false`                                       |
| `corner`          | The words over the row headings                                                             | None                                          |
| `caption`         | The finding in words, which names the figure                                                | None                                          |
| `scale`           | `sequential` or `diverging`                                                                 | `sequential`                                  |
| `color`           | The color of a sequential scale                                                             | `series.1`                                    |
| `colors`          | `{ negative, positive }`, the colors of a diverging scale                                   | `orange` and `blue`                           |
| `midpoint`        | The value a diverging scale takes the panel at                                              | `0`                                           |
| `domain`          | `{ min, max }`, the values the scale spans                                                  | The values' span                              |
| `values`          | Whether each block cell prints its value                                                    | `false`                                       |
| `valueOptions`    | `Intl.NumberFormatOptions` for the values                                                   | A number in the locale                        |
| `valueLabel`      | The name of the values in the key and the readout                                           | `Value`                                       |
| `missingLabel`    | The words of a cell without a value                                                         | `No data`                                     |
| `defaultIndex`    | The place in `cells` of the reading the readout shows at first                              | None                                          |
| `onSelect`        | Called with the reading of the cell Enter, Space or a press selects                         | None                                          |
| `shape`           | `block` or `square`                                                                         | `block`                                       |
| `size`            | `sm`, `md` or `lg`: blocks 24, 32 or 44px tall and at least as wide, squares 10, 14 or 24px | `md`                                          |
| `ratio`           | The aspect ratio of the empty state                                                         | `wide`                                        |
| `empty`, `locale` | As the cartesian presets take them                                                          |                                               |

### Calendar

`calendarCells(days, options)` lays daily readings out as a heatmap calendar and returns the props
to spread into `Heatmap`:

```tsx
import { calendarCells, Heatmap } from "@stealthscale/component-charts";

<Heatmap
  {...calendarCells(deploys, { from: "2025-10-01", locale: "en-US", to: "2026-09-30" })}
  caption="The release week of 9 March was the busiest, with 80 deploys."
  label="Deploys per day, October 2025 to September 2026"
  size="sm"
  valueLabel="Deploys"
/>;
```

- `days` are `{ date, value }`, each date a civil date written `YYYY-MM-DD`, never an instant. The
  layout reads each date as a calendar date through `@internationalized/date`, so no time zone moves
  a day. A string that is not a date is left out, and of two readings for one date the later
  applies.
- The window runs from `from` to `to`, the days' span unless stated, in whole weeks. A day of the
  window without a reading is missing, and a place of the first or last week outside the window is
  an empty place.
- The rows are the weekdays from the locale's first day of the week, or from `weekStartsOn`, a
  `DayOfWeek` from `sun` to `sat`. The columns are the weeks, each with a hidden heading of its
  dates in the window. The groups are the months, each week in the month of its first day in the
  window, the first month with its year.
- Each cell's `label` is its date in the locale's full words, and `onSelect` receives the cell with
  its `date`.
- The props render square cells in a sparse grid. A calendar that calls `onSelect` takes
  `size="lg"`, whose 24px squares are the pointer target WCAG 2.5.8 asks for.

## Cohorts

A cohort is `{ key, label, size, retained }`: how many arrived together and how many remained at
each period since, index 0 being the period they arrived in. The length of `retained` is how far the
cohort is observed. A `null` inside it is a count nobody measured, and a period past its end has not
happened yet.

`cohortCells(cohorts, options)` returns the props of a heatmap of retention by cohort:

```tsx
import { cohortCells, Heatmap } from "@stealthscale/component-charts";

<Heatmap
  {...cohortCells(signups, {
    average: "All cohorts",
    label: (cohort) => `${cohort.label} · ${cohort.size}`,
    locale: "en-US",
    periodLabel: (period) => `M${period}`,
  })}
  corner="Signed up"
  label="Share of customers still active, by signup month and month since signup"
  values
/>;
```

- Each cohort is a row and each period a column. A cell's value is the share of the cohort that
  remained, on a scale from 0 to 1 written as a percentage, and a period past the cohort's last
  count is an empty place.
- `measure: "count"` writes how many remained in each cell, and the fill is the rate either way.
- `average` names a last row of the rates weighted by each cohort's size, over the cohorts with a
  rate at the period. `cohortAverages` returns those rates, and `retentionRate` one cohort's rate.
- `onSelect` receives a cell with its `cohort`, `period` and `retained` count.

`retentionSeries(cohorts, options)` returns the props of a `LineChart` of the same cohorts:

```tsx
import { LineChart, retentionSeries } from "@stealthscale/component-charts";

<LineChart
  {...retentionSeries(trials, { periodLabel: (week) => `W${week}` })}
  label="Share of trials still active, by week since the trial started"
/>;
```

- A row per period, a line per cohort, and the average weighted by each cohort's size. The value
  axis runs from 0 to 1 and writes percentages.
- Every cohort's line takes `color`, `series.1` unless stated, each newer cohort mixed further
  towards the ink, up to 60% for the newest. The average is the ink.
- The average renders solid while at least `minCohorts`, 3 unless stated, have a rate at the period,
  and dashed after, where it is the average of the oldest few. The solid and the dashed part share
  the last solid period, so the line joins. `averageLabel` and `sparseLabel` name them.
- `cohortSeriesKey(key)` returns a cohort's series key, for `defaultHiddenKeys` or a
  `ReferenceLine`.

## Timeline

`TimelineChart` places moments on one time window across lanes, such as deploys and incidents per
service:

```tsx
import { TimelineChart } from "@stealthscale/component-charts";

<TimelineChart
  caption="The api raised three alerts between 14:03 and 14:09 UTC and rolled back at 16:20."
  events={moments}
  label="Deploys and incidents on 28 September"
  labelOptions={{ hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: "UTC" }}
  lanes={[
    { key: "api", label: "API" },
    { key: "web", label: "Web" },
  ]}
  since="2026-09-28T00:00:00Z"
  until="2026-09-29T00:00:00Z"
/>;
```

- A moment is `{ key, at, label, lane, color }`, where `at` is a `Date`, milliseconds since the
  epoch or an ISO 8601 string. A moment whose instant cannot be read, or outside the window, is left
  out.
- `lanes` lists the lanes in order with their names, else each lane in the order the moments first
  name it, and a moment of a lane it does not list is left out. The moments without a lane go into
  one lane named by `otherLabel`, after the others unless `lanes` lists its key, `OTHER_LANE`. A
  chart of one lane renders no lane axis.
- Every lane shares one window, from the earliest moment to the latest unless `since` and `until`
  state it. A caller who shows part of the moments states the window, so each marker keeps its
  place.
- Moments of a lane closer than `minGap` of the window share one marker. A moment joins the marker
  that opened first, measured from where that marker opened, so evenly spaced moments do not chain
  into one marker across the chart.
- A marker is a dot of radius 6 for one moment and a pill 20px tall with the count for two or more,
  7px wider per digit of the count. It takes the color of its loudest moment: `error`, then
  `warning`, then its first moment's color, else the theme's first series color. The count is black
  or white, whichever `contrast-color()` finds against the marker.
- The time axis writes `ticks` times evenly spaced across the window, both ends included, in
  `labelOptions`. recharts moves the time at each end inward until it fits, and leaves out a time
  between them that would meet another.
- The tooltip heads a marker with its lane and its time, or the range from its first moment to its
  last, and lists each moment with its time: five at most, then the row `moreLabel` writes for the
  rest.
- The plot is a row of `sizes.10` per lane over the time axis, at the chart's `rows` ratio.
- The chart's `svg` is one tab stop in the `application` role. The left and right arrows, Home and
  End walk the markers lane by lane, and Enter and Space select the marker the walk is at.
  `onSelect` receives the marker's moments on a press, Enter or Space.
- `layoutEvents(events, options)` returns the window and the lanes of clusters the chart plots, for
  a caller who writes a caption from them.
- To show part of the moments, a caller filters `events` and states `since` and `until`, so the
  window does not move.

| Prop                                     | Takes                                                                     | Default                            |
| ---------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------- |
| `events`                                 | The moments, in any order                                                 | Required                           |
| `label`                                  | The chart's accessible name, recharts' `title`                            | Required                           |
| `caption`                                | The finding in words, which names the figure                              | None                               |
| `lanes`                                  | `{ key, label }` per lane, in order                                       | Each lane the moments name         |
| `otherLabel`                             | The name of the lane of the moments without a lane                        | `Other`                            |
| `since`, `until`                         | The window's ends: a `Date`, milliseconds or an ISO 8601 string           | The earliest and the latest moment |
| `minGap`                                 | The share of the window under which two moments of a lane share a marker  | `0.02`                             |
| `ticks`                                  | The number of times on the time axis, both ends included                  | `5`                                |
| `labelOptions`                           | `Intl.DateTimeFormatOptions` for the ticks and the tooltip's times        | The day, the month and the time    |
| `moreLabel`                              | Writes the row that counts the moments the tooltip does not list          | `N more`                           |
| `onSelect`                               | Called with a marker's moments on a press, Enter or Space                 | None                               |
| `defaultIndex`                           | The place in the walk of the marker the tooltip shows on the first render | None                               |
| `animate`, `empty`, `locale`, `children` | As the cartesian presets take them                                        |                                    |

## Sparkline and sparkbar

`Sparkline` and `Sparkbar` render a run of values the size of a word, without axes, a tooltip or a
legend, for a table row or for the figure the run belongs to:

```tsx
import { Sparkline } from "@stealthscale/component-charts";

<Sparkline values={[5980, 6420, 6110, 7030, 6890, 7560, 8130]} />;
```

- A sparkline spans the run's own range, so it shows whether the run rises or falls, and the figure
  goes beside it. `area` fills under the line with the chart's gradient, which measures volume only
  for a run that starts at zero. `curve` is `monotone` unless stated, or `linear`.
- A sparkbar measures each bar from zero. `signed` renders a value under zero in the error palette's
  chart color, for a change per period.
- `baseline` marks a value with a dashed line in the subtle ink, and a sparkline's range widens to
  include it.
- A value that is not a finite number keeps its place as a gap, because a zero there would plot a
  fall that never happened. A sparkbar renders a zero and a missing value alike, as an empty period.
- `color` takes a hue or a palette, else the theme's first series color.
- `label` makes the run an image named by it. Without one the run is hidden from assistive
  technology, for a run beside its figure. Neither takes a tab stop.
- The box is a `div`, because recharts renders `div`s inside it. A spark goes in a table cell or a
  row of a layout, not in a paragraph.

| Axis      | Values                                                                 | Default |
| --------- | ---------------------------------------------------------------------- | ------- |
| `size`    | `sm` 64 by 16, `md` 96 by 24, `lg` 128 by 32 pixels, times the density | `md`    |
| `stretch` | `true` fills the container's width at the size's height                | `false` |

## Chart

`Chart.useChart` takes the rows and the series and returns the chart. `Chart.Root` provides it to
the parts. Each mark reads its color, its opacity and whether the legend hides it from the chart.

```tsx
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import { Chart } from "@stealthscale/component-charts";

const chart = Chart.useChart({
  data: payouts,
  series: [
    { key: "paid", label: "Paid" },
    { key: "refunded", label: "Refunded" },
  ],
});
const euros = chart.formatNumber({ currency: "EUR", style: "currency" });

<Chart.Root chart={chart}>
  <Chart.Plot>
    <LineChart accessibilityLayer data={chart.data} title="Payouts per day">
      <XAxis dataKey="day" />
      <YAxis tickFormatter={euros} />
      <Tooltip content={<Chart.Tooltip formatValue={euros} />} />
      {chart.series.map((series) => (
        <Line
          dataKey={series.key}
          hide={series.hidden}
          key={series.key}
          opacity={series.opacity}
          stroke={series.color}
        />
      ))}
    </LineChart>
  </Chart.Plot>
  <Chart.Legend />
  <Chart.Caption>Refunds rose to €1,250 on Thursday.</Chart.Caption>
</Chart.Root>;
```

| Part        | Element      | What it renders                                                                                               |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------- |
| `Root`      | `figure`     | The figure. It takes the chart and the ratio                                                                  |
| `Plot`      | `div`        | The box recharts sizes the chart to, while the chart has rows, and `center` and `centerLabel` over its middle |
| `Empty`     | `div`        | Its children in the plot's place and at its ratio, while the chart has no rows                                |
| `Legend`    | `fieldset`   | A button per series, which shows and hides the series                                                         |
| `Key`       | `ul`         | The parts of the marks, for a chart read by convention, such as a box plot                                    |
| `KeyItem`   | `li`         | A part's glyph, the caller's `svg`, beside its name                                                           |
| `Caption`   | `figcaption` | The finding in words, which is the figure's accessible name                                                   |
| `Tooltip`   | `output`     | The content of recharts' `Tooltip`: the category and each series' value, in the legend's order                |
| `Crosshair` | `g`          | A dashed guide across the plot at the active row's value of `dataKey`, a child of a cartesian chart           |

`Chart.Tooltip` takes `rowsOf(entries)` for a tooltip about one datum with more than one number,
such as a box. The rows it returns render as `{ key, name, value }` without a swatch.
`notesOf(label)` returns notes the tooltip lists after the rows, each `{ key, text, color }` with a
swatch.

`Chart.Crosshair` is a recharts child of any cartesian chart, a preset included:
`<LineChart …><Chart.Crosshair dataKey="p95" /></LineChart>`. It renders a guide in 3px dashes in
the `border` ink, across the plot at the active row's value, while the tooltip shows a finite value
of a series the legend shows. recharts' cursor marks the category, so the two lines cross at the
point, and the arrows move both with the tooltip.

| Axis    | Values                                                                            | Default |
| ------- | --------------------------------------------------------------------------------- | ------- |
| `ratio` | `square`, `landscape`, `portrait`, `golden`, `video`, `wide`, `ultrawide`, `rows` | `video` |

recharts renders nothing in a box 0 pixels high, and a plot inside a parent without a height
measures 0. The ratio gives the plot its height before recharts measures it. `rows` sizes the plot
by its rows in place of its width: `sizes.10` per row of the plot's `--chart-rows`, and `sizes.12`
for the axis under them.

The recipe sets recharts' own inks from the theme: the tick labels and a `Label`'s text in
`fg.muted`, the axis lines and tick marks in `border`, the grid in `border.muted`, and the band
under the pointer in `neutral.subtle`. These apply over a `fill` or `stroke` passed to an axis or a
`Label`.

### Series and colors

A series takes a `key`, the field of each row it reads, a `label` for the tooltip and the legend,
and an optional `color`.

- A series without a color takes the theme's series color at its position, `series.1` to `series.8`.
  The ninth series takes the first again.
- Each theme takes its series colors from its own colors first, so a chart's first series wear the
  brand. The first series is blue in ink, red in cinder and green in pine, and neon's first three
  are violet, pink and yellow.
- `color` names one of the theme's hue palettes, or one of its eight semantic palettes for a series
  with a meaning, such as an `error` threshold. The chart renders the palette's `chart` role, the
  lightest color of the palette's hue that keeps 3:1 against the page and the panel.
- `color` may also be one of the series colors, `series.1` to `series.8`, which a series keeps at
  any position, such as the same series in two charts.
- Each theme's contrast check measures every `chart` role and every series color at 3:1 or more
  against the page and the panel.
- `Chart.colorOf(color)` returns a palette's chart color for a recharts child, and
  `chart.color(key)` a series' color.
- `ink` mixes a series' color towards the ink, `fg`, by a share in percent, so series of one color
  read in an order of strength. A chart color mixed towards the ink measured 3:1 or more against the
  page and the panel at every share, on the 27 chart colors of the ten themes in both modes.

A pie's sectors are series: each row's name is a series key, and the caller sets each sector's
`fill` from `chart.color`. A `Pie` takes `rootTabIndex={-1}`, because recharts makes the pie's group
a tab stop without a name beside the keyboard layer.

### The legend

The legend renders a button per series outside the plot, so switching a series does not resize the
chart.

- A plain press switches the pressed series and never hides the last one shown.
- A press with Ctrl or Cmd shows the pressed series alone, and a second one shows every series
  again.
- The pointer or focus on a button fades every other series' marks to the plot's `--chart-faded`,
  the theme's `opacity.backdrop`, over the fast duration. A mark fades through its `opacity` prop,
  from `series.opacity` or `chart.opacity(key)`.
- A hidden series' name is struck through and its swatch faded. Each swatch is the data package's
  `ColorSwatch`.
- `hiddenKeys` and `onHiddenKeysChange` control the hidden series, and `defaultHiddenKeys` sets them
  for the first render.

### Formatting

`chart.formatNumber(options)` and `chart.formatDate(options)` take `Intl`'s own options and return
functions for recharts' `tickFormatter` and the tooltip's `formatValue` and `formatLabel`. Both
format in the chart's `locale` when it is set. Without it they use the locale of the nearest
`LocaleProvider`, and without a provider the runtime's. `chart.locale` returns that locale for
another `Intl` format. The tooltip formats values as numbers in that locale unless `formatValue` is
given, and a band's two ends as a range.

### Accessibility

- The caption is the figure's accessible name. A screen reader reads nothing from a plot's paths, so
  the caption states the finding: "Refunds doubled after Tuesday's release", not "Line chart of
  refunds". The root points `aria-labelledby` at the caption while one renders, because Chromium
  computes a `figure`'s name from its `figcaption` only through `aria-labelledby`.
- recharts' keyboard layer, `accessibilityLayer`, is on by default. It makes the chart one tab stop
  in the `application` role, whose left and right arrows move the tooltip through the categories.
  The `title` prop gives the chart its accessible name. VoiceOver users turn QuickNav off to use the
  arrows.
- The treemap, the sunburst, the sankey, the chord diagram and the timeline walk their marks
  themselves. recharts gives a treemap no keyboard layer, the arrows of a pie chart's layer move
  through its first pie alone, a sankey's layer ignores every key, and the marks of a chord diagram
  and a timeline are not recharts' own. Each chart's `svg` is the one tab stop in the `application`
  role. The left and right arrows, Home and End send the pointer's events to the next mark, and the
  tooltip opens there as it does under a pointer. Enter and Space press the mark the walk is at,
  which selects a timeline's marker.
- A chord diagram's readout is the same tooltip in the middle of the ring. Its panel is transparent
  while it is empty and remains in the accessibility tree. A screen reader announces the first step
  of the walk from it.
- A heatmap is an HTML table in the `grid` role, where the other charts are an `svg` in the
  `application` role. Its cells are `gridcell`s with one tab stop between them, and a screen reader
  reads each cell's value with its row and column headings. A calendar's cell reads its date first:
  "Sunday, October 5, 2025, 0" in Chromium. The readout over a cell is hidden from assistive
  technology, because the focused cell reads the same words.
- The tooltip is an `output`, whose `status` role reads its whole text on a change. It is
  `aria-live="assertive"` while the keyboard layer is on, as recharts' own tooltip is, so a screen
  reader reads each point the arrows move to. In a pie the arrows move it from slice to slice.
- The figure in a donut's or a sunburst's hole is hidden from assistive technology, because the
  caption states the finding.
- The legend's buttons report `aria-pressed`, and each swatch is hidden from assistive technology.
- Under forced colors neither Firefox nor Chromium replaces an SVG `fill` or `stroke`, so the series
  keep their colors. The tick labels, a `Label`'s text and the axis lines take `CanvasText`, the
  grid `GrayText`, and each swatch keeps its color inside a `CanvasText` edge. A quadrant chart's
  lines, its names and the words beside its points take `CanvasText`, and a timeline's markers keep
  their colors inside a `Canvas` edge. An annotation's words take `CanvasText` inside a `Canvas`
  halo. The crosshair takes `CanvasText`. A heatmap's cells keep their fills, a missing cell's
  dashed edge takes `GrayText`, and the lit headings take `Highlight`.
- A preset animates its marks only with `animate`. In the kit, recharts animates marks unless the
  caller passes `isAnimationActive={false}`. recharts turns the animation off under reduced motion
  either way.

### Not offered

- A data table behind the chart. The caption states the finding.
- recharts' own `Legend`, which renders inside the plot and takes room from it.
- Value labels on the cartesian presets' marks, and charts that share a tooltip through `syncId`.
- recharts' `Brush`. Its two travellers are sliders valued in pixels, with no minimum, no maximum
  and one name for both. A range `Slider` zooms a preset instead.
- A press on an annotation. A caption links the release or the incident an annotation marks.

## Types

| Type                                                                         | Describes                                                                                       |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `CartesianProps`                                                             | The props every preset takes                                                                    |
| `CartesianSeries`                                                            | A preset's series: the kit's series, `dashed` and `previousOf`                                  |
| `Annotation`                                                                 | One mark on the categories: its key, words, color, category, period's end or value              |
| `AlignOptions`                                                               | How `alignPeriods` merges two periods: the category field, the copied fields and their suffix   |
| `BarSeries`                                                                  | A bar chart's series: a preset's series with the field its `target` reads                       |
| `BulletProps`                                                                | The props a bar chart adds: `zones` and `targetLabel`                                           |
| `ComboSeries`                                                                | A combo chart's series: a preset's series with its `mark` and `axis`                            |
| `Mark`                                                                       | The mark a series renders as: `area`, `bar` or `line`                                           |
| `ValueAxis`                                                                  | The value axis a series reads: `start` or `end`                                                 |
| `RangeBand`                                                                  | A range chart's band: its key, label, color and its `low` and `high` field                      |
| `Curve`                                                                      | The path of a line between two points, `linear` or `monotone`                                   |
| `LineChartProps`, `AreaChartProps`, `StackedAreaChartProps`                  | A preset's props with its `curve`, and `percent` for stacked area                               |
| `StepLineChartProps`, `StackedBarChartProps`, `PercentStackedBarProps`       | A preset's props, which are `CartesianProps`                                                    |
| `BarChartProps`, `HorizontalBarChartProps`                                   | A bar chart's props: `CartesianProps` with `BarSeries` and `BulletProps`                        |
| `ComboChartProps`, `RangeChartProps`, `ParetoChartProps`, `StreamGraphProps` | A preset's props with the props it adds                                                         |
| `ParetoShares`                                                               | The `share` and `cumulative` share `paretoRows` adds to a row                                   |
| `BurndownChartProps`, `BurndownPoint`, `BurndownRow`, `BurndownOptions`      | A burndown's props, one period, one row it plots, and its plan                                  |
| `WaterfallChartProps`, `WaterfallStep`, `WaterfallBar`                       | A waterfall's props, one step, and one bar it renders                                           |
| `ScatterPlotProps`, `ScatterSeries`, `BubbleChartProps`                      | A scatter's props, one series with its points, and a bubble's props                             |
| `Quadrants`, `QuadrantId`, `Division`                                        | A quadrant chart's names and where it divides, one quadrant's key, and the values it divides at |
| `SpreadOptions`, `Span`                                                      | How `spreadPoints` spreads the points, and the two ends of an axis' span                        |
| `TimelineChartProps`, `TimelineLane`, `TimelineEvent`                        | A timeline's props, one lane with its name, and one moment                                      |
| `EventLayout`, `EventLane`, `EventCluster`, `LayoutOptions`                  | The window and lanes `layoutEvents` returns, one lane, one marker's moments, and its options    |
| `RegressionOverlayProps`, `LinearFit`                                        | A trend line's points, fields and series, and the fit `linearRegression` returns                |
| `HistogramChartProps`, `ChartBin`, `BinOptions`                              | A histogram's props, one bin with its count, and how `binValues` bins                           |
| `DistributionChartProps`, `DistributionSeries`                               | A distribution chart's props, and one series with its values                                    |
| `BoxPlotProps`, `BoxGroup`, `BoxSummary`                                     | A box plot's props, one group, and the summary `boxStats` returns                               |
| `ViolinPlotProps`, `ViolinGroup`, `DensityPoint`, `DensityOptions`           | A violin plot's props, one group, one point of a density, and how `kernelDensity` estimates it  |
| `CandlestickChartProps`, `Candle`, `CandleDirection`, `CandleChange`         | A candlestick chart's props, one period's prices, its direction and its change                  |
| `PieSlice`                                                                   | One slice: its key, label, value and color                                                      |
| `PolarProps`, `PieChartProps`                                                | The props a pie takes                                                                           |
| `RadarChartProps`, `RadarSeries`                                             | A radar chart's props, and one series with whether its polygon fills                            |
| `RadialBarChartProps`, `RadialBarDatum`                                      | A radial bar chart's props, and one bar with its key, label, value and color                    |
| `PolarAreaChartProps`                                                        | A rose's props: the slices of a cycle, `max`, `color`, `names` and `values`                     |
| `GaugeChartProps`, `GaugeZone`, `GaugeBand`                                  | A gauge's props, one zone with where it ends, and one band `gaugeBands` returns                 |
| `FunnelChartProps`, `FunnelStage`, `FunnelStep`                              | A funnel's props, one stage with its count, and one step `funnelSteps` returns                  |
| `HierarchyProps`, `TreemapChartProps`, `HierarchyNode`, `HierarchyLeaf`      | A hierarchy chart's props, a treemap's, one node, and one leaf `hierarchyLeaves` returns        |
| `SunburstChartProps`                                                         | A hierarchy chart's props with `center` and `centerLabel`                                       |
| `SankeyChartProps`, `SankeyNode`, `SankeyFlow`, `SankeyBalance`              | A sankey's props, one node, one flow, and one node's balance `flowBalance` returns              |
| `ChordDiagramProps`, `ChordLayout`, `ChordSpan`, `ChordRibbon`               | A chord diagram's props, and the arcs and ribbons `chordLayout` returns as spans of the circle  |
| `HeatmapProps`, `HeatmapCell`, `HeatmapHeading`                              | A heatmap's props, one reading, and the heading of a row, a column or a group of columns        |
| `HeatmapDomain`, `HeatmapScale`, `HeatmapColors`, `HeatShape`, `HeatSize`    | A heat scale's span, how it reads a value, a diverging scale's colors, a cell's shape and size  |
| `Valued`                                                                     | A reading `heatmapDomain` takes: anything with a `value`                                        |
| `CalendarDay`, `CalendarCell`, `CalendarOptions`, `Calendar`                 | One day's reading, one day as a cell, a calendar's window and words, and the props it returns   |
| `Cohort`, `CohortCell`, `CohortOptions`, `CohortGrid`                        | One intake, one cell of a cohort grid, the grid's words, and the props `cohortCells` returns    |
| `Retention`, `RetentionOptions`, `RetentionRow`                              | The props `retentionSeries` returns, its words and colors, and one row per period               |
| `DonutChartProps`                                                            | A pie's props with `center` and `centerLabel`                                                   |
| `SparklineProps`, `SparkbarProps`                                            | A spark's run, its color and shape, and the box's props                                         |
| `Chart.ChartOptions`                                                         | What `useChart` takes: the rows, the series, the hidden keys                                    |
| `Chart.ChartApi`                                                             | What `useChart` returns and `Chart.Root` provides                                               |
| `Chart.SeriesOptions`                                                        | A series the caller states                                                                      |
| `Chart.Series`                                                               | A series as the chart resolved it: key, label, color and opacity                                |
| `Chart.ChartColor`                                                           | A hue palette, a semantic palette or a series color of the theme                                |
| `Chart.TooltipEntry`                                                         | One value recharts passes the tooltip                                                           |
| `Chart.TooltipRow`                                                           | One row `rowsOf` returns: its key, name and value                                               |
| `Chart.TooltipNote`                                                          | One note `notesOf` returns: its key, words and color                                            |

Each part's props are `Chart.<Part>Props`.

## Licence

MIT. See [LICENSE](LICENSE).
