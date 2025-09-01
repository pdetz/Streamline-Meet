import { Swim, NO_SWIM, numberToTime } from "./Swim";
import { assignProperties } from "./assignProperties";

class Relay {
    //constructor(swims, event, lane = null, place = null) {
    constructor(relay) {
        assignProperties(this, relay,
            {dq: false,
              exhibition: false,
              result: null,
              type:'results',
              points: 0,
              heat: null,
              lane: null,
              place: null,
              converted: false,
              hypothetical: false,
              selectedIndex: -1,
              label: '', 
              swims: []
            }
        );
        if (this.swims.length === 0) {
          this.swims = relay.event.legs.map(leg => NO_SWIM);
        }
        this.swimmer = {team: this.team};
        this.meet = relay.event.meet;

        if (this.hypothetical) this.meet = {name: '', date: '', abbr: ''};
        if (!this.result) this.updateTime(this.type === 'results' ? 'result' : 'seed');
        this.updateKey();
    }

    addRelay() {
        if (!this.existsIn(this.event)) {
          this.event[this.type].push(this);
            this.event[this.type].sort((a, b) => a.seed - b.seed);
            return true;
        }
        return false;
    }

    existsIn(event) {
        return event[this.type].some(relay => this.key === relay.key);
    }

    updateTime(seedOrResult = 'seed') {
      if (this.type === 'entries') return;
      let newTime = 0;
      this.swims.forEach(swim => {
        if (swim[seedOrResult] === null) return;
        if (swim[seedOrResult] > 9990) return;
        newTime += swim[seedOrResult];
      });
      this[seedOrResult] = newTime;
      this.updateKey();
    }

    displaySwimmers() {
        return this.swims.map(swim => swim.swimmer.display).join(', ');
    }

    displaySwimmersShort() {
        return this.swims.map(swim => {
          if (swim === NO_SWIM) return '';
          return swim.swimmer.displayShort;
        }).join(', ');
    }

    display(seedOrResult = 'result') {
      // Convert the number to time (implement numberToTime() as needed) and append '*' if converted
      return numberToTime(this[seedOrResult]) + (this.hypothetical ? ' *' : '');
    }
    
    removeSwim() {
        //[this.event].forEach(target => {
          const index = this.event[this.type].indexOf(this);
          if (index !== -1) {
            this.event[this.type].splice(index, 1);
          }
          return this;
        //});
    }
    
    updateSwims(newSwims, seedOrResult='seed') {
      this.swims.forEach(swim => swim.removeSwim());
      this.swims = newSwims.map(swim => {
          return new Swim(swim);
      });
      this.updateTime('result');
    }

    updateKey() {
      this.key = this.meet.name + this.team.abbr + this.event.n + this.label + this.display('seed') + this.display() + this.swims.map(s => s.swimmer.key).join() + Math.floor(Math.random()*9999); 
      //if (this.type === 'results') console.log('Relay key: ', this.key, this, this.result);
    }
}


export default Relay;