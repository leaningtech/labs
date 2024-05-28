import {
	findNavDirectory,
	getRootNav,
	isProduct,
	type NavDirectory,
	type Product,
} from "./nav";

import cheerpLogotype from "../assets/branding/products/cheerp/logotype-white.svg";
import cheerpjLogotype from "../assets/branding/products/cheerpj/logotype-white.svg";
import cheerpxLogotype from "../assets/branding/products/cheerpx/logotype-white.svg";
import jnlprunnerLogotype from "../assets/branding/products/cheerpj-extensions/jnlp-logo.png";
import appletrunnerLogotype from "../assets/branding/products/cheerpj-extensions/applet-logo.png";

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
		href: "/cheerp",
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
		href: "/cheerpj2",
		logotype: cheerpjLogotype,
		favicon: "/cheerpj2/favicon.ico",
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
		href: "/cheerpj3",
		logotype: cheerpjLogotype,
		favicon: "/cheerpj2/favicon.ico",
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
		href: "/cheerpx",
		logotype: cheerpxLogotype,
		favicon: "/cheerpx/favicon.ico",
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
		href: "/cheerpx-for-flash",
		logotype: cheerpxLogotype,
		favicon: "/cheerpx/favicon.ico",
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
		href: "/cheerpj-jnlp-runner",
		logotype: jnlprunnerLogotype,
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
		href: "/cheerpj3/getting-started/Java-applet#running-a-public-applet",
		logotype: appletrunnerLogotype,
		favicon: "/cheerpj2/favicon.ico",
		subtitle: "Run Java Applets in the modern browser",
		description: "Run Java Applets in modern browsers without plugins",
		github: "https://github.com/leaningtech/cheerpj-applet-runner",
		repositoryName: "cheerpj-applet-runner",
	},
};

export function productFromUrl(url: URL): ProductData | undefined {
	const path = url.pathname.split("/")[1]?.replace(".html", "");
	if (path && isProduct(path)) {
		return products[path];
	}
	return undefined;
}

export async function getProductNav(productId: Product): Promise<NavDirectory> {
	const root = await getRootNav();
	const directory = findNavDirectory(root, [productId]);
	if (!directory)
		throw new Error(`no nav directory found for product ${productId}`);
	return directory;
}
