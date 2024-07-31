<script>
	/** @type {{ [label: string]: { href: string, title: string }[] }} */
	export let menu;

	function change(evt) {
		const title = evt.target.value;

		// Look up selected item and navigate to it
		for (const items of Object.values(menu)) {
			const item = items.find(item => item.title === title);

			if (item) {
				window.location.href = item.href;
				break;
			}
		}
	}
</script>

<select on:change={change}>
	{#each Object.entries(menu) as [label, items]}
		<optgroup label={label}>
			{#each items as { title }}
				<option>{title}</option>
			{/each}
		</optgroup>
	{/each}
</select>

<style>
	select {
		position: absolute; /* NOTE: parent must be relative */
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0; /* keep it clickable */
	}
</style>
