import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

// Assuming you have a collection named "blog"
const docss = await getCollection("docs");

// Transform the collection into an object
const pages = Object.fromEntries(
	docs.map(({ id, slug, data }) => [id, { data, slug }]),
);
export const { getStaticPaths, GET } = OGImageRoute({
	// The name of your dynamic route segment.
	// In this case it’s `route`, because the file is named `[...route].ts`.
	param: "route",
	pages: pages,

	// For each page, this callback will be used to customize the OG image.
	getImageOptions: async (_, { data, slug }: (typeof pages)[string]) => {
		return {
			title: data.title,
			description: data.description,
			dir: data.isArabic ? "rtl" : "ltr",
			border: { color: [114, 221, 64], width: 20, side: "inline-start" },
			bgGradient: [
				[6, 38, 45],
				[8, 3, 2],
			],
			logo: {
				path: "./src/logo.png",
				size: [500],
			},
		};
	},
});
