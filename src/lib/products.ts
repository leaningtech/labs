import { isProduct, type Product } from "./nav";

import cheerpLogotype from "../assets/branding/products/cheerp/logotype-white.svg";
import cheerpjLogotype from "../assets/branding/products/cheerpj/logotype-white.svg";
import cheerpxLogotype from "../assets/branding/products/cheerpx/logotype-white.svg";

export interface ProductData {
	id: string;
	name: string;
	href: string;
	logotype: string;
	subtitle: string;
	description: string;
}

export const products: {[product in Product]: ProductData} = {
	cheerp: {
		id: "cheerp",
		name: "Cheerp",
		href: "/cheerp",
		logotype: cheerpLogotype,
		subtitle: "Compile C++ for the browser",
		description: "C/C++ compiler targeting WebAssembly and JavaScript.",
	},
	cheerpj: {
		id: "cheerpj",
		name: "CheerpJ",
		href: "/cheerpj",
		logotype: cheerpjLogotype,
		subtitle: "Run Java in the browser",
		description: "Java Virtual Machine (JVM) replacement for the browser.",
	},
	cheerpx: {
		id: "cheerpx",
		name: "CheerpX",
		href: "/cheerpx",
		logotype: cheerpxLogotype,
		subtitle: "x86-to-WebAssembly virtualization",
		description:
			"Execute x86 binaries in the browser with the CheerpX virtual machine.",
	},
};

export function productFromUrl(url: URL): ProductData | undefined {
	// /cheerp/... -> cheerp
	const path = url.pathname.split("/")[1];
	if (path && isProduct(path)) {
		return products[path];
	}
	return undefined;
}
