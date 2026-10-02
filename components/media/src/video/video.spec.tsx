import { renderToString } from "react-dom/server";

import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { reducedMotion } from "#reduced-motion.fixtures.ts";
import { recipe } from "#video/recipe.ts";
import { Video } from "#video/video.tsx";

function drawnVideo(element: Parameters<typeof render>[0]): HTMLVideoElement {
  const { container } = render(element);
  const video = recipeElement(container, "video");

  if (!(video instanceof HTMLVideoElement)) throw new TypeError("The video did not render.");

  return video;
}

describe("Video", () => {
  it("passes the component conformance checks as a video element", () => {
    expect(violations(Video, { as: true, children: true, element: "VIDEO" })).toStrictEqual([]);
  });

  it("returns no accessibility violation with controls", async () => {
    await expect(
      accessibilityViolations(Video, { props: { controls: true, src: "/clip.webm" } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Video {...props} />).container),
    ).toStrictEqual([]);
  });

  it("starts a clip with autoPlay while the reader allows motion", () => {
    reducedMotion(false);

    expect(drawnVideo(<Video autoPlay />).autoplay).toBe(true);
  });

  it("drops autoPlay while the reader asks for reduced motion", () => {
    reducedMotion(true);

    expect(drawnVideo(<Video autoPlay />).autoplay).toBe(false);
  });

  it("stops starting a clip when the reader turns reduced motion on", () => {
    const setting = reducedMotion(false);
    const video = drawnVideo(<Video autoPlay />);

    act(() => {
      setting.change(true);
    });

    expect(video.autoplay).toBe(false);
  });

  it("shows controls on a clip with autoPlay", () => {
    reducedMotion(false);

    expect(drawnVideo(<Video autoPlay />).controls).toBe(true);
  });

  it("shows controls on a clip with autoPlay under reduced motion", () => {
    reducedMotion(true);

    expect(drawnVideo(<Video autoPlay />).controls).toBe(true);
  });

  it("keeps controls off when the caller sets controls to false", () => {
    reducedMotion(false);

    expect(drawnVideo(<Video autoPlay controls={false} />).controls).toBe(false);
  });

  it("shows no controls without autoPlay by default", () => {
    expect(drawnVideo(<Video />).controls).toBe(false);
  });

  it("mutes a clip that plays by itself", () => {
    reducedMotion(false);

    expect(drawnVideo(<Video autoPlay muted={false} />).muted).toBe(true);
  });

  it("keeps the sound of a clip with autoPlay under reduced motion", () => {
    reducedMotion(true);

    expect(drawnVideo(<Video autoPlay muted={false} />).muted).toBe(false);
  });

  it("keeps a clip muted when the caller mutes it", () => {
    expect(drawnVideo(<Video muted />).muted).toBe(true);
  });

  it("plays a clip that starts by itself inline", () => {
    reducedMotion(false);

    expect(drawnVideo(<Video autoPlay />).hasAttribute("playsinline")).toBe(true);
  });

  it("keeps the caller's playsInline", () => {
    expect(drawnVideo(<Video playsInline />).hasAttribute("playsinline")).toBe(true);
  });

  it("renders no autoplay attribute on the server", () => {
    expect(renderToString(<Video autoPlay />)).not.toContain("autoplay");
  });
});
