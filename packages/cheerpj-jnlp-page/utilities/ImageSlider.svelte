<script type="ts">
	import { fade } from "svelte/transition";

	let currentIndex = 1;
	let images = [
		{
			src: "/cheerpj3/assets/jnlp-screenshots/screenshot_1.png",
			alt: "Run Java Web Start applications. No Java installations. Easy to use. Sandboxed."
		},
		{
			src: "/cheerpj3/assets/jnlp-screenshots/screenshot_2.png",
			alt: "Extensive Java compatibility. Swing. Oracle Forms. Oracle EBS. File System. Clipboard. Networking. Printing."
		}
	];

	function back() {
		if (currentIndex > 1) {
			currentIndex--;
		}
	}

	function next() {
		if (currentIndex < images.length) {
			currentIndex++;
		} else if (currentIndex >= images.length) {
			currentIndex = 1;
		}
	}
</script>

<article class="overflow-hidden shadow-2xl relative">
	<div
		class="rounded-full bg-gray-600 text-white absolute top-5 right-5 text-sm px-2 text-center z-10"
	>
		<span>{currentIndex}</span>/<span>{images.length}</span>
	</div>

	{#each images as image, index (image)}
		{#if currentIndex === index + 1}
			<figure
				transition:fade={{ duration: 700 }}
				class="h-full w-full object-cover"
			>
				<img
					src={image.src}
					alt={image.alt}
					class="absolute inset-0 z-10 h-full w-full object-cover"
				/>
			</figure>
		{/if}
	{/each}

	<button
		on:click={back}
		class="absolute left-14 top-1/2 translate-y-1/2 w-11 h-11 flex justify-center items-center rounded-full shadow-md z-10 bg-gray-100 hover:bg-gray-200"
	>
		<svg
			class="w-8 h-8 font-bold transition duration-500 ease-in-out transform motion-reduce:transform-none text-gray-500 hover:text-gray-600 hover:-translate-x-0.5"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2.5"
				d="M15 19l-7-7 7-7"
			>
			</path>
		</svg>
	</button>

	<button
		on:click={next}
		class="absolute right-14 top-1/2 translate-y-1/2 w-11 h-11 flex justify-center items-center rounded-full shadow-md z-10 bg-gray-100 hover:bg-gray-200"
	>
		<svg
			class="w-8 h-8 font-bold transition duration-500 ease-in-out transform motion-reduce:transform-none text-gray-500 hover:text-gray-600 hover:translate-x-0.5"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2.5"
				d="M9 5l7 7-7 7"
			></path>
		</svg>
	</button>
</article>
