import { isProduct, type Product } from "./nav";

import cheerpLogotype from "../assets/branding/products/cheerp/logotype-white.svg";
import cheerpjLogotype from "../assets/branding/products/cheerpj/logotype-white.svg";
import cheerpxLogotype from "../assets/branding/products/cheerpx/logotype-white.svg";
import jnlprunnerLogotype from "../assets/branding/products/cheerpj-extensions/jnlp-logo.png";
import jnlprunnerLogotypeLarge from "../assets/branding/products/cheerpj-extensions/cheerpj-jnlprunner-large.png";
import appletrunnerLogotypeLarge from "../assets/branding/products/cheerpj-extensions/cheerpj-appletrunner-large.png";

export interface ProductData {
	id: Product;
	type: "technology" | "extension" | "tool";
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
		subtitle: "Compile C++ for the browser",
		description: "C/C++ compiler targeting WebAssembly and JavaScript.",
		github: "https://github.com/leaningtech/cheerp-meta",
		repositoryName: "cheerp-meta",
	},
	cheerpj2: {
		id: "cheerpj2",
		type: "technology",
		name: "CheerpJ",
		href: "/docs/cheerpj2",
		logotype: cheerpjLogotype,
		favicon: import.meta.env.BASE_URL + "cheerpj2/favicon.ico",
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
		favicon: import.meta.env.BASE_URL + "cheerpj3/favicon.ico",
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
		favicon: import.meta.env.BASE_URL + "cheerpx/favicon.ico",
		subtitle: "x86-to-WebAssembly virtualization",
		description:
			"Execute native binaries in the browser with the CheerpX virtual machine.",
		github: "https://github.com/leaningtech/webvm", // TODO
		repositoryName: "webvm",
	},
	"cheerpx-for-flash": {
		id: "cheerpx-for-flash",
		type: "technology",
		name: "CheerpX for Flash",
		href: "/docs/cheerpx-for-flash",
		logotype: cheerpxLogotype,
		favicon: import.meta.env.BASE_URL + "cheerpx/favicon.ico",
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
		favicon: "/cheerpj2/favicon.ico",
		subtitle: "Run Java Applets in the modern browser",
		description: "Run Java Applets in modern browsers without plugins",
		github: "https://github.com/leaningtech/cheerpj-applet-runner",
		repositoryName: "cheerpj-applet-runner",
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
