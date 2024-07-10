<script lang="ts">
	export let result: PagefindResult;

	const showExcerpt = false; // Makes the UI quite busy.

	// Based on thin_sub_results from https://github.com/CloudCannon/pagefind/blob/main/pagefind_ui/default/svelte/result_with_subs.svelte
	function thinSubResults(
		pageUrl: string,
		results: PagefindSubResult[],
		limit: number,
	) {
		results = results.filter((r) => r.url !== pageUrl);

		if (results.length <= limit) {
			return results;
		}

		const topResults = [...results]
			.sort((a, b) => b.locations.length - a.locations.length)
			.slice(0, 3)
			.map((r) => r.url);

		return results.filter((r) => topResults.includes(r.url));
	}

	const data = result.data().then((data) => {
		data.sub_results = thinSubResults(data.url, data.sub_results, 3);
		return data;
	});
</script>

{#await data}
	<li
		class="rounded-md bg-stone-900 py-3 px-4 text-transparent text-lg animate-pulse"
	>
		Loading...
	</li>
{:then document}
	<li class="rounded-md bg-stone-900">
		<a
			href={document.url}
			class="rounded-t-md block border border-transparent hover:border-stone-500 py-3 px-4 text-lg"
			class:rounded-b-md={document.sub_results.length <= 1}
		>
			<div class="whitespace-nowrap text-ellipsis overflow-hidden">
				{document.meta.title}
			</div>
			{#if showExcerpt}
				<div
					class="excerpt text-xs text-stone-400 font-normal whitespace-nowrap text-ellipsis overflow-hidden"
				>
					{@html document.excerpt}
				</div>
			{/if}
		</a>
		<ol class="text-base">
			{#each document.sub_results as subResult, i}
				<li>
					<a
						href={subResult.url}
						class="block border border-transparent hover:border-stone-500 text-stone-300 py-2 px-4 whitespace-nowrap text-ellipsis overflow-hidden"
						class:rounded-b-md={i === document.sub_results.length - 1}
					>
						{subResult.title}
					</a>
				</li>
			{/each}
		</ol>
	</li>
{/await}

<style>
	.excerpt :global(mark) {
		background-color: transparent;
		color: inherit;
		font-weight: bold;
	}
</style>
