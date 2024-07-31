<script>
	import { createEventDispatcher } from "svelte";

	import Item from "./Item.svelte";

	const dispatch = createEventDispatcher();

	export let title;
	export let popovertarget;
</script>

<Item>
	<button {popovertarget} on:click={evt => dispatch("click", evt)}>
		{title}
		<svg aria-hidden="true" viewBox="0 0 24 24">
			<path
				stroke="currentColor"
				fill="transparent"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="m8 10 4 4 4-4"
			/>
		</svg>
	</button>
</Item>
