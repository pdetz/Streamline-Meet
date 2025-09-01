import { HY3 , SD3 } from './FileFormat';
import { assignProperties } from '@models/assignProperties';
import { parseHtmlResultsFile } from '@files/fileParsing/parseHtmlFiles';

class File {
    constructor(file) {
        assignProperties(this, file, {
            name: 'New File.hy3',
            contents: ''
        })
        this.fileFormat = this.getFormat();
        this.lineTypes = {}; // Initialize with your line types
        this.exists = !(this.contents === '');
    }

    static NULL_FILE = Object.freeze(new File({name: 'NULL_FILE.hy3', contents: ''}));

      // Static method to normalize file arrays
    static normalizeFiles(filesArray, number = 1) {
      if (!filesArray) return [File.NULL_FILE];

      if (filesArray.hasOwnProperty('name') && filesArray.hasOwnProperty('contents')) {
        return [new File(filesArray)];
      }

      const normalizedArray = Array.isArray(filesArray) 
        ? filesArray.map(file => file ? new File(file) : File.NULL_FILE) 
        : [];

      // Ensure the array has the specified length
      while (normalizedArray.length < number) {
        normalizedArray.push(File.NULL_FILE);
      }

      return normalizedArray;
    }

    static writeEntriesToFile(meet, teams, type='entries', writeRelaySplits = true) {
      //const entries = meet.entries.filter(entry => entry.teamId === team.objectId);
      meet.generateCurrentIds(); // Generate current IDs for swimmers and relays
      
      const fileName = `${meet.name} - ${type.toUpperCase()}.hy3`;
      let fileContents =  HY3.writeLine('A1') +
                          HY3.writeLine('B1', meet) +
                          HY3.writeLine('B2', meet);

      teams.forEach(team => {
        fileContents += HY3.writeLine('C1', team) +
                        HY3.writeLine('C2', team) +
                        HY3.writeLine('C3', team);
        team.swimmers.forEach(swimmer => {
          const swims = swimmer[type].filter(swim => swim.meet.name === meet.name);
     
          if (swims.length > 0) {
            fileContents += HY3.writeLine('D1', swimmer);
            swims.forEach(swim => {
              fileContents += HY3.writeLine('E1', {swim, swimmer, meet} ); 
            });
          } else if (swimmer.findRelayEvents(meet, type).length > 0) {
            fileContents += HY3.writeLine('D1', swimmer);
          }
        });
        meet.relayEvents.forEach(relayEvent => {
          relayEvent.planning.forEach(relay => {
            if (relay.team.abbr === team.abbr) {
              fileContents += HY3.writeLine('F1', {relay, meet} );
              fileContents += HY3.writeLine('F3', {swims: relay.swims} );
              if (writeRelaySplits) {
                fileContents += HY3.writeLine('F4', {hypothetical: relay.hypothetical, swims: relay.swims} );
              }
            }
          });
        });
      });
      
      return new File({name: fileName, contents: fileContents});
    }

    static writeResultsToFile(meet, teams, writeRelaySplits = true) {
      //const entries = meet.entries.filter(entry => entry.teamId === team.objectId);
      meet.generateCurrentIds(); // Generate current IDs for swimmers and relays
      
      const fileName = `${meet.name} - Results.hy3`;
      let fileContents =  HY3.writeLine('A1') +
                          HY3.writeLine('B1', meet) +
                          HY3.writeLine('B2', meet);

      teams.forEach(team => {
        fileContents += HY3.writeLine('C1', team) +
                        HY3.writeLine('C2', team) +
                        HY3.writeLine('C3', team);
        team.swimmers.forEach(swimmer => {
          const swims = swimmer.results.filter(swim => swim.meet.name === meet.name);
     
          if (swims.length > 0) {
            fileContents += HY3.writeLine('D1', swimmer);
            swims.forEach(swim => {
              fileContents += HY3.writeLine('E1', {swim, swimmer, meet} ); 
              fileContents += HY3.writeLine('E2', {swim, swimmer, meet} ); 
            });
          } else if (swimmer.findRelayEvents(meet, type).length > 0) {
            fileContents += HY3.writeLine('D1', swimmer);
          }
        });
        meet.relayEvents.forEach(relayEvent => {
          relayEvent.planning.forEach(relay => {
            if (relay.team.abbr === team.abbr) {
              fileContents += HY3.writeLine('F1', {relay, meet} );
              fileContents += HY3.writeLine('F3', {swims: relay.swims} );
              if (writeRelaySplits) {
                fileContents += HY3.writeLine('F4', {hypothetical: relay.hypothetical, swims: relay.swims} );
              }
            }
          });
        });
      });
      
      return new File({name: fileName, contents: fileContents});
    }

    static writeRosterToFile(team) {
      const fileName = `${team.name} Roster.hy3`;
      let fileContents =  HY3.writeLine('A1', {}, 'roster') +
                          HY3.writeLine('C1', team) +
                          HY3.writeLine('C2', team) +
                          HY3.writeLine('C3', team);
      team.swimmers.forEach(swimmer => {
        swimmer.currentId = swimmer.id;
        fileContents += HY3.writeLine('D1', swimmer, 'roster');
      });
      return new File({name: fileName, contents: fileContents});
    }

    static writeCompleteRosterToFile(team) {
      console.log('Writing complete roster for team:', team.name);
      const fileName = `${team.name} Complete Roster.hy3`;
      let fileContents =  HY3.writeLine('A1', {}, 'roster') +
                          HY3.writeLine('C1', team) +
                          HY3.writeLine('C2', team) +
                          HY3.writeLine('C3', team);
      team.swimmers.forEach(swimmer => {
        swimmer.currentId = swimmer.id;
        fileContents += HY3.writeLine('D1', swimmer, 'roster');
        swimmer.parents?.forEach(parent => {
          fileContents += HY3.writeLine('D_', parent, 'roster');
        });
      });
      return new File({name: fileName, contents: fileContents});
    }

    getFormat() {
        const fileFormats = {
            hy3: HY3,
            sd3: SD3,
            cl2: SD3,
            html: 'html'
        };
        return fileFormats[this.name.split('.').pop().toLowerCase()];
    }

    parseTo(object, type) {
      if (!this.exists) return false;
      if (this.fileFormat === 'html') {
        parseHtmlResultsFile(object, this);
      } else {
        this.parseSdifFile(object, type);
      }
      return true;
    }

    parseSdifFile(object, type) { // object is a meet or team, to be overwritten later
      const lines = this.contents.split('\n');
      let current = {
        meet: object,
        type: type, // overwritten in A1
        team: object,
        swimmer: {key: null},
        swim: null,
        relay: null,
        entriesPlanningOrResults: type
      };
    
      lines.forEach(line => this.parseLine(line, current));
    }

    read() {
        // Implement logic to read the file from the cloud or upload
    }

    write() {
        // Implement logic to write the file to the cloud or download
    }

    parseLine(line, current) {
      const parsedData = this.fileFormat.parse(line, current.type);
      const parser = this.fileFormat.getParser(line);
      if (parser) parser(parsedData, current);
    }

    getEvents() {
        return this.fileFormat.getMultipleKeysMultipleValues(this.file, 
            ['eventNumber', 'eventGender', 'distance', 'stroke', 'ageLower', 'ageUpper'], ['label']);
    }
}

export default File;