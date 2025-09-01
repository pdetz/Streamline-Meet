<script>
    import NumberPicker from "@streamline/components/meets/planning/NumberPicker.svelte";

    export let dimensions;
    export let updateShape;

    $: dimensionEntries = Object.entries(dimensions).filter(([key]) => {
        return key !== "colors";
    });

</script>

<div class="logo-controls-group">
    {#each dimensionEntries as [key, { text, val }]}
        <NumberPicker
            text={text}
            n={val}
            updateN={(newValue) => {
                updateShape({ [key]: newValue });
            }}
            min={0}
            max={100}
            i={1}
        />
    {/each}
</div>

<style>
    .logo-controls-group {
        font-size: 1.4em;
        display: grid; /* Change from flex to grid */
        grid-template-columns: repeat(2, 1fr); /* Define two columns, each taking equal space */
        grid-auto-flow: row;
        gap: 0; /* This gap now applies between both rows and columns */
        
    }
</style>