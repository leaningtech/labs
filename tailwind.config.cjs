/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				primary: {
					600: "#e62755",
					500: "#e83d66",
					400: "#eb5277",
					300: "#f07d99",
					200: "#f5a9bb",
					100: "#fad4dd",
					50: "#fde9ee",
				},
				blurple: "#5865F2", // https://discord.com/branding
			},
			typography: (theme) => ({
				stone: {
					css: {
						"--tw-prose-links": theme("colors.primary[500]"),
						"--tw-prose-invert-links": theme("colors.primary[400]"),
					},
				},
			}),
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
