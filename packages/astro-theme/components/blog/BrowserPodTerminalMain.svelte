<script>
	import { BrowserPod } from "../../lib/browserpod.ts";
	import {
		BrowserPodEditorProvider,
		TerminalPanel,
		setAnalyticsCallback,
	} from "@leaningtech/svelte-browserpod-editor";
	import "@leaningtech/svelte-browserpod-editor/theme.css";

	let { id, version, projectSource, apiKey, terminalTabs, ariaLabel } = $props();

	// svelte-ignore state_referenced_locally
	const pod = BrowserPod(version).boot({ apiKey });
</script>

<div
	id={id}
	class="flex w-full h-[25rem] p-2 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl"
	aria-label={ariaLabel}
>
	<BrowserPodEditorProvider
		{projectSource}
		{pod}
		ctxId="demo"
	>
		<TerminalPanel tabs={terminalTabs} />
	</BrowserPodEditorProvider>
</div>
