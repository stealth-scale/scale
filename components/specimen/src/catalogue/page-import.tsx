/**
 * Draws the line a reader copies first: the page's components, imported from their package.
 */

import { type ReactElement } from "react";

import { VisuallyHidden } from "@stealthscale/component-a11y";
import { Section } from "@stealthscale/component-screen";

import { Code } from "#catalogue/code.tsx";
import { useWords } from "#words.ts";

/**
 * Describes what the import line takes.
 */
export interface ImportProps {
  /**
   * The statement as the page declares it, or nothing where it declares none.
   */
  readonly imports?: string | undefined;

  /**
   * The package the page's components are imported from, which heads the block.
   */
  readonly package: string;
}

/**
 * Draws the import statement in the library's code block, headed by the package's name, as the
 * first section of the page.
 *
 * @remarks
 *   A section, so the scenes after it are parted from it the way they are parted from each other,
 *   and named for a screen reader by a title the eye does not see: the statement is its own
 *   heading on the page. Nothing is drawn where the index knows no package for the page, or the
 *   page declares no statement.
 * @returns The section, or nothing.
 */
export function Import({ imports, package: from }: ImportProps): null | ReactElement {
  const { t } = useWords();

  if (from === "" || imports === undefined || imports === "") return null;

  return (
    <Section.Root>
      <Section.Header>
        <Section.Title>
          <VisuallyHidden>{t("code.import")}</VisuallyHidden>
        </Section.Title>
      </Section.Header>
      <Section.Body>
        <Code code={imports} title={from} />
      </Section.Body>
    </Section.Root>
  );
}
