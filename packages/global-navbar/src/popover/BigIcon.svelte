<script>
	export let href;
	export let title;
	export let description;
</script>

<li>
	<a {href}>
		<slot />
		<b>{title}</b>
		<span>{description}</span>
	</a>
</li>

<style>
	li {
		margin: 0; /* required to override style on cheerpj.com */
	}
</style>
