<script lang="ts">
	import { onMount } from "svelte";

	const TAGS = ["BrowserPod", "Cheerp", "CheerpJ", "CheerpX"] as const;
	// Preferred display order for blog categories; unknown values sort alphabetically after.
	const CATEGORY_ORDER = [
		"Release",
		"Deep Dive",
		"Community",
		"Projects & Demos",
		"Inside LT",
	];

	const tagToSiteClass: Record<string, string> = {
		BrowserPod: "site-browserpod",
		Cheerp: "site-cheerp",
		CheerpJ: "site-cheerpj",
		CheerpX: "site-cheerpx",
	};
	let originalSiteClass = "";
	let isInitialMount = true;

	let selected = $state("");
	// string[] is used instead of Set so Svelte 5 reactivity tracks it reliably.
	let selectedCategories = $state<string[]>([]);
	let availableCategories = $state<string[]>([]);
	let searchQuery = $state("");
	let inputFocused = $state(false);
	let filterMenuOpen = $state(false);
	let mobileSearchOpen = $state(false);
	let searchContainer: HTMLElement;
	let mobileFilterRef: HTMLElement;
	let mobileSearchRef: HTMLElement;

	interface SearchItem {
		title: string;
		description: string;
		href: string;
		tags: string[];
		categories: string[];
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

	// Desktop popup: close when focus leaves the search area.
	const showPopup = $derived(inputFocused && searchQuery.trim().length >= 2);
	// Mobile popup: autofocus is unreliable on mobile; show whenever
	// the search bar is open and the query is long enough.
	const showMobilePopup = $derived(mobileSearchOpen && searchQuery.trim().length >= 2);

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
		if (title.toLowerCase().includes(query)) {
			if (!desc) return "";
			return esc(desc.slice(0, 100)) + (desc.length > 100 ? "…" : "");
		}
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

		const isVisible = (item: HTMLElement) => {
			const tags = item.dataset.tags ? item.dataset.tags.split(",") : [];
			const cats = item.dataset.categories ? item.dataset.categories.split(",") : [];
			const productOk = !selected || tags.includes(selected);
			const categoryOk =
				selectedCategories.length === 0 ||
				selectedCategories.some((c) => cats.includes(c));
			return productOk && categoryOk;
		};

		if (!isInitialMount) {
			items.forEach((item) => {
				const visible = isVisible(item);
				if (visible) {
					item.style.opacity = "0";
					item.style.display = "";
				} else {
					item.style.opacity = "";
					item.style.display = "none";
				}
			});
		} else {
			items.forEach((item) => {
				item.style.display = isVisible(item) ? "" : "none";
			});
		}

		reapplyGridLayout("blog");
		reapplyGridLayout("showcase");

		if (!isInitialMount) {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					items.forEach((item) => {
						if (item.style.display !== "none") item.style.opacity = "";
					});
				});
			});
		}
	}

	// Reapplies col-span, border, and card-internal styles.
	// Blog: 2-col mobile grid + responsive image heights.
	// Showcase: desktop-only layout unchanged.
	function reapplyGridLayout(attr: string) {
		const grid = document.querySelector<HTMLElement>(
			`[data-filter-grid="${attr}"]`
		);
		if (!grid) return;
		const allItems = [...grid.querySelectorAll<HTMLElement>("li")];
		const visibleItems = allItems.filter((li) => li.style.display !== "none");

		allItems.forEach((li) => {
			li.classList.remove(
				"md:col-span-3", "md:col-span-2", "md:border-r", "md:border-t"
			);
			if (attr === "blog") li.classList.remove("col-span-2", "col-span-1");
			if (attr === "showcase") li.classList.remove("sm:col-span-2", "sm:col-span-1");
		});

		const featuredCount = Math.min(4, visibleItems.length);
		const featured = visibleItems.slice(0, featuredCount);
		const regular = visibleItems.slice(featuredCount);

		featured.forEach((li) => li.classList.add("md:col-span-3"));
		regular.forEach((li) => li.classList.add("md:col-span-2"));

		if (attr === "blog") {
			featured.forEach((li) => li.classList.add("col-span-2"));
			regular.forEach((li) => li.classList.add("col-span-1"));
		} else if (attr === "showcase") {
			featured.forEach((li) => li.classList.add("sm:col-span-2"));
			regular.forEach((li) => li.classList.add("sm:col-span-1"));
		}

		featured.forEach((li, i) => {
			if (i % 2 === 0 && i + 1 < featured.length) li.classList.add("md:border-r");
			if (i >= 2) li.classList.add("md:border-t");
		});
		regular.forEach((li, i) => {
			if (featured.length > 0 || i >= 3) li.classList.add("md:border-t");
			if (i % 3 < 2) li.classList.add("md:border-r");
		});

		const allHeightClasses = [
			"h-64", "h-48", "h-72", "h-56", "h-32", "sm:h-64", "sm:h-48",
		];
		allItems.forEach((li) => {
			li.querySelector<HTMLElement>(".card-image")
				?.classList.remove(...allHeightClasses);
			li.querySelector<HTMLElement>(".card-title")
				?.classList.remove("text-xl", "text-base");
		});

		if (attr === "blog") {
			featured.forEach((li) => {
				li.querySelector<HTMLElement>(".card-image")
					?.classList.add("h-48", "sm:h-64");
				li.querySelector<HTMLElement>(".card-title")?.classList.add("text-xl");
			});
			regular.forEach((li) => {
				li.querySelector<HTMLElement>(".card-image")
					?.classList.add("h-32", "sm:h-48");
				li.querySelector<HTMLElement>(".card-title")?.classList.add("text-base");
			});
		} else {
			featured.forEach((li) => {
				li.querySelector<HTMLElement>(".card-image")?.classList.add("h-72");
				li.querySelector<HTMLElement>(".card-title")?.classList.add("text-xl");
			});
			regular.forEach((li) => {
				li.querySelector<HTMLElement>(".card-image")?.classList.add("h-56");
				li.querySelector<HTMLElement>(".card-title")?.classList.add("text-base");
			});
		}
	}

	function applyProductTheme() {
		const html = document.documentElement;
		const productClasses = Object.values(tagToSiteClass);

		if (selected && tagToSiteClass[selected]) {
			// Selecting a product: remove all product classes and the base site class,
			// then apply the product-specific one so it wins without CSS-order conflicts.
			productClasses.forEach((c) => html.classList.remove(c));
			if (originalSiteClass) html.classList.remove(originalSiteClass);
			html.classList.add(tagToSiteClass[selected]);
		} else {
			// "All" (no product): remove every product class, restore the original
			// site class only if it is not already there to avoid pointless DOM
			// mutations that trigger CSS transitions on the ::after underline.
			productClasses.forEach((c) => html.classList.remove(c));
			if (originalSiteClass && !html.classList.contains(originalSiteClass)) {
				html.classList.add(originalSiteClass);
			}
		}
	}

	function updateUrl() {
		const params = new URLSearchParams(window.location.search);
		if (selected) params.set("product", selected);
		else params.delete("product");
		if (selectedCategories.length > 0)
			params.set("categories", selectedCategories.join(","));
		else params.delete("categories");
		const search = params.toString();
		history.replaceState(
			null,
			"",
			search ? `${window.location.pathname}?${search}` : window.location.pathname
		);
	}

	function selectTag(tag: string) {
		selected = selected === tag ? "" : tag;
		filterMenuOpen = false;
		updateUrl();
		applyProductTheme();
		applyTagFilter();
	}

	function toggleCategory(cat: string) {
		if (selectedCategories.includes(cat)) {
			selectedCategories = selectedCategories.filter((c) => c !== cat);
		} else {
			selectedCategories = [...selectedCategories, cat];
		}
		updateUrl();
		applyTagFilter();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			searchQuery = "";
			inputFocused = false;
			filterMenuOpen = false;
			mobileSearchOpen = false;
			(document.activeElement as HTMLElement)?.blur();
		}
	}

	function handleWindowClick(e: MouseEvent) {
		if (
			searchContainer &&
			!searchContainer.contains(e.target as Node) &&
			(!mobileSearchRef || !mobileSearchRef.contains(e.target as Node))
		) {
			inputFocused = false;
		}
		if (mobileFilterRef && !mobileFilterRef.contains(e.target as Node)) {
			filterMenuOpen = false;
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
		const cats = params.get("categories");
		if (cats) selectedCategories = cats.split(",").filter(Boolean);
		applyProductTheme();
		applyTagFilter();
		isInitialMount = false;

		const allItems = [...document.querySelectorAll<HTMLElement>("[data-tags]")];

		// Build the sorted list of available category values from the DOM.
		const catSet = new Set<string>();
		allItems.forEach((el) => {
			el.dataset.categories?.split(",").filter(Boolean).forEach((c) => catSet.add(c));
		});
		availableCategories = [...catSet].sort((a, b) => {
			const ai = CATEGORY_ORDER.indexOf(a);
			const bi = CATEGORY_ORDER.indexOf(b);
			if (ai >= 0 && bi >= 0) return ai - bi;
			if (ai >= 0) return -1;
			if (bi >= 0) return 1;
			return a.localeCompare(b);
		});

		searchItems = allItems.map((el) => ({
			title: el.dataset.title ?? "",
			description: el.dataset.description ?? "",
			href: el.dataset.href ?? "#",
			tags: el.dataset.tags ? el.dataset.tags.split(",") : [],
			categories: el.dataset.categories ? el.dataset.categories.split(",") : [],
		}));
	});
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleKeydown} />

<!-- ─── Mobile: unified filter row (product dropdown + category chips + search) ── -->
<div class="sm:hidden flex flex-wrap gap-x-3 gap-y-2 mb-8 items-center">
	{#if mobileSearchOpen}
		<!-- Search mode: full-width input replaces everything -->
		<div class="relative flex-1" bind:this={mobileSearchRef}>
			<span class="absolute left-3 top-1/2 -translate-y-1/2 text-bg-500 pointer-events-none">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
					viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</span>
			<input
				type="text"
				placeholder="Search…"
				bind:value={searchQuery}
				onfocus={() => (inputFocused = true)}
				autofocus
				class="w-full bg-bg-800 border border-bg-700 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white placeholder:text-bg-500 focus:outline-none focus:border-bg-500 transition-colors"
			/>
			{#if showMobilePopup}
				<div class="absolute top-full left-0 right-0 mt-2 bg-bg-900 border border-bg-700 rounded-xl shadow-2xl z-50 overflow-hidden">
					{#if searchResults.length === 0}
						<p class="px-4 py-3 text-bg-400 text-sm">No results found.</p>
					{:else}
						{#each searchResults as result}
							<a
								href={result.href}
								onclick={() => { searchQuery = ""; inputFocused = false; mobileSearchOpen = false; }}
								class="block px-4 py-3 hover:bg-bg-800 transition-colors border-b border-bg-800 last:border-0"
							>
								<p class="text-white text-sm font-semibold leading-snug">{@html result.title}</p>
								{#if result.snippet}
									<p class="text-bg-400 text-xs mt-1 leading-relaxed">{@html result.snippet}</p>
								{/if}
							</a>
						{/each}
					{/if}
				</div>
			{/if}
		</div>
		<button
			onclick={() => { mobileSearchOpen = false; searchQuery = ""; inputFocused = false; }}
			class="flex-none text-bg-400 hover:text-white transition-colors"
			aria-label="Close search"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
				viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	{:else}
		<!-- Product dropdown -->
		<div class="relative" bind:this={mobileFilterRef}>
			<button
				onclick={() => (filterMenuOpen = !filterMenuOpen)}
				class="filter-btn active flex items-center gap-1.5 text-sm font-medium text-white cursor-pointer transition-colors duration-200 whitespace-nowrap"
			>
				{selected || "All"}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-3 h-3 transition-transform duration-200 {filterMenuOpen ? 'rotate-180' : ''}"
					fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</button>
			{#if filterMenuOpen}
				<div class="absolute left-0 top-full mt-1 z-50 bg-bg-900 border border-bg-700 rounded-xl shadow-2xl overflow-hidden min-w-[10rem]">
					<button
						onclick={() => selectTag("")}
						class="w-full text-left px-4 py-3 text-sm transition-colors {!selected ? 'text-white font-semibold bg-bg-800' : 'text-bg-400 hover:bg-bg-800 hover:text-white'}"
					>All</button>
					{#each TAGS as tag}
						<button
							onclick={() => selectTag(tag)}
							class="w-full text-left px-4 py-3 text-sm transition-colors border-t border-bg-800 {selected === tag ? 'text-primary-400 font-semibold bg-bg-800' : 'text-bg-400 hover:bg-bg-800 hover:text-white'}"
						>{tag}</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Category chips inline with dropdown -->
		{#each availableCategories as cat}
			<button
				onclick={() => toggleCategory(cat)}
				class="category-chip text-xs cursor-pointer transition-colors duration-150 px-2 py-0.5 rounded border"
				class:active={selectedCategories.includes(cat)}
			>{cat}</button>
		{/each}

		<!-- Spacer + search icon at end -->
		<div class="flex-1"></div>
		<button
			onclick={() => { mobileSearchOpen = true; filterMenuOpen = false; }}
			class="flex-none text-bg-400 hover:text-white transition-colors"
			aria-label="Search"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
				viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
		</button>
	{/if}
</div>

<!-- ─── Desktop: unified single row (products | sep | categories | search) ── -->
<div class="hidden sm:flex flex-wrap gap-x-4 gap-y-3 mb-8 items-center min-w-0">
	<!-- Product filter tabs -->
	<button
		onclick={() => selectTag("")}
		class="filter-btn text-sm font-medium cursor-pointer transition-colors duration-200"
		class:active={!selected}
		class:text-white={!selected}
		class:text-bg-500={!!selected}
	>
		All
	</button>
	{#each TAGS as tag}
		<button
			onclick={() => selectTag(tag)}
			class="filter-btn text-sm font-medium cursor-pointer transition-colors duration-200"
			class:active={selected === tag}
			class:text-white={selected === tag}
			class:text-bg-500={selected !== tag}
		>
			{tag}
		</button>
	{/each}

	<!-- Separator + category chips (only when page has categories) -->
	{#if availableCategories.length > 0}
		<span class="h-4 w-px bg-stone-700 self-center" aria-hidden="true"></span>
		{#each availableCategories as cat}
			<button
				onclick={() => toggleCategory(cat)}
				class="category-chip text-xs cursor-pointer transition-colors duration-150 px-2.5 py-1 rounded-full border"
				class:active={selectedCategories.includes(cat)}
			>{cat}</button>
		{/each}
	{/if}

	<!-- Search — pushed to the right -->
	<div class="relative ml-auto" bind:this={searchContainer}>
		<span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-bg-500 pointer-events-none">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
				viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
		</span>
		<input
			type="text"
			placeholder="Search…"
			bind:value={searchQuery}
			onfocus={() => (inputFocused = true)}
			class="w-44 md:w-56 bg-bg-800 border border-bg-700 rounded-lg pl-10 pr-4 py-1.5 text-sm text-white placeholder:text-bg-500 focus:outline-none focus:border-bg-500 transition-colors"
		/>
		{#if showPopup}
			<div class="absolute top-full right-0 mt-2 w-72 sm:w-80 md:w-96 max-w-[calc(100vw-2rem)] bg-bg-900 border border-bg-700 rounded-xl shadow-2xl z-50 overflow-hidden">
				{#if searchResults.length === 0}
					<p class="px-4 py-3 text-bg-400 text-sm">No results found.</p>
				{:else}
					{#each searchResults as result}
						<a
							href={result.href}
							onclick={() => { searchQuery = ""; inputFocused = false; }}
							class="block px-4 py-3 hover:bg-bg-800 transition-colors border-b border-bg-800 last:border-0"
						>
							<p class="text-white text-sm font-semibold leading-snug">{@html result.title}</p>
							{#if result.snippet}
								<p class="text-bg-400 text-xs mt-1 leading-relaxed">{@html result.snippet}</p>
							{/if}
						</a>
					{/each}
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	/* Underline indicator — absolute so it never shifts layout */
	.filter-btn {
		position: relative;
		padding-bottom: 6px;
	}
	.filter-btn::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: rgba(255, 255, 255, 0);
		transition: height 150ms ease, background-color 200ms ease;
	}
	.filter-btn:hover::after {
		background: rgba(255, 255, 255, 0.35);
	}
	/* Active: 3 px solid brand colour */
	.filter-btn.active::after {
		height: 3px;
		background: rgb(var(--color-primary-500));
	}

	/* Category chips — pill style, primary colour fill when active */
	.category-chip {
		color: rgb(120 113 108); /* stone-500 */
		border-color: rgb(41 37 36); /* stone-800 */
	}
	.category-chip:hover {
		color: rgb(214 211 209); /* stone-300 */
		border-color: rgb(87 83 78); /* stone-600 */
	}
	/* Active: filled with the current primary colour (tracks product selection) */
	.category-chip.active {
		color: white;
		background-color: rgb(var(--color-primary-500));
		border-color: rgb(var(--color-primary-500));
	}

	/* Card fade-in on filter change */
	:global([data-tags]) {
		transition: opacity 250ms ease;
	}
</style>
