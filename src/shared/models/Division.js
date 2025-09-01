import { assignProperties } from "./assignProperties";

class Division {
  constructor(divisionData) {
    assignProperties(this, divisionData, 
      {
        name: 'X',
        teams: [],
        meets: []
      }
    );
    this.teamsLoaded = false;
    this.meetsLoaded = false;
  }

  getTeamById(teamId) {
    return this.teams.find((team) => team.objectId === teamId);
  }

  getTeamByAbbreviation(abbr) {
    return this.teams.find((team) => team.abbr === abbr);
  }

  getMeetById(meetId) {
    return this.meets.find((meet) => meet.objectId === meetId);
  }
  
  addMeet(meet, sort=true) {
    if (!this.meets.some(m => m.objectId === meet.objectId)) {
      this.meets.push(meet);
      meet.teamIds.forEach(teamId => {
        const team = this.getTeamById(teamId);
        if (team) {
          team.addMeet(meet); // Ensure teams get the meet
        }
      });
      if (sort) this.meets.sort((a, b) => a.startDate - b.startDate);
    }
  }

  addMeets(meets) {
    meets.forEach(meet => this.addMeet(meet, false)); // Reuse `addMeet()`
    this.meets.sort((a, b) => a.startDate - b.startDate);
  }

}

  export default Division;