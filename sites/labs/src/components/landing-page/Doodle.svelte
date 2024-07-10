<script lang="ts">
	import verticalAll from "./doodle/doodle_vertical/all_top.png";
	import verticalBrowser from "./doodle/doodle_vertical/browser.png";
	import verticalCheerp from "./doodle/doodle_vertical/cheerp_top.png";
	import verticalCheerpj from "./doodle/doodle_vertical/cheerpj_top.png";
	import verticalCheerpx from "./doodle/doodle_vertical/cheerpx_top.png";
	import horizontalAll from "./doodle/doodle_horizontal/all_top_h.png";
	import horizontalBrowser from "./doodle/doodle_horizontal/browser_h.png";
	import horizontalCheerp from "./doodle/doodle_horizontal/cheerp_h.png";
	import horizontalCheerpj from "./doodle/doodle_horizontal/cheerpj_h.png";
	import horizontalCheerpx from "./doodle/doodle_horizontal/cheerpx_h.png";

	const images = [verticalCheerp, verticalCheerpj, verticalCheerpx];
	const images_h = [horizontalCheerp, horizontalCheerpj, horizontalCheerpx];
	const hrefs = ["/cheerp", "/cheerpj", "/cheerpx"];

	let index = 0;
	setInterval(() => {
		index = (index + 1) % images.length;
	}, 5000);
</script>

<div
	class="doodle relative w-96 hidden md:block md:w-full max-w-full max-h-[36rem] lg:max-h-[48rem] overflow-hidden"
>
	<a href={hrefs[index]}>
		<img
			src={verticalAll.src}
			alt=""
			decoding="async"
			loading="lazy"
			class="absolute top-0 opacity-20"
		/>
		{#each images as image, i}
			<img
				src={image.src}
				alt=""
				decoding="async"
				loading="lazy"
				class="absolute top-0 transition-opacity duration-500"
				class:opacity-0={i !== index}
			/>
		{/each}
		<img
			src={verticalBrowser.src}
			alt=""
			decoding="async"
			loading="lazy"
			class="absolute top-0"
		/>
	</a>
</div>

<div class="doodle_h relative w-full md:hidden mt-28">
	<a href={hrefs[index]}>
		<img
			src={horizontalAll.src}
			alt=""
			decoding="async"
			loading="lazy"
			class="absolute top-0 opacity-20"
		/>
		{#each images_h as image, i}
			<img
				src={image.src}
				alt=""
				decoding="async"
				loading="lazy"
				class="absolute top-0 transition-opacity duration-500"
				class:opacity-0={i !== index}
			/>
		{/each}
		<img
			src={horizontalBrowser.src}
			alt=""
			decoding="async"
			loading="lazy"
			class="absolute top-0"
		/>
	</a>
</div>

<style>
	.doodle {
		aspect-ratio: 1101 / 1577;
	}
	.doodle_h {
		aspect-ratio: 1874 / 1101;
	}
</style>
