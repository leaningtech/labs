<script lang="ts">
	import { onMount } from "svelte";

	const TAGS = ["Cheerp", "CheerpJ", "CheerpX", "BrowserPod"] as const;

	const tagToSiteClass: Record<string, string> = {
		Cheerp: "site-cheerp",
		CheerpJ: "site-cheerpj",
		CheerpX: "site-cheerpx",
		BrowserPod: "site-browserpod",
	};
	let originalSiteClass = "";

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
		reapplyGridLayout("blog");
		reapplyGridLayout("showcase");
	}

	// Reapplies col-span, border, and card-internal styles for a 6-col grid with 4 featured
	// (2-per-row) followed by regular items (3-per-row).
	function reapplyGridLayout(attr: string) {
		const grid = document.querySelector<HTMLElement>(
			`[data-filter-grid="${attr}"]`
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

		const featuredCount = Math.min(4, visibleItems.length);
		const featured = visibleItems.slice(0, featuredCount);
		const regular = visibleItems.slice(featuredCount);

		featured.forEach((li) => li.classList.add("md:col-span-3"));
		regular.forEach((li) => li.classList.add("md:col-span-2"));

		// Featured borders: border-r on left of each 2-item row, border-t on second row
		featured.forEach((li, i) => {
			if (i % 2 === 0 && i + 1 < featured.length) li.classList.add("md:border-r");
			if (i >= 2) li.classList.add("md:border-t");
		});

		// Regular borders: border-t on all, border-r between items within each row of 3
		regular.forEach((li, i) => {
			if (featured.length > 0 || i >= 3) li.classList.add("md:border-t");
			if (i % 3 < 2) li.classList.add("md:border-r");
		});

		// Sync card-internal image height and title size to match promoted/demoted status
		const [featH, regH] =
			attr === "blog" ? ["h-64", "h-48"] : ["h-72", "h-56"];
		allItems.forEach((li) => {
			li.querySelector<HTMLElement>(".card-image")?.classList.remove(
				"h-64", "h-48", "h-72", "h-56"
			);
			li.querySelector<HTMLElement>(".card-title")?.classList.remove(
				"text-xl", "text-base"
			);
		});
		featured.forEach((li) => {
			li.querySelector<HTMLElement>(".card-image")?.classList.add(featH);
			li.querySelector<HTMLElement>(".card-title")?.classList.add("text-xl");
		});
		regular.forEach((li) => {
			li.querySelector<HTMLElement>(".card-image")?.classList.add(regH);
			li.querySelector<HTMLElement>(".card-title")?.classList.add("text-base");
		});
	}

	function applyProductTheme() {
		const html = document.documentElement;
		[...html.classList]
			.filter((c) => c.startsWith("site-"))
			.forEach((c) => html.classList.remove(c));
		const target = (selected && tagToSiteClass[selected]) || originalSiteClass;
		if (target) html.classList.add(target);
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
		applyProductTheme();
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
		for (const cls of document.documentElement.classList) {
			if (cls.startsWith("site-")) {
				originalSiteClass = cls;
				break;
			}
		}

		const params = new URLSearchParams(window.location.search);
		selected = params.get("product") ?? "";
		applyProductTheme();
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

<div class="flex flex-wrap gap-2 mb-8 items-center min-w-0">
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
				? 'bg-primary-500 text-white border-primary-500'
				: 'text-bg-400 border-bg-700 hover:border-bg-500 hover:text-white'}"
		>
			{tag}
		</button>
	{/each}

	<div class="relative w-full sm:w-auto sm:ml-auto" bind:this={searchContainer}>
		<input
			type="text"
			placeholder="Search…"
			bind:value={searchQuery}
			onfocus={() => (inputFocused = true)}
			class="w-full sm:w-36 md:w-40 bg-bg-800 border border-bg-700 rounded-full px-4 py-1.5 text-sm text-white placeholder:text-bg-500 focus:outline-none focus:border-bg-500 transition-colors"
		/>

		{#if showPopup}
			<div
				class="absolute top-full right-0 mt-2 w-72 sm:w-80 md:w-96 max-w-[calc(100vw-2rem)] bg-bg-900 border border-bg-700 rounded-xl shadow-2xl z-50 overflow-hidden"
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
