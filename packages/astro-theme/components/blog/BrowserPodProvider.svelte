<script>
	import { BrowserPod } from "../../lib/browserpod.ts";
	import { BrowserPodEditorProvider } from "@leaningtech/svelte-browserpod-editor";
	import "@leaningtech/svelte-browserpod-editor/theme.css";

	let { ctxId, version, projectSource, apiKey } = $props();

	// svelte-ignore state_referenced_locally
	const pod = BrowserPod(version).boot({ apiKey });
</script>

<BrowserPodEditorProvider {projectSource} {pod} {ctxId} />
