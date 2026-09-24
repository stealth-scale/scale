import { type ReactElement, useMemo } from "react";

import { CheckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { useListCollection } from "#collection/index.ts";
import * as Listbox from "#listbox/index.ts";

interface Consignment {
  readonly id: string;
  readonly name: string;
}

const COUNT = 10_000;

export function Consignments(): ReactElement {
  const { i18n, t } = useWords("listbox");
  const rows = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, at) => ({
        id: String(at),
        name: t("consignment", { at: String(at + 1).padStart(5, "0") }),
      })),
    [t],
  );
  const { collection } = useListCollection<Consignment>({
    itemToString: (consignment) => consignment.name,
    itemToValue: (consignment) => consignment.id,
    rows,
  });

  return (
    <Listbox.Simple<Consignment>
      collection={collection}
      label={t("consignments", { count: COUNT.toLocaleString(i18n.language) })}
      mark={<CheckIcon size="100%" />}
      tall={8}
      variant="surface"
    />
  );
}
