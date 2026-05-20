<script lang="ts">
	import { onMount } from "svelte";

	const TAGS = ["Cheerp", "CheerpJ", "CheerpX", "BrowserPod"] as const;

	let selected = $state("");

	function applyFilter() {
		const items = document.querySelectorAll<HTMLElement>("[data-tags]");
		items.forEach((item) => {
			const tags = item.dataset.tags ? item.dataset.tags.split(",") : [];
			item.style.display = !selected || tags.includes(selected) ? "" : "none";
		});

		// Re-apply showcase grid borders after items are shown/hidden
		const showcaseList = document.querySelector<HTMLElement>(
			'[data-filter-grid="showcase"]'
		);
		if (showcaseList) {
			const allItems = [
				...showcaseList.querySelectorAll<HTMLElement>("li"),
			];
			const visibleItems = allItems.filter(
				(li) => li.style.display !== "none"
			);

			allItems.forEach((li) =>
				li.classList.remove("md:border-r", "md:border-t")
			);
			visibleItems.forEach((li, i) => {
				if (i % 2 === 0) li.classList.add("md:border-r");
				if (i >= 2) li.classList.add("md:border-t");
			});
		}
	}

	function select(tag: string) {
		selected = selected === tag ? "" : tag;
		const params = new URLSearchParams(window.location.search);
		if (selected) {
			params.set("product", selected);
		} else {
			params.delete("product");
		}
		const search = params.toString();
		history.replaceState(
			null,
			"",
			search
				? `${window.location.pathname}?${search}`
				: window.location.pathname
		);
		applyFilter();
	}

	onMount(() => {
		selected = new URLSearchParams(window.location.search).get("product") ?? "";
		applyFilter();
	});
</script>

<div class="flex gap-2 flex-wrap mb-8">
	<button
		onclick={() => select("")}
		class="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer {!selected
			? 'bg-white text-bg-900 border-white'
			: 'text-bg-400 border-bg-700 hover:border-bg-500 hover:text-white'}"
	>
		All
	</button>
	{#each TAGS as tag}
		<button
			onclick={() => select(tag)}
			class="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer {selected ===
			tag
				? 'bg-white text-bg-900 border-white'
				: 'text-bg-400 border-bg-700 hover:border-bg-500 hover:text-white'}"
		>
			{tag}
		</button>
	{/each}
</div>
