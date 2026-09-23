/**
 * Catalogues the alert: one scene per recipe axis, generated from the recipe.
 *
 * @remarks
 *   Every alert renders with `live="off"`. The page mounts every cell at once, and a live region
 *   per cell would make a screen reader announce forty notices in a row. Each scene uses the notice
 *   that shows its axis best: a failed payment for the colour and motion axes, and a saved draft
 *   for the layout axes. The copy is keyed under `alert` in the catalogue namespace, in
 *   `locales/en/specimen/alert.json`.
 */

import { type ReactElement } from "react";

import { TriangleAlertIcon, XIcon } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { scenesOf, specimen, useWords, type ValueOf } from "@stealthscale/specimen";

import * as Alert from "#alert/index.ts";
import { recipe } from "#alert/recipe.ts";

/**
 * Narrows the recipe's variant map so a scene can type the value of one axis.
 */
type Axes = NonNullable<typeof recipe.variants>;

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Alert.Indicator>{icon}</Alert.Indicator>",
    "<Alert.Content>",
    "  <Alert.Title>Payment failed</Alert.Title>",
    "  <Alert.Description>The card was declined.</Alert.Description>",
    "</Alert.Content>",
  ].join("\n"),
  imports: 'import { Alert } from "@stealthscale/component-feedback";',
  name: "Alert.Root",
};

/**
 * Describes the copy of one notice and the variants of the alert that contains it.
 */
interface NoticeProps {
  /**
   * The body text of the notice, when the scene has one.
   *
   * @remarks
   *   The grid of looks by statuses has none. With a title and a sentence in each of its 25 cells,
   *   every sentence wrapped over four lines and pushed the dismiss control into the middle of a
   *   column of text. The grid compares colours, and a one-line title shows them.
   */
  readonly description?: string | undefined;

  /**
   * The status of the surrounding alert, which sets the dismiss control's palette. Defaults to the
   * recipe's default when a scene does not vary this axis.
   */
  readonly status?: ValueOf<Axes, "status">;

  /**
   * The headline of the notice.
   */
  readonly title: string;

  /**
   * The variant of the surrounding alert, which selects the dismiss control's variant. Defaults to
   * the recipe's default when a scene does not vary this axis.
   */
  readonly variant?: ValueOf<Axes, "variant">;
}

/**
 * Renders the four inner slots of an alert that every scene on this page shares.
 *
 * @remarks
 *   The dismiss control takes the alert's status as its palette and derives its variant from the
 *   alert's. On a solid alert it is `solid`, so it uses the alert's fill and contrast ink. On every
 *   other alert it is `ghost`, so it uses the palette ink of the title. A ghost control on a solid
 *   alert rendered a dark cross on the solid fill.
 */
function Notice({
  description,
  status = "info",
  title,
  variant = "subtle",
}: NoticeProps): ReactElement {
  const { t } = useWords("alert");

  return (
    <>
      <Alert.Indicator>
        <TriangleAlertIcon aria-hidden size="1em" />
      </Alert.Indicator>
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        {description === undefined ? null : <Alert.Description>{description}</Alert.Description>}
      </Alert.Content>
      <Alert.Aside>
        <IconButton
          aria-label={t("dismiss")}
          palette={status}
          size="xs"
          variant={variant === "solid" ? "solid" : "ghost"}
        >
          <XIcon aria-hidden size="1em" />
        </IconButton>
      </Alert.Aside>
    </>
  );
}

/**
 * Returns a scene renderer whose alerts all show the same notice.
 *
 * @remarks
 *   An axis the scene does not set is omitted from the notice instead of passed as `undefined`, so
 *   the notice's defaults still set the dismiss control's palette.
 * @param title - The translation key of the headline, not the headline itself.
 * @param description - The translation key of the body, not the body itself.
 */
function noticing(title: string, description?: string): (props: Alert.RootProps) => ReactElement {
  return function Noticing({ status, variant, ...rest }: Alert.RootProps): ReactElement {
    const { t } = useWords("alert");

    return (
      <Alert.Root
        live="off"
        {...(status === undefined ? {} : { status })}
        {...(variant === undefined ? {} : { variant })}
        {...rest}
      >
        <Notice
          {...(description === undefined ? {} : { description: t(description) })}
          {...(status === undefined ? {} : { status })}
          title={t(title)}
          {...(variant === undefined ? {} : { variant })}
        />
      </Alert.Root>
    );
  };
}

export default specimen({
  about: "alert.about",
  id: "components/feedback/alert",
  imports: 'import { Alert } from "@stealthscale/component-feedback";',
  scenes: [
    ...scenesOf<Alert.RootProps>(recipe, {
      axes: {
        edge: { with: { status: "warning" } },
        layout: { with: { status: "success" } },
        motion: { draw: noticing("failed", "declined"), with: { status: "error" } },
        radius: { across: "size" },
        variant: { across: "status", draw: noticing("failed") },
      },
      draw: noticing("saved", "restored"),
      namespace: "alert",
      order: ["variant", "radius", "layout", "edge", "motion"],
      sample: SAMPLE,
    }),
  ],
  title: "alert.title",
});
