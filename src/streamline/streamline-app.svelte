<script>
// ©2025 Streamline Swimming Solutions, LLC
  import { onMount } from 'svelte';
  import { userStore, viewStore } from '@src/stores';
  import SelectButtons from '@shared/components/SelectButtons.svelte';
  import Roster from '@roster/Roster.svelte';
  import Meets from './components/meets/Meets.svelte';
  import LogIn from './components/LogIn.svelte';
  import EmailPreview from '@coms/EmailPreview.svelte';
  import TeamSelector from './components/TeamSelector.svelte';
  import Settings from './components/Settings/Settings.svelte';
  import UserManagement from './components/UserManagement.svelte';
  import VirtualMeet from './components/VirtualMeet.svelte';
  import Logo from '@logo/Logo.svelte';
  import SeasonAdmin from './components/SeasonAdmin.svelte';
  import { applyTheme } from '@models/User';
  import { fullUserObject, logOut } from '@data/loginout';

  import Parse from 'parse/dist/parse.min.js';
  import { transformParseObject } from '@models/models';
  import DropDownMenu from '@shared/components/DropDownMenu.svelte';
  import { loadData } from '@data/LoadData';
    import Reports from './components/Reports/Reports.svelte';

	//userStore.set(null); // Start with no user logged in

	$: isLoggedIn = $userStore !== null && $userStore !== undefined;
  let loading = true;

  let coachOptions = [
    { name: 'Meets', component: Meets },
    { name: 'Roster', component: Roster },
    { name: 'Settings', component: Settings },
    { name: 'Emails', component: EmailPreview },
    { name: 'Virtual Meet', component: VirtualMeet },
    { name: 'Reports', component: Reports}
    //{ name: 'Improvements', component: Improvements },
  ];
  let adminOptions = [
    ...coachOptions,
    //{ name: 'Team Selector', component: TeamSelector },
    { name: 'User Management', component: UserManagement },
    { name: 'Season Admin', component: SeasonAdmin },
    { name: 'Logo', component: Logo },
    //{ name: 'Create Users', component: CreateUsers },
    //{ name: 'Create Events', component: CreateEvents },
  ];
  $: options = $userStore && $userStore.role==='admin' ? adminOptions : coachOptions;
  const allViewOptions = [...coachOptions, ...adminOptions,
    { name: 'Account Settings', component: Settings } // Add Account Settings to all options
  ];

  onMount(async () => {
    applyTheme('dark');
    try {
      if (!$userStore) {
        //initializeParse();
        const currentParseUser = await Parse.User.currentAsync();
        //console.log('Current Parse User:', currentParseUser); // Debugging line
        if (currentParseUser) {
          const user = await fullUserObject(currentParseUser); // Get the full user object
          //const user = transformParseObject(currentParseUser); // Transform the Parse object to your desired format
          userStore.set(user);
          await loadData(user); // Load data for the user
          setViewStore("Meets"); // Set the view based on the user data
          user.applyTheme('');
        } else {
          userStore.set(null); 
        }
      }
    } catch (error) {
      console.error('Error during initialization:', error);
    } finally {
      console.log('Initialization complete.'); // Debugging line
      loading = false;
    }
  });

  function setViewStore(name) {
    const selectedOption = allViewOptions.find(option => option.name === name);
    if (selectedOption) viewStore.set(selectedOption);
  }

  async function logout() {
    await logOut();
  }
</script>

{#if isLoggedIn}
    <div class="container">
      <div class="navbar">
        <SelectButtons 
          {options}
          selected={$viewStore}
          select={(option) => viewStore.set(option)}
          text={(option) => option.name} 
        />

        <div class='account'>
          {$userStore.username}
          <DropDownMenu style="--menu-left: auto; --menu-right: 0;">
            <div slot='menu-button' class="menu-content">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          <slot>
            <button class="sb menu" on:click={() => setViewStore('Account Settings')}>
              Account Settings
            </button>
            <button class="sb menu" on:click={logout}>
              Log Out
            </button>
          </slot>
        </DropDownMenu>

        </div>
        
      </div>
      <div class="content">
        {#if !loading && $viewStore !== null && $viewStore !== undefined}
          <svelte:component this={$viewStore.component} user={$userStore}/>
        {/if}
        </div>
      {#if loading}
        <div class="loading-overlay">
          <div class="loading-text">Loading...</div>
        </div>
      {/if}
    </div>
{:else}
  <LogIn />
{/if}
<input id="fileInput" type="file" style="display: none;" />


<style>
  
  div.account {
    margin-left: auto;
    font-size: 0.8rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  button.sb.menu {
    width: 7rem;
    background-color: transparent;
    padding: 0.1rem;
    text-align: right;
  }

  .menu-content {
    width: 1.8em;
    height: 1.8em;
    background-color: var(--bg-color-1);
    border: none;
    border-radius: 50%;
    color: var(--text-color-1);
    padding: 0.1rem;
    cursor: pointer;
    display: flex;
  justify-content: center;
  align-items: center;

  background-image: none;

  transition: background-color 0.3s ease, background-image 0.3s ease, color 0.3s ease;
}

  .menu-content:hover {
    background-image: linear-gradient(to top, var(--blue));
  }

  .container {
    display: flex;
    height: 100vh;
  }

  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3rem;
    background-color: var(--bg-color-1);
    display: flex;
    align-items: center;
    padding: 0 1rem;
    gap: 0.5rem;
    z-index: 1000;
  }

  .content {
    margin-top: 3rem;
    background-color: var(--bg-color-1);
    color: var(--text-color-1);
    padding: var(--std-padding);
    height: calc(100vh - 3rem);
    width: 100vw;
    flex: 1;
  }

  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .loading-text {
    color: var(--text-color-1);
    font-size: 2rem;
  }

</style>