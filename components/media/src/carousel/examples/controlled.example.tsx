import { type ReactElement, useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { SegmentGroup } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Carousel from "#carousel/index.ts";

import { PICTURES } from "./pictures.ts";

const SHOWN = PICTURES.slice(0, 3);

export function Controlled(): ReactElement {
  const { t } = useWords("carousel");
  const [page, setPage] = useState(0);

  return (
    <Stack gap="md">
      <SegmentGroup.Root
        aria-label={t("chooser")}
        onValueChange={({ value }) => {
          setPage(SHOWN.findIndex((picture) => picture.key === value));
        }}
        value={SHOWN[page]?.key ?? null}
      >
        {SHOWN.map((picture) => (
          <SegmentGroup.Item key={picture.key} value={picture.key}>
            <SegmentGroup.ItemText>{t(`places.${picture.key}`)}</SegmentGroup.ItemText>
          </SegmentGroup.Item>
        ))}
      </SegmentGroup.Root>
      <Carousel.Root
        aria-label={t("controlledLabel")}
        onPageChange={(details) => {
          setPage(details.page);
        }}
        page={page}
        slideCount={SHOWN.length}
      >
        <Carousel.ItemGroup>
          {SHOWN.map((picture, index) => (
            <Carousel.Item
              aria-label={t("slide", { count: SHOWN.length, index: index + 1 })}
              index={index}
              key={picture.key}
            >
              <img alt={t(`pictures.${picture.key}`)} src={picture.src} />
            </Carousel.Item>
          ))}
        </Carousel.ItemGroup>
        <Carousel.Control>
          <Carousel.PrevTrigger label={t("previous")}>
            <ChevronLeftIcon />
          </Carousel.PrevTrigger>
          <Carousel.ProgressText text={(details) => t("progress", { ...details })} />
          <Carousel.NextTrigger label={t("next")}>
            <ChevronRightIcon />
          </Carousel.NextTrigger>
        </Carousel.Control>
      </Carousel.Root>
    </Stack>
  );
}
