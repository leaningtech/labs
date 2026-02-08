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
		// Default theme (pink/red) - using RGB values for opacity support
		":root": {
			"--color-primary-600": "230 39 85", // #e62755
			"--color-primary-500": "232 61 102", // #e83d66
			"--color-primary-400": "235 82 119", // #eb5277
			"--color-primary-300": "240 125 153", // #f07d99
			"--color-primary-200": "245 169 187", // #f5a9bb
			"--color-primary-100": "250 212 221", // #fad4dd
			"--color-primary-50": "253 233 238", // #fde9ee
		},
		// BrowserPod theme (teal)
		".site-browserpod": {
			"--color-primary-600": "17 158 123", // #119e7b (darker, more saturated)
			"--color-primary-500": "35 201 159", // #23c99f (medium-dark)
			"--color-primary-400": "58 229 179", // #3ae5b3 (Browserpod logo)
			"--color-primary-300": "104 239 199", // #68efc7 (lighter)
			"--color-primary-200": "158 247 220", // #9ef7dc (very light)
			"--color-primary-100": "206 252 239", // #cefcef (pale)
			"--color-primary-50": "237 254 248", // #edfef8 (almost white)
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
					cheerp: "#56f4ec",
					cheerpx: "#3b516d",
					blurple: "#5865F2", // https://discord.com/branding
				},
				typography: (theme: PluginAPI["theme"]) => ({
					stone: {
						css: {
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