/**
 * Resolves the words a page declares through the catalogue namespace they are keys in.
 *
 * @remarks
 *   A page writes its title, its opening and its scenes' words as keys under a prefix of its own in
 *   the catalogue's namespace, and the words follow the language a reader chose. A page whose words
 *   live in another namespace names it. A key with no entry is shown as the key, so a page written
 *   in plain words, or half translated, reads rather than breaks.
 *   The namespace is named on the key rather than handed to the hook, because the hook types its
 *   namespace against the catalogues this package declares and a page's namespace is any package's.
 */

import { useTranslation } from "@stealthscale/provider-i18n";

import { NAMESPACE } from "#words.ts";

/**
 * The separator the instance reads a namespace off a key by.
 */
const SEPARATOR = ":";

/**
 * Returns the words any page's keys resolve to, for a caller reading pages of several namespaces.
 *
 * @returns A function from a namespace and a key to the words, which returns a key as it is where
 *   the namespace has no entry for it. An empty or absent namespace is the catalogue's own.
 */
export function useWordings(): (namespace: string | undefined, key: string) => string {
  const { t } = useTranslation(NAMESPACE);

  return (namespace, key) => {
    const named = namespace === undefined || namespace === "" ? NAMESPACE : namespace;

    return t(`${named}${SEPARATOR}${key}`, { defaultValue: key });
  };
}

/**
 * Returns the words a page's keys resolve to.
 *
 * @param namespace - The namespace the page names, or empty for the catalogue's own.
 * @returns A function from a key to the words, which returns a key as it is where the namespace
 *   has no entry for it.
 */
export function useWording(namespace: string | undefined): (key: string) => string {
  const word = useWordings();

  return (key) => word(namespace, key);
}

/**
 * The prefix a group's heading is looked up under in the catalogue's namespace.
 */
const GROUPS = "groups";

/**
 * Returns the words a group is headed with.
 *
 * @remarks
 *   A group is looked up as `groups.<name>` in the catalogue's namespace and shown as the name
 *   where no entry exists, so an application translates its groups in one place and a group
 *   nobody translated reads as written. The pages that name no group are headed by the
 *   catalogue's own words for that.
 * @returns A function from a group's name to its heading.
 */
export function useGroupName(): (name: string) => string {
  const { t } = useTranslation(NAMESPACE);

  return (name) =>
    name === "" ? t("rail.ungrouped") : t(`${GROUPS}.${name}.title`, { defaultValue: name });
}

/**
 * Returns the sentence a group's own index opens with.
 *
 * @remarks
 *   Looked up beside the heading as `groups.<name>.about`, and empty where nobody wrote one, so a
 *   group gains a sentence by having one written rather than by an edit here.
 * @returns A function from a group's name to its sentence, empty where it has none.
 */
export function useGroupAbout(): (name: string) => string {
  const { t } = useTranslation(NAMESPACE);

  return (name) => (name === "" ? "" : t(`${GROUPS}.${name}.about`, { defaultValue: "" }));
}

/**
 * The prefix a section's heading is looked up under in the catalogue's namespace.
 */
const SECTIONS = "sections";

/**
 * Returns the words a section is headed with.
 *
 * @remarks
 *   Read the same way a group is, as `sections.<name>` with the name itself where no entry exists.
 *   A section is the first segment of a page's address, so the entry is what turns `components`
 *   into the word a reader sees and what a catalogue in another language translates.
 * @returns A function from a section's name to its heading, empty for a page in no section.
 */
export function useSectionName(): (name: string) => string {
  const { t } = useTranslation(NAMESPACE);

  return (name) => (name === "" ? "" : t(`${SECTIONS}.${name}.title`, { defaultValue: name }));
}

/**
 * Returns the sentence a section's own index opens with.
 *
 * @remarks
 *   Looked up beside the heading as `sections.<name>.about`, and empty where nobody wrote one.
 * @returns A function from a section's name to its sentence, empty where it has none.
 */
export function useSectionAbout(): (name: string) => string {
  const { t } = useTranslation(NAMESPACE);

  return (name) => (name === "" ? "" : t(`${SECTIONS}.${name}.about`, { defaultValue: "" }));
}
