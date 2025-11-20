import { visit } from "unist-util-visit";

const replacements = {
	CX_LATEST: "1.2.2",
	BP_LATEST: "0.9.2",
};

export function remarkReplaceVars() {
	return (tree) => {
		visit(tree, ["text", "code", "inlineCode"], (node) => {
			if (node.value) {
				Object.entries(replacements).forEach(([key, value]) => {
					node.value = node.value.replaceAll(`%${key}%`, value);
				});
			}
		});
	};
}
export function rehypeReplaceVars() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.properties) {
				Object.entries(node.properties).forEach(([prop, val]) => {
					if (typeof val === "string") {
						Object.entries(replacements).forEach(([key, value]) => {
							node.properties[prop] = val.replaceAll(`%${key}%`, value);
						});
					}
				});
			}
		});
		visit(tree, "mdxJsxFlowElement", (node) => {
			if (node.attributes) {
				Object.entries(node.attributes).forEach(([idx, attr]) => {
					if (typeof attr.value === "string") {
						Object.entries(replacements).forEach(([key, value]) => {
							attr.value = attr.value.replaceAll(`%${key}%`, value);
						});
					}
				});
			}
		});
		visit(tree, "text", (node) => {
			Object.entries(replacements).forEach(([key, value]) => {
				node.value = node.value.replaceAll(`%${key}%`, value);
			});
		});
	};
}
