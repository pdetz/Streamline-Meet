<script>
  import Tile from "@shared/components/Tile.svelte";
  import { logIn } from "@data/loginout";

  let username = "";
  let password = "";

  async function login() {
    await logIn(username, password);
  }
</script>

<div class='login-background'>
  <Tile size={{ width: "40em", height: "auto" }}>
    <div class='title' slot="title">
      Log In to <span class='blue-gradient'>Streamline</span> 
    </div>

    <div class='flexrow'>
      <div class='logo'>
        <img src='streamline.svg' alt='Streamline Logo' />
      </div>
      <form on:submit|preventDefault={login}>
        <label>
          Username:
          <input type="text" bind:value={username} placeholder="Enter your username" />
        </label>
        <label>
          Password:
          <input type="password" bind:value={password} placeholder="Enter your password" />
        </label>
        <button type="submit" class='sb tool'>
          Log In
        </button>
      </form>
    </div>
  </Tile>
  <div class='copyright'>© 2025 Streamline Swimming Solutions, LLC</div>
</div>

<style>
  div.title {
    font-size: 1.2em;
    font-weight: bold;
        background: linear-gradient(to right, #fff, #adf 10%, #6af 40%, #04f 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  span.blue-gradient {
    background: linear-gradient(90deg, var(--blue));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  div.login-background {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    z-index: 1001;
    background-color: var(--bg-color-1);
  }
  div.copyright {
    width: 30em;
    text-align: right;
    font-size: 0.8em;
    color: #04f;
  }

  div.flexrow {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }

  form {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
  }

  input {
    margin: 0.2rem;
    padding: 0.5rem;
    background-color: var(--bg-color-2);
    border: 2px solid var(--bg-color-1);
    border-radius: 0.3rem;
    color: #ccc;
  }

  input:hover {
    border-color: var(--border-color-hl);
    background-color: var(--bg-color-2);
  }

  button {
    padding: 0.5rem;
    border: 2px solid #00f;
    border-radius: 4px;
    background-color: #00f;
    color: #ccc;
    font-weight: bold;
    cursor: pointer;
  }

  button:hover {
    background-color: 000;
    border-color: #6af;
  }
</style>