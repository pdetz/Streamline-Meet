<script>
    import { numberToTime } from "@models/Swim";
    import TimeScroll from "./TimeScroll.svelte";
    import Keypad from "./Keypad.svelte";
    import SubmitTimes from "./SubmitTimes.svelte";

    export let meet = {name: 'Hypothetical A Meet', objectId: 'abc123'};
    export let swim = {
        event: {name: 'Event 1 - Boys 12 & Under 100 IM'},
        swimmer: {display: 'Swimmer 1'},
        heat: 1,
        lane: 4
    };
    export let numberOfTimes = 3;

    let times = Array(numberOfTimes).fill(null);
    let currentTime = null;
    let currentIndex = 0;
    let ViewComponent = Keypad;
    let viewProps = {currentTime, saveTime};

    let timeScroll = false;

    function saveTime(newTime) {
        if (newTime < 10) return;
        times[currentIndex] = newTime;
        times = [...times].sort((a, b) => {
            if (a === null) return 1;
            if (b === null) return -1;
            return a - b;
        });
        currentIndex = times.indexOf(null);
        currentTime = null;
        timeScroll = true;
        updateView();
    }

    function updateView(showSubmitTimes = false) {
        if (showSubmitTimes) {
            ViewComponent = SubmitTimes;
            viewProps = {times, updateView};
            return;
        }
        const numberOfTimes = times.filter(t => t !== null).length;
        if (numberOfTimes === 0) {
            ViewComponent = Keypad;
            viewProps = {currentTime, saveTime};
        } else if (numberOfTimes === 3 && currentIndex === -1) {
            ViewComponent = SubmitTimes;
            viewProps = {times, numberOfTimes, updateView};
        } else {
            ViewComponent = TimeScroll;
            viewProps = {times, currentIndex, saveTime};
        }
    }
</script>

<div class='screen'>
    <div class='info'>
        <div>{meet.name} - {numberOfTimes} Times</div>
        <div>{swim.event.name}</div>
        <div>Heat {swim.heat} Lane {swim.lane}</div>
        <button class='swimmer'>{swim.swimmer.display}</button>
    </div>
    <div class='times'>
        {#each times as time, index}
            <button on:click={() => {currentIndex = index; currentTime = time;}}
                class={index === currentIndex ? 'sb current time' : 'sb time'}>
                {#if time !== null}
                    {numberToTime(time)}
                {/if}
            </button>
        {/each}
    </div>
    <div class='timeInput'>
        <svelte:component this={ViewComponent} {...viewProps} />
    </div>
    <div class='tools'>
        <button class='sb tool' on:click={() => updateView(true)}>
            Submit Times
        </button>
    </div>

</div>

<style>
    /* Use a root font-size based on viewport width for a truly responsive experience */
    :root {
      font-size: calc(16px + 1vw);
    }
    .screen {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 0.5em;
        width: 100vw;
        height: 100vh;
    }
    .info {
        width: 100%;
        height: 20vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5em;
        border: 1px solid green;
        box-sizing: border-box;
    }
    .times {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 0.5em;
        height: 10vh;
        overflow-y: auto;
        width: 100%;
        border: 1px solid red;
    }
    .time {
        font-size: 3vh;
        width: 30%;
        padding: 0;
        height: 6vh;
        background-color: var(--bg-color-2);
        border: 1px solid #aaa;
        text-align: center;
    }
    button.current {
        outline: 2px solid #ff0;
        border: 2px solid #000;
        font-weight: bold;
    }
    .tools {
        width: 100%;
        height: 10vh;
        border: 1px solid blue;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .timeInput {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 60vh;
        width: 100%;
        border: 1px solid yellow;
    }
    button.swimmer {
        font-size: 2.5vh;
        padding: 0.25em 0.5em;
        background: none;
        color: #0ff;
        border: 1px solid #aaa;
        text-align: center;
    }
</style>