import { type ReactElement, useState } from "react";

import { ChevronDownIcon } from "lucide-react";

import { NativeSelect } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { NetworkGraph } from "#network-graph/index.ts";

const DEPARTMENTS = [
  { id: "emergency", weight: 8 },
  { id: "radiology", weight: 7 },
  { id: "cardiology", weight: 5 },
  { id: "neurology", weight: 4 },
  { id: "oncology", weight: 4 },
  { id: "paediatrics", weight: 3 },
  { id: "pharmacy", weight: 2 },
] as const;

const REFERRALS = [
  { source: "emergency", strength: 2, target: "cardiology" },
  { source: "emergency", strength: 2, target: "radiology" },
  { source: "emergency", target: "neurology" },
  { source: "oncology", strength: 2, target: "radiology" },
  { source: "oncology", target: "pharmacy" },
  { source: "paediatrics", target: "emergency" },
  { source: "neurology", target: "radiology" },
];

export function Controlled(): ReactElement {
  const { t } = useWords("network-graph");
  const [focus, setFocus] = useState<null | string>("radiology");
  const nodes = DEPARTMENTS.map(({ id, weight }) => ({
    id,
    label: t(`departments.${id}`),
    weight,
  }));

  return (
    <Stack align="flex-start">
      <NativeSelect.Root>
        <NativeSelect.Field
          aria-label={t("controlled.pick")}
          onChange={(event) => {
            setFocus(event.target.value === "" ? null : event.target.value);
          }}
          placeholder={t("controlled.none")}
          value={focus ?? ""}
        >
          {nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator>
          <ChevronDownIcon />
        </NativeSelect.Indicator>
      </NativeSelect.Root>
      <NetworkGraph
        clearLabel={t("words.clear")}
        edgeName={({ source, target }) => t("words.edge", { source, target })}
        focus={focus}
        focusLabel={t("words.focus")}
        label={t("controlled.label")}
        links={REFERRALS}
        neighborLabel={t("words.connected")}
        nodeDescription={t("words.description")}
        nodes={nodes}
        onFocusChange={setFocus}
        summary={({ count, name }) => t("controlled.summary", { count, name })}
      />
    </Stack>
  );
}
