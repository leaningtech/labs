import { getAbsoluteLocaleUrlList } from "astro:i18n";
import assert from "assert";

export const locales = ["en", "ja"];

/** Gets the base paths for all locales. */
function getLocaleBasePaths(currentLocale: string | undefined): {
	[locale: string]: string;
} {
	if (!currentLocale) return {};

	const bases = getAbsoluteLocaleUrlList().map(
		(a: string) => new URL(a).pathname,
	);
	assert(bases.length === locales.length);

	const obj: { [locale: string]: string } = {};
	for (let i = 0; i < bases.length; i++) {
		const locale = locales[i]!;
		const base = bases[i]!;
		obj[locale] = base;
	}
	return obj;
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
