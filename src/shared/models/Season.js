import { upsertParseObjectByProps } from "@data/ParseHelpers";
import { assignProperties } from "./assignProperties";
import Division from "./Division";

class Season {
  constructor(seasonData) {
    assignProperties(this, seasonData);

    this.divisions = Object.entries(this.divisionAssignments).map(([key, value]) => 
      new Division({ name: key, teams: value, meets: [] })
    );

    this.teams = Object.entries(this.divisionAssignments)
      .flatMap(([key, value]) => {
        return value;
      }).sort((a, b) => a.name.localeCompare(b.name));
  }

  setLeague(league) {
    this.league = league;
  }

  divisionOfTeam(team) {
    return this.divisions.find(division => division.teams.some(t => t.objectId === team.objectId)); 
  }

  updateDivision(division) {
    this.divisions = this.divisions.map(d => d.name === division.name ? division : d);
  }

  sortLoadedTeamsIntoDivisions(teams) {
    this.divisions.forEach(division => {
      division.teams = division.teams.map(team => {
        const loadedTeam = teams.find(t => t.objectId === team.objectId);
        return loadedTeam ? loadedTeam : team;
      });
      division.teamsLoaded = true;
    });
  }

  async createDivisionalsMeets() {
    for (let division of this.divisions) {
      const queryProps = {
        name: `${division.name} Divisionals`,
        abbr: `${division.name} DIV`,
        divisionName: division.name,
        seasonId: this.objectId,
        meetType: 'DIV',
        startDate: this.weeks[5],
        endDate: this.weeks[5],
      }
      const divisionalsProps = {
        entriesFiles: division.teams.map(team => null),
        resultsFiles: [null],
        teamIds: division.teams.map(team => team.objectId),
        is_official: true
      }
      const newMeet = await upsertParseObjectByProps('Meet', queryProps, divisionalsProps);
      console.log(newMeet);
    };
  }

  getMeetsByDate(date) {
    return this.divisions.flatMap(division => 
      division.meets.filter(meet => meet.startDate === date)
    );
  }

  // Optionally, you can add methods for the League class here
}

export default Season;
