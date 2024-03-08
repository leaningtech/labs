<script>
	import { onMount } from "svelte";

	let canvas;

	onMount(async () => {
		window.THREE = await import("three");
		const { default: init } = await import("../lib/three-demo.js");
		const { run } = await init();
		run(canvas);
	});
</script>

<canvas bind:this={canvas} width=320 height=240></canvas>
