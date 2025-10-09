<script lang="ts">
	import { slide } from "svelte/transition";

	export let labelText = "";
	export let collapsableText = "";

	let isCollapsed = false;
	let isHovered = false;
	const CSScolorDarkText = `#0f1729`;
	const CSScolorGrey = `#dededf`;
	const CSScolorLightBlue = `#004cdc`;
</script>

<div
	style="--colorBg: {isHovered ? CSScolorGrey : `rgba(0,0,0,0.01)`}"
	class="bg-[var(--colorBg)]"
>
	<div
		class="flex flex-row gap-2 items-center py-4 px-2"
		role="button"
		tabindex="0"
		on:click={() => (isCollapsed = !isCollapsed)}
		on:mouseenter={() => (isHovered = true)}
		on:mouseleave={() => (isHovered = false)}
		on:keydown={(e) =>
			(e.key === "Enter" || e.key === " ") && (isCollapsed = !isCollapsed)}
	>
		<img
			src="icons/icon-quest-mark.svg"
			color={isHovered || isCollapsed ? CSScolorLightBlue : CSScolorDarkText}
			class="w-6 h-6 shrink-0"
			alt="question mark icon"
		/>
		<p
			style="--colorText: {isHovered || isCollapsed
				? CSScolorLightBlue
				: CSScolorDarkText}"
			class="text-[var(--colorText)] text-[1.2rem] lg:max-w-[50ch]"
		>
			{@html labelText}
		</p>
		<img
			src={isCollapsed
				? "icons/icon-chevron-up.svg"
				: "icons/icon-chevron-down.svg"}
			color={isHovered || isCollapsed ? CSScolorLightBlue : CSScolorDarkText}
			class="w-8 h-8 shrink-0 ml-auto"
			alt="chevron up or down"
		/>
	</div>

	{#if isCollapsed}
		<div class="pb-8 px-4" transition:slide|local>
			<p class="text-[#0f1729] tracking-wide lg:max-w-[60ch]">
				{@html collapsableText}
			</p>
		</div>
	{/if}
</div>
