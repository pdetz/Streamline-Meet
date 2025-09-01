import { upsertParseObjectByProps } from "@data/ParseHelpers";
//import { loadParseObjects } from "@shared/data/LoadParseObjects";
import { loadDivision } from "@shared/data/LoadData";

export default async function createRelayCarnivals(season) {
    for (let division of season.divisions) {
      division = await loadDivision(division, season);
      const teamIds = division.teams.map(team => team.objectId);
      const nullFiles = division.teams.map(team => null);

      let relayCarnival = {
        abbr: `${division.name} RELAYS`,
        startDate: '07062025',
        endDate: '07062025',
        divisionName: division.name,
        is_official: true,
        meetType: 'REL',
        name: `Division ${divisionName} Relay Carnival`,
        seasonId: season.objectId,
        teamIds,
        entriesFiles: nullFiles,
        resultsFiles: nullFiles
      };
      console.log('Division:', division);
      console.log('Relay Carnival:', relayCarnival);
      await upsertParseObjectByProps('Meet', {abbr: relayCarnival.abbr}, relayCarnival);
    }
}