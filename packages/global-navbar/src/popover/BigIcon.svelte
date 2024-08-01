<script>
	export let href;
	export let title;
	export let description;
</script>

<li>
	<a {href}>
		<slot />
		<b>{title}</b>
		<span>{description}</span>
	</a>
</li>

<style>
	li {
		margin: 0; /* required to override style on cheerpj.com */
	}

	a {
		color: white;
		text-decoration: none;

		padding: 1rem;
		border-radius: 8px;

		&:global(:has(svg)) {
			/* <slot /> */
			display: grid;
			grid-template-rows: 1fr 1fr;
			grid-template-columns: 3rem 1fr;
			align-items: center;
			gap: 0.5rem;

			& :global(svg) {
				grid-row: span 2;
				width: 80%;
				height: 100%;
			}
		}
	}

	span {
		color: rgb(168 162 158);
	}
</style>
