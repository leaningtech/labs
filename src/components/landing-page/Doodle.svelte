<script lang="ts">
	const images = [
		"/landing/doodle/Cheerp.png",
		"/landing/doodle/CheerpJ.png",
		"/landing/doodle/CheerpX.png",
	];

	let index = 0;
	setInterval(() => {
		index = (index + 1) % images.length;
	}, 5000);
</script>

<div class="doodle relative w-full max-h-[36rem] lg:max-h-[48rem]">
	<img
		src="/landing/doodle/AllCheerps.png"
		alt=""
		class="absolute top-0 opacity-20"
	/>

	{#each images as image, i}
		<img
			src={image}
			alt=""
			class="absolute top-0 transition-opacity duration-500"
			class:opacity-0={i !== index}
		/>
	{/each}
</div>

<!-- TODO: <map> and <area> elements -->

<style>
	.doodle {
		aspect-ratio: 1101 / 1577;
	}
</style>
