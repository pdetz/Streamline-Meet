<script>
    import { userStore } from "@src/stores";
    import ResultsTables from "../ResultsTables.svelte";
    import PageAndTools from "./PageAndTools.svelte";
    import ColorPicker from "./tools/ColorPicker.svelte";
    import Pairs from "@shared/components/Pairs.svelte";

    export let meet;

    let showPoints = meet.points.length > 0 && meet.relayPoints.length > 0;

    let selectedColors = $userStore?.documentColors || ["#fff", "#fff"];
    let title = meet.name + ' Results';

    function selectColors(colors) {
        $userStore.updateDocumentColors(colors);
        selectedColors = colors;
    }
</script>

{#if !meet.completed}
    <PageAndTools title={title}>
        <svelte:fragment slot="document">
            <div class="small">
                <Pairs
                    items={meet.events}
                    itemName="events"
                    Component = {ResultsTables}
                    {meet}
                    {selectedColors}
                    cssClass = "stripe pair",
                    visiblePointTotal = {showPoints}
                />
            </div>
        </svelte:fragment>

        <svelte:fragment slot="tools">
            <ColorPicker
              {selectedColors}
              {selectColors}
            />
          </svelte:fragment>
    </PageAndTools>
{/if}

{#if meet.completed}
    <PageAndTools title={title}>
        <svelte:fragment slot="document">
            {#if showPoints}
                <div class='points'>
                    {#each meet.teams as team, index}
                        <span class='points'>{team.abbr}: {meet.resultsScore[index]}</span>
                    {/each}
                </div>
            {/if}
            <div class="small">
                <Pairs
                    items={meet.events}
                    itemName="events"
                    Component = {ResultsTables}
                    {meet}
                    {selectedColors}
                    cssClass = "stripe pair",
                    visiblePointTotal = {false}
                />
            </div>
        </svelte:fragment>

        <svelte:fragment slot="tools">
            <ColorPicker
              {selectedColors}
              {selectColors}
            />
          </svelte:fragment>
    </PageAndTools>
{/if}

<style>
    .small {
        font-size: 0.8rem;
    }

    div.points {
        display: flex;
        gap: 2rem;
        margin-bottom: 1rem;
        justify-content: center;
    }
</style>