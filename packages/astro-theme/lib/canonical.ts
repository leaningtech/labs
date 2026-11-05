const LABS_ORIGIN = "https://labs.leaningtech.com";

// Labs blog posts that were copied to browserpod.io declare the browserpod.io
// page as canonical, so search engines don't treat them as duplicate content.
// To add a post, map its labs path (no ".html", no trailing slash) to the full
// browserpod.io URL. Only add an entry once the browserpod.io page is live:
// until then the labs page would hand its ranking to a URL that doesn't exist.
export const browserpodCanonicals: Record<string, string> = {
	"/blog/browserpod-10": "https://browserpod.io/blog/browserpod-10/",
	"/blog/browserpod-20": "https://browserpod.io/blog/browserpod-20/",
	"/blog/browserpod-deep-dive":
		"https://browserpod.io/blog/browserpod-deep-dive/",
	"/blog/browserpod-beta-announcement":
		"https://browserpod.io/blog/browserpod-beta-announcement/",
	"/blog/browserpod-annoucement":
		"https://browserpod.io/blog/browserpod-announcement/",
	"/blog/announcing-browsercode":
		"https://browserpod.io/blog/announcing-browsercode/",
};

// Strips one ".html" or one trailing "/", not both.
function normalisePath(pathname: string): string {
	return pathname.replace(/(?:\.html|\/)$/, "");
}

export function isBlogPath(pathname: string): boolean {
	return (
		pathname.startsWith("/blog/") ||
		/* CheerpJ */ pathname.startsWith("/docs/blog/")
	);
}

export function getCanonicalURL(url: URL, site: URL | undefined): URL {
	const path = normalisePath(url.pathname);
	const override = browserpodCanonicals[path];
	if (override) return new URL(override);
	// Blog posts are canonical on labs, even when served from another site.
	const origin = isBlogPath(url.pathname) ? LABS_ORIGIN : site;
	return new URL(path || "/", origin);
}
