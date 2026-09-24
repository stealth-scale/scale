import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { useGridCollection } from "#collection/index.ts";
import * as Listbox from "#listbox/index.ts";

interface Port {
  readonly code: string;
}

const COLUMNS = "4";

const PORTS = [
  "NLRTM",
  "DEHAM",
  "BEANR",
  "FRLEH",
  "GBFXT",
  "ESVLC",
  "ITGOA",
  "PLGDN",
  "SEGOT",
  "DKAAR",
  "NOOSL",
  "FIHEL",
];

export function Ports(): ReactElement {
  const { t } = useWords("listbox");
  const { collection } = useGridCollection<Port>({
    columnCount: Number(COLUMNS),
    itemToString: (port) => port.code,
    itemToValue: (port) => port.code,
    rows: PORTS.map((code) => ({ code })),
  });

  return (
    <Listbox.Simple<Port>
      boxed
      collection={collection}
      columns={COLUMNS}
      defaultValue={["NLRTM", "DEHAM"]}
      label={t("ports")}
      mark={<CheckIcon size="100%" />}
      selectionMode="multiple"
      variant="surface"
    />
  );
}
