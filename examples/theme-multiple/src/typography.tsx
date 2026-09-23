/**
 * Draws the typography package's components: two headings, a paragraph holding a snippet of code
 * and a key, a truncated line, two icons, the lists and a quotation.
 *
 * @remarks
 *   Every variant is written as a literal, which is what the compiler extracts the rules for. The
 *   second icon is labelled, so a screen reader names it, and the first is decoration and stays
 *   hidden. The lists are drawn by a scene of their own, which keeps this one under the house cap
 *   on a function's lines.
 */

import { type ReactElement } from "react";

import { Blockquote, Code, Heading, Icon, Kbd, Text } from "@stealthscale/component-typography";
import { css } from "@stealthscale/theme";

import { Lists } from "#lists.tsx";

/**
 * Lays the section out as a column.
 */
const section = css({ display: "flex", flexDirection: "column", gap: "gap.md" });

/**
 * Lays a row of marks out, wrapping where the row is too narrow.
 */
const row = css({ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "gap.sm" });

/**
 * Draws the typography.
 */
export function Typography(): ReactElement {
  return (
    <section className={section}>
      <Heading>Typography</Heading>
      <Heading as="h3" size="md" tone="muted">
        A heading in the middle size
      </Heading>
      <Heading as="h3" size="3xl">
        A hero heading
      </Heading>
      <Heading as="h3" size="xs" tone="muted">
        The smallest heading
      </Heading>
      <Text size="xl">A paragraph in the largest body size.</Text>
      <Text size="xs">A paragraph in the smallest body size.</Text>
      <Text>
        A paragraph in the body size, holding <Code>pnpm add</Code> as a snippet of code and{" "}
        <Kbd.Root>Esc</Kbd.Root> as a key a reader is asked to press.
      </Text>
      <Text size="sm" tone="muted" truncate>
        A small muted line cut to one line where the box ends, however long it runs on past the edge
        of the panel it sits in.
      </Text>
      <p className={row}>
        <Icon size="md" tone="warning" viewBox="0 0 24 24">
          <path d="M12 2 2 22h20Z" />
        </Icon>
        <Icon aria-hidden={false} aria-label="Loading" motion="spin" size="md" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 1 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" />
        </Icon>
        <Icon size="2xl" tone="info" viewBox="0 0 24 24">
          <path d="M12 2 2 22h20Z" />
        </Icon>
        <Icon size="4xl" tone="success" viewBox="0 0 24 24">
          <path d="M12 2 2 22h20Z" />
        </Icon>
      </p>
      <Lists />
      <Blockquote.Root variant="subtle">
        <Blockquote.Icon viewBox="0 0 24 24">
          <path d="M6 17h4l2-4V7H6v6h3zm8 0h4l2-4V7h-6v6h3z" />
        </Blockquote.Icon>
        <Blockquote.Content>A quotation set apart from the paragraph around it.</Blockquote.Content>
        <Blockquote.Caption>Someone, somewhere</Blockquote.Caption>
      </Blockquote.Root>
    </section>
  );
}
