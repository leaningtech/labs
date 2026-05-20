<script lang="ts">
	import { onMount } from "svelte";

	const TAGS = ["Cheerp", "CheerpJ", "CheerpX", "BrowserPod"] as const;

	let selected = $state("");
	let searchQuery = $state("");
	let debounceTimer: ReturnType<typeof setTimeout>;

	function applyFilter() {
		const query = searchQuery.toLowerCase().trim();
		const items = document.querySelectorAll<HTMLElement>("[data-tags]");

		items.forEach((item) => {
			const tags = item.dataset.tags ? item.dataset.tags.split(",") : [];
			const matchesTag = !selected || tags.includes(selected);
			const matchesSearch =
				!query || (item.textContent?.toLowerCase().includes(query) ?? false);
			item.style.display = matchesTag && matchesSearch ? "" : "none";
		});

		reapplyBlogLayout();
		reapplyShowcaseBorders();
	}

	function reapplyBlogLayout() {
		const grid = document.querySelector<HTMLElement>(
			'[data-filter-grid="blog"]'
		);
		if (!grid) return;
		const allItems = [...grid.querySelectorAll<HTMLElement>("li")];
		const visibleItems = allItems.filter((li) => li.style.display !== "none");
		allItems.forEach((li) =>
			li.classList.remove("md:col-span-3", "md:col-span-2")
		);
		visibleItems.forEach((li, i) =>
			li.classList.add(i < 2 ? "md:col-span-3" : "md:col-span-2")
		);
	}

	function reapplyShowcaseBorders() {
		const list = document.querySelector<HTMLElement>(
			'[data-filter-grid="showcase"]'
		);
		if (!list) return;
		const allItems = [...list.querySelectorAll<HTMLElement>("li")];
		const visibleItems = allItems.filter((li) => li.style.display !== "none");
		allItems.forEach((li) =>
			li.classList.remove("md:border-r", "md:border-t")
		);
		visibleItems.forEach((li, i) => {
			if (i % 2 === 0) li.classList.add("md:border-r");
			if (i >= 2) li.classList.add("md:border-t");
		});
	}

	function selectTag(tag: string) {
		selected = selected === tag ? "" : tag;
		updateUrl();
		applyFilter();
	}

	function handleSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			updateUrl();
			applyFilter();
		}, 200);
	}

	function updateUrl() {
		const params = new URLSearchParams(window.location.search);
		if (selected) params.set("product", selected);
		else params.delete("product");
		if (searchQuery.trim()) params.set("q", searchQuery.trim());
		else params.delete("q");
		const search = params.toString();
		history.replaceState(
			null,
			"",
			search
				? `${window.location.pathname}?${search}`
				: window.location.pathname
		);
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		selected = params.get("product") ?? "";
		searchQuery = params.get("q") ?? "";
		applyFilter();
	});
</script>

<div class="flex flex-wrap gap-3 mb-8 items-center">
	<div class="flex gap-2 flex-wrap">
		<button
			onclick={() => selectTag("")}
			class="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer {!selected
				? 'bg-white text-bg-900 border-white'
				: 'text-bg-400 border-bg-700 hover:border-bg-500 hover:text-white'}"
		>
			All
		</button>
		{#each TAGS as tag}
			<button
				onclick={() => selectTag(tag)}
				class="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer {selected ===
				tag
					? 'bg-white text-bg-900 border-white'
					: 'text-bg-400 border-bg-700 hover:border-bg-500 hover:text-white'}"
			>
				{tag}
			</button>
		{/each}
	</div>
	<div class="flex-1 min-w-48">
		<input
			type="search"
			placeholder="Search..."
			bind:value={searchQuery}
			oninput={handleSearchInput}
			class="w-full bg-bg-800 border border-bg-700 rounded-full px-4 py-1.5 text-sm text-white placeholder:text-bg-500 focus:outline-none focus:border-bg-500 transition-colors"
		/>
	</div>
</div>
