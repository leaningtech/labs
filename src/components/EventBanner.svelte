<script lang="ts">
	const date = new Date("2023-09-18T14:00:00Z");
	const now = new Date();
	const isFuture = now.getTime() - date.getTime() < 0;
	const dateString = new Intl.DateTimeFormat(undefined, {
		weekday: "long",
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	}).format(date);
</script>

{#if isFuture}
	<a
		class="bg-orange-600 text-orange-100 group"
		href="https://discord.gg/q8kyQz8V7v?event=1141742514945138750"
	>
		<div
			class="w-full max-w-screen-xl px-4 md:px-6 py-3 mx-auto md:flex items-center text-sm xl:text-base"
		>
			<div class="grow font-semibold leading-tight">
				Interested in running Java in the browser with CheerpJ 3.0? <br
					class="xl:hidden"
				/>
				Ask our developers anything at our <em>live Q&A</em> on
				<time class="font-bold" datetime={date.toISOString()}>{dateString}</time
				>!
			</div>
			<div class="text-sm text-white font-bold group-hover:underline py-1">
				Join the event &raquo;
			</div>
		</div>
	</a>
{/if}
