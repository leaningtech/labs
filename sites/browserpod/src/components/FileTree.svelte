<script>
	export let node;

	const rootFiles = [
		{
			type: "folder",
			name: "public",
			expanded: true,
			files: [
				{
					type: "folder",
					name: "project",
					expanded: true,
					files: [
						{ type: "file", name: "main.js" },
						{ type: "file", name: "package.json" },
					],
				},
			],
		},
		{ type: "file", name: ".env" },
		{ type: "file", name: "index.html" },
		{ type: "file", name: "package.json" },
		{
			type: "folder",
			name: "src",
			expanded: true,
			files: [
				{ type: "file", name: "main.js" },
				{ type: "file", name: "style.css" },
				{ type: "file", name: "utils.js" },
			],
		},
	];

	if (!node) {
		node = {
			type: "folder",
			name: "<project>",
			files: rootFiles,
			expanded: true,
		};
	}

	let open = !!node.expanded;
	const toggle = () => (open = !open);

	const extIcon = (name) => {
		if (name.startsWith(".") && name.length > 1)
			return name.slice(1).toLowerCase();
		const parts = name.split(".");
		const ext = parts.length > 1 ? parts.pop().toLowerCase() : "";
		return ext;
	};
</script>

{#if node.type === "folder"}
	{#if node.name === "<project>" || node.name === "/"}
		<div class="bp-tree-card">
			<button
				type="button"
				class="bp-tree-row"
				on:click={toggle}
				aria-expanded={open}
			>
				<span class="bp-tree-caret">{open ? "▾" : "▸"}</span>
				<span class="bp-tree-icon folder" aria-hidden="true">
					<svg
						viewBox="0 0 24 24"
						width="14"
						height="14"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path
							d="M3 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
						/>
					</svg>
				</span>
				<span class="bp-tree-name">{node.name}</span>
			</button>
			{#if open}
				<ul class="bp-tree-children">
					{#each node.files as child}
						<li>
							<svelte:self node={child} />
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{:else}
		<button
			type="button"
			class="bp-tree-row"
			on:click={toggle}
			aria-expanded={open}
		>
			<span class="bp-tree-caret">{open ? "▾" : "▸"}</span>
			<span class="bp-tree-icon folder" aria-hidden="true">
				<svg
					viewBox="0 0 24 24"
					width="14"
					height="14"
					fill="none"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M3 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
					/>
				</svg>
			</span>
			<span class="bp-tree-name">{node.name}</span>
		</button>
		{#if open}
			<ul class="bp-tree-children">
				{#each node.files as child}
					<li>
						<svelte:self node={child} />
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
{:else}
	<div class="bp-tree-row bp-tree-file">
		<span class="bp-tree-caret" aria-hidden="true"></span>
		<span
			class="bp-tree-icon file"
			data-ext={extIcon(node.name)}
			aria-hidden="true"
		></span>
		<span class="bp-tree-name">{node.name}</span>
	</div>
{/if}
