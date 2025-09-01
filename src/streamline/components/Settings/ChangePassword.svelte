<script>
  import { get } from 'svelte/store';
  import { userStore, viewStore } from '@src/stores';
    import Tile from '@shared/components/Tile.svelte';

  export let user;

  let password1 = '';
  let password2 = '';

  // Reactive variable to display strength feedback
  $: password1Strength = passwordStrength(password1); // Pass false to not show length/char requirements initially
  $: password2Strength = passwordStrength(password2, password1);


  // Reactive variable to determine if the save button should be enabled
  // It's enabled ONLY if passwords match AND the first password meets full strength
  $: isSaveButtonEnabled = password1 !== '' && password1 === password2 && passwordStrength(password1) === '✔️';

  function applyTheme(newTheme) {
    theme = newTheme;
    if (user) {
        user.applyTheme(theme);
    }
  }

  async function handlePasswordSubmit() {
    if (password1 !== password2) {
        alert('Passwords do not match!');
        return;
    }
    if (passwordStrength(password1) !== '✔️') {
        alert('Password does not meet the strength requirements.');
        return;
    }

    if (user) {
        try {
            await user.setPassword(password1);
            alert('Password updated successfully!');
            password1 = ''; // Clear fields on success
            password2 = '';
        } catch (error) {
            console.error('Error saving password:', error);
            alert('Failed to update password: ' + error.message);
        }
    }
    password1 = ''; // Clear fields on success
    password2 = '';
  }

  function passwordStrength(password, password2='') {
    if (password === '') return '';

    // Full checks for validation
    if (password.length < 8) return '❌';

    const hasUpper = /[A-Z]/.test(password);
    if (!hasUpper) return '❌';
    const hasLower = /[a-z]/.test(password);
    if (!hasLower) return '❌';
    const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
     if (!hasNumberOrSpecial) return '❌';
    if (password !== password2 && password2 !== '') return '❌';

    return '✔️';
  }
</script>

<Tile size={{width: '30em'}}>
  <div slot='title'>Change Password</div>
  <div>Passwords must have at least one upper case letter, one lower case letter, and one number or special character.</div>
  <form class='password-form' on:submit|preventDefault={handlePasswordSubmit}>
  <div class='password-field'>
    <label for='new-password'>New password:</label>
    <input type='password' id='new-password' placeholder='Password' bind:value={password1} />
    <span class='strength-indicator'>{password1Strength}</span>
  </div>

  <div class='password-field'>
    <label for='confirm-password'>Confirm password:</label>
    <input type='password' id='confirm-password' placeholder='Confirm Password' bind:value={password2} />
    <span class='strength-indicator'>{password2Strength}</span>
  </div>

  <div class='form-actions'>
    <button type='submit' class='sb tool' disabled={!isSaveButtonEnabled}>
      Save Password
    </button>
  </div>
  </form>
</Tile>

<style>
  .password-field {
    display: grid;
    grid-template-columns: 10em 12em auto; /* Set label column to 120 pixels wide */
    gap: 0.5em;
    align-items: center;
    margin-bottom: 1em;
  }
  button.sb.tool:disabled {
    background-color: #888;
    color: #444;
  }
  button.sb.tool:disabled:hover { 
    background-image: none;
    cursor: default;
    color: #444;
    border-color: transparent;
  }
  .strength-indicator {
      font-weight: bold;
      text-align: left; /* Align text to the left */
      color: var(--text-color-1, #333); /* Default color */
  }
  
</style>