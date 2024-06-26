const plugin = require("tailwindcss/plugin");

// https://gist.github.com/Merott/d2a19b32db07565e94f10d13d11a8574
const exportColorsAsCssVariables = plugin(({ addBase, theme }) => {
	function extractColorVars(colorObj, colorGroup = "") {
		return Object.keys(colorObj).reduce((vars, colorKey) => {
			const value = colorObj[colorKey];

			const newVars =
				typeof value === "string"
					? { [`--color${colorGroup}-${colorKey}`]: value }
					: extractColorVars(value, `-${colorKey}`);

			return { ...vars, ...newVars };
		}, {});
	}

	addBase({
		":root": extractColorVars(theme("colors")),
	});
});

/** @type {import('tailwindcss').Config} */
const disabledCss = {
	pre: false,
	code: false,
	"pre code": false,
	"code::before": false,
	"code::after": false,
	"blockquote p:first-of-type::before": false,
	"blockquote p:last-of-type::after": false,
};

module.exports = () => ({
	content: [
		"./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
		"../../packages/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					"Archivo",
					"DM Sans",
					"Inter",
					"system-ui",
					"-apple-system",
					"BlinkMacSystemFont",
					"Segoe UI",
					"Roboto",
					"Helvetica Neue",
					"Arial",
					"Noto Sans",
					"sans-serif",
				],
				mono: ["Monaspace Argon", "monospace"],
			},
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
				cheerp: "#56f4ec",
				blurple: "#5865F2", // https://discord.com/branding
			},
			typography: (theme) => ({
				stone: {
					css: {
						"--tw-prose-links": theme("colors.cheerp"),
						"--tw-prose-invert-links": theme("colors.primary[400]"),
					},
				},
				DEFAULT: { css: disabledCss },
				sm: { css: disabledCss },
				lg: { css: disabledCss },
				xl: { css: disabledCss },
				"2xl": { css: disabledCss },
			}),
		},
	},
	plugins: [
		require("@designbycode/tailwindcss-text-shadow"),
		require("@tailwindcss/typography"),
		exportColorsAsCssVariables,
	],
	darkMode: "class",
});
