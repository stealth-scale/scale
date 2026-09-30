import { type ReactElement } from "react";

import { EllipsisIcon, PencilIcon, UserPlusIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Table } from "@stealthscale/component-collections";
import { Input } from "@stealthscale/component-forms";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Section from "#section/index.ts";

const MEMBERS = [
  { name: "Mara Lindqvist", role: "owner" },
  { name: "Jonas Berg", role: "admin" },
  { name: "Priya Nair", role: "member" },
] as const;

export function Cards(props: Section.RootProps): ReactElement {
  const { t } = useWords("section");

  return (
    <>
      <Section.Root variant="surface" {...props}>
        <Section.Header>
          <Section.Title as="h3">{t("rename.title")}</Section.Title>
          <Section.Description>{t("rename.about")}</Section.Description>
        </Section.Header>
        <Section.Body>
          <Input aria-label={t("rename.title")} defaultValue="Ledger" maxLength={32} size="sm" />
        </Section.Body>
        <Section.Footer>
          <Text size="sm" tone="muted">
            {t("rename.limit")}
          </Text>
          <Button size="sm">{t("rename.save")}</Button>
        </Section.Footer>
      </Section.Root>
      <Section.Root variant="surface" {...props}>
        <Section.Header>
          <Section.Title as="h3">{t("members.title")}</Section.Title>
          <Section.Description>{t("members.about")}</Section.Description>
          <Section.Actions more={t("members.more")} moreIcon={<EllipsisIcon size="1em" />}>
            <Section.Action icon={<PencilIcon size="1em" />}>{t("members.roles")}</Section.Action>
            <Section.Action>{t("members.export")}</Section.Action>
            <Section.Action icon={<UserPlusIcon size="1em" />} primary>
              {t("members.invite")}
            </Section.Action>
          </Section.Actions>
        </Section.Header>
        <Section.Body bleed>
          <Table.Scroller>
            <Table.Root>
              <Table.Body>
                {MEMBERS.map(({ name, role }) => (
                  <Table.Row key={name}>
                    <Table.RowHeader>{name}</Table.RowHeader>
                    <Table.Cell data-numeric>
                      <Text as="span" tone="muted">
                        {t(`roles.${role}`)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.Scroller>
        </Section.Body>
        <Section.Footer>
          <Text size="sm" tone="muted">
            {t("members.seats")}
          </Text>
          <Button size="sm" variant="ghost">
            {t("members.manage")}
          </Button>
        </Section.Footer>
      </Section.Root>
    </>
  );
}
