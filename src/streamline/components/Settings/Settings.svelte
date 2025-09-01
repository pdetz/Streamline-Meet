<script>
    import Themes from './Themes.svelte';
    import ScrollBox from '@shared/components/ScrollBox.svelte';
    import ChangePassword from './ChangePassword.svelte';
    import UserInfo from './UserInfo.svelte';
    import { enableAliasMode, disableAliasMode } from './aliasMode';

    export let user;
    export let admin = false;
    user.setUserColors();

    let settingsHaveChanged = user.settingsHaveChanged();

  let theme = user?.theme || 'dark';

  async function updateUser() {
    await user.updateUserToParse();
    alert('Settings updated successfully!');
    haveSettingsChanged();
  }

  function haveSettingsChanged() {
    settingsHaveChanged = user.settingsHaveChanged();
  }
</script>

{#if user}
  <div class='account-settings'>
      <div class='title'>Account Settings for {user.username}
        {#if settingsHaveChanged}
          <button class='sb tool save' on:click|stopPropagation={updateUser}>
            Save Changes
          </button>
        {/if}
        {#if user.isAdmin}
          <button class='sb tool' on:click={logOut}>
            Log Out
          </button>
        {/if}
        {#if user.isAdmin}
          <SelectButtons
            options={['light', 'dark']}
            selected={theme}
            select={applyTheme}
            text={(option) => option[0].toUpperCase() + option.slice(1)}
          />
        {/if}
      </div>
      <ScrollBox>
        <div class='flex-column'>
          <UserInfo {user} {haveSettingsChanged} {admin} />

          <ChangePassword {user} />
        
          <Themes {user} {haveSettingsChanged}/>

          {#if user.role === 'admin'}
            <div class='admin-settings'>
              <button class='sb tool' on:click={()=>enableAliasMode(user)}>
                Enable Alias Mode
              </button>
              <button class='sb tool' on:click={()=>disableAliasMode(user)}>
                Disable Alias Mode
              </button>
            </div>
          {/if}          
        </div>
    </ScrollBox>
  </div>

{:else}
  <p>You must be logged in to view account settings.</p>
{/if}

<style>
  button.save {
    margin: 0 0 0 2em;
    font-size: 0.8rem;
  }
  .flex-column {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
  .account-settings {
    padding: 1em;
    font-size: 0.9rem;
    height: calc(100% - 2rem);
  }
  .title {
    font-size: 1.1rem;
    height: 1.5em;
    padding: 0.1em;
    margin-bottom: 1em;
    vertical-align: bottom;
  }
</style>