/**
 * Lays out the catalogue page for the card.
 *
 * @remarks
 *   The generated scenes are built from the recipe, so an axis added there appears here without an
 *   edit to this file and the page cannot fall behind the component. Every card in them holds the
 *   same invoice, which keeps each scene about its own axis: a header with its mark, title,
 *   description and aside, a content band, and a footer with two controls.
 *   The shapes scene is written by hand and holds four different cards. One invoice turned through
 *   every axis says what each axis does and nothing about what a card is for, and it left the
 *   picture band drawn nowhere on the page. The text comes from keys under `card` in the catalogue
 *   namespace, held beside this file in `locales/en/specimen/card.json`.
 */

import { type ReactElement } from "react";

import { Button, IconButton } from "@stealthscale/component-actions";
import { Link } from "@stealthscale/component-navigation";
import { Heading, Icon, Text } from "@stealthscale/component-typography";
import {
  Board,
  Matrix,
  Room,
  Sample,
  type Scene,
  scenesOf,
  specimen,
  useWords,
  written,
} from "@stealthscale/specimen";

import * as Card from "#card/index.ts";
import { recipe } from "#card/recipe.ts";

/**
 * The three-dot glyph, as path data over a 24 unit viewBox.
 */
const DOTS = "M5 12h.01M12 12h.01M19 12h.01";

/**
 * A hillside under a morning sun, sixteen by nine, carried in the file as a data URL so the page
 * fetches nothing and the picture cannot go missing.
 */
const HILLSIDE =
  "data:image/svg+xml," +
  "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 90'%3E" +
  "%3Crect width='160' height='90' fill='%2387b5d8'/%3E" +
  "%3Ccircle cx='120' cy='30' r='14' fill='%23f6d365'/%3E" +
  "%3Cpath d='M0 90V60c30-20 50-10 80-25s50 5 80 20v35z' fill='%235d8f52'/%3E" +
  "%3C/svg%3E";

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
 * Renders a card leading with a picture, which bleeds to the three edges it reaches.
 */
function Pictured(): ReactElement {
  const { t } = useWords("card");

  return (
    <Card.Root as="div" variant="elevated">
      <Card.Media>
        <img alt={t("hillside")} src={HILLSIDE} />
      </Card.Media>
      <Card.Header>
        <Card.Title>{t("statement")}</Card.Title>
        <Card.Description>{t("issued")}</Card.Description>
      </Card.Header>
      <Card.Content>{t("lines")}</Card.Content>
      <Card.Footer>
        <Button size="sm">{t("send")}</Button>
      </Card.Footer>
    </Card.Root>
  );
}

/**
 * Renders a card holding one figure, which is a card with no footer and nothing to press.
 */
function Figured(): ReactElement {
  const { t } = useWords("card");

  return (
    <Card.Root as="div" status="success" variant="subtle">
      <Card.Header>
        <Card.Title>{t("outstanding")}</Card.Title>
      </Card.Header>
      <Card.Content>
        <Heading as="p" size="xl">
          {t("amount")}
        </Heading>
        <Text size="sm" tone="muted">
          {t("trend")}
        </Text>
      </Card.Content>
    </Card.Root>
  );
}

/**
 * Renders a card running across the page, where the picture bleeds to the leading side instead.
 */
function Beside(): ReactElement {
  const { t } = useWords("card");

  return (
    <Card.Root as="div" orientation="horizontal" variant="outline">
      <Card.Media>
        <img alt={t("hillside")} src={HILLSIDE} />
      </Card.Media>
      <Card.Header>
        <Card.Title>{t("statement")}</Card.Title>
        <Card.Description>{t("issued")}</Card.Description>
      </Card.Header>
      <Card.Content>{t("lines")}</Card.Content>
    </Card.Root>
  );
}

/**
 * Renders the three shapes a card is written in, beside the invoice the rest of the page draws.
 *
 * @remarks
 *   Written by hand because none of them is a value of an axis. Every generated scene holds the
 *   same invoice, which is what keeps each of them about its own axis, and the cost is a page on
 *   which one part of the component is drawn nowhere and every card is the same card. The picture
 *   band is that part.
 *   Each card is drawn in a room of the catalogue's. A card is as wide as what it holds, so four
 *   cards left to themselves came out at four widths and the row read as a ragged edge rather than
 *   as a set.
 */
function Kinds(): ReactElement {
  const { t } = useWords("card");

  return (
    <Board>
      <Sample of={t("kinds.picture")}>
        <Room size="xs">
          <Pictured />
        </Room>
      </Sample>
      <Sample of={t("kinds.figure")}>
        <Room size="xs">
          <Figured />
        </Room>
      </Sample>
      <Sample of={t("kinds.invoice")}>
        <Room size="xs">
          <Invoiced variant="elevated" />
        </Room>
      </Sample>
      <Sample of={t("kinds.beside")} span="2">
        <Room size="md">
          <Beside />
        </Room>
      </Sample>
    </Board>
  );
}

/**
 * The hand-written scene for the shapes a card takes.
 */
export const kinds: Scene = {
  about: "card.kinds.about",
  draw: Kinds,
  title: "card.kinds.title",
};

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
  id: "components/surfaces/card",
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
    kinds,
    pressable,
  ],
  title: "card.title",
});
