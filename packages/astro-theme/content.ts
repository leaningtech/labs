import { defineCollection, z } from "astro:content";

export function defineDocsCollection() {
	return defineCollection({
		// These are passed to DocsArticle.astro
		schema: z.object({
			title: z.string(),
			description: z.string().optional(),
			fullWidthLayout: z.boolean().default(false),
		}),
	});
}
