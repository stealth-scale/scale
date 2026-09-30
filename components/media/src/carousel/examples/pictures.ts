/**
 * Lists the pictures the carousel examples show, each under the key of its description in the
 * page's words.
 */

import dawn from "./dawn.webp";
import dunes from "./dunes.webp";
import harbour from "./harbour.webp";
import lake from "./lake.webp";
import peaks from "./peaks.webp";

/**
 * Describes a picture: the key of its description and its address.
 */
export interface Picture {
  /**
   * Key of the picture's description, which the example reads as its `alt`.
   */
  readonly key: "dawn" | "dunes" | "harbour" | "lake" | "peaks";

  /**
   * Address of the picture.
   */
  readonly src: string;
}

/**
 * Lists the five pictures, in the order the examples show them.
 */
export const PICTURES: readonly Picture[] = [
  { key: "dawn", src: dawn },
  { key: "lake", src: lake },
  { key: "dunes", src: dunes },
  { key: "harbour", src: harbour },
  { key: "peaks", src: peaks },
];
