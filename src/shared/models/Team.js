import { MY_TEAM, seasonStore } from '@src/stores';
import { get } from 'svelte/store';
import { assignProperties } from "./assignProperties";
import { updateParseObject, upsertParseObjectByProps } from '@data/ParseHelpers';
import { Swimmer } from '@models/Swimmer';

class Team {
  constructor(teamData) {
    assignProperties(this, teamData,
      {
        objectId: '',
        rosterFile: null,
        mascot: '',
        leagueId: '',
        name: '',
        abbr: '',
        divisionName: '',
        createdAt: new Date().toISOString(),
        meets: [],
        swimmers: [],
        groupings: [],
        meetPlans: [],
        meetConfirmations: []
      }
    );
    //this.rosterFile = new File(teamData.rosterFile);
    this.fullName = teamData.name + ' ' + teamData.mascot;
  }

  isMyTeam () {
    const myTeam = get(MY_TEAM);
    return this.abbr === myTeam.abbr;
  }

  findMeetById(objectId){
    return this.meets.find((meet) => meet.objectId === objectId);
  }

  // Add a new meet to the team's array of meets
  addMeet(meet) {  
    let existingMeet = this.findMeetById(meet.objectId);
    if (existingMeet) return existingMeet;
    this.meets.push(meet);
    this.meets.sort((a, b) => a.startDate > b.startDate ? 1: -1);
    meet.addTeam(this);
    return meet;
  }

  addMeets(meets) {
    meets.forEach(meet => this.addMeet(meet));
  }

  // Remove a meet from the team's array of meets
  removeMeet(meet) {
    const index = this.meets.indexOf(meet);
    if (index > -1) {
      this.meets.splice(index, 1);
    }
  }

  filterSwimmers({ages, gender}) {
    return this.swimmers.filter((swimmer) => {
      const ageMatch = ages[0] <= swimmer.age && ages[1] >= swimmer.age;
      const genderMatch = gender === "X" || swimmer.gender === gender;
      return ageMatch && genderMatch;
    });
  }
  
  findSwimmerByKey(swimmer, key = 'key') {
    if (swimmer[key] !== undefined && swimmer[key] !== null && swimmer[key] !== '') {
      let keySwimmer = this.swimmers.find(s => swimmer[key] !== '' && swimmer[key] === s[key]);
      if (keySwimmer) return keySwimmer;
      
      if (typeof swimmer[key] === 'string') {
        // If the key is a string, check for case-insensitive match
        keySwimmer = this.swimmers.find(s => s[key].toLowerCase() === swimmer[key].toLowerCase());
        if (keySwimmer) return keySwimmer;
      }
    }
    let ussIDSwimmer =  this.swimmers.find((s) => s.ussID !== '' && swimmer.ussID === s.ussID);
    if (ussIDSwimmer) return ussIDSwimmer;
    return false;
  }

  findSwimmerByName(apellido, nombre) {
    let found = this.swimmers.find(swimmer => swimmer.nombre.toLowerCase() === nombre.toLowerCase() && swimmer.apellido.toLowerCase() === apellido.toLowerCase());
    if (found) return found;
    return false;
  }

  addSwimmer(swimmer) {
    let existingSwimmer = this.findSwimmerByKey(swimmer);

    if (!existingSwimmer) {
      let newSwimmer = new Swimmer(swimmer);
      this.swimmers.push(newSwimmer);
      this.swimmers.sort((a, b) => {
        if (a.apellido < b.apellido) return -1;
        if (a.apellido > b.apellido) return 1;
        if (a.nombre < b.nombre) return -1;
        if (a.nombre > b.nombre) return 1;
        return (a.age > b.age) ? 1 : -1;
      });
      //newSwimmer.writeToDatabase();
      return newSwimmer;
    }
    return existingSwimmer;
  }

  addSwimmers(swimmers) {
    swimmers.forEach(swimmer => {
      this.addSwimmer(swimmer);
    });
  }

  clearCurrentIds() {
    this.swimmers.forEach(swimmer => {
      swimmer.currentId = 0;
    });
  }

  parseRosterFile() {
    this.rosterFile.parseSdifFile(this, 'roster');
  }

  async updateRoster(rosterFile) {
    const season = get(seasonStore);
    try {
      await upsertParseObjectByProps('RosterFile', 
        {teamId: this.objectId, seasonId: season.objectId},
        {contents: rosterFile.contents, name: rosterFile.name, count: this.swimmers.length}
      );
      this.rosterFile = rosterFile;
      this.swimmers = [];
      this.parseRosterFile();   
      return this.swimmers;
    } catch (error) {
      console.error("Error updating roster file: ", error);
      throw error; // Propagate the error
    }
  }

  // Remove a swimmer from the team's array of swimmers
  removeSwimmer(swimmer) {
    const index = this.swimmers.indexOf(swimmer);
    if (index > -1) {
      this.swimmers.splice(index, 1);
    }
  }
}

export default Team; // in Team.js