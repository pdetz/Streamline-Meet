import Parse from 'parse/dist/parse.min.js';
import EventEmitter from 'eventemitter3';

let isParseInitialized = false;

export default function initializeParse() {
  console.log("Initializing Parse SDK...");

  if (isParseInitialized) {
    console.warn("Parse SDK is already initialized. Skipping re-initialization.");
    return;
  }
  Parse.EventEmitter = EventEmitter;
  //Parse.initialize('rS30iXTG4Tjs7SS3WgbjlBKHQKw4QhLvqIdnXZfk', 'Ew7bZdUDm9N62S7e82D1ZXUtUBSDcYsHMWC3LhuQ');
  Parse.initialize('cDTG4xNVCw6MpMl7yTXJJFz13M2RvrFmJTbuycEh', 'Ye9sadli0rL0Z3zprj6z6sEgENEeIKVScTqO96b5');
  
  //Parse.serverURL = 'https://parseapi.back4app.com/';
  Parse.serverURL = 'https://streamline.b4a.io/';

  isParseInitialized = true;
  //Parse.serverURL = 'https://accepted-constancy-pdetz-8dfa5a7e.koyeb.app/parse';
}