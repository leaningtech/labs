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

export interface ProductData {
	id: Product;
	name: string;
	href: string;
	logotype: ImageMetadata;
	favicon: string;
	subtitle: string;
	description: string;
	github: string;
}

export const products: { [product in Product]: ProductData } = {
	cheerp: {
		id: "cheerp",
		name: "Cheerp",
		href: "/cheerp",
		logotype: cheerpLogotype,
		favicon: "/cheerp/favicon.ico",
		subtitle: "Compile C++ for the browser",
		description: "C/C++ compiler targeting WebAssembly and JavaScript.",
		github: "https://github.com/leaningtech/cheerp-meta",
	},
	cheerpj2: {
		id: "cheerpj2",
		name: "CheerpJ",
		href: "/cheerpj2",
		logotype: cheerpjLogotype,
		favicon: "/cheerpj2/favicon.ico",
		subtitle: "Java Virtual Machine replacement for the browser",
		description:
			"Run Java 8 applications, libraries, applets, Java Web Start, and Oracle Forms on the web without legacy plugins.",
		github: "https://github.com/leaningtech/cheerpj-meta",
	},
	cheerpj3: {
		id: "cheerpj3",
		name: "CheerpJ",
		href: "/cheerpj3",
		logotype: cheerpjLogotype,
		favicon: "/cheerpj2/favicon.ico",
		subtitle: "Java Virtual Machine for modern web browsers",
		description:
			"Run Java 8 applications, libraries, applets, Java Web Start, and Oracle Forms on the web without legacy plugins.",
		github: "https://github.com/leaningtech/cheerpj-meta",
	},
	cheerpx: {
		id: "cheerpx",
		name: "CheerpX",
		href: "/cheerpx",
		logotype: cheerpxLogotype,
		favicon: "/cheerpx/favicon.ico",
		subtitle: "x86-to-WebAssembly virtualization",
		description:
			"Execute native binaries in the browser with the CheerpX virtual machine.",
		github: "https://github.com/leaningtech/webvm", // TODO
	},
	"cheerpx-for-flash": {
		id: "cheerpx-for-flash",
		name: "CheerpX for Flash",
		href: "/cheerpx-for-flash",
		logotype: cheerpxLogotype,
		favicon: "/cheerpx/favicon.ico",
		subtitle: "Run Flash content without the Adobe Flash plugin",
		description:
			"An HTML5 Flash emulator that allows your Flash content to run seamlessly on browsers, after the end of life of the Flash player.",
		github: "https://github.com/leaningtech/cheerpx-flash",
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
