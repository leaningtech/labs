import assert from "assert";
import translationsJa from "../../../translations/ja.json";
import translationsZh from "../../../translations/zh.json";

// NOTE: we cannot import astro:i18n anywhere, because it only works for sites with localisation
// enabled. Some sites may not have localisation enabled, and will raise an error. The error
// cannot be caught via dynamic import.

export const locales = ["en", "ja", "zh"];

/** Join two paths with a slash between. */
function join(a: string, b: string): string {
	if (a.endsWith("/")) return a + b;
	return a + "/" + b;
}

/** Gets the base paths for all locales. */
function getLocaleBasePaths(currentLocale: string | undefined): {
	[locale: string]: string;
} {
	if (!currentLocale) return {};

	const base = import.meta.env.BASE_URL;
	return { en: base, ja: join(base, "ja"), zh: join(base, "zh") };
}

/**
 * Returns paths representing the given one in supported locales.
 * Usage: `getLocalisedPaths(Astro.url.pathname, Astro.currentLocale)`
 */
export function getLocalisedPaths(
	path: string,
	currentLocale: string | undefined,
): { [locale: string]: string } {
	if (!currentLocale) return {};

	const bases = getLocaleBasePaths(currentLocale);

	// Strip base from url
	const currentBase = bases[currentLocale]!;
	assert(path.startsWith(currentBase));
	const pathWithoutBase = path.slice(currentBase.length);

	// Generate paths for all locales
	const obj: { [locale: string]: string } = {};
	for (const [locale, base] of Object.entries(bases)) {
		obj[locale] = base + pathWithoutBase;
	}
	return obj;
}

/** Translates the given English string, falling back to English if it's not found. */
export function t(english: string, currentLocale: string | undefined): string {
	if (currentLocale === "ja") {
		const translation = translationsJa[english as keyof typeof translationsJa];
		if (translation) return translation;
		else if (import.meta.env.DEV) {
			return "このコンテンツはまだ日本語訳がありませんので、英語版をご参照ください。";
		} else throw new Error(`Missing Japanese translation for: ${english}`);
	} else if (currentLocale === "zh") {
		const translation = translationsZh[english as keyof typeof translationsZh];
		if (translation) return translation;
		else if (import.meta.env.DEV) {
			return "MISSING TRANSLATION";
		} else throw new Error(`Missing Chinese translation for: ${english}`);
	}

	return english;
}
