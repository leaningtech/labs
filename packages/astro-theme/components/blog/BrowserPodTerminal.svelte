<script>
	import { tick } from "svelte";
	import { TerminalPanel } from "@leaningtech/svelte-browserpod-editor";

	// terminalTabs is serializable: each tab has id, label, command, optional
	// args array, and optional echo boolean. command defaults to "bash".
	let { id, ctxId, terminalTabs, description, autoStart = true, playCaption = "Interactive demo — click to run" } = $props();

	// When autoStart is false, either the play button or onReady may fire first.
	// playClicked tracks whether the user already clicked before the pod was ready,
	// so onReady can run immediately in that case rather than waiting forever.
	let pendingRuns = $state([]);
	let playClicked = $state(false);
	let overlayVisible = $state(!autoStart);

	function makeExecutor(tab) {
		const opts = { cwd: "/home/user", echo: tab.echo ?? true };
		return (run) => run(tab.command ?? "bash", tab.args ?? [], opts);
	}

	// onReady callbacks cannot be passed as props from MDX: Astro serializes
	// client:only props and functions are lost in the process. We accept a
	// serializable command/args instead and build the callback here.
	// svelte-ignore state_referenced_locally
	const tabs = terminalTabs.map((tab) => ({
		id: tab.id,
		label: tab.label,
		onReady: autoStart
			? makeExecutor(tab)
			: (run) => {
				if (playClicked) makeExecutor(tab)(run);
				else pendingRuns.push(() => makeExecutor(tab)(run));
			},
	}));

	async function handlePlay() {
		overlayVisible = false;
		playClicked = true;
		for (const run of pendingRuns) run();
		await tick();
		const firstPaneId = terminalTabs[0]?.id;
		document.getElementById(firstPaneId)?.querySelector("textarea")?.focus();
	}
</script>

<figure class="w-full">
	<div class="w-full relative">
		<div
			id={id}
			class="flex w-full h-[25rem] p-2 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl"
			aria-label={description}
		>
			<TerminalPanel {ctxId} {tabs} />
		</div>
		{#if overlayVisible}
			<button
				onclick={handlePlay}
				aria-label="Run demo"
				class="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/50 hover:bg-black/40 transition-colors cursor-pointer border-0"
			>
				<span class="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors">
					<svg viewBox="0 0 24 24" class="w-8 h-8 fill-white ml-1" aria-hidden="true">
						<polygon points="5,3 19,12 5,21" />
					</svg>
				</span>
				{#if playCaption}
					<span class="text-sm text-white/70">{playCaption}</span>
				{/if}
			</button>
		{/if}
	</div>
	<figcaption class="text-center">{description}</figcaption>
</figure>
