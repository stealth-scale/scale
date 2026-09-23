import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import { Group } from "#group/index.ts";

export function Rsvp(props: Parameters<typeof Group>[0]): ReactElement {
  const { t } = useWords("group");

  return (
    <Group aria-label={t("attending")} as="fieldset" {...props}>
      <Button aria-pressed variant="outline">
        {t("yes")}
      </Button>
      <Button aria-pressed={false} variant="outline">
        {t("no")}
      </Button>
      <Button aria-pressed={false} variant="outline">
        {t("maybe")}
      </Button>
    </Group>
  );
}
