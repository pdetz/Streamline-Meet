import { assignProperties } from './assignProperties.js';
import { updateParseObject } from '@data/ParseHelpers.js';
import { getTeamsFromFile } from '@files/integrateFile.js';
import { MCSL_MEETS, BlankMeet } from './MeetTypes/MeetType.js';
import AgeGroup from '@models/AgeGroup';
import File from '@files/File';
import MeetPlan from './MeetPlan';
import Event from '@models/Event';

class Meet {
  constructor(meet) {
    assignProperties(this, meet,
      {
        abbr: '',
        completed: false,
        course: 'S',
        createdAt: new Date().toISOString(),
        startDate: '',
        endDate: '',
        divisionName: '',
        entriesFiles: [null],
        facility: '',
        filesLoaded: false,
        is_official: false,
        meetType: null,
        name: '',
        objectId: '',
        resultsFiles: [null],
        rosterFiles: [null],
        seasonId: '',
        seeded: false,
        teamIds: [''],
        teams: [],
        meetPlan: false, //new MeetPlan({ planningFile: null }, this)
        connectedMeetId: null,
        virtual: false
      }
    );

    this.type = this.meetType ? MCSL_MEETS[this.meetType] : BlankMeet;
    //this.ageGroups = this.type.ageGroups;
    this.ageGroups = this.createAgeGroupsForMeet(this.type);
    this.course = this.type.course || this.course;
    this.points = this.type.points;
    this.relayPoints = this.type.relayPoints;
    this.swimUps = this.type.swimUps;

    this.lanes = this.type.lanes || 6;
    this.seeding = this.type.seeding || 'standard';

    this.planningScore = new Array(this.teamIds.length).fill(0);
    this.entriesScore = new Array(this.teamIds.length).fill(0);
    this.resultsScore = new Array(this.teamIds.length).fill(0);

    //this.planningFiles = File.normalizeFiles(null);
    this.entriesFiles = File.normalizeFiles(this.entriesFiles, this.teamIds.length); // Example: Ensure 5 slots
    this.resultsFiles = File.normalizeFiles(this.resultsFiles);
    this.rosterFiles = File.normalizeFiles(this.rosterFiles, this.teamIds.length); // Example: Ensure 3 slots

    this.absences = new Map();
    this.swimmersSorted = false;
    this.view = this.getDefaultView();

    this.connectedMeet = null;
    // Extend events to include swims
    this.initializeEvents(this.type.events);
  }

  connectAMeet() {
    if (!this.connectedMeetId) return;

    this.teams.forEach(team => {
      const connectedMeet = team.findMeetById(this.connectedMeetId);
      if (connectedMeet) this.connectedMeet = connectedMeet;
    });
  }

  sortAllSwimmers() {
    if (this.swimmersSorted) return;
    this.ageGroups.forEach(ageGroup => {
      ageGroup.swimmers = this.teams.flatMap(team => team.filterSwimmers(ageGroup));
    });
    //this.sortSwimUps();
    this.swimmersSorted = true;
    if (!this.meetPlan) return;

    this.meetPlan.swimmerPlans.forEach((sp, key) => {
      if (sp.status === 'Absent') {
        this.absences.set(sp.swimmer.key, sp.swimmer); // Assuming sp.swimmer is the swimmer ID or object
      }
      if (sp.ageGroups && sp.ageGroups.length > 0) this.sortSwimmerIntoAgeGroups(sp);
    });
  }

  sortSwimmerIntoAgeGroups(swimmerPlan) {
    let swimUpAgeGroups = [];
    if (swimmerPlan.ageGroups.length === 0) {
      swimUpAgeGroups = [this.swimmerBag(swimmerPlan.swimmer)];
    } else {
      swimUpAgeGroups = swimmerPlan.ageGroups;
    }
    this.ageGroups.forEach(ageGroup => {
      if (swimUpAgeGroups.some(ag => ageGroup.contains(ag))) {
        ageGroup.addSwimmer(swimmerPlan.swimmer);
      } else {
        ageGroup.removeSwimmer(swimmerPlan.swimmer);
        ageGroup.eventIndices.forEach(eventIndex => {
          const event = this.events[eventIndex];
          event.removeSwimmer(swimmerPlan.swimmer, 'planning');
        });
      }
    });
  }

  swimmerBag(swimmer) {
    const groups = this.ageGroups.filter(ageGroup => ageGroup.swimmerBelongs(swimmer));
    if (groups.length === 0) return null; // or handle as needed
  
    return groups.reduce((min, current) => {
      const currentRange = current.ages[1] - current.ages[0];
      const minRange = min.ages[1] - min.ages[0];
      return currentRange < minRange ? current : min;
    });
  }

  getBags() {
    let bags = [];
    this.ageGroups.forEach(potentialBag => {
      const contains = this.ageGroups.filter(ag => potentialBag.contains(ag)).length;
      if (contains === 1) bags.push(potentialBag);
    });
    return bags;
  }

  swimmerAgeGroup(swimmer) {
    if (!this.meetPlan) return this.swimmerBag(swimmer);
    const swimmerPlan = this.meetPlan.getSwimmerPlan(swimmer);
    if (!swimmerPlan || !swimmerPlan.ageGroups) return this.swimmerBag(swimmer);
    if (swimmerPlan.ageGroups.length === 0) return this.swimmerBag(swimmer);
    if (swimmerPlan.ageGroups.length > 1) return null;
    return this.ageGroups.find(ag => ag.isEqualTo(swimmerPlan.ageGroups[0]));
  }

  getMeetAgeGroup(ageGroup) {
    return this.ageGroups.find(ag => ag.isEqualTo(ageGroup));
  }

  createAgeGroupsForMeet(meetType) {
    //console.log(meetType);
    return meetType.ageGroups.map((ageGroup, index) => {
        // Clone the base ageGroup object
        const clonedAgeGroup = new AgeGroup({ ...ageGroup, index, genders: meetType.genders});
        
        // Add a swimmers Map or array to track swimmers in this age group for this meet
        clonedAgeGroup.swimmers = []; // Use a Map for O(1) lookup, or an array if you prefer

        return clonedAgeGroup;
    });
  }

  findSwimmerByKey(swimmer, key = 'key') {
    for (const team of this.teams) {
      const found = team.findSwimmerByKey(swimmer, key);
      if (found) return found; // Exit and return the found swimmer
    }
    return false; // Return false if no swimmer is found
  }  

  initializeEvents(events) {
    this.events = events.map((eventData) => {
      return new Event({...eventData, meet: this});
    });
    this.relayEvents = this.events.filter(event => event.relay);
  }

  getTeamByAbbreviation(teamAbbr, prop='abbr') {
    return this.teams.find((team) => team[prop] === teamAbbr);
  }

  getDefaultView() {
    if (this.completed) return 'results';
    if (this.entriesFiles.some(file => file.exists)) return 'entries';
    if (this.seeded) return 'entries';
    return 'planning';
  }

  teamIndex(team) {
    return this.teams.indexOf(team);
  }

  match(date, teamAbbrs) {
    // Check if the date matches
    let dateMatch = this.startDate === date;
  
    // Check if all teams in the provided array are in this meet's teams array
    let teamMatch = teamAbbrs.every(abbr => {
      return this.teams.some(team => team.abbr === abbr);
    });
  
    // Check if at least one team in the provided array is in this meet's teams array
    let partialTeams = teamAbbrs.some(abbr => {
      return this.teams.some(team => team.abbr === abbr);
    });
  
    // Return an object with each match condition and the combined match
    return {
      meet: this,
      date: dateMatch,
      teams: teamMatch,
      partialTeams: partialTeams,
      partialDate: dateMatch && partialTeams,
      full: dateMatch && teamMatch
    };
  }

  parseFiles() {
    if (this.filesLoaded) return;
    //if (this.meetPlan) {
    //  console.log('parse planning', this.meetPlan);
    //  this.parseSwims(this.meetPlan.planningFile, 'planning', 'seed');
    //}
    this.parseSwims(this.entriesFiles, 'entries', 'seed');
    this.parseSwims(this.resultsFiles, 'results');
    this.parseRoster();
    this.filesLoaded = true;
  }

  parseSwims(files, type = 'results', sortBy='result') {
    this.teams.forEach(team => {
      team.clearCurrentIds(); // Clear old entries or planning data
    });
    files.forEach(file => {
      if (file.parseTo(this, type)) {
        if (sortBy) this.sortSwims(type, sortBy);
        this.calculateScore(type);
        //this.view = type;
        if (type === 'results') {
          this.completed = true;
          this.view = 'results';
        }
      }
    });
    //console.log('parseResults', this.view);
  }

  parseRoster() { 
    this.rosterFiles.forEach(file => {
      file.parseTo(this, 'roster');
    });
  }

  sortSwims(type, sortBy = 'result') {
    this.events.forEach(event => {
      event[type].sort((a, b) => a[sortBy] - b[sortBy]);
    });
  }

  async updateResults(resultsFile) {
    console.log('Updating results for', this.name, 'with file:', resultsFile);
    this.clear('results'); // Clear old results data
    this.resultsFiles = [resultsFile]; // Update the file reference
    this.parseSwims(this.resultsFiles, 'results');
    try {
      await updateParseObject(this, 'Meet',
        { resultsFiles: [{name: resultsFile.name, contents: resultsFile.contents}] });
    } catch (error) {
      console.error("Error updating results file: ", error);
      throw error; // Propagate the error
    }
  }
  
  async updateEntries(entriesFile, passedTeam = null, type = 'entries') {
    this.clear(type); // Clear old entries or planning data
    let team = passedTeam;
  
    if (!team) {
      const teamAbbr = getTeamsFromFile(entriesFile)[0].abbr;
      team = this.getTeamByAbbreviation(teamAbbr);
    }
    // Update the entries file for the team
    this.entriesFiles[this.teamIndex(team)] = entriesFile;
  
    // Parse the entries file
    this.parseSwims(this.entriesFiles, type, 'seed');
  
    // Update the database
    await updateParseObject(this, 'Meet', { entriesFiles: this.entriesFiles });
    console.log(this.name, 'entries updated with', entriesFile ? entriesFile.name : 'no file');
  }

  getMeetPlan() {
    if (!this.meetPlan) {
      this.meetPlan = new MeetPlan(
        { planningFile: null, meet: this });
    }
    return this.meetPlan;
  }

  async updateSwimmerPlan(swimmer, updatedSwimmerPlan) {
    const oldPlan = this.getMeetPlan().getSwimmerPlan(swimmer);
    let update = false;
    if (oldPlan.notes !== updatedSwimmerPlan.notes) update = true;
    if (oldPlan.status !== updatedSwimmerPlan.status) {
      update = true;
      if (updatedSwimmerPlan.status === 'Absent'){
        swimmer.removeSwims(this);
        this.absences.set(swimmer.key, swimmer);
      } else {
        this.absences.delete(swimmer.key);
      }
    }
    if (updatedSwimmerPlan.ageGroups && !areAgeGroupsEqual(oldPlan.ageGroups, updatedSwimmerPlan.ageGroups)) {
      update = true;
      if (this.swimUps === 'Strict') {
        swimmer.removeSwims(this);
      }
      this.sortSwimmerIntoAgeGroups({swimmer, ...updatedSwimmerPlan});
    }
    if (update) await this.meetPlan.updateSwimmerPlan(swimmer, updatedSwimmerPlan);
    return update;
  }

  clear(type) {
    this.events.forEach(event => {
      // Iterate in reverse to avoid issues with index shifting
      for (let i = event[type].length - 1; i >= 0; i--) {
        const swim = event[type][i];
        swim.removeSwim();
      }
    });
  }

  calculateScore(type='results') {
    let allSwims = [];
    this.events.forEach(event => {
      let pts = event.name.includes("Relay") ? 
        this.relayPoints : this.points;

      event.calculateScore(pts, type);

      allSwims.push(...event[type]);
    });
    this[type + 'Score'] = this.tallyPoints(allSwims);
  }

  tallyPoints(swims) {
    const teams = this.teams;
    let points = new Array(teams.length).fill(0);

    if (swims.length === 0) return points;

    swims.forEach(swim => {
      //console.log(swim.swimmer.team.abbr);
        const teamIndex = teams.findIndex(t => t.abbr === swim.swimmer.team.abbr);
        points[teamIndex] += swim.points;
    });

    return points;
  }

  generateCurrentIds() {
    let currentId = 1;
    this.teams.forEach(team => {
      team.swimmers.forEach(swimmer => {
        swimmer.currentId = currentId;
        currentId++;
      });
    });
  }

  participants(team, type='planning') {
    let participants = new Set();
    this.events.forEach(event => {
      if (event.relay) {
        event[type].forEach(relay => {
          relay.swims.forEach(swim => {
            if (swim.swimmer.team && swim.swimmer.team.abbr === team.abbr) {
              participants.add(swim.swimmer);
            }
          });
        });
      } else {
        event[type].forEach(swim => {
          if (swim.swimmer.team.abbr === team.abbr) {
            participants.add(swim.swimmer);
          }
        });
      };
    });
    return Array.from(participants).sort((a, b) => a.nameSort(b));
  }

  individualEntries(team, type='planning') {
    let entries = [];
    this.events.forEach(event => {
      if (event.relay) return; // Skip relay events for individual entries
      event[type].forEach(swim => {
        if (swim.swimmer.team.abbr === team.abbr) entries.push(swim);
      });
    });
    return entries;
  }

  seed(){
    if (this.seeding === 'alternate') this.alternateSeedEntries();
    if (this.seeding === 'standard') this.standardSeedEntries();
    this.seeded = true;
  }

  standardSeedEntries() {
    const laneAssignments = generateLaneAssignments(this.lanes, 'standard');
    console.log(laneAssignments);
    this.events.forEach(event => {
      event.entries.sort((a, b) => a.seed - b.seed);
      let heats = Math.ceil(event.entries.length / this.lanes);
      event.entries.forEach((entry, index) => {
        entry.heat = heats + 1 - Math.ceil((index + 1) / this.lanes);
        entry.lane = laneAssignments[index % this.lanes];
      });
      event.entries.sort((a, b) => a.lane - b.lane);
      event.entries.sort((a, b) => a.heat - b.heat);
    });
  }

  alternateSeedEntries() {
    const laneAssignments = generateLaneAssignments(this.lanes, 'alternate');
    const la = generateLaneAssignments(this.lanes, 'standard');
    this.events.forEach(event => {
      event.entries.sort((a, b) => a.seed - b.seed);
      let evenEntries = event.entries.filter(event => event.swimmer.team.abbr === this.teams[0].abbr);
      let oddEntries = event.entries.filter(event => event.swimmer.team.abbr === this.teams[1].abbr);
      [evenEntries, oddEntries].forEach((entries, index) => {
        let lanes = laneAssignments[index];
        let nLanes = lanes.length;
        let heats = Math.ceil(entries.length / nLanes);
        entries.forEach((entry, index2) => {
          entry.heat = heats + 1 - Math.ceil((index2 + 1) / nLanes);
          entry.lane = lanes[index2 % nLanes];
          //console.log(entry);
        });
      });
      
      event.entries.sort((a, b) => a.lane - b.lane);
      event.entries.sort((a, b) => a.heat - b.heat);
    });
  }

  addTeam(team) {
    let existingTeam = this.teams.find(t => t.abbr === team.abbr);
    if (existingTeam) return existingTeam;
    this.teams.push(team);
  }
}

function generateLaneAssignments(lanes, seeding='standard') {
  const laneOrder = [];
  const center = Math.ceil(lanes / 2); // Central lane or the right of two central lanes if even
  laneOrder.push(center); // Start with the center lane

  for (let offset = 1; offset <= Math.ceil(lanes / 2); offset++) {
    if (center + offset <= lanes) laneOrder.push(center + offset); // Right side
      if (center - offset > 0) laneOrder.push(center - offset); // Left side
  }

  if (seeding === 'standard') return laneOrder;

  if (seeding === 'alternate') {
    const evens = laneOrder.filter(lane => !(lane % 2)); // even lanes
    const odds = laneOrder.filter(lane => lane % 2);     // odd lanes
    return [ evens, odds ];
  }
}

function blankMeet(n=1) {
    return new Meet({
      entriesFiles: new Array(n).fill(null),
      teamIds: new Array(n).fill('')
    }); 
}

const MEET_PROPS = {
  abbr: 'Meet Abbreviation',
  course: 'Course',
  date: 'Date',
  divisionName: 'MCSL Division',
  facility: 'Facility',
  is_official: 'Is Official',
  meetType: 'Meet Type',
  name: 'Meet Name',
}

function areAgeGroupsEqual(ag1, ag2) {
  if (!ag1 || !ag2) return false;
  if (ag1.length !== ag2.length) return false;
  for (let i = 0; i < ag1.length; i++) {
      if (!ag1[i].isEqualTo(ag2[i])) return false;
  }
  return true;
}

export default Meet;
export { MEET_PROPS };