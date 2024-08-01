<script>
	import Item from "./Item.svelte";
	import TowerLogo from "../logos/tower.svg.svelte";
</script>

<Item>
	<a href="https://leaningtech.com/" aria-label="Leaning Technologies">
		<TowerLogo />
		<span class="company-name">Leaning Technologies</span>
	</a>
</Item>

<style>
	a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		height: 100%;

		color: rgb(168 162 158);
		background: none;
		border: 0;
		font: inherit;
		text-decoration: none;
		font-weight: 600;

		cursor: pointer;

		& :global(svg) {
			height: 100%;
		}
	}

	.company-name {
		color: white;
		white-space: nowrap;
	}

	@media (max-width: 768px) {
		.company-name {
			display: none;
		}
	}
</style>
