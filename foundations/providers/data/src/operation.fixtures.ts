/**
 * Defines the operations and the records the package's specifications run and read.
 */

import { type ChangeBatch } from "#changes.ts";
import { defineMutation, defineQuery, defineSubscription } from "#operation.ts";
import { type ResourceSelector } from "#resources.ts";

/**
 * Describes the record the operations of the specifications read and change.
 */
export interface Person {
  /**
   * Id of the person.
   */
  readonly id: string;

  /**
   * Name of the person.
   */
  readonly name: string;
}

/**
 * Describes the data of the query that lists people.
 */
export interface People {
  /**
   * The people, in the order the gateway returned them.
   */
  readonly items: readonly Person[];
}

/**
 * Kind of the records the specifications read.
 */
export const PERSON_KIND = "people/person";

/**
 * The person the gateway returns.
 */
export const ADA: Person = { id: "7", name: "Ada" };

/**
 * A second person, in the list.
 */
export const GRACE: Person = { id: "8", name: "Grace" };

/**
 * A query that reads one person.
 */
export const PERSON = defineQuery<Person, { readonly id: string }>("people~1~9c1e7a");

/**
 * A query that lists people.
 */
export const PEOPLE = defineQuery<People>("people~1~0b5e11");

/**
 * A mutation that renames one person.
 */
export const RENAME = defineMutation<Person, Person>("people~1~41b0d2");

/**
 * A subscription whose events count the people who moved.
 */
export const MOVES = defineSubscription<number>("people~1~77aa01");

/**
 * The subscription that streams changes to records.
 */
export const CHANGES = defineSubscription<ChangeBatch>("people~1~c4a9e2");

/**
 * The selector of a person that is the data itself.
 */
export const ONE: ResourceSelector = { id: "id", type: PERSON_KIND };

/**
 * The selector of the people in a list.
 */
export const LISTED: ResourceSelector = { at: "items", id: "id", list: true, type: PERSON_KIND };
