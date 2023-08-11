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

type PlausibleEvent = "pageview" | "404";
