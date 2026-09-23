/**
 * Catalogues the loader: the palette and scrim axes, the spinner's placement, a value that keeps
 * its width while it loads, a button that keeps its width, and an overlay over a card.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added there reaches the page without
 *   an edit here. The loading scenes set `loading` to `false` and `true` side by side, so the page
 *   shows that the box keeps its size. The words are keys under `loader` in the catalogue
 *   namespace, stored at `locales/en/specimen/loader.json`.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Card } from "@stealthscale/component-surfaces";
import { Text } from "@stealthscale/component-typography";
import { Matrix, Room, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { Loader, type LoaderPlacement, type LoaderProps } from "#loader/loader.tsx";
import { LoaderOverlay, type LoaderOverlayProps } from "#loader/overlay.ts";
import { recipe } from "#loader/recipe.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "Matching",
  imports: 'import { Loader } from "@stealthscale/component-feedback";',
  name: "Loader",
};

/**
 * The two sides of the words the spinner can be rendered on.
 */
const PLACEMENTS: readonly LoaderPlacement[] = ["start", "end"];

/**
 * The loading states the side-by-side scenes compare.
 */
const STATES = [false, true] as const;

/**
 * Renders a loader with words, with the scene's props.
 */
function Worded(props: LoaderProps): ReactElement {
  const { t } = useWords("loader");

  return <Loader text={t("matching")} {...props} />;
}

/**
 * Renders a card whose content an overlay covers while it loads.
 */
function Covered(props: LoaderOverlayProps): ReactElement {
  const { t } = useWords("loader");

  return (
    <Room size="xs">
      <Card.Root>
        <Card.Header>
          <Card.Title>{t("lines")}</Card.Title>
          <Card.Description>{t("ledger")}</Card.Description>
        </Card.Header>
        <LoaderOverlay {...props}>
          <Loader text={t("matching")} />
        </LoaderOverlay>
      </Card.Root>
    </Room>
  );
}

/**
 * Renders the spinner on each side of its words.
 */
function Placed(): ReactElement {
  return (
    <Matrix knob="placement" of={PLACEMENTS}>
      {(placement) => <Worded placement={placement} />}
    </Matrix>
  );
}

/**
 * Renders a settled amount loaded and loading, so the two boxes can be compared.
 */
function Value(): ReactElement {
  const { t } = useWords("loader");

  return (
    <Matrix knob="loading" of={STATES}>
      {(loading) => (
        <Text weight="semibold">
          <Loader loading={loading}>{t("settled")}</Loader>
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Renders a button loaded and loading, so the two widths can be compared.
 */
function InButton(): ReactElement {
  const { t } = useWords("loader");

  return (
    <Matrix knob="loading" of={STATES}>
      {(loading) => (
        <Button disabled={loading}>
          <Loader label={t("saving")} loading={loading}>
            {t("save")}
          </Loader>
        </Button>
      )}
    </Matrix>
  );
}

/**
 * The hand-written scene for the side of the words the spinner is on.
 */
export const placement: Scene = {
  about: "loader.placement.about",
  draw: Placed,
  title: "loader.placement.title",
};

/**
 * The hand-written scene for a loader over a value.
 */
export const value: Scene = {
  about: "loader.value.about",
  draw: Value,
  title: "loader.value.title",
};

/**
 * The hand-written scene for a loader in a button.
 */
export const button: Scene = {
  about: "loader.button.about",
  draw: InButton,
  title: "loader.button.title",
};

export default specimen({
  about: "loader.about",
  id: "components/feedback/loader",
  imports: 'import { Loader, LoaderOverlay } from "@stealthscale/component-feedback";',
  scenes: [
    ...scenesOf<LoaderOverlayProps & LoaderProps>(recipe, {
      axes: {
        palette: { draw: (props) => <Worded {...props} /> },
        scrim: { draw: (props) => <Covered {...props} /> },
      },
      draw: (props) => <Worded {...props} />,
      namespace: "loader",
      order: ["palette", "scrim"],
      sample: SAMPLE,
    }),
    placement,
    value,
    button,
  ],
  title: "loader.title",
});
