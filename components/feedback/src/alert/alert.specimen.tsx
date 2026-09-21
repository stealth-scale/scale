/**
 * Shows the alert: every look in every status, both layouts, every corner at every size, and the
 * motions.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every alert is on the page from the first paint, so `live` is off and no
 *   screen reader is told of forty notices arriving. Each carries the mark, the title, the
 *   description and a control in the aside. The words are keys under `alert` in the catalogue's
 *   namespace, kept beside this file in `locales/en/specimen/alert.json`.
 */

import { type ReactElement } from "react";

import { IconButton } from "@stealthscale/component-actions";
import { Icon } from "@stealthscale/component-typography";
import {
  Matrix,
  type Scene,
  specimen,
  useWords,
  type ValueOf,
  valuesOf,
} from "@stealthscale/specimen";

import * as Alert from "#alert/index.ts";
import { recipe } from "#alert/recipe.ts";

/**
 * The path of a warning triangle, in a 24 unit box.
 */
const TRIANGLE = "M12 3 2 21h20L12 3zm0 6v6m0 3v.5";

/**
 * The path of a cross, in a 24 unit box.
 */
const CROSS = "M6 6l12 12M18 6 6 18";

/**
 * The axes of the alert's recipe, which the notice reads the status and the look from.
 */
type Axes = NonNullable<typeof recipe.variants>;

/**
 * Describes the words of one notice, and the alert it sits in.
 */
interface NoticeProps {
  /**
   * The rest of it.
   */
  readonly description: string;

  /**
   * The status the alert reports, which the control that dismisses it is drawn in. The default
   * status where the alert states none.
   */
  readonly status?: ValueOf<Axes, "status">;

  /**
   * What the notice is about.
   */
  readonly title: string;

  /**
   * The look the alert is drawn in, which decides the control's. The default look where the alert
   * states none.
   */
  readonly variant?: ValueOf<Axes, "variant">;
}

/**
 * Draws the mark, the words and the control every alert carries.
 *
 * @remarks
 *   The control that dismisses the alert takes the alert's status, and its look from the alert's:
 *   solid on a solid alert, where it reads in the contrast ink and its fill is the alert's own, and
 *   ghost on every other, where it reads in the palette's ink beside the title. A neutral ghost
 *   control drew a dark cross on a solid fill.
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
        <Icon viewBox="0 0 24 24">
          <path d={TRIANGLE} fill="none" stroke="currentColor" strokeWidth="2" />
        </Icon>
      </Alert.Indicator>
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description>{description}</Alert.Description>
      </Alert.Content>
      <Alert.Aside>
        <IconButton
          aria-label={t("dismiss")}
          size="xs"
          status={status}
          variant={variant === "solid" ? "solid" : "ghost"}
        >
          <Icon viewBox="0 0 24 24">
            <path d={CROSS} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </IconButton>
      </Alert.Aside>
    </>
  );
}

/**
 * Draws a failed payment in every look in every status.
 */
function Looks(): ReactElement {
  const { t } = useWords("alert");

  return (
    <Matrix
      across={{ knob: "status", of: valuesOf(recipe, "status") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, status) => (
        <Alert.Root live="off" status={status} variant={variant}>
          <Notice
            description={t("declined")}
            status={status}
            title={t("failed")}
            variant={variant}
          />
        </Alert.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a saved draft in both layouts.
 */
function Layouts(): ReactElement {
  const { t } = useWords("alert");

  return (
    <Matrix knob="layout" of={valuesOf(recipe, "layout")}>
      {(layout) => (
        <Alert.Root layout={layout} live="off" status="success">
          <Notice description={t("restored")} status="success" title={t("saved")} />
        </Alert.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a saved draft at every corner at every size.
 */
function Corners(): ReactElement {
  const { t } = useWords("alert");

  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="radius"
      of={valuesOf(recipe, "radius")}
    >
      {(radius, size) => (
        <Alert.Root live="off" radius={radius} size={size}>
          <Notice description={t("restored")} title={t("saved")} />
        </Alert.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a failed payment entering with every motion.
 */
function Motion(): ReactElement {
  const { t } = useWords("alert");

  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <Alert.Root live="off" motion={motion} status="error">
          <Notice description={t("declined")} status="error" title={t("failed")} />
        </Alert.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the notice with a bar along each edge the theme draws one for.
 */
function Edge(): ReactElement {
  const { t } = useWords("alert");

  return (
    <Matrix knob="edge" of={valuesOf(recipe, "edge")}>
      {(edge) => (
        <Alert.Root edge={edge} live="off" status="warning">
          <Notice description={t("restored")} status="warning" title={t("saved")} />
        </Alert.Root>
      )}
    </Matrix>
  );
}

/**
 * Every look in every status.
 */
export const looks: Scene = {
  about: "alert.looks.about",
  draw: Looks,
  title: "alert.looks.title",
};

/**
 * The bar a notice carries along one of its edges.
 */
export const edge: Scene = {
  about: "alert.edge.about",
  draw: Edge,
  title: "alert.edge.title",
};

/**
 * Both layouts.
 */
export const layouts: Scene = {
  about: "alert.layouts.about",
  draw: Layouts,
  title: "alert.layouts.title",
};

/**
 * Every corner at every size.
 */
export const corners: Scene = {
  about: "alert.corners.about",
  draw: Corners,
  title: "alert.corners.title",
};

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "alert.motion.about",
  draw: Motion,
  title: "alert.motion.title",
};

export default specimen({
  about: "alert.about",
  group: "Feedback",
  id: "feedback/alert",
  imports: 'import { Alert } from "@stealthscale/component-feedback";',
  scenes: [looks, edge, layouts, corners, motion],
  title: "alert.title",
});
