import { defineCommonCollections } from "@leaningtech/astro-theme/content";
import { defineCollection, z } from "astro:content";

const showcase = defineCollection({
	type: "data",
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().optional(),
			url: z.string(),
			image: image().refine((img) => img.width / img.height == 1.5, {
				message: "Image must have 3:2 aspect ratio"
			})
		})
});

export const collections = { showcase, ...defineCommonCollections() };
