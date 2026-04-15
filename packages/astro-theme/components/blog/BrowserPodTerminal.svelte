<script>
	import { TerminalPanel } from "@leaningtech/svelte-browserpod-editor";

	// terminalTabs is serializable: each tab has id, label, and an optional
	// bashCommand string (passed as bash -c <command>). If omitted, opens an
	// interactive bash session.
	let { id, ctxId, terminalTabs, description } = $props();

	// onReady callbacks cannot be passed as props from MDX: Astro serializes
	// client:only props and functions are lost in the process. We accept a
	// plain bashCommand string instead and build the callback here.
	// svelte-ignore state_referenced_locally
	const tabs = terminalTabs.map((tab) => ({
		id: tab.id,
		label: tab.label,
		onReady: tab.bashCommand
			? (run) => run("bash", ["-c", tab.bashCommand], { cwd: "/home/user" })
			: (run) => run("bash", [], { cwd: "/home/user" }),
	}));
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
	</div>
	<figcaption class="text-center">{description}</figcaption>
</figure>
