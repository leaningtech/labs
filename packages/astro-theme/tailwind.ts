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
		// Default theme (pink/red + neutral backgrounds)
		":root": {
			// Primary colors
			"--color-primary-600": "230 39 85",
			"--color-primary-500": "232 61 102",
			"--color-primary-400": "235 82 119",
			"--color-primary-300": "240 125 153",
			"--color-primary-200": "245 169 187",
			"--color-primary-100": "250 212 221",
			"--color-primary-50": "253 233 238",

			// Background colors - Neutral palette
			"--color-bg-950": "10 10 10",
			"--color-bg-900": "23 23 23",
			"--color-bg-800": "38 38 38",
			"--color-bg-700": "64 64 64",
			"--color-bg-600": "82 82 82",
			"--color-bg-500": "115 115 115",
			"--color-bg-400": "163 163 163",
			"--color-bg-300": "212 212 212",
			"--color-bg-200": "229 229 229",
			"--color-bg-100": "245 245 245",
			"--color-bg-50": "250 250 250",
		},
		// BrowserPod theme
		".site-browserpod": {
			"--color-primary-600": "17 158 123",
			"--color-primary-500": "35 201 159",
			"--color-primary-400": "58 229 179",
			"--color-primary-300": "104 239 199",
			"--color-primary-200": "158 247 220",
			"--color-primary-100": "206 252 239",
			"--color-primary-50": "237 254 248",
		},
		// CheerpJ theme
		".site-cheerpj": {
			"--color-primary-600": "194 98 3",
			"--color-primary-500": "219 110 4",
			"--color-primary-400": "243 123 4",
			"--color-primary-300": "247 148 56",
			"--color-primary-200": "251 179 115",
			"--color-primary-100": "253 215 179",
			"--color-primary-50": "254 239 229",
		},
		// Cheerp theme
		".site-cheerp": {
			"--color-primary-600": "41 174 165",
			"--color-primary-500": "46 196 186",
			"--color-primary-400": "81 218 206",
			"--color-primary-300": "121 229 219",
			"--color-primary-200": "168 240 233",
			"--color-primary-100": "209 248 245",
			"--color-primary-50": "237 252 251",
		},
		// CheerpX theme (bright blue)
		".site-cheerpx": {
			"--color-primary-600": "41 98 159", // #29629f (darker, saturated blue)
			"--color-primary-500": "59 130 246", // #3b82f6 (bright blue-500)
			"--color-primary-400": "96 165 250", // #60a5fa (bright blue-400)
			"--color-primary-300": "147 197 253", // #93c5fd (light blue)
			"--color-primary-200": "191 219 254", // #bfdbfe (very light)
			"--color-primary-100": "219 234 254", // #dbeafe (pale)
			"--color-primary-50": "239 246 255", // #eff6ff (almost white)
		},
		// Labs theme
		".site-labs": {
			"--color-primary-600": "230 39 85",
			"--color-primary-500": "232 61 102",
			"--color-primary-400": "235 82 119",
			"--color-primary-300": "240 125 153",
			"--color-primary-200": "245 169 187",
			"--color-primary-100": "250 212 221",
			"--color-primary-50": "253 233 238",
		},
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
						"Archivo",
						"DM Sans",
						"Noto Sans",
						"Noto Sans JP",
						"Inter",
						"system-ui",
						"-apple-system",
						"BlinkMacSystemFont",
						"Segoe UI",
						"Roboto",
						"Helvetica Neue",
						"Arial",
						"Yu Gothic",
						"Hiragino Sans",
						"Noto Sans CJK JP",
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
					blurple: "#5865F2",
				},
				typography: {
					DEFAULT: {
						css: {
							...disabledCss,
							"--tw-prose-links": "rgb(var(--color-primary-500))",
							"--tw-prose-invert-links": "rgb(var(--color-primary-400))",
							a: {
								color: "rgb(var(--color-primary-500))",
								"&:hover": {
									color: "rgb(var(--color-primary-400))",
								},
							},
							".dark a": {
								color: "rgb(var(--color-primary-400))",
								"&:hover": {
									color: "rgb(var(--color-primary-300))",
								},
							},
						},
					},
					sm: { css: disabledCss },
					lg: { css: disabledCss },
					xl: { css: disabledCss },
					"2xl": { css: disabledCss },
				},
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
