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
						600: "#e62755",
						500: "#e83d66",
						400: "#eb5277",
						300: "#f07d99",
						200: "#f5a9bb",
						100: "#fad4dd",
						50: "#fde9ee",
					},
					cheerp: "#56f4ec",
					cheerpx: "#3b516d",
					blurple: "#5865F2", // https://discord.com/branding
				},
				typography: (theme: PluginAPI["theme"]) => ({
					stone: {
						css: {
							"--tw-prose-links": theme("colors.cheerp"),
							"--tw-prose-invert-links": theme("colors.primary[400]"),
							lineHeight: "1.75",
							p: {
								marginTop: "1.2em",
								marginBottom: "1.2em",
							},
							h1: {
								marginTop: "0",
								marginBottom: "0.8em",
								lineHeight: "1.2",
							},
							h2: {
								marginTop: "2em",
								marginBottom: "0.8em",
								lineHeight: "1.25",
							},
							h3: {
								marginTop: "1.6em",
								marginBottom: "0.6em",
								lineHeight: "1.3",
							},
							h4: {
								marginTop: "1.4em",
								marginBottom: "0.6em",
								lineHeight: "1.35",
							},
							"ul,ol": {
								marginTop: "1.2em",
								marginBottom: "1.2em",
							},
							li: {
								marginTop: "0.4em",
								marginBottom: "0.4em",
							},
							blockquote: {
								marginTop: "1.6em",
								marginBottom: "1.6em",
								paddingLeft: "1em",
								borderLeftWidth: "2px",
								borderLeftColor: theme("colors.stone[700]"),
							},
							pre: {
								marginTop: "1.6em",
								marginBottom: "1.6em",
								borderRadius: "0.75rem",
								border: `1px solid ${theme("colors.stone[800]")}`,
								padding: "1.1em 1.3em",
							},
							code: {
								fontWeight: "500",
							},
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
		plugins: [require("@tailwindcss/typography"), exportColorsAsCssVariables],
		darkMode: "class",
	};
}
