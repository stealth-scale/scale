/**
 * Lists the layouts a form built from a schema renders its members with.
 */

import { type Layouts } from "@stealthscale/provider-form";

import { Cell } from "#form/cell.tsx";
import { Errors } from "#form/errors.tsx";
import { Group } from "#form/group.tsx";
import { Item } from "#form/item.tsx";
import { Step } from "#form/step.tsx";

/**
 * The layouts: the cell around a field, the region of the form's own errors, a group, an item of a
 * repeat group, and a step. An application that replaces one spreads these and states its own.
 */
export const layouts: Layouts = { Cell, Errors, Group, Item, Step };
