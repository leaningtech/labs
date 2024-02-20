<script lang="ts">
	export let repo: string; // user/repo

	let localStorageKey = `github-stars-${repo}`;
	let localStorageDateKey = `github-stars-date-${repo}`;

	let stars = parseInt(localStorage[localStorageKey]);
	let starsDate = new Date(localStorage[localStorageDateKey]);

	$: localStorage[localStorageKey] = stars.toString();
	$: localStorage[localStorageDateKey] = new Date().toISOString();

	if (isNaN(stars)) {
		update();
	} else {
		// https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api#primary-rate-limit-for-unauthenticated-users
		// Invalidate cache after 1 hour
		if (new Date().getTime() - starsDate.getTime() > 1000 * 60 * 60) {
			update();
		}
	}

	function update() {
		fetch("https://api.github.com/repos/" + repo)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error(response.statusText);
			})
			.then((json) => {
				stars = json.stargazers_count;
				console.log("got stars from GitHub", stars);
			})
			.catch((error) => {
				console.error("couldn't fetch from GitHub" + error);
			});
	}

	// Format count as 1.2k etc
	function formatCount(count: number): string {
		if (count < 1000) return count.toString();
		if (count < 10000) return (count / 1000).toFixed(1) + "k"; // 1.2k
		return Math.round(count / 1000) + "k"; // 12k
	}
</script>

{#if !isNaN(stars)}
	{formatCount(stars)}
{/if}
