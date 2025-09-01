import { userStore } from '@src/stores.js';
import { transformParseObject } from '@models/models.js';
import Parse from 'parse/dist/parse.min.js';
import { loadData } from './LoadData';
import { get } from 'svelte/store';
import { viewStore } from '@src/stores.js';
import Meets from '@streamline/components/meets/Meets.svelte';
import { newParseObject } from './ParseHelpers';

async function fullUserObject(user) {
  const userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo('objectId', user.id);
  userQuery.include('league'); // Include the object pointed to by the 'league' field
  userQuery.include('season'); // Include the object pointed to by the 'season' field
  userQuery.include('team'); // Include the object pointed to by the 'team' field

  const userWithIncludes = await userQuery.first(); // Use first() or get(parseUser.id)
  //console.log('userWithIncludes', userWithIncludes);
  return transformParseObject(userWithIncludes); // Transform the Parse object to your desired format
}

async function logIn(username, password) {
    try {
      let parseUser = await Parse.User.logIn(username, password);
      //console.log('login check');
      //await checkCurrentUser(); // Check if the user has the correct role
      if (parseUser) {
        const user = await fullUserObject(parseUser); // Use first() or get(parseUser.id)
        console.log('userWithIncludes', user);
        await newParseObject('LogInHistory', {
          user: username,
          action: 'login',
        });
        if (user) {
            //let user = transformParseObject(userWithIncludes); // Transform the Parse object to your desired format
            await loadData(user);
            viewStore.set({name: 'Meets', component: Meets, props: {meet: null}});
        } else {
          console.error("Failed to refetch user object with includes after successful login.");
        }

      } else {
        console.error("Login failed: Parse.User.logIn did not return a user.");
      }

    } catch (error) {
      // Catch any errors from Parse.User.logIn OR the subsequent query.
      console.error("An error occurred during login or subsequent data fetching:", error);
      try {
        const currentUser = Parse.User.current();
        if (currentUser) {
          await Parse.User.logOut(); // Attempt cleanup
          console.log("User logged out successfully after login error.");
          await newParseObject('LogInHistory', {
            user: username,
            action: 'error log out',
          });
        }
      } catch (logoutError) {
        console.error("Error during cleanup after login fetch error:", logoutError);
      }
      userStore.set(null); // Ensure userStore is cleared on any login/fetch failure
    }
  }

  async function logOut() {
    const user = get(userStore);
    try {
      await Parse.User.logOut(); // Log out the user from Parse
      console.log(user.username + ' logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
    userStore.set(null);
  }

  export { logIn, logOut, fullUserObject };