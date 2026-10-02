/**
 * Every word the page and the contact form read, in two languages, keyed the way the foundation
 * derives identifiers.
 */

/**
 * The languages the page offers.
 */
export type Language = "en" | "nl";

/**
 * Every word the contact form reads, by language.
 *
 * @remarks
 *   A field's words are keyed `contact.fields.<path>.<kind>`, a legend
 *   `contact.groups.<name>.legend`, the submit button `contact.actions.submit`, and an error
 *   `contact.errors.<path>.<keyword>` or `errors.<keyword>` for every form at once. The one key
 *   under `contact` that no field derives, `sent`, is the page's own.
 */
export const catalogues: Readonly<Record<Language, Readonly<Record<string, string>>>> = {
  en: {
    "contact.actions.submit": "Send",
    "contact.errors.consent.const": "Tick the box to continue",
    "contact.errors.email.minLength": "Enter your email address",
    "contact.errors.name.minLength": "Enter at least {{minLength}} characters",
    "contact.errors.topic.enum": "Pick a topic",
    "contact.fields.consent.label": "I agree to be contacted",
    "contact.fields.email.description": "We reply within a day",
    "contact.fields.email.label": "Email address",
    "contact.fields.message.label": "Your message",
    "contact.fields.name.label": "Your name",
    "contact.fields.topic.label": "Topic",
    "contact.fields.topic.options.sales": "Sales",
    "contact.fields.topic.options.support": "Support",
    "contact.groups.what.legend": "What you need",
    "contact.groups.who.legend": "Who you are",
    "contact.sent": "Thanks {{name}}, we have your message",
    "errors.format": "Enter an address like name@example.com",
    "errors.maxLength": "Keep it under {{maxLength}} characters",
  },
  nl: {
    "contact.actions.submit": "Versturen",
    "contact.errors.consent.const": "Vink het vakje aan om verder te gaan",
    "contact.errors.email.minLength": "Vul uw e-mailadres in",
    "contact.errors.name.minLength": "Vul minstens {{minLength}} tekens in",
    "contact.errors.topic.enum": "Kies een onderwerp",
    "contact.fields.consent.label": "Ik ga akkoord met contact",
    "contact.fields.email.description": "We antwoorden binnen een dag",
    "contact.fields.email.label": "E-mailadres",
    "contact.fields.message.label": "Uw bericht",
    "contact.fields.name.label": "Uw naam",
    "contact.fields.topic.label": "Onderwerp",
    "contact.fields.topic.options.sales": "Verkoop",
    "contact.fields.topic.options.support": "Ondersteuning",
    "contact.groups.what.legend": "Wat u nodig heeft",
    "contact.groups.who.legend": "Wie u bent",
    "contact.sent": "Bedankt {{name}}, we hebben uw bericht",
    "errors.format": "Vul een adres in zoals naam@voorbeeld.nl",
    "errors.maxLength": "Houd het onder {{maxLength}} tekens",
  },
};
