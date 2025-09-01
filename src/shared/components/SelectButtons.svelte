<script>
    export let options;
    export let selected;
    export let select;
    export let text;
    export let css='bold';

</script>

{#each options as option}
    <button class={"sb "+css} class:selected={selected === option} on:click={() => select(option)}>
        {text(option)}
    </button>
{/each}