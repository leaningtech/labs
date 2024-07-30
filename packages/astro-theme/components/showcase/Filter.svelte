<script>
	export let checked = false;
</script>

<li>
	<label class="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 py-2 px-4 rounded-md cursor-pointer select-none">
		<input type="checkbox" bind:checked={checked} />
		<slot />
	</label>
</li>
