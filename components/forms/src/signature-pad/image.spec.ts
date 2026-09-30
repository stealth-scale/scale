import { describe, expect, it } from "vitest";

import { imageOf } from "#signature-pad/image.ts";

const STROKE = "M10.5,20.25 Q30,40 50.5,60.75 Z";

function svgOf(url: string): string {
  return decodeURIComponent(url.slice("data:image/svg+xml,".length));
}

describe("imageOf", () => {
  it("returns an empty string for no strokes", () => {
    expect(imageOf([])).toBe("");
  });

  it("returns an SVG data URL", () => {
    expect(imageOf([STROKE]).startsWith("data:image/svg+xml,")).toBe(true);
  });

  it("crops the view box to the strokes with a margin of 4px", () => {
    expect(svgOf(imageOf([STROKE]))).toContain('viewBox="6 16 49 49" width="49" height="49"');
  });

  it("crops the view box to every stroke", () => {
    expect(svgOf(imageOf([STROKE, "M90,5 Q95,8 100,10 Z"]))).toContain('viewBox="6 1 98 64"');
  });

  it("renders a path per stroke", () => {
    expect(svgOf(imageOf([STROKE, STROKE])).match(/<path /gu)).toHaveLength(2);
  });

  it("inks the strokes in black by default", () => {
    expect(svgOf(imageOf([STROKE]))).toContain('fill="black"');
  });

  it("inks the strokes in the fill the caller passes", () => {
    expect(svgOf(imageOf([STROKE], "#1d4ed8"))).toContain('fill="#1d4ed8"');
  });

  it("escapes the characters XML reserves in the fill", () => {
    expect(svgOf(imageOf([STROKE], 'red" <a> & "'))).toContain(
      'fill="red&quot; &lt;a&gt; &amp; &quot;"',
    );
  });
});
