<script lang="ts">
	const images = [
		"/landing/doodle/cheerp_top.png",
		"/landing/doodle/cheerpj_top.png",
		"/landing/doodle/cheerpx_top.png",
	];

	let index = 0;
	setInterval(() => {
		index = (index + 1) % images.length;
	}, 5000);
</script>

<div class="doodle relative w-96 md:w-full max-w-full max-h-[36rem] lg:max-h-[48rem] overflow-hidden">
	<img
		src="/landing/doodle/all_top.png"
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
	<img
	src="/landing/doodle/browser.png"
	alt=""
	class="absolute top-0"
	/>

</div>

<!-- TODO: <map> and <area> elements -->
<style>
	.doodle {
		aspect-ratio: 1101 / 1577;
	}
</style>
