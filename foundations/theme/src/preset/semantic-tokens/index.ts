/**
 * Assembles the semantic tokens: the colors, shadows, sizes, spacing, corners and stroke widths
 * the foundation's statement draws, and the gradients drawn from the colors.
 *
 * @remarks
 *   Typed as the tokens a root theme states, so the foundation is held to the same contract as
 *   every theme: a role left out of a palette here fails to compile.
 */

import { type ThemeTokens } from "#contract.ts";
import { gradients } from "#preset/semantic-tokens/gradients.ts";
import { drawn } from "#preset/statement.ts";

/**
 * Lists every semantic token, by category.
 */
export const semanticTokens: ThemeTokens = { ...drawn.semanticTokens, gradients };
