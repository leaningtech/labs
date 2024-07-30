<script>
	export let items;

	function url(path) {
		let base = import.meta.env.BASE_URL;
		if (base.endsWith('/')) base = base.slice(0, -1);
		return `${base}${path}`;
	}
</script>

<ul class="grid grid-cols-3 gap-5 bg-stone-900">
	{#each items as item}
		<li class="relative overflow-hidden shadow-lg rounded-lg aspect-[13/9] bg-stone-700 border border-stone-800">
			{#if item.image}
				<div aria-hidden="true" class="absolute inset-0">
					<img src={item.image.src} alt="" loading="lazy" />
					<div class="bg-gradient-to-bl from-transparent to-stone-900 absolute inset-0"></div>
				</div>
			{/if}

			<a href={url(`/showcase/${item.slug}`)} class="relative z-10 h-full w-full flex items-end group">
				<div class="bg-gradient-to-t from-stone-950 to-transparent absolute inset-0 opacity-70 transition-opacity group-hover:opacity-30"></div>

				<div class="p-10 relative z-10">
					<p class="text-2xl font-semibold text-balance">{item.title}</p>
					{#if item.description}
						<p class="text-base pt-2 text-balance leading-snug opacity-70 hidden md:block">{item.description}</p>
					{/if}
				</div>
			</a>
		</li>
	{/each}
</ul>
