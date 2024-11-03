/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Element {
	// Non-standard. Not supported on Firefox.
	// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded
	scrollIntoViewIfNeeded(centerIfNeeded?: boolean): void;
}

interface Window {
	plausible: (event: PlausibleEvent, options?: any) => void;
}

declare function plausible(event: PlausibleEvent, options?: any): void;

type PlausibleEvent =
	| "pageview"
	| "404"
	| "HelpfulYes"
	| "HelpfulNo"
	| "Search";

interface Pagefind {
	init: () => Promise<void>;
	destroy: () => Promise<void>;
	search: (
		query: string | null,
		options?: PagefindSearchOptions
	) => Promise<PagefindResponse>;
	debouncedSearch: (
		query: string | null,
		options?: PagefindSearchOptions
	) => Promise<PagefindResponse>;
}

interface PagefindSearchOptions {
	filters: { [key: string]: string | undefined };
}

interface PagefindResponse {
	results: PagefindResult[];
}

interface PagefindResult {
	id: string;
	data: () => Promise<PagefindDocument>;
}

interface PagefindDocument {
	url: string;
	excerpt: string;
	filters: {
		author: string;
	};
	meta: {
		title: string;
		image: string;
	};
	content: string;
	word_count: number;
	sub_results: PagefindSubResult[];
}

interface PagefindSubResult {
	title: string;
	url: string;
	excerpt: string;
	locations: number[];
}
