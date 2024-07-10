// src/content/open-graph/[...route].ts

import { OGImageRoute } from "astro-og-canvas";

export const { getStaticPaths, GET } = OGImageRoute({
	// Tell us the name of your dynamic route segment.
	// In this case it’s `route`, because the file is named `[...route].ts`.
	param: "route",

	// A collection of pages to generate images for.
	// The keys of this object are used to generate the path for that image.
	// In this example, we generate one image at `/open-graph/example.png`.
	pages: await import.meta.glob("/src/content/**/*.md", { eager: true }),

	// For each page, this callback will be used to customize the OpenGraph image.
	getImageOptions: (_path, page) => ({
		title: page.frontmatter.title,
		description: page.frontmatter.description,
		logo: { path: "./src/astro-docs-logo.png", size: [350] },
		border: { width: 10 },
		padding: 40,
		// There are a bunch more options you can use here!
	}),
});
