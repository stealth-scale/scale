import { type ReactElement, useState } from "react";

import { CircleAlertIcon, XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as TagsInput from "#tags-input/index.ts";

export function Skills(): ReactElement {
  const { t } = useWords("tags-input");
  const [skills, setSkills] = useState<string[]>([]);
  const [tried, setTried] = useState(false);

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setTried(true);
      }}
    >
      <Stack align="flex-start" gap="lg">
        <Field.Root invalid={tried && skills.length === 0} required>
          <Field.Label>{t("skills")}</Field.Label>
          <TagsInput.Root
            name="skills"
            onValueChange={({ value }) => {
              setSkills(value);
            }}
            placeholder={t("skill")}
            value={skills}
          >
            <TagsInput.Control>
              <TagsInput.Items>
                {(value, index) => (
                  <TagsInput.Item index={index} value={value}>
                    <TagsInput.ItemPreview>
                      <TagsInput.ItemText />
                      <TagsInput.ItemDeleteTrigger label={t("remove", { value })}>
                        <XIcon />
                      </TagsInput.ItemDeleteTrigger>
                    </TagsInput.ItemPreview>
                  </TagsInput.Item>
                )}
              </TagsInput.Items>
              <TagsInput.Input />
            </TagsInput.Control>
          </TagsInput.Root>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("needed")}
          </Field.ErrorText>
        </Field.Root>
        <Button type="submit">{t("save")}</Button>
      </Stack>
    </form>
  );
}
