<script>
    import { numberToTime } from "@models/Swim";

    export let saveTime;
    export let currentTime;

    let newTimeArray;
    $: newTime = currentTime || 0;
    $: newTimeArray = numberToArray(currentTime || 0);

    function timeArrayToNumber(timeArray) {
        return timeArray.reduce((acc, curr, index) => {
            let multiplier = 6000;
            if (index > 0) multiplier = Math.pow(10, 4 - index);
            return acc + curr * multiplier;
        }, 0) / 100;
    }
    function numberToArray(time) {
        console.log('Converting number to array: ' + time);
        if (time === 0 || time === null) return ['', '', '', '', ''];
        let string = numberToTime(time);
        let parts = string.split('').filter(s => s !== ':' && s !== '.');
        while (parts.length < 5) parts.unshift('');
        return parts;
    }

    function addDigit(n) {
        console.log('Adding digit: ' + n);
        if (newTimeArray[0] !== '') return;
        if (n === 0 && newTimeArray[4] === '') return;
        newTimeArray = [...newTimeArray.slice(1), n.toString()];
        newTime = timeArrayToNumber(newTimeArray);
        console.log('New time: ' + numberToArray(newTime));
    }

    function deleteDigit() {
        if (newTimeArray[4] === '') return;
        newTimeArray = ['', ...newTimeArray.slice(0, 4)];
        newTime = timeArrayToNumber(newTimeArray);
        console.log('New time: ' + newTime);
    }
</script>

    <div class='currentTime'>
        <button class='digit'>{newTimeArray[0]}</button>:
        <button class='digit'>{newTimeArray[1]}</button>
        <button class='digit'>{newTimeArray[2]}</button>.
        <button class='digit'>{newTimeArray[3]}</button>
        <button class='digit'>{newTimeArray[4]}</button>
    </div>

    <div class='keypad'>
        {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as number}
            <button class='sb key'
                on:click={() => addDigit(number)}>
                {number}
            </button>
        {/each}
        <button class='sb key delete' on:click={deleteDigit}>x</button>
        <button class='sb key zero'
            on:click={() => addDigit(0)}>
            0
        </button>
        <button class='sb key send' 
            on:click={() => saveTime(newTime)}>
                &#10003
        </button>
    </div>

<style>
    .currentTime {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 6vh;
        margin-bottom: 0.5em;
        border: 1px solid orange;
    }
    .digit {
        width: 5vh;
        height: 8vh;
        font-size: 5vh;
        border: 1px solid #aaa;
        border-radius: 1.25vh;
        background-color: var(--bg-color-2);
        margin: 0.5vh;
        text-align: center;
        padding-top: 0.05em;
        display: inline-block;
    }
    .keypad {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-items: center;
        gap: 1vh;
        /* Allow the keypad to fill a larger percentage of the screen width */
        height: 40vh; /* Use a percentage for a fluid width */
        width: 30vh;
        border: 1px solid aqua;
    }

    .key {
        background-color: var(--bg-color-2);
        height: 9vh; /* Adjust width based on viewport width */
        width: 9vh; /* Adjust width based on viewport width */
        display: flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        font-size: 2em;
        background-color: #def;
        color: #000;
         font-weight: bold;
    }
    .key.delete {
        background-color: #f44336; /* Red */
        color: #000;
    }
    .key.send {
        background-color: #4CAF50; /* Green */
        color: #000;
    }
    .key:active {
        background-color: #000;
        color: #fff;
        border: 2px solid #000;
    }
</style>