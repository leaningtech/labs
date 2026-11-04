import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import type { ProductTag } from "@leaningtech/astro-theme/content";
import { SITE_TITLE, SITE_DESCRIPTION } from "@leaningtech/astro-theme/consts";

// One feed per product tag, served at /rss/<product>.xml next to the main
// /rss.xml that carries every post.
export const FEED_PRODUCTS: ProductTag[] = [
	"Cheerp",
	"CheerpJ",
	"CheerpX",
	"BrowserPod",
];

export function feedPath(product?: ProductTag): string {
	return product ? `/rss/${product.toLowerCase()}.xml` : "/rss.xml";
}

export function feedTitle(product?: ProductTag): string {
	return product ? `${product} posts | ${SITE_TITLE}` : SITE_TITLE;
}

// Browsers render the feeds through this stylesheet instead of showing raw XML.
// It is a processing instruction, so feed readers and crawlers ignore it.
const FEED_STYLESHEET = "/rss/styles.xsl";

export async function blogFeed(context: APIContext, product?: ProductTag) {
	const posts = (
		await getCollection(
			"blog",
			({ data }) =>
				data.draft !== true && (!product || !!data.tags?.includes(product))
		)
	).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	// The newest post's date, not the build time: rebuilding on every deploy would
	// otherwise make the feed look updated when no post was added.
	const lastBuildDate = posts[0]?.data.pubDate;
	const self = new URL(feedPath(product), context.site!).href;

	return rss({
		title: feedTitle(product),
		description: product
			? `Releases, technical deep dives and news about ${product} from the Leaning Technologies engineering blog.`
			: SITE_DESCRIPTION,
		site: context.site!,
		// Pages are built as blog/<slug>.html and served without a trailing slash
		trailingSlash: false,
		stylesheet: FEED_STYLESHEET,
		xmlns: { atom: "http://www.w3.org/2005/Atom" },
		// <link> points at the site, so on its own it is identical in all five
		// feeds. The atom:self link is what identifies each feed downstream.
		customData: [
			"<language>en</language>",
			lastBuildDate
				? `<lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>`
				: "",
			`<atom:link href="${self}" rel="self" type="application/rss+xml"/>`,
		].join(""),
		items: posts.map((post) => ({
			title: post.data.subtitle
				? `${post.data.title}: ${post.data.subtitle}`
				: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.slug}`,
			categories: [...(post.data.tags ?? []), ...(post.data.categories ?? [])],
		})),
	});
}
