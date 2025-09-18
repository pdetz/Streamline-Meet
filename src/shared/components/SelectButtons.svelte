<script>
    let { options, selected, select, text, css='bold' } = $props();
</script>

{#each options as option}
    <button class={"sb "+css} class:selected={selected === option} on:click={() => select(option)}>
        {text(option)}
    </button>
{/each}