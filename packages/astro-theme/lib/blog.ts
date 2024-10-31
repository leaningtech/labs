import { getEntry, type CollectionEntry, getCollection } from "astro:content";
import { productFromUrl } from "./products";

export async function resolveAuthors(
	authors: string[]
): Promise<CollectionEntry<"blogauthors">["data"][]> {
	return Promise.all(
		authors.map((id: string) =>
			getEntry("blogauthors", id).then((entry) => {
				if (!entry) throw new Error(`unknown author '${id}'`);
				return entry.data;
			})
		)
	);
}

export async function latestFeaturedPost(url: URL) {
	const requiredTag = productFromUrl(url)?.name;

	const posts = (
		await getCollection(
			"blog",
			(entry) =>
				entry.data.featured &&
				!entry.data.draft &&
				(!requiredTag || entry.data.tags?.includes(requiredTag))
		)
	).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
	return posts[0];
}
