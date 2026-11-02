import type { APIContext } from "astro";
import type { ProductTag } from "@leaningtech/astro-theme/content";
import { FEED_PRODUCTS, blogFeed } from "../../lib/feeds";

export function getStaticPaths() {
	return FEED_PRODUCTS.map((product) => ({
		params: { product: product.toLowerCase() },
		props: { product },
	}));
}

export const GET = (context: APIContext) =>
	blogFeed(context, context.props.product as ProductTag);
