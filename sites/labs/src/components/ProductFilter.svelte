<script lang="ts">
	import { onMount } from "svelte";

	const TAGS = ["Cheerp", "CheerpJ", "CheerpX", "BrowserPod"] as const;

	let selected = $state("");
	let searchQuery = $state("");
	let inputFocused = $state(false);
	let searchContainer: HTMLElement;

	interface SearchItem {
		title: string;
		description: string;
		href: string;
		tags: string[];
	}

	let searchItems: SearchItem[] = $state([]);

	const searchResults = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (q.length < 2) return [];
		return searchItems
			.filter((item) => {
				const matchesTag = !selected || item.tags.includes(selected);
				return (
					matchesTag &&
					(item.title.toLowerCase().includes(q) ||
						item.description.toLowerCase().includes(q))
				);
			})
			.slice(0, 6)
			.map((item) => ({
				href: item.href,
				title: highlight(item.title, q),
				snippet: getSnippet(item.title, item.description, q),
			}));
	});

	const showPopup = $derived(
		inputFocused && searchQuery.trim().length >= 2
	);

	function esc(s: string): string {
		return s
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	}

	function highlight(text: string, query: string): string {
		const i = text.toLowerCase().indexOf(query);
		if (i === -1) return esc(text);
		return (
			esc(text.slice(0, i)) +
			`<mark class="bg-primary-400/20 text-primary-300 rounded-sm not-italic">${esc(text.slice(i, i + query.length))}</mark>` +
			esc(text.slice(i + query.length))
		);
	}

	function getSnippet(title: string, desc: string, query: string): string {
		// If match is in title, show a plain description preview
		if (title.toLowerCase().includes(query)) {
			if (!desc) return "";
			return esc(desc.slice(0, 100)) + (desc.length > 100 ? "…" : "");
		}
		// Match is in description — show context window around it
		const i = desc.toLowerCase().indexOf(query);
		if (i === -1) return "";
		const start = Math.max(0, i - 35);
		const end = Math.min(desc.length, i + query.length + 60);
		return (
			(start > 0 ? "…" : "") +
			highlight(desc.slice(start, end), query) +
			(end < desc.length ? "…" : "")
		);
	}

	function applyTagFilter() {
		const items = document.querySelectorAll<HTMLElement>("[data-tags]");
		items.forEach((item) => {
			const tags = item.dataset.tags ? item.dataset.tags.split(",") : [];
			item.style.display = !selected || tags.includes(selected) ? "" : "none";
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
			li.classList.remove(
				"md:col-span-3",
				"md:col-span-2",
				"md:border-r",
				"md:border-t"
			)
		);

		const featuredCount = Math.min(2, visibleItems.length);
		const featured = visibleItems.slice(0, featuredCount);
		const regular = visibleItems.slice(featuredCount);

		featured.forEach((li) => li.classList.add("md:col-span-3"));
		regular.forEach((li) => li.classList.add("md:col-span-2"));

		// Border between the two featured items
		if (featured.length > 1) featured[0].classList.add("md:border-r");

		// Regular items: border-t on all rows, border-r between items within each row of 3
		regular.forEach((li, i) => {
			if (featured.length > 0 || i >= 3) li.classList.add("md:border-t");
			if (i % 3 < 2) li.classList.add("md:border-r");
		});
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
		const params = new URLSearchParams(window.location.search);
		if (selected) params.set("product", selected);
		else params.delete("product");
		const search = params.toString();
		history.replaceState(
			null,
			"",
			search ? `${window.location.pathname}?${search}` : window.location.pathname
		);
		applyTagFilter();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			searchQuery = "";
			inputFocused = false;
			(document.activeElement as HTMLElement)?.blur();
		}
	}

	function handleWindowClick(e: MouseEvent) {
		if (searchContainer && !searchContainer.contains(e.target as Node)) {
			inputFocused = false;
		}
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		selected = params.get("product") ?? "";
		applyTagFilter();

		searchItems = [
			...document.querySelectorAll<HTMLElement>("[data-tags]"),
		].map((el) => ({
			title: el.dataset.title ?? "",
			description: el.dataset.description ?? "",
			href: el.dataset.href ?? "#",
			tags: el.dataset.tags ? el.dataset.tags.split(",") : [],
		}));
	});
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleKeydown} />

<div class="flex flex-wrap gap-2 mb-8 items-center">
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

	<div class="relative" bind:this={searchContainer}>
		<input
			type="text"
			placeholder="Search…"
			bind:value={searchQuery}
			onfocus={() => (inputFocused = true)}
			class="w-40 bg-bg-800 border border-bg-700 rounded-full px-4 py-1.5 text-sm text-white placeholder:text-bg-500 focus:outline-none focus:border-bg-500 transition-colors"
		/>

		{#if showPopup}
			<div
				class="absolute top-full left-0 mt-2 w-80 md:w-96 bg-bg-900 border border-bg-700 rounded-xl shadow-2xl z-50 overflow-hidden"
			>
				{#if searchResults.length === 0}
					<p class="px-4 py-3 text-bg-400 text-sm">No results found.</p>
				{:else}
					{#each searchResults as result}
						<a
							href={result.href}
							onclick={() => {
								searchQuery = "";
								inputFocused = false;
							}}
							class="block px-4 py-3 hover:bg-bg-800 transition-colors border-b border-bg-800 last:border-0"
						>
							<p class="text-white text-sm font-semibold leading-snug">
								{@html result.title}
							</p>
							{#if result.snippet}
								<p class="text-bg-400 text-xs mt-1 leading-relaxed">
									{@html result.snippet}
								</p>
							{/if}
						</a>
					{/each}
				{/if}
			</div>
		{/if}
	</div>
</div>
