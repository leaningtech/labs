import { isProduct, type Product } from "./nav";

import cheerpLogotype from "../assets/branding/products/cheerp/logotype-white.svg";
import cheerpjLogotype from "../assets/branding/products/cheerpj/logotype-white.svg";
import cheerpxLogotype from "../assets/branding/products/cheerpx/logotype-white.svg";
import jnlprunnerLogotype from "../assets/branding/products/cheerpj-extensions/jnlp-logo.png";
import jnlprunnerLogotypeLarge from "../assets/branding/products/cheerpj-extensions/cheerpj-jnlprunner-large.png";
import appletrunnerLogotype from "../assets/branding/products/cheerpj-extensions/applet-logo.png";
import appletrunnerLogotypeLarge from "../assets/branding/products/cheerpj-extensions/cheerpj-appletrunner-large.png";
import gamesrunnerLogotypeLarge from "../assets/branding/products/cheerpx-extensions/cheerpx-gamesrunner-white.png";

let baseWithSlash = import.meta.env.BASE_URL;
if (!baseWithSlash.endsWith("/")) {
	baseWithSlash += "/";
}

export interface ProductData {
	id: Product;
	type: "technology" | "extension" | "tool" | "extension-beta";
	name: string;
	href: string;
	logotype: ImageMetadata;
	favicon: string;
	subtitle: string;
	description: string;
	github: string;
	repositoryName: string;
}

export const products: { [product in Product]: ProductData } = {
	cheerp: {
		id: "cheerp",
		type: "technology",
		name: "Cheerp",
		href: "https://cheerp.io",
		logotype: cheerpLogotype,
		favicon: "/cheerp/favicon.ico",
		subtitle: "How C++ engineers build web applications",
		description:
			"Cheerp is an enterprise-grade compiler toolchain that can compile C/C++ into efficient WebAssembly and JavaScript. It is open source, liberally licensed, and actively developed by Leaning Technologies.",
		github: "https://github.com/leaningtech/cheerp-meta",
		repositoryName: "cheerp-meta",
	},
	cheerpj2: {
		id: "cheerpj2",
		type: "technology",
		name: "CheerpJ",
		href: "/docs/cheerpj2",
		logotype: cheerpjLogotype,
		favicon: baseWithSlash + "cheerpj2/favicon.ico",
		subtitle: "Java Virtual Machine replacement for the browser",
		description:
			"Run Java 8 applications, libraries, applets, Java Web Start, and Oracle Forms on the web without legacy plugins.",
		github: "https://github.com/leaningtech/cheerpj-meta",
		repositoryName: "cheerpj-meta",
	},
	cheerpj3: {
		id: "cheerpj3",
		type: "technology",
		name: "CheerpJ",
		href: "https://cheerpj.com",
		logotype: cheerpjLogotype,
		favicon: baseWithSlash + "cheerpj3/favicon.ico",
		subtitle: "Java Virtual Machine for modern web browsers",
		description:
			"Run Java 8 applications, libraries, applets, Java Web Start, and Oracle Forms on the web without legacy plugins.",
		github: "https://github.com/leaningtech/cheerpj-meta",
		repositoryName: "cheerpj-meta",
	},
	cheerpx: {
		id: "cheerpx",
		type: "technology",
		name: "CheerpX",
		href: "https://cheerpx.io",
		logotype: cheerpxLogotype,
		favicon: baseWithSlash + "cheerpx/favicon.ico",
		subtitle: "Virtual machines in your web app",
		description:
			"CheerpX is a JavaScript library that enables secure client-side execution of x86 binaries on any browser. Coming soon.",
		github: "https://github.com/leaningtech/webvm", // TODO
		repositoryName: "webvm",
	},
	"cheerpx-for-flash": {
		id: "cheerpx-for-flash",
		type: "technology",
		name: "CheerpX for Flash",
		href: "/docs/cheerpx-for-flash",
		logotype: cheerpxLogotype,
		favicon: baseWithSlash + "cheerpx/favicon.ico",
		subtitle: "Run Flash content without the Adobe Flash plugin",
		description:
			"An HTML5 Flash emulator that allows your Flash content to run seamlessly on browsers, after the end of life of the Flash player.",
		github: "https://github.com/leaningtech/cheerpx-flash",
		repositoryName: "cheerpx-flash",
	},
	"cheerpj-jnlp-runner": {
		id: "cheerpj-jnlp-runner",
		type: "extension",
		name: "CheerpJ JNLP Runner",
		href: "/docs/cheerpj-jnlp-runner",
		logotype: jnlprunnerLogotypeLarge,
		favicon: jnlprunnerLogotype.src,
		subtitle: "Run Java Web Start applications in the browser",
		description:
			"Run Java Web Start Applications without a Java Desktop installation.",
		github: "https://github.com/leaningtech/cheerpj-jnlp-runner",
		repositoryName: "cheerpj-jnlp-runner",
	},
	"cheerpj-applet-runner": {
		id: "cheerpj-applet-runner",
		type: "extension",
		name: "CheerpJ Applet Runner",
		href: "/docs/cheerpj-applet-runner",
		logotype: appletrunnerLogotypeLarge,
		favicon: appletrunnerLogotype.src,
		subtitle: "Run Java Applets in the modern browser",
		description: "Run Java Applets in modern browsers without plugins",
		github: "https://github.com/leaningtech/cheerpj-applet-runner",
		repositoryName: "cheerpj-applet-runner",
	},
	"cheerpx-games-runner": {
		id: "cheerpx-games-runner",
		type: "extension-beta",
		name: "CheerpX Games Runner",
		href: "https://cheerpx.io",
		logotype: gamesrunnerLogotypeLarge,
		favicon: baseWithSlash + "cheerpx/favicon.ico",
		subtitle: "Run Games in the modern browser",
		description: "Run Games in the modern browser",
		github: "https://github.com/leaningtech/cheerpx-games-runner",
		repositoryName: "cheerpx-games-runner",
	},
};

export function productFromUrl(url: URL): ProductData | undefined {
	// Use site from astro config if possible
	switch (import.meta.env.SITE) {
		case "https://cheerp.io":
			return products.cheerp;
		case "https://cheerpj.com":
			return products.cheerpj3;
		case "https://cheerpx.io":
			return products.cheerpx;
	}

	// Fallback for labs
	// /docs/[PRODUCT]/
	const path = url.pathname.split("/")[2]?.replace(".html", "");
	if (path && isProduct(path)) {
		return products[path];
	}
	return undefined;
}
