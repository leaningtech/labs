<script>
	import { TerminalPanel } from "@leaningtech/svelte-browserpod-editor";
</script>

<div
	id="demo-repl"
	class="flex w-full h-[25rem] p-2 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl"
	aria-label="In-browser Node.js demo playground"
>
	<TerminalPanel
		ctxId="demo"
		tabs={[
			{
				id: "repl-standalone",
				label: "REPL",
				commands: [["node"]],
				autoRun: true,
			},
		]}
	/>
</div>
