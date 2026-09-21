/**
 * Lays out the catalogue page for the card.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added there appears here without an edit
 *   to this file and the page cannot fall behind the component. Every card holds the same invoice,
 *   which keeps each scene about its own axis: a header with its mark, title, description and
 *   aside, a content band, and a footer with two controls. The text comes from keys under `card` in
 *   the catalogue namespace, held beside this file in `locales/en/specimen/card.json`.
 */

import { type ReactElement } from "react";

import { Button, IconButton } from "@stealthscale/component-actions";
import { Link } from "@stealthscale/component-navigation";
import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, scenesOf, specimen, useWords, written } from "@stealthscale/specimen";

import * as Card from "#card/index.ts";
import { recipe } from "#card/recipe.ts";

/**
 * The three-dot glyph, as path data over a 24 unit viewBox.
 */
const DOTS = "M5 12h.01M12 12h.01M19 12h.01";

/**
 * Carries the one choice the invoice offers a scene.
 */
interface InvoiceProps {
  /**
   * Whether the title wraps its text in a link, which is what an interactive card follows.
   */
  readonly linked?: boolean;
}

/**
 * The two looks the hand-written scene below renders an interactive card in.
 */
const PRESSABLE = ["elevated", "outline"] as const;

/**
 * The body of the snippet every scene shows, written the way a consumer would write it.
 */
const INVOICE = `<Card.Header>
  <Card.Title>Invoice 4821</Card.Title>
  <Card.Description>Issued on 2 September</Card.Description>
</Card.Header>
<Card.Content>Three lines, one unbilled.</Card.Content>
<Card.Footer>
  <Button size="sm">Send</Button>
</Card.Footer>`;

/**
 * The call site every scene's snippet is generated from, whether the scene is generated or
 * hand-written.
 */
const SAMPLE = {
  children: INVOICE,
  imports: [
    'import { Button } from "@stealthscale/component-actions";',
    'import { Card } from "@stealthscale/component-surfaces";',
  ].join("\n"),
  name: "Card.Root",
};

/**
 * Renders the bands of one invoice, optionally with the title as a link.
 */
function Invoice({ linked = false }: InvoiceProps): ReactElement {
  const { t } = useWords("card");

  return (
    <>
      <Card.Header>
        <Card.Indicator aria-hidden>●</Card.Indicator>
        <Card.Title>
          {linked ? (
            <Link href="#invoice" inherit>
              {t("invoice")}
            </Link>
          ) : (
            t("invoice")
          )}
        </Card.Title>
        <Card.Description>{t("issued")}</Card.Description>
        <Card.Aside>
          <IconButton aria-label={t("more")} size="sm" variant="ghost">
            <Icon viewBox="0 0 24 24">
              <path
                d={DOTS}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </Icon>
          </IconButton>
        </Card.Aside>
      </Card.Header>
      <Card.Content>{t("lines")}</Card.Content>
      <Card.Footer>
        <Button size="sm" variant="subtle">
          {t("remind")}
        </Button>
        <Button size="sm">{t("send")}</Button>
      </Card.Footer>
    </>
  );
}

/**
 * Renders the invoice inside a root carrying whichever variants the scene set.
 */
function Invoiced({ linked = false, ...rest }: Card.RootProps & InvoiceProps): ReactElement {
  return (
    <Card.Root as="div" {...rest}>
      <Invoice linked={linked} />
    </Card.Root>
  );
}

/**
 * Renders an interactive card in each of the two looks worth clicking.
 *
 * @remarks
 *   This scene is written by hand because the axis only means anything on a card whose title holds
 *   a link, and the generated renderer produces one without. Its snippet comes from the same sample
 *   the generated scenes use, so a reader copies one shape off the whole page.
 */
function Pressable(): ReactElement {
  return (
    <Matrix knob="variant" of={PRESSABLE}>
      {(variant) => (
        <Card.Root as="div" interactive variant={variant}>
          <Invoice linked />
        </Card.Root>
      )}
    </Matrix>
  );
}

/**
 * The hand-written scene for an interactive card.
 */
export const pressable: Scene = {
  about: "card.pressable.about",
  draw: Pressable,
  source: written(SAMPLE, { interactive: true, variant: "elevated" }),
  title: "card.pressable.title",
};

export default specimen({
  about: "card.about",
  group: "Surfaces",
  id: "surfaces/card",
  imports: 'import { Card } from "@stealthscale/component-surfaces";',
  scenes: [
    ...scenesOf<Card.RootProps>(recipe, {
      axes: {
        divided: { direction: "column" },
        effect: { with: { status: "info" } },
        interactive: {
          direction: "column",
          draw: (props) => <Invoiced {...props} linked={props.interactive ?? false} />,
        },
        justify: { direction: "column" },
        orientation: { direction: "column" },
        radius: { across: "size" },
        variant: { across: "status" },
      },
      draw: (props) => <Invoiced {...props} />,
      namespace: "card",
      order: [
        "variant",
        "backdrop",
        "effect",
        "radius",
        "orientation",
        "justify",
        "divided",
        "interactive",
        "motion",
      ],
      sample: SAMPLE,
    }),
    pressable,
  ],
  title: "card.title",
});
