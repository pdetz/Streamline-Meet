<script>
	export let text = '';

	let visible = false;
	let tooltipElement;
	let containerElement;

	function showTooltip() {
		if (text) visible = true;
	}

	function hideTooltip() {
		visible = false;
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') hideTooltip();
	}
</script>

<div
	class="tooltip-container"
	bind:this={containerElement}
	on:mouseover={showTooltip}
	on:mouseleave={hideTooltip}
	on:focus={showTooltip}
	on:blur={hideTooltip}
	on:keydown={handleKeydown}
    role="tooltip"
>
	<slot />

	{#if visible && text}
		<div class="tooltip-content" bind:this={tooltipElement} role="tooltip">
			{text}
		</div>
	{/if}
</div>

<style>
	.tooltip-container {
		position: relative;
		display: inline-block;
        width: 100%;
	}

	.tooltip-content {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
        min-width: 12em;
        max-width: 24em;
        font-size: 0.8em;
        padding: 0.25em;
        border: 1px solid var(--border-color);
		background-color: var(--bg-color-1);
		color: var(--border-color-hl);
		text-align: center;
		z-index: 1000;
		pointer-events: none;
		margin-bottom: 0.25em;
	}
</style>