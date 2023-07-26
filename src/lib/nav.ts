import { getCollection, type CollectionEntry } from "astro:content";

/** Navigation group. */
export interface Group {
	title: string;
	entries: CollectionEntry<"cheerp">[];
}

/** https://diataxis.fr */
export type Mode = "guides" | "tutorials" | "reference" | "explanation";

export type Product = "cheerp";

export function isMode(value: unknown): value is Mode {
	return value === "guides" || value === "tutorials" || value === "reference";
}

export function isProduct(value: unknown): value is Product {
	return value === "cheerp";
}

/** Sorts a collection into an array of groups, by subdirectory. */
export function calcCollectionGroups(
	collection: CollectionEntry<"cheerp">[],
): Group[] {
	// Group entries by directory
	const groups: { [directory: string]: Group } = {};
	for (const entry of collection) {
		const directory = entry.id.split("/")[1];
		if (!directory) throw new Error("no directory");
		if (!groups[directory]) {
			groups[directory] = {
				title: idToTitle(directory),
				entries: [],
			};
		}
		groups[directory]!.entries.push(entry);
	}

	// Sort entries
	for (const group of Object.values(groups)) {
		group.entries.sort((a, b) => {
			return a.id.localeCompare(b.id);
		});
	}

	// Convert to array
	const groupsArr = Object.entries(groups);
	groupsArr.sort((a, b) => {
		return a[0].localeCompare(b[0]);
	});
	return groupsArr.map(([, group]) => group);
}

// 00-my-dir/00-my-page.md -> My page
export function idToTitle(id: string): string {
	// Get last component
	const components = id.split("/");
	let filename = components[components.length - 1] ?? id;

	// Strip extension
	const dotIndex = filename.lastIndexOf(".");
	if (dotIndex !== -1) {
		filename = filename.slice(0, dotIndex);
	}

	// Remove leading numbers
	filename = filename.replace(/^\d+-/, "");

	// Convert to sentence case
	const [firstWord, ...words] = filename.split("-");
	if (!firstWord) throw new Error(`id ${id} is empty (has no first word)`);
	const upperFirstWord = firstWord[0]?.toUpperCase() + firstWord.slice(1);
	return [upperFirstWord, ...words].join(" ");
}

export async function getCollectionGroupsByMode(
	product: Product,
	mode: Mode,
): Promise<Group[]> {
	const collection = await getCollection(
		product,
		({ id }) => id.split("/")[0] === mode,
	);
	return calcCollectionGroups(collection);
}
