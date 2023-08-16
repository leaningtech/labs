<script lang="ts">
	const images = [
		"/landing/doodle/doodle_vertical/cheerp_top.png",
		"/landing/doodle/doodle_vertical/cheerpj_top.png",
		"/landing/doodle/doodle_vertical/cheerpx_top.png",
	];
	const images_h = [
		"/landing/doodle/doodle_horizontal/cheerp_h.png",
		"/landing/doodle/doodle_horizontal/cheerpj_h.png",
		"/landing/doodle/doodle_horizontal/cheerpx_h.png",
	];

	let index = 0;
	setInterval(() => {
		index = (index + 1) % images.length;
	}, 5000);
</script>

<div class="doodle relative w-96 hidden md:block  md:w-full max-w-full max-h-[36rem] lg:max-h-[48rem] overflow-hidden">
	<img
		src="/landing/doodle/doodle_vertical/all_top.png"
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
	src="/landing/doodle/doodle_vertical/browser.png"
	alt=""
	class="absolute top-0"
	/>

</div>

<div class="doodle_h relative w-full md:hidden mt-28">
	<img
		src="/landing/doodle/doodle_horizontal/all_top_h.png"
		alt=""
		class="absolute top-0 opacity-20"
	/>

	{#each images_h as image, i}
		<img
			src={image}
			alt=""
			class="absolute top-0 transition-opacity duration-500"
			class:opacity-0={i !== index}
		/>
	{/each}
	<img
	src="/landing/doodle/doodle_horizontal/browser_h.png"
	alt=""
	class="absolute top-0"
	/>

</div>

<!-- TODO: <map> and <area> elements -->
<style>
	.doodle {
		aspect-ratio: 1101 / 1577;
	}
	.doodle_h {
		aspect-ratio: 1874 / 1101;
	}
	
</style>
