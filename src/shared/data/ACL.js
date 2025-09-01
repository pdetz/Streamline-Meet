// Your file
import Parse from "parse/dist/parse.min.js";
import { upsertParseObjectByProps, newParseObject } from './ParseHelpers.js';
import { loadParseObjects } from './LoadParseObjects.js';
import { transformParseObject } from '@models/models.js';

async function createUsers(teamId) {
  let rolesQuery = new Parse.Query(Parse.Role);
  rolesQuery.equalTo("name", "coach");
  const coachRole = await rolesQuery.first();

  if (!coachRole) {
    console.error("Error: 'coach' role not found.");
    return;
  }

  const acl = new Parse.ACL();
  acl.setPublicReadAccess(false); 
  acl.setRoleReadAccess("admin", true);
  acl.setRoleWriteAccess("admin", true);

  // const teams = await loadParseObjects("Team", { leagueId: "RbZWGDEF5f" });
  const teams = await loadParseObjects("Team", { objectId: teamId });
  const league = Parse.Object.extend("League").createWithoutData("RbZWGDEF5f"); // Replace with actual league ID
  const season = Parse.Object.extend("Season").createWithoutData("tuDAcblNdJ"); // Replace with actual season ID

  for (const team of teams) {
    const n = Math.floor(Math.random() * 9000) + 1000; // Generate a random number between 0 and 1000
    const newCoachData = {
      username: team.abbr + "-coach",
      password: team.abbr + "mcsl" + n,
      role: "coach",
      team: Parse.Object.extend("Team").createWithoutData(team.objectId), // Create a Pointer to the Team object
      league,
      season,
      ACL: acl,
      n
    };

    try {
      const savedUser = await upsertParseObjectByProps('User', 
        {username: newCoachData.username}, 
        newCoachData);
      coachRole.getUsers().add([savedUser]);
      //coachRelation.add(lastUser);
      await coachRole.save();

      console.log(`User ${savedUser.get('username')} added to the 'coach' role.`);
      return transformParseObject(savedUser);
    } catch (error) {
      console.error(`Error creating user for team ${team.abbr}:`, error);
    }
  }

  console.log('Finished creating and assigning coach users.');
}

async function checkCurrentUser() {
  const currentUser = Parse.User.current();
  if (currentUser) {
      console.log('Current user logged in:', currentUser.getUsername());
      await newParseObject('LogInHistory', {
        user: currentUser.getUsername(),
        action: 'current user logged in',
      });
      try {
          // Fetch the roles for the current user
          /*
          const roles = await currentUser.getRoles();
          const roleNames = roles.map(role => role.getName());
          console.log('Current user roles:', roleNames);

          if (!roleNames.includes('admin')) {
              console.warn('Current user is logged in but NOT in the admin role. This might be the issue.');
          }
*/
      } catch (roleError) {
          console.error('Error fetching current user roles:', roleError);
      }
  } else {
      console.log('No user currently logged in.');
  }
}

export { createUsers, checkCurrentUser };