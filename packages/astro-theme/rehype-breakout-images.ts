import { visit } from "unist-util-visit";

// Adds `breakout` to paragraphs holding only an image (optionally linked).
export function rehypeBreakoutImages() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName !== "p") return;
			const children = node.children.filter(
				(child) => !(child.type === "text" && child.value.trim() === "")
			);
			if (children.length !== 1) return;
			const only = children[0];
			const isImage = (n) => n.type === "element" && n.tagName === "img";
			const isLinkedImage =
				only.type === "element" &&
				only.tagName === "a" &&
				only.children.length === 1 &&
				isImage(only.children[0]);
			if (!isImage(only) && !isLinkedImage) return;
			const className = node.properties.className ?? [];
			node.properties.className = [...className, "breakout"];
		});
	};
}
