/**
 * Registers TanStack's stock sort, filter and aggregation functions under their stock names.
 *
 * @remarks
 *   A column names a function by its key: `sortFn: "alphanumeric"`, `filterFn: "includesString"`,
 *   `aggregationFn: "sum"`. TanStack resolves a name, `"auto"` included, only among the functions a
 *   table registers, so the kit registers every stock function TanStack exports: 6 sort, 22 filter
 *   and 11 aggregation functions. TanStack's own deprecated `filterFns` registry leaves out the
 *   four comparison filters, `greaterThan`, `greaterThanOrEqualTo`, `lessThan` and
 *   `lessThanOrEqualTo`.
 */

import {
  aggregationFn_count,
  aggregationFn_extent,
  aggregationFn_first,
  aggregationFn_last,
  aggregationFn_max,
  aggregationFn_mean,
  aggregationFn_median,
  aggregationFn_min,
  aggregationFn_sum,
  aggregationFn_unique,
  aggregationFn_uniqueCount,
  filterFn_arrHas,
  filterFn_arrIncludes,
  filterFn_arrIncludesAll,
  filterFn_arrIncludesSome,
  filterFn_between,
  filterFn_betweenInclusive,
  filterFn_empty,
  filterFn_endsWith,
  filterFn_equals,
  filterFn_equalsString,
  filterFn_equalsStringSensitive,
  filterFn_greaterThan,
  filterFn_greaterThanOrEqualTo,
  filterFn_includesString,
  filterFn_includesStringSensitive,
  filterFn_inDateRange,
  filterFn_inNumberRange,
  filterFn_lessThan,
  filterFn_lessThanOrEqualTo,
  filterFn_notEmpty,
  filterFn_startsWith,
  filterFn_weakEquals,
  sortFn_alphanumeric,
  sortFn_alphanumericCaseSensitive,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  sortFn_textCaseSensitive,
} from "@tanstack/react-table";

/**
 * Lists the stock sort functions by the name a column's `sortFn` takes.
 */
export const SORT_FNS = {
  alphanumeric: sortFn_alphanumeric,
  alphanumericCaseSensitive: sortFn_alphanumericCaseSensitive,
  basic: sortFn_basic,
  datetime: sortFn_datetime,
  text: sortFn_text,
  textCaseSensitive: sortFn_textCaseSensitive,
};

/**
 * Lists the stock filter functions by the name a column's `filterFn` takes.
 */
export const FILTER_FNS = {
  arrHas: filterFn_arrHas,
  arrIncludes: filterFn_arrIncludes,
  arrIncludesAll: filterFn_arrIncludesAll,
  arrIncludesSome: filterFn_arrIncludesSome,
  between: filterFn_between,
  betweenInclusive: filterFn_betweenInclusive,
  empty: filterFn_empty,
  endsWith: filterFn_endsWith,
  equals: filterFn_equals,
  equalsString: filterFn_equalsString,
  equalsStringSensitive: filterFn_equalsStringSensitive,
  greaterThan: filterFn_greaterThan,
  greaterThanOrEqualTo: filterFn_greaterThanOrEqualTo,
  includesString: filterFn_includesString,
  includesStringSensitive: filterFn_includesStringSensitive,
  inDateRange: filterFn_inDateRange,
  inNumberRange: filterFn_inNumberRange,
  lessThan: filterFn_lessThan,
  lessThanOrEqualTo: filterFn_lessThanOrEqualTo,
  notEmpty: filterFn_notEmpty,
  startsWith: filterFn_startsWith,
  weakEquals: filterFn_weakEquals,
};

/**
 * Lists the stock aggregation functions by the name a column's `aggregationFn` takes.
 */
export const AGGREGATION_FNS = {
  count: aggregationFn_count,
  extent: aggregationFn_extent,
  first: aggregationFn_first,
  last: aggregationFn_last,
  max: aggregationFn_max,
  mean: aggregationFn_mean,
  median: aggregationFn_median,
  min: aggregationFn_min,
  sum: aggregationFn_sum,
  unique: aggregationFn_unique,
  uniqueCount: aggregationFn_uniqueCount,
};
