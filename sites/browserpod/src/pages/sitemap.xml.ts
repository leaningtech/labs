import type { APIRoute } from "astro";
import { getRootNav, flattenNav } from "@leaningtech/astro-theme/nav";

const BASE = "https://browserpod.io";

// Sitemap for the /docs section. This is a separate Astro build with
// base: "/docs/", so this endpoint is served at https://browserpod.io/docs/sitemap.xml.
// The main browserpod.io repo serves a sitemap index at /sitemap.xml that
// references this file, so Google discovers the docs URLs through it.
//
// We build the URL list from the same nav functions the docs routes are
// generated from ([...slug].astro uses flattenNav(getRootNav())), so this
// sitemap can never drift from the pages that actually exist. getRootNav()
// already excludes drafts in PROD; we drop language directories here the same
// way the route generator does.
export const GET: APIRoute = async () => {
	const entries = flattenNav(await getRootNav()).filter((entry) => {
		if (entry.type === "directory" && entry.isLanguageDirectory) return false;
		return true;
	});

	// The /docs/ landing page is served by the theme's pages/docs/index.astro,
	// not the content collection, so it isn't in `entries`. Add it explicitly.
	const landingUrl = `${BASE}/docs/`;

	// entry.href is already "/docs/<slug>". Normalise and drop duplicates.
	const innerUrls = Array.from(
		new Set(entries.map((entry) => `${BASE}${entry.href}`))
	).sort();

	const pages = [
		{ loc: landingUrl, priority: "0.8" },
		...innerUrls
			.filter((u) => u !== landingUrl)
			.map((loc) => ({ loc, priority: "0.7" })),
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `  <url>
    <loc>${page.loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join("\n")}
</urlset>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
};
