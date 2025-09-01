<script>
    export let swimmer;
    export let meet;

    $: swims = swimmer.swims.filter(s => s.meet === meet);

    $: show = swims.length > 0;
</script>

<div>
    {#if show}
        <div class="tile">
            <div class="tile-title">{meet.name}</div>
            <div class="tile-content">
                {#each swims as swim}
                    <div>{swim.distance} {swim.stroke.name} {swim.display()}</div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .tile {
        margin: 1rem;
    }
    .swimmer {
        color: #fff;
        width: 100%;
        text-align: center;
    }
</style>
