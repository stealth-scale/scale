import { type ReactElement, type ReactNode, useState } from "react";

import { ArrowUpIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Mark } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Composer from "#composer/index.ts";
import * as Message from "#message/index.ts";

const PEOPLE = [
  { id: "ada", label: "Ada Okafor", team: "finance" },
  { id: "adil", label: "Adil Rahman", team: "engineering" },
  { id: "ben", label: "Ben Carter", team: "sales" },
  { id: "chioma", label: "Chioma Eze", team: "design" },
] as const;

function marked(text: string, names: readonly string[]): ReactNode[] {
  const pattern = new RegExp(`(${names.map((name) => `@${name}`).join("|")})`, "u");

  return names.length === 0
    ? [text]
    : text.split(pattern).map((part, index) =>
        names.includes(part.slice(1)) ? (
          <Mark as="span" key={`${String(index)}-${part}`} palette="primary">
            {part}
          </Mark>
        ) : (
          part
        ),
      );
}

export function Mentions(): ReactElement {
  const { t } = useWords("composer");
  const [query, setQuery] = useState<Composer.Query | undefined>();
  const [names, setNames] = useState<readonly string[]>([]);
  const [sent, setSent] = useState<readonly string[]>([]);
  const term = query?.term.toLowerCase() ?? "";
  const people: readonly Composer.Suggestion[] = PEOPLE.map((person) => ({
    description: t(person.team),
    id: person.id,
    label: person.label,
  }));

  return (
    <Stack gap="md">
      {sent.map((text, index) => (
        <Message.Root align="end" aria-label={t("you")} key={`${String(index)}-${text}`}>
          <Message.Content>
            <Message.Bubble>{marked(text, names)}</Message.Bubble>
          </Message.Content>
        </Message.Root>
      ))}
      <Composer.Root
        onSubmit={(text) => {
          setSent((was) => [...was, text]);
        }}
      >
        <Composer.Input
          label={t("label")}
          onMention={(person) => {
            setNames((was) => [...was, person.label]);
          }}
          onQueryChange={setQuery}
          placeholder={t("mentionPlaceholder")}
          suggestions={
            query === undefined
              ? []
              : people.filter((person) => person.label.toLowerCase().includes(term))
          }
          suggestionsLabel={t("people")}
          triggers={["@"]}
        />
        <Composer.Toolbar>
          <Composer.Submit label={t("send")}>
            <ArrowUpIcon size="1em" />
          </Composer.Submit>
        </Composer.Toolbar>
      </Composer.Root>
    </Stack>
  );
}
