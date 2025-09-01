<script>
    import { numberToTime } from "@models/Swim";
    import { onMount } from "svelte";
    import { generateNumbers, stDev } from "../stats";
    import { filterData } from "../stats";

    export let times = [];
    export let currentIndex = 0;
    export let saveTime;

    $: currentTime = times[currentIndex] || null;

    $: minMax = times.some(t => t!== null) ?
        [Math.min(...filterData(times)) - 0.3, Math.max(...filterData(times)) + 0.3] : [];

    $: timesList = generateNumbers(minMax);

    $: if (times.length > 0) scrollToMiddle();

    onMount(() => {
        scrollToMiddle();
    });

    function scrollToMiddle() {
        const parentElement = document.getElementById('timeScroll');
        const endElement = document.getElementById('end');

        if (parentElement && endElement) {
            // Calculate the position to center the element

            const parentHeight = parentElement.clientHeight;
            const end = endElement.offsetTop;
            const windowHeight = window.innerHeight;

            const scrollToPosition = end / 2 - parentHeight / 2 - 0.15 * windowHeight;
            console.log(scrollToPosition);

            // Apply the scroll
            parentElement.scroll({
                top: scrollToPosition
            });
        }
    }

    function stDevColor(time) {
        let newTimes = [...times];
        newTimes[currentIndex] = time;
        const sd = stDev(newTimes) * 100;
        if (sd < 0.1) return 232;
        if (sd > 10) return 0;
        return 220 - 20 * sd;
    }

    function buttonId(time) {
        return 'time-' + Math.floor(time * 100);
    }

    function buttonClass(time) {
        const rTime = Math.floor(time * 100);
        if (currentTime !== null) {
            const rCurrent = Math.floor(currentTime * 100);
            if (rTime === rCurrent) return 'current time';
        }
        if (times.some(t => t !== null && Math.floor(t * 100) === rTime)) {
            return 'selected time';
        }
        return 'time';
    }
</script>

<div id='timeScroll'>
    {#if timesList.length > 0}
        {#each timesList as time, index}
            <button id="time-{index}"
                class={buttonClass(time)}
                on:click={() => saveTime(time)}
                style="background-color: hsl({stDevColor(time)}, 100%, 50%);">
                {numberToTime(time)}
            </button>
        {/each}
    {:else}
        <div>No times yet.</div>
    {/if}
        <div id='end'></div>
</div>

<style>
    #timeScroll {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1vh;
        width: 100%;
        height: 100%;
        padding: 2vh;
        border-top: 2vh solid #000;
        border-bottom: 2vh solid #000;
        overflow-y: auto;
    }
    .time {
        padding: 0.5em;
        border-radius: 0.3em;
        border: 4px solid #000;
        cursor: pointer;
        width: calc(100% - 20vw);
        font-size: 4vh;
        height: 8vh;
        text-align: center;
        color: #000;
    }
    .current.time {
        outline: 2px solid #ffa;
        width: 100%;
    }
    .selected.time {
        outline: 2px solid #aaa;
    }
    #end {
        height: 0;
    }
</style>
