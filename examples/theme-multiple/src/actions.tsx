/**
 * Renders the actions package's components: a button in every look, size and status palette, the
 * hero buttons, a glowing button, a disabled button, two icon buttons, and a pair under a provider.
 *
 * @remarks
 *   Every variant is written as a literal, because the compiler emits rules only for values it
 *   extracts from source. Each button is labelled with an action, so no two buttons on the page
 *   share an accessible name. Each icon button has an `aria-label`, because an icon provides no
 *   name. The provider sets the size and the look of the pair below it.
 */

import { type ReactElement } from "react";

import { Button, ButtonPropsProvider, IconButton } from "@stealthscale/component-actions";
import { Heading, Icon } from "@stealthscale/component-typography";
import { css } from "@stealthscale/theme";

import { Heroes } from "#heroes.tsx";

/**
 * The class that lays the section out as a column.
 */
const section = css({ display: "flex", flexDirection: "column", gap: "gap.md" });

/**
 * The class that lays a row of controls out and wraps it when the row is too narrow.
 */
const row = css({ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "gap.sm" });

/**
 * Renders the actions section.
 */
export function Actions(): ReactElement {
  return (
    <section className={section}>
      <Heading>Actions</Heading>
      <p className={row}>
        <Button>Save</Button>
        <Button variant="subtle">Cancel</Button>
        <Button variant="surface">Options</Button>
        <Button variant="outline">Edit</Button>
        <Button variant="ghost">Dismiss</Button>
        <Button variant="plain">Learn more</Button>
        <Button variant="glass">Preview</Button>
      </p>
      <p className={row}>
        <Button size="xs" variant="outline">
          Cut
        </Button>
        <Button size="sm" variant="outline">
          Copy
        </Button>
        <Button size="md" variant="outline">
          Paste
        </Button>
        <Button size="lg" variant="outline">
          Undo
        </Button>
        <Button size="xl" variant="outline">
          Redo
        </Button>
      </p>
      <Heroes />
      <p className={row}>
        <Button palette="info">Info</Button>
        <Button palette="success">Success</Button>
        <Button palette="warning">Warning</Button>
        <Button palette="error">Error</Button>
      </p>
      <p className={row}>
        <Button effect="glow">Glow</Button>
        <Button disabled>Disabled</Button>
        <IconButton aria-label="Close" variant="ghost">
          <Icon viewBox="0 0 24 24">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </IconButton>
        <IconButton aria-label="Add" size="sm">
          <Icon viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </IconButton>
      </p>
      <ButtonPropsProvider value={{ size: "sm", variant: "subtle" }}>
        <p className={row}>
          <Button>Back</Button>
          <Button variant="solid">Continue</Button>
        </p>
      </ButtonPropsProvider>
    </section>
  );
}
