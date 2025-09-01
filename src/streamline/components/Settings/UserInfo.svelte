<script>
  import Tile from '@shared/components/Tile.svelte';

  export let user; // Expecting user to be an object/instance with properties and a save() method
  export let haveSettingsChanged;
  export let admin = false; // Boolean to determine if the user is an admin

  let email = user?.email || ''; // Default to empty string if user is not defined
  let name = user?.name || ''; // Default to empty string if user is not defined

  function handleInput(key, value) {
    user.set(key, value); // Assuming user has a set method to update properties
    haveSettingsChanged(); // Call the passed-in handleChange function
  }
</script>

<Tile size={{width: '30em'}}>
  <div slot="title">Edit User Information</div>

  <form>
    <div class="user-info">
      <div>
        Username: {user.username}
      </div>
      <div>
        Role: {user.role}
      </div>
      {#if admin}
        <div class='admin'>
          <span class='admin'>Team ID: {user.team.objectId}</span>
          <span class='admin'>User ID: {user.objectId}</span>
        </div>
      {/if}

      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" 
          bind:value={email}
          on:input={() => {handleInput('email', email)}}  
        />
      </div>

      <div>
        <label for="name">Name:</label>
        <input type="text" id="name"
          bind:value={name}
          on:input={() => {handleInput('name', name)}}
        />
      </div>
    </div>
  </form>
</Tile>

<style>
  .user-info > div {
    margin-bottom: 1em;
  }

  label {
    display: block;
    margin-bottom: 0.5em;
    font-weight: bold;
  }

  input[type="text"],
  input[type="email"] {
    width: 100%;
    padding: 0.5em;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  div.admin {
    display: flex;
    flex-direction: row;
    gap: 2em;
    color: var(--team-color);
  }
</style>