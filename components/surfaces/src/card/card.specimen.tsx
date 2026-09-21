/**
 * Shows the card: every axis it offers, drawn on one invoice.
 *
 * @remarks
 *   The scenes are built from the recipe, so an axis added to it reaches this page without the
 *   file changing and the page cannot fall behind the component. Every card carries the same
 *   invoice: a header with its mark, title, description and aside, the substance, and a footer
 *   with two controls. The words are keys under `card` in the catalogue's namespace, kept beside
 *   this file in `locales/en/specimen/card.json`.
 */

import { type ReactElement } from "react";

import { Button, IconButton } from "@stealthscale/component-actions";
import { Link } from "@stealthscale/component-navigation";
import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, scenesOf, specimen, useWords, written } from "@stealthscale/specimen";

import * as Card from "#card/index.ts";
import { recipe } from "#card/recipe.ts";

/**
 * The path of three dots, in a 24 unit box.
 */
const DOTS = "M5 12h.01M12 12h.01M19 12h.01";

/**
 * Describes what the invoice takes.
 */
interface InvoiceProps {
  /**
   * Whether the title is a link, which is what a card a reader presses follows.
   */
  readonly linked?: boolean;
}

/**
 * The looks a card is pressed in, which the scene written out below crosses its media against.
 */
const PRESSABLE = ["elevated", "outline"] as const;

/**
 * The invoice as a consumer writes it, which every scene shows as its source.
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
 * The card as a consumer writes it, which every scene on the page shows as its source, the ones
 * built from the recipe and the one written out alike.
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
 * Draws the bands of an invoice, with a link in the title where the card is pressed.
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
 * Draws the invoice in whatever card the scene hands over.
 */
function Invoiced({ linked = false, ...rest }: Card.RootProps & InvoiceProps): ReactElement {
  return (
    <Card.Root as="div" {...rest}>
      <Invoice linked={linked} />
    </Card.Root>
  );
}

/**
 * Draws a card whose whole face follows the link in its title, in the looks worth pressing.
 *
 * @remarks
 *   Written out rather than built, because the axis it turns is drawn on a card that holds a link
 *   and the page's own drawing holds none. It states its source off the same sample every built
 *   scene reads, so a reader copies one shape from the whole page.
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
 * A card a reader presses, in the looks worth pressing.
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
