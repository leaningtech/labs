<script>
	import "@oddbird/popover-polyfill"; // https://caniuse.com/mdn-api_htmlelement_popover

	import LogotypeItem from "./items/Logotype.svelte";
	import DropdownItem from "./items/Dropdown.svelte";
	import SocialIconItem from "./items/SocialIcon.svelte";

	import BigIconItem from "./popover/BigIcon.svelte";

	import SelectMenu from "./SelectMenu.svelte";

	import CheerpLogo from "./logos/cheerp.svg.svelte";
	import CheerpJLogo from "./logos/cheerpj.svg.svelte";
	import CheerpXLogo from "./logos/cheerpx.svg.svelte";
	import BrowserPodLogo from "./logos/browserpod.svg.svelte";

	const mobileMenu = {
		Technology: [
			{
				href: "https://cheerp.io/",
				title: "Cheerp",
			},
			{
				href: "https://cheerpj.com/",
				title: "CheerpJ",
			},
			{
				href: "https://cheerpx.io/",
				title: "CheerpX",
			},
			{
				href: "https://browserpod.io/",
				title: "BrowserPod",
			},
		],
		Resources: [
			{
				href: "https://labs.leaningtech.com/",
				title: "Developer Hub",
			},
			{
				href: "https://labs.leaningtech.com/blog",
				title: "Blog",
			},
			{
				href: "https://github.com/leaningtech",
				title: "GitHub",
			},
		],
	};
</script>

<nav aria-label="Primary" class="navbar">
	<ul class="items">
		<LogotypeItem />
	</ul>
	<ul class="items desktop-only">
		<DropdownItem title="Technology" popovertarget="global-navbar-technology" />
		<DropdownItem title="Resources" popovertarget="global-navbar-resources" />
		<SocialIconItem href="https://discord.leaningtech.com" icon="discord" />
		<SocialIconItem href="https://x.com/leaningtech" icon="x" />
	</ul>
	<ul class="items mobile-only">
		<DropdownItem title="Leaning Technologies" />
		<SelectMenu menu={mobileMenu} />
	</ul>
</nav>

<nav popover aria-label="Technology" id="global-navbar-technology">
	<ul>
		<BigIconItem
			href="https://cheerp.io/"
			title="Cheerp"
			description="C++ to Wasm/JS compiler"
		>
			<CheerpLogo />
		</BigIconItem>
		<BigIconItem
			href="https://cheerpj.com/"
			title="CheerpJ"
			description="Java runtime for browsers"
		>
			<CheerpJLogo />
		</BigIconItem>
		<BigIconItem
			href="https://cheerpx.io/"
			title="CheerpX"
			description="Virtual machines for the web"
		>
			<CheerpXLogo />
		</BigIconItem>
		<BigIconItem
			href="https://browserpod.io/"
			title="BrowserPod"
			description="Code Sandboxes in your browser"
		>
			<BrowserPodLogo />
		</BigIconItem>
	</ul>
</nav>

<nav popover aria-label="Resources" id="global-navbar-resources">
	<ul>
		<li>
			<a href="https://labs.leaningtech.com/"> Developer Hub </a>
		</li>
		<li>
			<a href="https://labs.leaningtech.com/blog"> Blog </a>
		</li>
		<li>
			<a href="https://github.com/leaningtech"> GitHub </a>
		</li>
	</ul>
</nav>

<style>
	.navbar {
		background: black;
		height: 2.5rem;
		border-bottom: 1px solid rgb(68 64 60);

		display: flex;
		justify-content: space-between;
	}

	.items {
		display: flex;
		height: 100%;
		align-items: center;

		padding: 0 1rem;
		margin: 0;
		list-style: none;

		gap: 1rem;

		position: relative; /* for .select */
	}

	#global-navbar-technology,
	#global-navbar-resources {
		position: absolute;

		background: linear-gradient(to bottom right, black, rgb(28, 25, 23));
		border: 1px solid rgb(41 37 36);
		border-radius: 12px;
		box-shadow: 0 2px 1rem rgba(0, 0, 0, 0.5);

		padding: 1.5rem;

		& ul {
			padding: 0;
			margin: 0;
			list-style: none;

			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			& a {
				color: white;
				text-decoration: none;

				padding: 1rem;
				border-radius: 8px;

				&:has(svg) {
					display: grid;
					grid-template-rows: 1fr 1fr;
					grid-template-columns: 3rem 1fr;
					align-items: center;
					gap: 0.5rem;

					& svg {
						grid-row: span 2;
						width: 80%;
						height: 100%;
					}

					& span {
						color: rgb(168 162 158);
					}
				}
			}
		}
	}

	#global-navbar-technology {
		inset: 3rem 6rem auto auto;
	}

	#global-navbar-resources {
		inset: 3rem 3rem auto auto;
	}

	@media (max-width: 768px) {
		.desktop-only {
			display: none !important;
		}
	}

	@media (min-width: 769px) {
		.mobile-only {
			display: none !important;
		}
	}
</style>
