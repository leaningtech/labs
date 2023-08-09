<script lang="ts">
	const images = [
		"/landing/doodle/AllCheerps.png", // 50% opacity when inactive
		"/landing/doodle/Cheerp.png",
		"/landing/doodle/CheerpJ.png",
		"/landing/doodle/CheerpX.png",
	];

	let index = 0;
	setInterval(() => {
		index = (index + 1) % images.length;
	}, 3000);
</script>

<div class="doodle relative w-full max-h-[36rem] lg:max-h-[48rem]">
	{#each images as image, i}
		<img
			src={image}
			alt=""
			class="absolute top-0 transition-opacity duration-500"
			class:opacity-0={i !== index && i !== 0}
			class:opacity-50={i !== index && i === 0}
		/>
	{/each}
</div>

<!-- TODO: <map> and <area> elements -->

<style>
	.doodle {
		aspect-ratio: 1101 / 1577;
	}
</style>
