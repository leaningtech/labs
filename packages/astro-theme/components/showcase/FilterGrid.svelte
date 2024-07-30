<script>
	import Grid from './Grid.svelte';
	import FilterGroup from './FilterGroup.svelte';
	import Filter from "./Filter.svelte";

	export let items; // data of showcase content collection
	export let enableTechnologyFilterGroup;

	let searchQuery, cheerp, cheerpj, cheerpx, liveDemo, openSource;
	function clearFilters() {
		searchQuery = '';
		cheerp = false;
		cheerpj = false;
		cheerpx = false;
		liveDemo = false;
		openSource = false;
	}
	clearFilters();

	$: hasFilters = searchQuery.length > 0 || cheerp || cheerpj || cheerpx || liveDemo || openSource;
	$: filteredItems = items.filter(item => {
		return item.title.toLowerCase().includes(searchQuery.toLowerCase())
			&& (!cheerp || item.tags.includes("Cheerp"))
			&& (!cheerpj || item.tags.includes("CheerpJ"))
			&& (!cheerpx || item.tags.includes("CheerpX"))
			&& (!liveDemo || item.url)
			&& (!openSource || item.sourceCode);
	});
</script>

<div class="grid grid-cols-9 text-sm">
	<aside class="col-span-2 px-10">
		<h2 class="text-lg font-semibold pb-4 flex items-center justify-between">
			Filters
			<button on:click={clearFilters} class="text-sm font-normal px-3 py-1.5 border border-stone-700 rounded-lg" class:opacity-0={!hasFilters}>Clear</button>
		</h2>
	
		<input
			type="search" 
			placeholder="Search…"
			aria-label="Search" aria-invalid="false" autocapitalize="none" autocomplete="off" autocorrect="off"
			bind:value={searchQuery}
			class="px-3 py-2 border border-stone-700 rounded-lg w-full bg-stone-900 placeholder-stone-500"
		/>

		<div class="mt-4 border-b border-stone-800">
			{#if enableTechnologyFilterGroup}
				<FilterGroup title="Technology">
					<Filter bind:checked={cheerp}>Cheerp</Filter>
					<Filter bind:checked={cheerpj}>CheerpJ</Filter>
					<Filter bind:checked={cheerpx}>CheerpX</Filter>
				</FilterGroup>
			{/if}
			<FilterGroup title="Type">
				<Filter bind:checked={liveDemo}>Live demo</Filter>
				<Filter>Case study</Filter>
				<Filter bind:checked={openSource}>Open source</Filter>
			</FilterGroup>
		</div>
	</aside>
	<div class="col-span-7">
		{#if filteredItems.length === 0}
		<p class="rounded-lg border border-stone-800 py-10 px-6 text-center text-lg">
			No search results found. Try adjusting your filters.
		</p>
		{:else}
			<Grid items={filteredItems} />
		{/if}
	</div>
</div>
