/**
 * Collects the renderers of the blocks with a structure of their own: lists, tables, fenced blocks,
 * callouts and footnotes, each in its own module.
 */

import { renderCallout } from "#markdown/callouts.tsx";
import { renderCode } from "#markdown/code.tsx";
import { renderFootnotes } from "#markdown/footnotes.tsx";
import { renderList } from "#markdown/lists.tsx";
import { renderTable } from "#markdown/tables.tsx";

/**
 * Maps each structured block type to its renderer.
 */
export const STRUCTURED = {
  callout: renderCallout,
  code: renderCode,
  footnotes: renderFootnotes,
  list: renderList,
  table: renderTable,
};
