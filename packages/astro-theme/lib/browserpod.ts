/**
 * Load any version of BrowserPod from the CDN without npm version conflicts.
 *
 * Usage:
 *   const pod = BrowserPod('1.3.4').boot({ apiKey: '...' });
 *   const pod = BrowserPod('4.0.0').boot({ opinionatedFetch: true });
 *   // pass pod (Promise<BrowserPodInstance>) to BrowserPodEditorProvider
 */

import type { BrowserPodInstance } from "@leaningtech/svelte-browserpod-editor";

const dynImport = new Function("x", "return import(x)");

export function BrowserPod(version: string) {
	return {
		// opinionatedFetch: boot on a fetch network that uses
		// BrowserPod.opinionatedFetch. It takes the place of apiKey.
		boot({
			opinionatedFetch = false,
			...opts
		}: {
			apiKey?: string;
			nodeVersion?: string;
			opinionatedFetch?: boolean;
		}): Promise<BrowserPodInstance> {
			return dynImport(
				`https://rt.browserpod.io/${version}/browserpod.js`
			).then(async ({ BrowserPod }: any) => {
				if (!opinionatedFetch) return BrowserPod.boot(opts);
				const network = await BrowserPod.createFetchNetwork({
					fetch: BrowserPod.opinionatedFetch,
				});
				return BrowserPod.boot({ ...opts, network });
			});
		},
	};
}
