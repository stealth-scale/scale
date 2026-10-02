/**
 * Lists the expense claims of the data table's editing example, and writes an edit into a claim.
 */

/**
 * Describes the key of a category, the word its name is written under.
 */
export type Category = "meals" | "office" | "software" | "travel";

/**
 * Describes the key of a claim's description, the words it is written under.
 */
export type Topic = "dinner" | "flight" | "hotel" | "licence" | "monitor" | "taxi";

/**
 * Lists the categories in the order a picker offers them.
 */
export const CATEGORIES: readonly Category[] = ["travel", "meals", "software", "office"];

/**
 * Describes a claim as the example renders it: its reference, its description, its category and
 * its amount in euros.
 */
export interface Claim {
  /**
   * Amount claimed, in euros.
   */
  readonly amount: number;

  /**
   * Key of the claim's category.
   */
  readonly category: Category;

  /**
   * Description of the claim, in the reader's words.
   */
  readonly description: string;

  /**
   * Reference of the claim.
   */
  readonly id: string;
}

/**
 * Describes a claim as it was filed: a claim whose description is the key of its words.
 */
export interface Filed extends Omit<Claim, "description"> {
  /**
   * Key of the claim's description.
   */
  readonly topic: Topic;
}

/**
 * Lists the claims to review, in the order they were filed.
 */
export const FILED: readonly Filed[] = [
  { amount: 412.5, category: "travel", id: "EX-1041", topic: "flight" },
  { amount: 186, category: "travel", id: "EX-1042", topic: "hotel" },
  { amount: 64.8, category: "meals", id: "EX-1043", topic: "dinner" },
  { amount: 38.2, category: "travel", id: "EX-1044", topic: "taxi" },
  { amount: 129, category: "software", id: "EX-1045", topic: "licence" },
  { amount: 249, category: "office", id: "EX-1046", topic: "monitor" },
];

/**
 * Returns a claim with an edit written into it: an amount as a number, a category among the
 * categories, and a description as typed.
 *
 * @param claim - The claim as it was before the edit.
 * @param field - The claim's field the edit changes, its column's id.
 * @param text - The text saved.
 * @returns The claim with the field changed.
 */
export function writtenTo(claim: Claim, field: string, text: string): Claim {
  return {
    amount: field === "amount" ? Number(text) : claim.amount,
    category: CATEGORIES.find((each) => field === "category" && each === text) ?? claim.category,
    description: field === "description" ? text : claim.description,
    id: claim.id,
  };
}

/**
 * Lists the fields of a claim a person edits.
 */
const FIELDS = ["amount", "category", "description"] as const;

/**
 * Returns the number of fields in which two lists of the same claims differ, claim by claim.
 *
 * @param rows - The claims as edited.
 * @param saved - The claims as last saved, in the same order.
 * @returns The number of changed fields.
 */
export function changesOf(rows: readonly Claim[], saved: readonly Claim[]): number {
  return rows.reduce(
    (count, row, at) => count + FIELDS.filter((field) => row[field] !== saved[at]?.[field]).length,
    0,
  );
}

/**
 * Returns whether a claim's field differs from its last saved value.
 *
 * @param rows - The claims as edited.
 * @param saved - The claims as last saved, in the same order.
 * @param id - Reference of the claim.
 * @param field - The field, its column's id.
 * @returns Whether the field changed, false for a field no person edits.
 */
export function differs(
  rows: readonly Claim[],
  saved: readonly Claim[],
  id: string,
  field: string,
): boolean {
  const at = rows.findIndex((row) => row.id === id);

  return FIELDS.some((each) => each === field && rows[at]?.[each] !== saved[at]?.[each]);
}
