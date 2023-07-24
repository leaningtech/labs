import { defineCollection, z } from "astro:content";

export enum Product {
	Cheerp = "cheerp",
}

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		heroImage: z.string().optional(),
	}),
});

const docs = defineCollection({
	schema: z.object({
		title: z.string(),
		product: z.nativeEnum(Product),
	}),
});

export const collections = { docs, blog };
