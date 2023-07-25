/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Element {
	// Non-standard. Not supported on Firefox.
	// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded
	scrollIntoViewIfNeeded(centerIfNeeded?: boolean): void;
}
