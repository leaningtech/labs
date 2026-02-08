import type { Config } from "tailwindcss";
import type {
	CSSRuleObject,
	PluginAPI,
	RecursiveKeyValuePair,
} from "tailwindcss/types/config";
import plugin from "tailwindcss/plugin";

// https://gist.github.com/Merott/d2a19b32db07565e94f10d13d11a8574
const exportColorsAsCssVariables = plugin(({ addBase, theme }) => {
	function extractColorVars(
		colorObj: RecursiveKeyValuePair,
		colorGroup = ""
	): CSSRuleObject {
		return Object.keys(colorObj).reduce((vars, colorKey) => {
			const value = colorObj[colorKey]!;

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

const siteThemes = plugin(({ addBase }) => {
	addBase({
		// Default theme (pink/red + stone backgrounds) - using RGB values for opacity support
		":root": {
			// Primary colors
			"--color-primary-600": "230 39 85", // #e62755
			"--color-primary-500": "232 61 102", // #e83d66
			"--color-primary-400": "235 82 119", // #eb5277
			"--color-primary-300": "240 125 153", // #f07d99
			"--color-primary-200": "245 169 187", // #f5a9bb
			"--color-primary-100": "250 212 221", // #fad4dd
			"--color-primary-50": "253 233 238", // #fde9ee

			// Background colors - default to stone palette
			"--color-bg-950": "12 10 9", // stone-950
			"--color-bg-900": "28 25 23", // stone-900
			"--color-bg-800": "41 37 36", // stone-800
			"--color-bg-700": "68 64 60", // stone-700
			"--color-bg-600": "87 83 78", // stone-600
			"--color-bg-500": "120 113 108", // stone-500
			"--color-bg-400": "168 162 158", // stone-400
			"--color-bg-300": "214 211 209", // stone-300
			"--color-bg-200": "231 229 228", // stone-200
			"--color-bg-100": "245 245 244", // stone-100
			"--color-bg-50": "250 250 249", // stone-50
		},
		// BrowserPod theme (teal + darker emerald-tinted backgrounds)
		".site-browserpod": {
			// Primary colors
			"--color-primary-600": "17 158 123", // #119e7b
			"--color-primary-500": "35 201 159", // #23c99f
			"--color-primary-400": "58 229 179", // #3ae5b3
			"--color-primary-300": "104 239 199", // #68efc7
			"--color-primary-200": "158 247 220", // #9ef7dc
			"--color-primary-100": "206 252 239", // #cefcef
			"--color-primary-50": "237 254 248", // #edfef8

			"--color-bg-950": "2 8 6", // #020806 (nearly black with emerald tint)
			"--color-bg-900": "4 12 10", // #040c0a (very dark emerald-tinted)
			"--color-bg-800": "8 20 16", // #081410 (dark emerald-tinted)
			"--color-bg-700": "12 30 24", // #0c1e18 (medium-dark)
			"--color-bg-600": "16 40 32", // #102820 (dark-medium)
			"--color-bg-500": "16 185 129", // #10b981 (emerald-500)
			"--color-bg-400": "52 211 153", // #34d399 (emerald-400)
			"--color-bg-300": "110 231 183", // #6ee7b7 (emerald-300)
			"--color-bg-200": "167 243 208", // #a7f3d0 (emerald-200)
			"--color-bg-100": "209 250 229", // #d1fae5 (emerald-100)
			"--color-bg-50": "236 253 245", // #ecfdf5 (emerald-50)
		},
		// Add future site themes here, e.g.:
		// ".site-cheerpx": { ... },
		// ".site-cheerp": { ... },
	});
});

const disabledCss = {
	pre: false,
	code: false,
	"pre code": false,
	"code::before": false,
	"code::after": false,
	"blockquote p:first-of-type::before": false,
	"blockquote p:last-of-type::after": false,
};

export default function makeConfig(): Config {
	return {
		content: [
			"./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
			"../../packages/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
		],
		theme: {
			extend: {
				fontFamily: {
					sans: [
						"Archivo", //English default
						"DM Sans",
						"Noto Sans",
						"Noto Sans JP", // Japanese default
						"Inter",
						"system-ui",
						"-apple-system",
						"BlinkMacSystemFont",
						"Segoe UI",
						"Roboto",
						"Helvetica Neue",
						"Arial",
						"Yu Gothic", // Japanese for windows users
						"Hiragino Sans", // Japanese for mac users
						"Noto Sans CJK JP", // Japanese for linux users
						"sans-serif",
					],
					mono: ["Monaspace Argon", "monospace"],
				},
				colors: {
					primary: {
						600: "rgb(var(--color-primary-600) / <alpha-value>)",
						500: "rgb(var(--color-primary-500) / <alpha-value>)",
						400: "rgb(var(--color-primary-400) / <alpha-value>)",
						300: "rgb(var(--color-primary-300) / <alpha-value>)",
						200: "rgb(var(--color-primary-200) / <alpha-value>)",
						100: "rgb(var(--color-primary-100) / <alpha-value>)",
						50: "rgb(var(--color-primary-50) / <alpha-value>)",
					},
					// Semantic background colors that adapt to site theme
					bg: {
						950: "rgb(var(--color-bg-950) / <alpha-value>)",
						900: "rgb(var(--color-bg-900) / <alpha-value>)",
						800: "rgb(var(--color-bg-800) / <alpha-value>)",
						700: "rgb(var(--color-bg-700) / <alpha-value>)",
						600: "rgb(var(--color-bg-600) / <alpha-value>)",
						500: "rgb(var(--color-bg-500) / <alpha-value>)",
						400: "rgb(var(--color-bg-400) / <alpha-value>)",
						300: "rgb(var(--color-bg-300) / <alpha-value>)",
						200: "rgb(var(--color-bg-200) / <alpha-value>)",
						100: "rgb(var(--color-bg-100) / <alpha-value>)",
						50: "rgb(var(--color-bg-50) / <alpha-value>)",
					},
					cheerp: "#56f4ec",
					cheerpx: "#3b516d",
					blurple: "#5865F2", // https://discord.com/branding
				},
				typography: (theme: PluginAPI["theme"]) => ({
					stone: {
						css: {
							// Use CSS variables for consistency
							"--tw-prose-links": "rgb(var(--color-primary-500))",
							"--tw-prose-invert-links": "rgb(var(--color-primary-400))",
						},
					},
					browserpod: {
						css: {
							// Use CSS variables for consistency
							"--tw-prose-links": "rgb(var(--color-primary-500))",
							"--tw-prose-invert-links": "rgb(var(--color-primary-400))",
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
			require("@tailwindcss/typography"),
			exportColorsAsCssVariables,
			siteThemes,
		],
		darkMode: "class",
	};
}
