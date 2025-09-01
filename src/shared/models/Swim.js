import { assignProperties } from "./assignProperties";

class Swim {
    //constructor(swimmer, event, meet, seed, heat=null, lane=null, result=null, place=null, converted=false) {
    constructor(swim){
      assignProperties(this, swim,
        {dq: false, 
          exhibition: false, 
          result: null, 
          type:'results', 
          points: 0, 
          heat: null,
          lane: null, 
          place: null, 
          converted: false, 
          relayLeg: false,
          add: true}
      );

      if (!this.relayLeg) {
        this.distance = swim.event.distance;
        this.stroke = swim.event.stroke;
      }
      
      this.course = swim.meet.course;
      if (!this.date) this.date = swim.meet.startDate;

      this.key = this.meet.name + this.swimmer.key + this.event.n + this.display() + this.display('seed');

      this.addSwim();
    }

    addSwim() {
      if (!this.add) return;
      if (!this.converted && !this.relayLeg) this.event.addSwim(this);
      this.swimmer.addSwim(this);
    }

    removeSwim() {
      [this.swimmer, this.event].forEach(target => {
        const index = target[this.type].indexOf(this);
        if (index !== -1) {
          target[this.type].splice(index, 1);
        }
      });
    }

    findMeetFromEntry() {
      const matches = this.swimmer.results.filter(swim => {
        return swim.stroke.abbr === this.stroke.abbr && swim.distance === this.distance && swim.result === this.seed;
      }).sort((a, b) => a.meet.startDate - b.meet.startDate);
      return matches[0] ? matches[0].meet : {name: ''};
    }

    display(seedOrResult = 'result') {
      //const value = this[seedOrResult]; //seedOrResult === 'seed' ? this.seed : this.result;
      if (this[seedOrResult] === 9996) {
        if (seedOrResult === 'result') return 'DQ '; // + this.dq.description;
        return 'NT';
      }
        return (this.exhibition ? 'X ' : '') + numberToTime(this[seedOrResult]) + (this.converted ? ' *' : '');
    }
  
    convertedTime(distance) {
      if (this.distance == distance) return this.result;
      if (this.result > 9990) return this.result;

      let convertedTime = this.result;

      if (this.distance == 100 && distance == 50){
        convertedTime = Math.round((this.result / 2 - 4) * 100) / 100;
        if (this.stroke == 2) convertedTime = Math.round((convertedTime + 1) * 100) / 100;
      }
      else if (this.distance == 50 && distance == 25){
        convertedTime = Math.round((this.result / 2 - 2) * 100) / 100;
      }
      else if (this.distance == 25 && distance == 50){
        convertedTime = 2 * this.result + 4;
      }
      else if (this.distance == 50 && distance == 100){
        convertedTime = 2 * this.result + 8;
      }
      else if (this.distance == 25 && distance == 100){
        convertedTime = 4 * this.result + 16;
      }
      return convertedTime;
    }
}

const CODES = {"DQ": 9996, "NS": 9997, "NT": 9998, "": 9999};
const SEDOC = Object.fromEntries(
    Object.entries(CODES).map(([key, value]) => [value.toString(), key])
);

function timeToNumber(time) {
  if (time > 9997) return 'NT';
  if (CODES[time] !== undefined) return CODES[time];

  var [minutes, seconds] = time.split(':').map(parseFloat);
  if (typeof seconds !== 'undefined') return minutes * 60 + seconds;
  else return minutes;
}

function numberToTime(number) {

  if (!number) return '';
  if (number >= 9996) {
    console.log(number, SEDOC[number]);
    return SEDOC[number];
  } 

  var minutes = Math.floor(number / 60);
  var seconds = (number - minutes * 60).toFixed(2);
  
  // Format the time components with leading zeros if necessary
  var minutesString = minutes == 0 ? '' : minutes.toString() + ":";
  var secondsString = seconds.toString().padStart(5, '0');

  return minutesString + secondsString;
}

class NoSwim {
  constructor(key) {
    this.swimmer = {nombre: '', apellido: '', age: 110, key: 'ns'};
    this.distance = null;
    this.stroke = null;
    this.exhibition = false;
    this.seed = 9999;
    this.result = 9999;

    this.meet = {is_official:true};
    this.date = null;
    this.place = null;
    this.converted = false;

    this.key = key;
  }

  display() {return '';}
  removeSwim() {};

  convertedTime() {
    return 9999;
  }
}

const NO_SWIM = new NoSwim("no_swim"); 

function compareTimes(t1, t2) {
  return t1.result - t2.result;
}

export { Swim, NO_SWIM, compareTimes, timeToNumber, numberToTime };