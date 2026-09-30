import { type ReactElement, useState } from "react";

import { CircleAlertIcon, StarIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as RatingGroup from "#rating-group/index.ts";

export function Review(): ReactElement {
  const { t } = useWords("rating-group");
  const [rated, setRated] = useState(0);
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
        <Field.Root invalid={tried && rated <= 0} required>
          <Field.Label>{t("review.label")}</Field.Label>
          <RatingGroup.Root
            name="stay"
            onValueChange={({ value }) => {
              setRated(value);
            }}
          >
            <RatingGroup.Control>
              <RatingGroup.Items>
                {(index) => (
                  <RatingGroup.Item index={index}>
                    <RatingGroup.ItemIndicator>
                      <StarIcon />
                    </RatingGroup.ItemIndicator>
                  </RatingGroup.Item>
                )}
              </RatingGroup.Items>
            </RatingGroup.Control>
          </RatingGroup.Root>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("review.error")}
          </Field.ErrorText>
        </Field.Root>
        <Button type="submit">{t("review.send")}</Button>
      </Stack>
    </form>
  );
}
