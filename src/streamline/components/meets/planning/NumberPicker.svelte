<script>
    export let n = 1;
    export let updateN = () => {};
    export let text = '';
    export let showN = (n) => n;
    export let min = 1;
    export let max = 10;
    export let step = 1;

    function increment() {
        n += step;
        updateN(n);
    }
    function decrement() {
        if (n > min) n -= step;
        updateN(n);
    }
</script>

<div class="number-picker">
    <div>{text}</div>
    <div class="number">{showN(n)}</div>
    <div class="controls">
      <button class="top" on:click={increment}>&#9650;</button>
      <button class="bottom" on:click={decrement}>&#9660;</button>
    </div>
  </div>

<style>
    .number-picker {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0.2em 1em;
        margin-bottom: 0.5em;
        background-color: var(--bg-color-2);
    }

    .controls {
        display: flex;
        flex-direction: column; /* Stack buttons vertically */
        margin: 0.1em; /* Add some space between buttons and number */
    }

    .number {
        width: 2em;
        background-color: var(--bg-color-1);
        padding: 0.2em;
        text-align: center;
        margin: 0 0.5em;
    }

    button {
        border: none;
        padding: 0em 0.2em;
        width: 2em;
        background-color: transparent;
        height: 1.2em;
    }

    button.top {
        vertical-align: text-bottom;
    }

    button.top:hover {
        background-color: #6af;
        color: #000;
    }

    button.bottom {
        vertical-align: top;
    }

    button.bottom:hover {
        background-color: #f66;
        color: #000;
    }
</style>