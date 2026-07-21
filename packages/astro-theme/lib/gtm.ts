import type { ProductData } from "./products";

// GTM container per product. Products without an entry don't load GTM.
const containers: Partial<Record<ProductData["id"], string>> = {
	browserpod: "GTM-M4T2J9TS",
	cheerpj3: "GTM-WXJ325GT",
};

export function gtmContainerId(
	product: ProductData | undefined
): string | undefined {
	return product && containers[product.id];
}
