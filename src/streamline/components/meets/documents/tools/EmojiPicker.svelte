<script>
  import { writable } from 'svelte/store';
  import Picker from './Picker.svelte';
  import { EMOJIS } from './colorsEmojis.js';

  export let selectedEmojis = [];
  export let selectedColors = [];
  export let selectEmojis = () => {};
  let which = writable(0);
  let newEmojis = [...selectedEmojis];

  function handleToggle() {
    which.update(n => 1 - n);
  }

  function onEmojiClick(n, emoji) {
    newEmojis[n] = emoji;
    //newEmojis = [...newEmojis];
    selectEmojis([...newEmojis]);
  }

  function radialGradiant(emoji, n) {
    if (newEmojis[n] !== emoji) return '';
    return `background-image: radial-gradient(circle, 
      #fff 10%,
      ${selectedColors[1]} 20%,
      ${selectedColors[1]} 45%, 
      ${selectedColors[0]} 75%)`;
  }
</script>

<div class="toolbox">
  <button class="toggle" on:click={handleToggle}>
    {#each ["Regular Swims", "Swim Ups"] as label, l}
      <div
        style="color: {selectedColors[0]}; filter: brightness({$which == l ? '100%' : '50%'}); filter: grayscale({$which == l ? '0%' : '70%'})"
      >
        {label}
      </div>
    {/each}
  </button>

  <div class="underline">
    <div class="line pos{$which}" style="border-color: {selectedColors[0]}"></div>
  </div>

  <div class="slide">
    <div class="slider sliiide pos{$which}">
      {#each [0, 1] as n}
        <Picker
          items={ EMOJIS }
          selectedItem={newEmojis[n]}
          onButtonClick={(emoji) => onEmojiClick(n, emoji)}
          buttonProps={(emoji) => ({
            text: emoji,
            style: radialGradiant(emoji, n)
          })}
        />
      {/each}
    </div>
  </div>
</div>

<style>
  button.toggle{
    border: 0.125rem solid transparent;
    background: none;
    border-radius: 0.3rem;
    display: flex;
    align-items: stretch;
    justify-content: center;
    flex-flow: row;
    width: 18.625rem;
    cursor: pointer;
  }

  button.toggle:hover{
      outline: 2px solid #888;
  }

  button.toggle:active{
      filter: brightness(50%);
  }

button.toggle>div {
    display: flex;
    justify-content: center;
    flex: 1;
    text-align: center;
    transition: 1s ease;
}
  div.slide {
    z-index: 1;
    display: flex;
    flex-flow: nowrap;
    width: 19rem;
    overflow-x: hidden;
  }

  div.slider {
      z-index: 0;
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      min-width: calc(200% + 2rem);
  }

  div.slider.pos1{
      transform: translate(0);
  }

  div.slider.pos0{
      transform: translate(-21rem);    
  }

  div.underline{
    width: 18.625rem;
    margin: -0.3125rem 0 0.5rem 0;
  }

  div.sliiide {
    transition: transform 1s ease-in-out;
  }

  div.line{
      border-top: 0.0625rem solid;
      width: 9.125rem; 
      transition: transform 1s ease-in-out;
  }
  div.line.pos1{
      transform-origin: right;
      transform: scaleX(1) translateX(9.5rem);
  }
  div.line.pos0{
      transform-origin: right;
      transform: scaleX(1) translateX(0);
  }
</style>