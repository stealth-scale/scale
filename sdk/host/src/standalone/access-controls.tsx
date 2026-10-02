/**
 * Renders the development panel's control of the decisions on single resources: every check
 * allowed, every check denied, or every check pending.
 */

import { type ReactElement, useState } from "react";

import { SegmentGroup } from "@stealthscale/component-forms";
import { useTranslation } from "@stealthscale/provider-i18n";

import { type StandaloneAccess } from "#standalone.ts";
import { useStandalone } from "#standalone/context.ts";
import { Group } from "#standalone/group.tsx";

/**
 * Lists the decisions in the order the panel offers them, each with the key of its words and the
 * call that applies it.
 */
const DECISIONS = [
  {
    apply: (access: StandaloneAccess): void => {
      access.allow();
    },
    key: "standalone.panel.access.allow",
    value: "allow",
  },
  {
    apply: (access: StandaloneAccess): void => {
      access.deny();
    },
    key: "standalone.panel.access.deny",
    value: "deny",
  },
  {
    apply: (access: StandaloneAccess): void => {
      access.pending();
    },
    key: "standalone.panel.access.pending",
    value: "pending",
  },
] as const;

/**
 * Lists the ways the panel decides every check on one resource.
 */
type Decision = (typeof DECISIONS)[number]["value"];

/**
 * Renders a segment group of the three decisions, which applies the one a person picks to every
 * check from then on.
 *
 * @remarks
 *   The access source tells the host's access store, which drops the decisions it knew and asks
 *   again, so every `useAccess` on the page follows.
 * @returns The group.
 */
export function AccessControls(): ReactElement {
  const { access } = useStandalone();
  const { t } = useTranslation("host");
  const [decision, setDecision] = useState<Decision>("allow");

  return (
    <Group title={t("standalone.panel.access.title")}>
      <SegmentGroup.Root
        aria-label={t("standalone.panel.access.title")}
        onValueChange={({ value }) => {
          // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the group offers the three decisions alone, so a pick is one of them
          const picked = DECISIONS.find((one) => one.value === value) as (typeof DECISIONS)[number];

          picked.apply(access);
          setDecision(picked.value);
        }}
        size="sm"
        value={decision}
      >
        {DECISIONS.map(({ key, value }) => (
          <SegmentGroup.Item key={value} value={value}>
            <SegmentGroup.ItemText>{t(key)}</SegmentGroup.ItemText>
          </SegmentGroup.Item>
        ))}
      </SegmentGroup.Root>
    </Group>
  );
}
