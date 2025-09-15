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
  Parse.initialize('', '');
  
  Parse.serverURL = 'https://streamline.b4a.io/';

  isParseInitialized = true;
}
