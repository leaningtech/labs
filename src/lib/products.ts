import { isProduct, type Product } from "./nav";

import cheerpLogotype from "../assets/branding/products/cheerp/logotype-white.svg";
import cheerpjLogotype from "../assets/branding/products/cheerpj/logotype-white.svg";
import cheerpxLogotype from "../assets/branding/products/cheerpx/logotype-white.svg";

export interface ProductData {
	id: string;
	name: string;
	href: string;
	logotype: string;
	favicon: string;
	subtitle: string;
	description: string;
}

export const products: {[product in Product]: ProductData} = {
	cheerp: {
		id: "cheerp",
		name: "Cheerp",
		href: "/cheerp",
		logotype: cheerpLogotype,
		favicon: "/cheerp/favicon.ico",
		subtitle: "Compile C++ for the browser",
		description: "C/C++ compiler targeting WebAssembly and JavaScript.",
	},
	cheerpj2: {
		id: "cheerpj2",
		name: "CheerpJ 2",
		href: "/cheerpj2",
		logotype: cheerpjLogotype,
		favicon: "/cheerpj2/favicon.ico",
		subtitle: "Run Java in the browser",
		description: "Compile Java bytecode to WebAssembly and JavaScript.",
	},
	cheerpj3: {
		id: "cheerpj3",
		name: "CheerpJ 3",
		href: "/cheerpj3",
		logotype: cheerpjLogotype,
		favicon: "/cheerpj2/favicon.ico",
		subtitle: "Run JAR files and Java applets on the web",
		description: "Java Virtual Machine (JVM) replacement",
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
	},
};

export function productFromUrl(url: URL): ProductData | undefined {
	const path = url.pathname.split("/")[1];
	if (path && isProduct(path)) {
		return products[path];
	}
	return undefined;
}
