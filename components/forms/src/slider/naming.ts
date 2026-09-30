/**
 * Returns the attributes that name a slider's thumb.
 *
 * @remarks
 *   Each thumb takes the name of its slider from the label part, a field's label or a fieldset's
 *   legend. Its own words, such as `Minimum` in a range, follow that name, so the name reads "Price
 *   Minimum". The slider and the angle slider name their thumbs alike.
 */

/**
 * Returns the `aria-label` and `aria-labelledby` of a thumb: the group's name alone, the group's
 * name and the thumb's own words, or the words alone.
 *
 * @param label - The thumb's own words, or nothing.
 * @param group - ID of the element that names the slider, or nothing.
 * @param id - ID of the thumb.
 * @returns The attributes to set, without the ones that would be empty.
 */
export function naming(
  label: string | undefined,
  group: string | undefined,
  id: string,
): Record<string, string> {
  if (label === undefined) return group === undefined ? {} : { "aria-labelledby": group };

  return {
    "aria-label": label,
    ...(group === undefined ? {} : { "aria-labelledby": `${group} ${id}` }),
  };
}
