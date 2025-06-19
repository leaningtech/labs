import { defineCollection, z } from "astro:content";

const productTags = z.array(z.enum(["Cheerp", "CheerpJ", "CheerpX"]));

export type ProductTag = z.infer<typeof productTags>[0];

export function defineCommonCollections() {
	return {
		docs: defineCollection({
			// These are passed to DocsArticle.astro
			schema: z.object({
				title: z.string(),
				description: z.string().optional(),
				shortTitle: z.string().optional(), // Used for nav only
				fullWidthLayout: z.boolean().default(false),
				draft: z.boolean().default(false),
			}),
		}),

		blogauthors: defineCollection({
			schema: ({ image }) =>
				z.object({
					name: z.string(),
					jobTitle: z.string().optional(),
					avatar: image().optional(),
					url: z.string().optional(),
					guest: z.boolean().default(false),
				}),
			type: "data",
		}),

		blog: defineCollection({
			schema: ({ image }) =>
				z.object({
					title: z.string(),
					shortTitle: z.string().optional(),
					subtitle: z.string().optional(),
					description: z.string(),
					pubDate: z
						.string()
						.or(z.date())
						.transform((val) => new Date(val)),
					updatedDate: z
						.string()
						.optional()
						.transform((str) => (str ? new Date(str) : undefined)),
					authors: z.array(z.string()),
					heroImage: image().optional(),
					featured: z.boolean().default(false),
					draft: z.boolean().default(false),
					tags: productTags.optional(),
				}),
		}),
		showcase: defineCollection({
			type: "data",
			schema: ({ image }) =>
				z.object({
					title: z.string(),
					description: z.string().optional(),
					url: z.string(),
					heroImage: image().refine((img) => img.width / img.height == 1.5, {
						message: "Image must have 3:2 aspect ratio",
					}),
					tags: productTags.optional(),
				}),
		}),
	};
}
