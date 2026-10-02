import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Avatar from "#avatar/index.ts";

import ada from "./ada.webp";
import bram from "./bram.webp";

const PEOPLE = [
  ["ada", ada],
  ["bram", bram],
  ["cleo", undefined],
] as const;

export function Pictures(): ReactElement {
  const { t } = useWords("avatar");

  return (
    <Avatar.Group size="lg">
      {PEOPLE.map(([person, picture]) => (
        <Avatar.Root key={person} name={t(person)}>
          <Avatar.Fallback />
          {picture === undefined ? null : <Avatar.Image src={picture} />}
        </Avatar.Root>
      ))}
    </Avatar.Group>
  );
}
