<script lang="ts">
	const text = [ // TODO consider making these links to relevant docs/guides
		"C and C++",
		"Java",
		"native code",
	];

	let index = 0;
	let targetText = text[index] ?? "";
	let visibleText = targetText;
	$: targetText = text[index] ?? "";

	enum Direction {
		Typing,
		Deleting,
		Waiting,
	}

	let direction = Direction.Typing;

	setInterval(() => {
		if (direction == Direction.Deleting) {
			visibleText = visibleText.slice(0, -1);
			if (visibleText.length == 0) {
				direction = Direction.Typing;
				index = (index + 1) % text.length;
			}
		} else if (direction == Direction.Typing) {
			visibleText = targetText.slice(0, visibleText.length + 1);
			if (visibleText.length == targetText.length) {
				direction = Direction.Waiting;
			}
		}
	}, 70);

	setInterval(() => {
		direction = Direction.Deleting;
	}, 5000);
</script>

{visibleText}<span class="cursor inline-block bg-current"></span>

<style>
	.cursor {
		animation: cursor 1s infinite;

		width: 0.3ch;

		height: 1em; /* fallback */
		height: 1lh; /* webkit */
		height: 1cap; /* firefox */

		margin-left: 0.2ch;
		transform: translateY(15%);
	}

	@keyframes cursor {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 0.6;
		}
		100% {
			opacity: 0;
		}
	}
</style>
