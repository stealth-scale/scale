/**
 * Renders an instant as a `time` element with the instant in `dateTime`.
 *
 * @remarks
 *   `dateTime` is the instant in ISO 8601, which a screen reader, a crawler and a copy of the page
 *   resolve to the moment whatever the text is. A value `Date` cannot read renders an empty element
 *   without `dateTime`, because `Intl` throws on an invalid date and an invented instant is worse
 *   than none. A relative reading puts the exact form in `title`, which a browser shows on hover
 *   only. `both` writes the exact form on the page and sets no `title`. The element is not a live
 *   region, so a distance that updates announces nothing.
 */

import { type ComponentProps, type ReactElement } from "react";

import { useFormatLocale } from "#format/locale.ts";
import { withContext, withProvider } from "#timestamp/context.ts";
import { distanceOf } from "#timestamp/distance.ts";
import { useNow } from "#timestamp/now.ts";

/**
 * Renders the `time` element with the timestamp's root class.
 */
const Root = withProvider("time", "root");

/**
 * Renders the exact form after a distance.
 */
const Exact = withContext("span", "exact");

/**
 * Options of the exact form when a caller states none: the date at medium length and the time
 * without seconds.
 */
const PLAIN: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" };

/**
 * Lists the readings of an instant: the exact form, the distance from `now`, or the distance
 * followed by the exact form.
 */
export type TimestampReading = "absolute" | "both" | "relative";

/**
 * Describes the props of the timestamp: the instant, its reading, the locale, the clock and the
 * props of a `time` element.
 */
export interface TimestampProps extends Omit<ComponentProps<typeof Root>, "children" | "dateTime"> {
  /**
   * Locale of both forms, the locale in scope unless stated.
   */
  readonly locale?: string | undefined;

  /**
   * Instant a distance is measured from, the clock unless stated.
   *
   * @remarks
   *   Rows that share one `now` never drift apart, and a page rendered on a server needs one so its
   *   hydration reads the same distance.
   */
  readonly now?: Date | number | undefined;

  /**
   * Options of `Intl.DateTimeFormat` for the exact form, a medium date and a short time unless
   * stated.
   *
   * @remarks
   *   State `timeZone` where two readers must read one instant alike. `Intl` throws for `dateStyle`
   *   or `timeStyle` beside a single field such as `hour`.
   */
  readonly options?: Intl.DateTimeFormatOptions | undefined;

  /**
   * Reading of the instant, `absolute` unless stated.
   */
  readonly reads?: TimestampReading | undefined;

  /**
   * Milliseconds between two reads of the clock, which keep a distance true.
   *
   * @remarks
   *   Off unless stated, because an interval per row is a timer per row: a list reads the clock
   *   once and passes it as `now`. Ignored under `absolute` and while `now` is stated.
   */
  readonly updateInterval?: number | undefined;

  /**
   * Instant to show: a `Date`, the milliseconds since the epoch, or a string `Date` parses.
   */
  readonly value: Date | number | string;
}

/**
 * Renders the instant.
 *
 * @param props - The instant, its reading, the locale, the clock and the props of a `time` element.
 * @returns The `time` element.
 */
export function Timestamp({
  locale,
  now,
  options,
  reads = "absolute",
  updateInterval,
  value,
  ...props
}: TimestampProps): ReactElement {
  const tag = useFormatLocale(locale);
  const from = useNow(now, reads === "absolute" ? undefined : updateInterval);
  const at = new Date(value);

  if (Number.isNaN(at.getTime())) {
    return <Root {...props} />;
  }

  const exact = new Intl.DateTimeFormat(tag, options ?? PLAIN).format(at);

  return (
    <Root title={reads === "relative" ? exact : undefined} {...props} dateTime={at.toISOString()}>
      {reads === "absolute" ? exact : distanceOf(at, from, tag)}
      {reads === "both" ? (
        <>
          {" "}
          <Exact>({exact})</Exact>
        </>
      ) : null}
    </Root>
  );
}
