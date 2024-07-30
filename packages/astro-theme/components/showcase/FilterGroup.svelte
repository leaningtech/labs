<script>
	export let title;
</script>

<details name="showcase-filters" class="border-t border-stone-800">
	<summary class="select-none py-4 font-semibold text-base cursor-pointer">
		<span class="pl-1">{title}</span>
	</summary>
	<ul class="flex flex-col gap-2 pb-4">
		<slot />
	</ul>
</details>
