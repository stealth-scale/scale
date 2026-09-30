import { type PropsWithChildren, type ReactElement } from "react";

import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LocaleContext } from "@stealthscale/provider-locale";

import { formatOf } from "#phone-input/number.ts";
import { type Phone, type PhoneOptions, usePhone } from "#phone-input/phone.ts";

/**
 * Options every case starts from: the Netherlands, the four countries on offer and English names.
 */
const BASE: PhoneOptions = {
  countries: ["NL", "BE", "GB", "US"],
  defaultCountry: "NL",
  locale: "en",
};

/**
 * Renders the hook with the base options and the options the case sets.
 */
function phone(options: PhoneOptions = {}): RenderHookResult<Phone, PhoneOptions> {
  return renderHook((props: PhoneOptions) => usePhone(props), {
    initialProps: { ...BASE, ...options },
  });
}

/**
 * Renders children under a locale provider set to German.
 */
function German({ children }: PropsWithChildren): ReactElement {
  return (
    <LocaleContext
      value={{
        direction: "ltr",
        isPending: false,
        locale: "de",
        locales: ["de"],
        setLocale: () => {},
      }}
    >
      {children}
    </LocaleContext>
  );
}

describe("usePhone", () => {
  it("formats the default value for the default country", () => {
    const { result } = phone({ defaultValue: "0612345678" });

    expect(result.current.text).toBe("06 12345678");
  });

  it("returns the E.164 form as the value of a valid number", () => {
    const { result } = phone({ defaultValue: "0612345678" });

    expect(result.current.value).toBe("+31612345678");
  });

  it("keeps the typed text while the controlled value is the one it reported", () => {
    const onValueChange = vi.fn<NonNullable<PhoneOptions["onValueChange"]>>();
    const { rerender, result } = phone({ onValueChange, value: "" });

    act(() => {
      result.current.edit(formatOf("0612345678", "NL"));
    });
    rerender({ ...BASE, onValueChange, value: "+31612345678" });

    expect(result.current.text).toBe("06 12345678");
  });

  it("formats a controlled value it did not report for the picked country", () => {
    const { result } = phone({ value: "+442071838750" });

    expect(result.current.text).toBe("+44 20 7183 8750");
  });

  it("reports the details of an edit", () => {
    const onValueChange = vi.fn<NonNullable<PhoneOptions["onValueChange"]>>();
    const { result } = phone({ onValueChange });

    act(() => {
      result.current.edit(formatOf("0612345678", "NL"));
    });

    expect(onValueChange.mock.lastCall).toStrictEqual([
      { country: "NL", text: "06 12345678", valid: true, value: "+31612345678" },
    ]);
  });

  it("moves the country to the one a typed prefix names while a picker renders", () => {
    const onCountryChange = vi.fn<NonNullable<PhoneOptions["onCountryChange"]>>();
    const { result } = phone({ onCountryChange });

    act(() => {
      result.current.setPicking(true);
    });
    act(() => {
      result.current.edit(formatOf("+442071838750", "NL"));
    });

    expect([result.current.country, onCountryChange.mock.lastCall]).toStrictEqual([
      "GB",
      [{ country: "GB" }],
    ]);
  });

  it("keeps the country while no picker renders", () => {
    const { result } = phone();

    act(() => {
      result.current.edit(formatOf("+442071838750", "NL"));
    });

    expect(result.current.country).toBe("NL");
  });

  it("keeps the country when the prefix names one the picker does not offer", () => {
    const { result } = phone({ countries: ["NL", "BE"] });

    act(() => {
      result.current.setPicking(true);
    });
    act(() => {
      result.current.edit(formatOf("+442071838750", "NL"));
    });

    expect(result.current.country).toBe("NL");
  });

  it("keeps the country while the prefix names several", () => {
    const { result } = phone();

    act(() => {
      result.current.setPicking(true);
    });
    act(() => {
      result.current.edit(formatOf("+1", "NL"));
    });

    expect(result.current.country).toBe("NL");
  });

  it("reports no country change for a number in the picked country", () => {
    const onCountryChange = vi.fn<NonNullable<PhoneOptions["onCountryChange"]>>();
    const { result } = phone({ onCountryChange });

    act(() => {
      result.current.setPicking(true);
    });
    act(() => {
      result.current.edit(formatOf("0612345678", "NL"));
    });

    expect(onCountryChange).not.toHaveBeenCalled();
  });

  it("rewrites the digits in the international form of a picked country", () => {
    const { result } = phone({ defaultValue: "0612345678" });

    act(() => {
      result.current.pick("GB");
    });

    expect([result.current.country, result.current.text]).toStrictEqual(["GB", "+44 612345678"]);
  });

  it("reports nothing but the country for a pick without digits", () => {
    const onValueChange = vi.fn<NonNullable<PhoneOptions["onValueChange"]>>();
    const { result } = phone({ onValueChange });

    act(() => {
      result.current.pick("BE");
    });

    expect([result.current.country, onValueChange.mock.calls]).toStrictEqual(["BE", []]);
  });

  it("offers every region sorted by name without a list", () => {
    const { result } = renderHook(() => usePhone({ locale: "en" }));

    expect(result.current.countries).toHaveLength(245);
  });

  it("names the countries in the locale in scope without a locale", () => {
    const { result } = renderHook(() => usePhone({ countries: ["NL"] }), { wrapper: German });

    expect(result.current.countries[0]?.name).toBe("Niederlande");
  });

  it("names the countries in the runtime's locale without a provider", () => {
    const { result } = renderHook(() => usePhone({ countries: ["NL"] }));

    expect(result.current.countries[0]?.name).toBe(
      new Intl.DisplayNames([new Intl.NumberFormat().resolvedOptions().locale], {
        type: "region",
      }).of("NL"),
    );
  });
});
