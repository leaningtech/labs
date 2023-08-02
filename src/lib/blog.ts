import { getEntry, type CollectionEntry } from "astro:content";

export async function resolveAuthors(
	authors: string[],
): Promise<CollectionEntry<"blogauthors">["data"][]> {
	return Promise.all(
		authors.map((id: string) =>
			getEntry("blogauthors", id).then((entry) => {
				if (!entry) throw new Error(`unknown author '${id}'`);
				return entry.data;
			}),
		),
	);
}
