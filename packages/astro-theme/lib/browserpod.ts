/**
 * Load any version of BrowserPod from the CDN without npm version conflicts.
 *
 * Usage:
 *   const pod = BrowserPod('1.3.4').boot({ apiKey: '...' });
 *   // pass pod (Promise<BrowserPodInstance>) to BrowserPodEditorProvider
 */

import type { BrowserPodInstance } from "@leaningtech/svelte-browserpod-editor";

const dynImport = new Function("x", "return import(x)");

export function BrowserPod(version: string) {
	return {
		boot(opts: {
			apiKey: string;
			nodeVersion?: string;
		}): Promise<BrowserPodInstance> {
			return dynImport(
				`https://rt.browserpod.io/${version}/browserpod.js`
			).then((m: any) => m.BrowserPod.boot(opts));
		},
	};
}
