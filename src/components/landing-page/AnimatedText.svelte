<script lang="ts">
	const text = [ // TODO consider making these links to relevant docs/guides
		"anything",
		"C and C++",
		"Java",
		"native code",
		//"Linux",
		//"Java applets",
		//"Flash",
		//"Python",
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
	}, 50);

	setInterval(() => {
		direction = Direction.Deleting;
	}, 3000);
</script>

{visibleText}<span class="cursor inline-block w-3 h-[1em] ml-3 translate-y-4 bg-current"></span>

<style>
	.cursor {
		animation: cursor 1s infinite;
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
