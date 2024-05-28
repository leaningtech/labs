import { OGImageRoute } from "astro-og-canvas";

export const { getStaticPaths, GET } = OGImageRoute({
	// Tell us the name of your dynamic route segment.
	// In this case it’s `route`, because the file is named `[...route].ts`.
	param: "slug",

	// A collection of pages to generate images for.
	// The keys of this object are used to generate the path for that image.
	// In this example, we generate one image at `/open-graph/example.png`.
	pages: {
		"cheerpj-jnlp-runner": {
			title: "Example Page",
			description: "Description of this page shown in smaller text",
		},
	},

	// For each page, this callback will be used to customize the OpenGraph image.
	getImageOptions: (path, page) => ({
		title: page.title,
		description: page.description,
		logo: {
			path: "src/assets/branding/products/cheerpj-extensions/jnlp-logo.png",
		},
		// There are a bunch more options you can use here!
	}),
});
