/**
 * Provides the table `DataTable.Root` takes, and the prefix of the ids its parts write, to the
 * kit's parts.
 */

import { createRequiredContext } from "@stealthscale/hooks";

import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Provides the table to the parts, and reads it where a part renders.
 */
export const [TableProvider, useTableState] = createRequiredContext<DataTableApi>("DataTable");

/**
 * Provides the root's unique prefix of the ids a part writes, such as a detail row's.
 */
export const [PrefixProvider, useIdPrefix] = createRequiredContext<string>("DataTable");
