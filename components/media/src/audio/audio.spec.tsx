import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { recipeClass, recipeElement } from "@stealthscale/testing-theme";

import { Audio } from "#audio/audio.tsx";

/**
 * Renders an audio element and returns it.
 */
function drawnAudio(element: Parameters<typeof render>[0]): HTMLAudioElement {
  const { container } = render(element);
  const audio = recipeElement(container, "audio");

  if (!(audio instanceof HTMLAudioElement)) throw new TypeError("The audio did not render.");

  return audio;
}

describe("Audio", () => {
  it("passes the component conformance checks as an audio element", () => {
    expect(violations(Audio, { as: true, children: true, element: "AUDIO" })).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Audio, { props: { "aria-label": "Voice memo", src: "/memo.webm" } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the recipe's class", () => {
    expect(drawnAudio(<Audio src="/memo.webm" />).className).toContain(recipeClass("audio"));
  });

  it("shows the browser's controls by default", () => {
    expect(drawnAudio(<Audio src="/memo.webm" />).controls).toBe(true);
  });

  it("hides the browser's controls when controls is false", () => {
    expect(drawnAudio(<Audio controls={false} src="/memo.webm" />).controls).toBe(false);
  });

  it("starts by itself with autoPlay", () => {
    expect(drawnAudio(<Audio autoPlay src="/memo.webm" />).autoplay).toBe(true);
  });
});
