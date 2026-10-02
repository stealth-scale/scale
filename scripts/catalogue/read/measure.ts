/**
 * Measures text and icon placement inside elements, in CSS pixels, for alignment reviews.
 *
 * @remarks
 *   Every offset is signed. A positive centre offset is to the right of or below the element's
 *   centre. Text is the element's non-blank text nodes outside any `svg`. The icon is the element's
 *   first `svg`, or the element itself when it is one.
 */

import { type Locator } from "playwright";

/**
 * Measurements `--measure` accepts.
 *
 * @remarks
 *   - `ink`: offset of the x-height centre and the cap-height centre from the element's centre.
 *   - `glyph`: inset of the icon's ink from each edge of the element, and its centre offset. The ink
 *     is the geometry's bounding box plus half the stroke width.
 *   - `starts`: page x of the first and last text ink, and their insets from the element's edges.
 *   - `gaps`: block and inline distance from each element to the next one matched.
 */
export const MEASURES = ["ink", "glyph", "starts", "gaps"] as const;

/**
 * Name of one measurement.
 */
export type Measure = (typeof MEASURES)[number];

/**
 * One measured element or pair: its name, then each value by label.
 */
export type Row = Readonly<Record<string, number | string>>;

/**
 * Point in viewport pixels.
 */
interface Point {
  /**
   * Horizontal coordinate.
   */
  readonly x: number;

  /**
   * Vertical coordinate.
   */
  readonly y: number;
}

/**
 * Rectangle in viewport pixels.
 */
interface Rect {
  /**
   * Bottom edge.
   */
  readonly bottom: number;

  /**
   * Left edge.
   */
  readonly left: number;

  /**
   * Right edge.
   */
  readonly right: number;

  /**
   * Top edge.
   */
  readonly top: number;
}

/**
 * Box, icon and name of one element.
 */
interface Framed {
  /**
   * Border box of the element.
   */
  readonly box: Rect;

  /**
   * Ink box of the icon, or null when the element has no `svg`.
   */
  readonly glyph: null | Rect;

  /**
   * Tag and first class of the element.
   */
  readonly named: string;
}

/**
 * Text geometry of one element.
 */
interface Lettered {
  /**
   * Viewport y of the cap-height centre of the first text node.
   */
  readonly cap: number;

  /**
   * Box of every text node together.
   */
  readonly rect: Rect;

  /**
   * Viewport y of the x-height centre of the first text node.
   */
  readonly x: number;
}

/**
 * Raw geometry of one element.
 */
interface Read extends Framed {
  /**
   * Text geometry, or null when the element has no text.
   */
  readonly text: Lettered | null;
}

/**
 * Reads the box, the icon ink box and the name of every element a locator matches.
 *
 * @remarks
 *   The icon's ink box is `getBBox()` mapped from the `viewBox` to viewport pixels under the
 *   default `xMidYMid meet`, widened by half the stroke width of its first shape.
 */
function framed(elements: Locator): Promise<readonly Framed[]> {
  return elements.evaluateAll((all) => {
    const SHAPES = "path, circle, rect, line, polyline, polygon, ellipse";

    /**
     * Copies the four edges of a DOM rectangle into a plain object.
     */
    // eslint-disable-next-line unicorn/consistent-function-scoping -- the function runs inside the browser, where only what is written inside the callback exists
    const plain = (rect: DOMRect): Rect => ({
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      top: rect.top,
    });

    /**
     * Returns the ink box of the element's icon, or null when it has none.
     */
    // eslint-disable-next-line unicorn/consistent-function-scoping -- as above
    const glyphOf = (element: Element): null | Rect => {
      const svg = element instanceof SVGSVGElement ? element : element.querySelector("svg");

      if (svg === null) return null;

      const frame = svg.getBoundingClientRect();
      const view = svg.viewBox.baseVal;
      const width = view.width > 0 ? view.width : frame.width;
      const height = view.height > 0 ? view.height : frame.height;
      const scale = Math.min(frame.width / width, frame.height / height);
      const left = frame.left + (frame.width - width * scale) / 2 - view.x * scale;
      const top = frame.top + (frame.height - height * scale) / 2 - view.y * scale;
      const shape = getComputedStyle(svg.querySelector(SHAPES) ?? svg);
      const stroke = Number(shape.strokeWidth.replace(/px$/u, ""));
      const half = shape.stroke === "none" ? 0 : stroke / 2;
      const ink = svg.getBBox();

      return {
        bottom: top + (ink.y + ink.height + half) * scale,
        left: left + (ink.x - half) * scale,
        right: left + (ink.x + ink.width + half) * scale,
        top: top + (ink.y - half) * scale,
      };
    };

    return all.map((element) => {
      const [kind] = element.classList;

      return {
        box: plain(element.getBoundingClientRect()),
        glyph: glyphOf(element),
        named: `${element.tagName.toLowerCase()}${kind === undefined ? "" : `.${kind}`}`,
      };
    });
  });
}

/**
 * Reads the text geometry of every element a locator matches.
 *
 * @remarks
 *   The baseline is the top of the first text node's range plus the font's ascent from canvas
 *   `measureText`, because a text range's box spans the font's ascent and descent. The x-height and
 *   the cap height are the ink ascents of `x` and `H` in the same font.
 */
function lettered(elements: Locator): Promise<ReadonlyArray<Lettered | null>> {
  return elements.evaluateAll((all) => {
    /**
     * Lists the element's non-blank text nodes outside any `svg`, in document order.
     */
    // eslint-disable-next-line unicorn/consistent-function-scoping -- the function runs inside the browser, where only what is written inside the callback exists
    const textsOf = (element: Element): Text[] => {
      const nodes: Text[] = [];
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

      for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
        const outside = (node.parentElement?.closest("svg") ?? null) === null;

        if (node instanceof Text && node.data.trim() !== "" && outside) nodes.push(node);
      }

      return nodes;
    };

    return all.map((element) => {
      const nodes = textsOf(element);
      const [first] = nodes;
      const last = nodes.at(-1);
      const context = document.createElement("canvas").getContext("2d");

      if (first === undefined || last === undefined || context === null) return null;

      const style = getComputedStyle(first.parentElement ?? element);
      const whole = document.createRange();
      const line = document.createRange();

      context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      whole.setStart(first, 0);
      whole.setEnd(last, last.length);
      line.selectNodeContents(first);

      const x = context.measureText("x");
      const baseline = line.getBoundingClientRect().top + x.fontBoundingBoxAscent;
      const rect = whole.getBoundingClientRect();

      return {
        cap: baseline - context.measureText("H").actualBoundingBoxAscent / 2,
        rect: { bottom: rect.bottom, left: rect.left, right: rect.right, top: rect.top },
        x: baseline - x.actualBoundingBoxAscent / 2,
      };
    });
  });
}

/**
 * Rounds a length to two decimals.
 */
function rounded(length: number): number {
  return Math.round(length * 100) / 100;
}

/**
 * Returns the centre of a rectangle.
 */
function centreOf(rect: Rect): Point {
  return { x: (rect.left + rect.right) / 2, y: (rect.top + rect.bottom) / 2 };
}

/**
 * Builds one element's row of a measurement, or undefined when the element lacks what it measures.
 */
function rowOf(kind: Exclude<Measure, "gaps">, read: Read): Row | undefined {
  const centre = centreOf(read.box);
  const { box, glyph, named, text } = read;

  if (kind === "glyph") {
    if (glyph === null) return undefined;

    const ink = centreOf(glyph);

    return {
      bottom: rounded(box.bottom - glyph.bottom),
      "centre-x": rounded(ink.x - centre.x),
      "centre-y": rounded(ink.y - centre.y),
      end: rounded(box.right - glyph.right),
      named,
      start: rounded(glyph.left - box.left),
      top: rounded(glyph.top - box.top),
    };
  }

  if (text === null) return undefined;

  if (kind === "ink") {
    return { cap: rounded(text.cap - centre.y), named, "x-height": rounded(text.x - centre.y) };
  }

  return {
    end: rounded(box.right - text.rect.right),
    "end-x": rounded(text.rect.right),
    named,
    start: rounded(text.rect.left - box.left),
    "start-x": rounded(text.rect.left),
  };
}

/**
 * Builds the rows of one measurement from the raw geometry.
 */
function rowsOf(kind: Measure, reads: readonly Read[]): readonly Row[] {
  if (kind !== "gaps") {
    return reads.map((read) => rowOf(kind, read)).filter((row) => row !== undefined);
  }

  return reads.slice(1).map((next, index) => {
    const read = reads[index] ?? next;

    return {
      block: rounded(next.box.top - read.box.bottom),
      inline: rounded(next.box.left - read.box.right),
      named: `${read.named} → ${next.named}`,
    };
  });
}

/**
 * Measures every element a locator matches.
 *
 * @param elements - Elements to measure, in document order.
 * @param kinds - Measurements to take.
 * @returns Rows per measurement. A measurement omits an element without the text or the icon it
 *   measures.
 */
export async function measured(
  elements: Locator,
  kinds: readonly Measure[],
): Promise<Readonly<Partial<Record<Measure, readonly Row[]>>>> {
  const frames = await framed(elements);
  const texts = await lettered(elements);
  const reads = frames.map(({ box, glyph, named }, index) => ({
    box,
    glyph,
    named,
    text: texts[index] ?? null,
  }));

  return Object.fromEntries(kinds.map((kind) => [kind, rowsOf(kind, reads)]));
}
