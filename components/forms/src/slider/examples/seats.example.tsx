import { type ReactElement, useState } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as Slider from "#slider/index.ts";

const PRICE = 12;

const MONEY = new Intl.NumberFormat("en-GB", {
  currency: "EUR",
  maximumFractionDigits: 0,
  style: "currency",
});

export function Seats(): ReactElement {
  const { t } = useWords("slider");
  const [seats, setSeats] = useState([12]);
  const [count = 1] = seats;

  return (
    <Field.Root>
      <Field.Label>{t("seats")}</Field.Label>
      <Slider.Root
        max={50}
        min={1}
        onValueChange={({ value }) => {
          setSeats(value);
        }}
        value={seats}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb />
        </Slider.Control>
      </Slider.Root>
      <Field.HelperText>
        {t("total", { count, total: MONEY.format(count * PRICE) })}
      </Field.HelperText>
    </Field.Root>
  );
}
