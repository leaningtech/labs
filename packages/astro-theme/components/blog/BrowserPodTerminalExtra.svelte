<script>
	import { TerminalPanel } from "@leaningtech/svelte-browserpod-editor";

	let { id, terminalTabs, ariaLabel } = $props();
</script>

<div
	id={id}
	class="flex w-full h-[25rem] p-2 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl"
	aria-label={ariaLabel}
>
	<TerminalPanel ctxId="demo" tabs={terminalTabs} />
</div>
