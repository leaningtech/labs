<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import Result from "./Result.svelte";

	export let productId: string | undefined;

	let pagefind: Pagefind;
	let results: PagefindResult[] = [];
	let noResultsForQuery = false;

	onMount(async () => {
		// Vite and TypeScript hate imports from actual URLs, so we need to perform dark magic to load pagefind.
		const url = new URL(window.origin + "/pagefind/pagefind.js").href; // Can't use import.meta.url because Vite prefixes the module with /@fs.
		// @ts-ignore
		const pf = await import(/* @vite-ignore */ url);
		await pf.init();
		pagefind = pf;
	});

	onDestroy(async () => {
		await pagefind?.destroy();
	});

	async function search(event: Event) {
		if (!pagefind) {
			console.warn("Search requested but Pagefind not yet loaded.");
			return;
		}

		const query = (event.target as HTMLInputElement).value;

		const response = await pagefind.debouncedSearch(query, {
			filters: { productId },
			baseUrl: import.meta.env.BASE_URL,
		});
		if (response === null) {
			// Debounce.
			return;
		}

		results = response.results;
		noResultsForQuery = query.length > 0 && results.length === 0;

		plausible("Search", {
			props: { query, resultsCount: results.length, productId },
		});
	}
</script>

<search class="block m-3 relative">
	<div class="absolute top-[50%] translate-y-[-50%] left-4 pointer-events-none">
		<!-- fa-solid:search icon -->
		<svg viewBox="0 0 512 512" class="w-4 h-4 mr-0.5 text-white"
			><path
				fill="currentColor"
				d="M505 442.7 405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
			></path>
		</svg>
	</div>
	<input
		type="search"
		placeholder="Type to search..."
		class="w-full text-lg pl-10 pr-4 py-3 rounded-md border border-stone-700 outline-none bg-stone-900 text-white placeholder-stone-400"
		on:input={search}
	/>
</search>

<output
	class="block m-3 text-left text-base font-medium text-stone-100 overflow-y-auto h-96"
>
	{#if noResultsForQuery}
		<slot name="no-results" />
	{:else}
		<ol class="flex flex-col gap-2">
			{#each results as result (result.id)}
				<Result {result} />
			{/each}
		</ol>
	{/if}
</output>
