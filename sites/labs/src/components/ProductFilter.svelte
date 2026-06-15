<script lang="ts">
	import { onMount } from "svelte";

	let { searchPlaceholder = "Search…" }: { searchPlaceholder?: string } =
		$props();

	const TAGS = ["BrowserPod", "Cheerp", "CheerpJ", "CheerpX"] as const;
	// Preferred display order for blog categories; unknown values sort alphabetically after.
	const CATEGORY_ORDER = [
		"Release",
		"Technical",
		"Community",
		"Projects & Demos",
		"Dev Tools",
		"Tech Demo",
		"Commercial",
		"Leaning Technologies",
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
	let filterPanelOpen = $state(false);
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

	// Show search popup when the input is focused and has a query.
	const showPopup = $derived(inputFocused && searchQuery.trim().length >= 2);
	// Mobile popup: tied to the search-open state so it survives autofocus quirks.
	const showMobilePopup = $derived(
		mobileSearchOpen && searchQuery.trim().length >= 2
	);

	function esc(s: string): string {
		return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
			const cats = item.dataset.categories
				? item.dataset.categories.split(",")
				: [];
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
		const allItems = [
			...grid.querySelectorAll<HTMLElement>("li:not([data-empty-state])"),
		];
		const visibleItems = allItems.filter((li) => li.style.display !== "none");

		// Show/hide the empty state message
		const emptyState = grid.querySelector<HTMLElement>("[data-empty-state]");
		if (emptyState) {
			emptyState.style.display = visibleItems.length === 0 ? "" : "none";
		}

		allItems.forEach((li) => {
			li.classList.remove(
				"md:col-span-3",
				"md:col-span-2",
				"md:border-r",
				"md:border-t"
			);
			if (attr === "blog") li.classList.remove("col-span-2", "col-span-1");
			if (attr === "showcase")
				li.classList.remove("sm:col-span-2", "sm:col-span-1");
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
			if (i % 2 === 0 && i + 1 < featured.length)
				li.classList.add("md:border-r");
			if (i >= 2) li.classList.add("md:border-t");
		});
		regular.forEach((li, i) => {
			if (featured.length > 0 || i >= 3) li.classList.add("md:border-t");
			if (i % 3 < 2) li.classList.add("md:border-r");
		});

		const allHeightClasses = [
			"h-64",
			"h-48",
			"h-72",
			"h-56",
			"h-32",
			"sm:h-64",
			"sm:h-48",
		];
		allItems.forEach((li) => {
			li.querySelector<HTMLElement>(".card-image")?.classList.remove(
				...allHeightClasses
			);
			li.querySelector<HTMLElement>(".card-title")?.classList.remove(
				"text-xl",
				"text-base"
			);
		});

		if (attr === "blog") {
			featured.forEach((li) => {
				li.querySelector<HTMLElement>(".card-image")?.classList.add(
					"h-48",
					"sm:h-64"
				);
				li.querySelector<HTMLElement>(".card-title")?.classList.add("text-xl");
			});
			regular.forEach((li) => {
				li.querySelector<HTMLElement>(".card-image")?.classList.add(
					"h-32",
					"sm:h-48"
				);
				li.querySelector<HTMLElement>(".card-title")?.classList.add(
					"text-base"
				);
			});
		} else {
			featured.forEach((li) => {
				li.querySelector<HTMLElement>(".card-image")?.classList.add("h-72");
				li.querySelector<HTMLElement>(".card-title")?.classList.add("text-xl");
			});
			regular.forEach((li) => {
				li.querySelector<HTMLElement>(".card-image")?.classList.add("h-56");
				li.querySelector<HTMLElement>(".card-title")?.classList.add(
					"text-base"
				);
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
			search
				? `${window.location.pathname}?${search}`
				: window.location.pathname
		);
	}

	function selectTag(tag: string) {
		selected = selected === tag ? "" : tag;
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
			filterPanelOpen = false;
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
			filterPanelOpen = false;
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
			el.dataset.categories
				?.split(",")
				.filter(Boolean)
				.forEach((c) => catSet.add(c));
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

<!-- ─── Mobile: tabs row → icon controls row ──────────────────────────────────── -->
<div class="md:hidden flex flex-col gap-y-3 mb-8">
	<!-- Row 1: product browser-tabs, horizontally scrollable -->
	<!-- pb-px gives the active tab's margin-bottom:-1px room so overflow-x:auto
	     (which implicitly clips overflow-y) does not trim the baseline overlap. -->
	<div class="overflow-x-auto pb-px">
		<div class="flex items-end gap-x-1 border-b border-stone-700 min-w-max">
			<button
				onclick={() => selectTag("")}
				class="filter-btn text-sm font-medium cursor-pointer"
				class:active={!selected}>All</button
			>
			{#if selected && selected !== TAGS[0]}
				<span class="h-4 w-px bg-stone-700 self-center mx-1" aria-hidden="true"
				></span>
			{/if}
			{#each TAGS as tag, i}
				<button
					onclick={() => selectTag(tag)}
					class="filter-btn text-sm font-medium cursor-pointer"
					class:active={selected === tag}>{tag}</button
				>
				{#if i < TAGS.length - 1 && selected !== TAGS[i] && selected !== TAGS[i + 1]}
					<span
						class="h-4 w-px bg-stone-700 self-center mx-1"
						aria-hidden="true"
					></span>
				{/if}
			{/each}
		</div>
	</div>

	<!-- Row 2: icon controls — collapse to full-width input when search is open -->
	<div class="flex items-center gap-x-2 min-h-[2rem]">
		{#if mobileSearchOpen}
			<!-- Search expanded: full-width input + close button -->
			<div class="relative flex-1" bind:this={mobileSearchRef}>
				<span
					class="absolute left-3 top-1/2 -translate-y-1/2 text-bg-500 pointer-events-none"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-4 h-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</span>
				<input
					type="text"
					placeholder={searchPlaceholder}
					bind:value={searchQuery}
					onfocus={() => (inputFocused = true)}
					autofocus
					class="w-full bg-stone-950 border border-bg-700 rounded-md pl-9 pr-3 py-1.5 text-sm text-white placeholder:text-bg-500 focus:outline-none focus:border-bg-500 transition-colors"
				/>
				{#if showMobilePopup}
					<div
						class="absolute top-full left-0 right-0 mt-2 bg-bg-900 border border-bg-700 rounded-xl shadow-2xl z-50 overflow-hidden"
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
										mobileSearchOpen = false;
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
			<button
				onclick={() => {
					mobileSearchOpen = false;
					searchQuery = "";
					inputFocused = false;
				}}
				class="flex-none text-bg-400 hover:text-white transition-colors p-1"
				aria-label="Close search"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-4 h-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		{:else}
			<!-- Filter icon with checkbox dropdown -->
			{#if availableCategories.length > 0}
				<div class="relative" bind:this={mobileFilterRef}>
					<button
						onclick={() => (filterPanelOpen = !filterPanelOpen)}
						aria-expanded={filterPanelOpen}
						class="flex items-center gap-1.5 py-1 px-2 rounded-md text-bg-400 hover:text-white transition-colors {filterPanelOpen
							? 'bg-bg-800 text-white'
							: ''}"
					>
						<!-- Funnel / filter icon -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4 flex-none"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3 6h18M7 12h10M11 18h2"
							/>
						</svg>
						<!-- Badge: count of active filters -->
						{#if selectedCategories.length > 0}
							<span
								class="flex items-center justify-center min-w-[1.1rem] h-[1.1rem] rounded-full bg-primary-500 text-white text-[10px] font-bold leading-none px-0.5"
							>
								{selectedCategories.length}
							</span>
						{/if}
					</button>

					{#if filterPanelOpen}
						<div
							class="absolute top-full left-0 mt-1.5 z-50 bg-bg-900 border border-bg-700 rounded-xl shadow-2xl overflow-hidden min-w-[13rem]"
						>
							{#each availableCategories as cat}
								<button
									onclick={() => toggleCategory(cat)}
									class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-left transition-colors hover:bg-bg-800 border-b border-bg-800 last:border-0"
								>
									<!-- Custom checkbox visual -->
									<span
										class="flex flex-none items-center justify-center w-4 h-4 rounded border transition-colors {selectedCategories.includes(
											cat
										)
											? 'bg-primary-500 border-primary-500'
											: 'border-bg-600'}"
									>
										{#if selectedCategories.includes(cat)}
											<svg
												class="w-2.5 h-2.5 text-white"
												fill="none"
												viewBox="0 0 10 10"
												stroke="currentColor"
												stroke-width="2.5"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M1.5 5l2.5 2.5 4.5-4.5"
												/>
											</svg>
										{/if}
									</span>
									<span
										class="transition-colors {selectedCategories.includes(cat)
											? 'text-white'
											: 'text-bg-400'}">{cat}</span
									>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Spacer pushes search icon to the right -->
			<div class="flex-1"></div>

			<!-- Search icon -->
			<button
				onclick={() => {
					mobileSearchOpen = true;
					filterPanelOpen = false;
				}}
				class="text-bg-400 hover:text-white transition-colors p-1"
				aria-label="Search"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-4 h-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</button>
		{/if}
	</div>
</div>

<!--
  md+: two rows — product tabs on row 1 (with border-b baseline), chips+search on row 2.
  items-center horizontally centres each row.
-->
<div class="hidden md:flex flex-col items-center gap-y-3 mb-8 w-full">
	<!-- Product tabs — border-b ends with the last tab -->
	<div class="flex items-end gap-x-1 border-b border-stone-700">
		<button
			onclick={() => selectTag("")}
			class="filter-btn text-sm font-medium cursor-pointer"
			class:active={!selected}>All</button
		>
		<!-- Separator after "All": hide when All or the first product tab is active -->
		{#if selected && selected !== TAGS[0]}
			<span class="h-4 w-px bg-stone-700 self-center mx-1" aria-hidden="true"
			></span>
		{/if}
		{#each TAGS as tag, i}
			<button
				onclick={() => selectTag(tag)}
				class="filter-btn text-sm font-medium cursor-pointer"
				class:active={selected === tag}>{tag}</button
			>
			<!-- Separator between product tabs: hide when either neighbour is active -->
			{#if i < TAGS.length - 1 && selected !== TAGS[i] && selected !== TAGS[i + 1]}
				<span class="h-4 w-px bg-stone-700 self-center mx-1" aria-hidden="true"
				></span>
			{/if}
		{/each}
	</div>

	<!-- Chips + search: single non-wrapping row. Search bar shrinks with viewport via clamp(). -->
	<!-- overflow-x-clip (not overflow-hidden) so the absolute search popup can escape vertically -->
	<div class="flex items-center gap-x-3 overflow-x-clip">
		{#if availableCategories.length > 0}
			<span class="text-xs text-bg-500 whitespace-nowrap shrink-0"
				>Filter by</span
			>
			{#each availableCategories as cat}
				<button
					onclick={() => toggleCategory(cat)}
					class="category-chip text-xs cursor-pointer transition-colors duration-150 px-2.5 py-1 rounded-md border shrink-0"
					class:active={selectedCategories.includes(cat)}>{cat}</button
				>
			{/each}
		{/if}

		<!-- Search bar — shrinks proportionally, never pushed to its own row -->
		<div
			class="relative shrink-0 w-[clamp(7rem,15vw,12rem)]"
			bind:this={searchContainer}
		>
			<span
				class="absolute left-2.5 top-1/2 -translate-y-1/2 text-bg-500 pointer-events-none"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-3.5 h-3.5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</span>
			<input
				type="text"
				placeholder={searchPlaceholder}
				bind:value={searchQuery}
				onfocus={() => (inputFocused = true)}
				class="w-full bg-stone-950 border border-bg-700 rounded-md pl-8 pr-3 py-1 text-xs text-white placeholder:text-bg-500 focus:outline-none focus:border-bg-500 transition-colors"
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
</div>

<style>
	/*
	 * Classic browser-tab effect:
	 *  - The outer container has border-bottom (the baseline)
	 *  - Inactive tabs: flat text sitting on the baseline, no background
	 *  - Active tab: border on left + top (coloured) + right, no bottom border,
	 *    rounded top corners, background = page colour → visually "erases" the
	 *    baseline beneath it and creates the open-tab cutout shape.
	 *  - margin-bottom: -1px makes the tab overlap the 1 px baseline border.
	 */
	.filter-btn {
		position: relative;
		padding: 6px 14px;
		color: rgb(120 113 108); /* stone-500 */
		transition: color 150ms ease;
	}
	.filter-btn:hover:not(.active) {
		color: rgb(214 211 209); /* stone-300 */
	}
	.filter-btn.active {
		border-top: 2px solid rgb(var(--color-primary-500));
		border-left: 1px solid rgb(68 64 60); /* stone-700 */
		border-right: 1px solid rgb(68 64 60);
		border-bottom: none;
		/*
		 * 2 px bottom radius softens the junction with the baseline so the
		 * side-border ends curve very slightly rather than cutting at 90°.
		 * No pseudo-elements needed — the tiny convex arc is enough.
		 */
		border-radius: 8px 8px 2px 2px;
		background-color: rgb(12 10 9); /* stone-950 — same as page bg */
		color: white;
		margin-bottom: -1px;
		z-index: 1;
		padding-top: 4px; /* 6px − 2px border-top keeps text aligned */
		padding-bottom: 7px; /* 6px + 1px to compensate margin-bottom offset */
	}

	/* Category chips — rectangular with rounded corners, primary fill when active */
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
