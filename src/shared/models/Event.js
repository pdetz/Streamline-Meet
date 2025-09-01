
import { assignProperties } from "./assignProperties";

class Event {
    constructor(event) {

      assignProperties(this, event, 
        {stroke: null,
          distance: 0,
          ageGroup: null,
          relay: event.stroke.relay,
          virtualEvent: false,
          maxEntries: event.maxEntries || 0
        }
      );

      this.planning = [];
      this.entries = [];
      this.results = [];
      this.course = this.meet.course;
      this.name = `Event ${this.n} - ${this.ageGroup.name} ${this.distance} ${this.stroke.name}`;
      this.key = this.meet.objectId + this.n;
      this.unavailableSwimmers = new Map();

      if (this.relay) this.swimmerOrderFixed = event.swimmerOrderFixed ?? true;
    }

  addSwim(swim) {
      if (!this.findSwim(swim)) this[swim.type].push(swim);
  }

  addSwims(swims, seedOrResult='result') {
    if (swims.length === 0) return;
    swims.forEach(swim => this.addSwim(swim));
    this.sortSwims(swims[0].type, seedOrResult);
  }

  updateSwim(swim, newSwim) {
      const swimIndex = this[swim.type].findIndex(s => s.key === swim.key);
      this[swim.type][swimIndex] = newSwim;
  }

  sortSwims(type, seedOrResult='result') {
      this[type].sort((a, b) => a[seedOrResult] - b[seedOrResult]);
  }

  removeSwim(swim, entryOrResult) {
      this[entryOrResult] = this[entryOrResult].filter(s => s.key !== swim.key);
      return this;
  }

  removeSwimmer(swimmer, entryOrResult) {
      this[entryOrResult] = this[entryOrResult].filter(s => s.swimmer.key !== swimmer.key);
      return this;
  }

  findSwim(swim) {
      return this[swim.type].some(s => swim.key === s.key);
  }

  findSwimBySwimmer(swimmer, entryOrResult) {
      return this[entryOrResult].find(s => s.swimmer.key === swimmer.key);
  }

  findSwimsByTeam(team, type) {
      return this[type].filter(s => s.swimmer.team.abbr === team.abbr);
  }

  calculateScore(points, entryOrResult = 'results') {

    const seedOrResult = entryOrResult === 'results' ? 'result' : 'seed';

    var sortedSwims = this[entryOrResult].filter(swim => swim[seedOrResult] < 9990);

    sortedSwims.sort(function(a, b) {
      return a[seedOrResult] - b[seedOrResult]; // Sort numerically based on the dynamic property
    });

    // Initialize an array to keep track of points for each swim
    const assignedPoints = new Array(sortedSwims.length).fill(0);
    const places = new Array(sortedSwims.length).fill(0);
    let startTieIndex = 0; // Start index of a tie in the array
  
    for (let i = 0; i <= sortedSwims.length; i++) {
      // Check if the end of array is reached or a tie is broken
      if (i === sortedSwims.length || sortedSwims[i][seedOrResult] !== sortedSwims[startTieIndex][seedOrResult]) {
        let sumPoints = 0;
        let countTie = i - startTieIndex; // Number of swimmers in the tie
        
        // Calculate the sum of points for the tied positions
        for (let j = startTieIndex; j < i; j++) {
          sumPoints += (j < points.length ? points[j] : 0); // Add points for each tied position, considering array boundaries
        }
        
        // Assign the average points to each swimmer in the tie
        let averagePoints = sumPoints / countTie;
        for (let j = startTieIndex; j < i; j++) {
          assignedPoints[j] = averagePoints;
          places[j] = i - countTie + 1;
        }
  
        // Move the startTieIndex to current position
        startTieIndex = i;
      }
    }
  
    // Assign calculated points back to swimmers
    sortedSwims.forEach((swim, index) => {
      swim.points = assignedPoints[index];
      swim.place = places[index];
    });
  
    // Optionally, you can now use sortedSwims for further processing
  }
  
  isEqualTo(event) {
    if (!this.ageGroup.isEqualTo(event.ageGroup)) return false;

    if (this.distance != event.distance || this.stroke != event.stroke) return false;

    if (this.legs) {
      if (!event.legs) return false;
      if (event.legs.length != this.legs.length) return false;
      this.legs.forEach((leg, index) => {
        if (leg.distance != event.legs[index].distance || leg.stroke != event.legs[index].stroke) return false;
      });
    }

    if (this.swimmers) {    // For relay events
      if (!event.swimmers) return false;
      if (event.swimmers.length != this.swimmers.length) return false;
      this.swimmers.forEach((swimmer, index) => {
        if (swimmer.gender != event.swimmers[index].gender) return false;
        if (swimmer.n != event.swimmers[index].n) return false;
        if (swimmer.ages[0] != event.swimmers[index].ages[0]) return false;
        if (swimmer.ages[1] != event.swimmers[index].ages[1]) return false;
      });
    }

    return true;
  }

}

export default Event;