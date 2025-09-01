import { get } from "svelte/store";
import { assignProperties, updatedProps } from "./assignProperties";
import { seasonStore } from "@src/stores";
import League from "./League";
import Season from "./Season";
import Team from "./Team";
import { updateParseObject } from "@data/ParseHelpers";

class User {
  constructor(userData) {
    assignProperties(this, userData,
      {
        documentColors: ['#6af', '#def'],
        teamColor: '#6b3',
        emojis: ['🐊', '⭐'],
        name: ''
      }

    );

    if (this.league) this.league = new League(this.league);
    if (this.season)  this.season = new Season(this.season);
    if (this.team) this.team = new Team(this.team);

    this.leagueTeams = [];
    this.theme = userData.theme || "dark";

    this.originalUserProps = {};
    this.propsToUpdate = {
      email: true,
      name: true,
      teamColor: true,
      documentColors: true,
      emojis: true
    };
    assignProperties(this.originalUserProps, this);
  }

  setPassword(password) {
    updateParseObject(this, '_User', { password });
  }

  updateUserToParse() {
    const updatedPropValues = updatedProps(this, this.originalUserProps, this.propsToUpdate);
    assignProperties(this.originalUserProps, updatedPropValues);
    updateParseObject(this, '_User', updatedPropValues);
    //console.log(updatedPropValues);
  }

  settingsHaveChanged() {
    const updatedPropValues = updatedProps(this, this.originalUserProps, this.propsToUpdate);
    return Object.keys(updatedPropValues).length > 0;
  }

  setColor(varName, color) {
    document.documentElement.style.setProperty(varName, color);
  }

  setUserColors() {
    this.setColor('--team-color', this.teamColor);
    this.setColor('--stripe-header', this.documentColors[0]);
    this.setColor('--stripe-stripe', this.documentColors[1]);
  }
  
  updateTeamColor(color) {
    console.log('updateTeamColor', this.teamColor, color);
    this.teamColor = color;
    this.setColor('--team-color', color);
  }

  updateDocumentColors(colors) {
    this.documentColors = colors;
    this.setColor('--stripe-header', colors[0]);
    this.setColor('--stripe-stripe', colors[1]);
  }

  // Optionally, you can add methods for the League class here
  updateTeam(team) {
    const season = get(seasonStore);
    this.teamId = team.objectId;
    this.team = team;
    this.divisionName = season.divisionOfTeam(team).name;
  }

  // Apply the user's theme
  applyTheme(theme=this.theme) {
    this.theme = theme;
    let selectedTheme = theme === "light" ? lightTheme : darkTheme;
    for (let key in selectedTheme) {
      document.documentElement.style.setProperty(key, selectedTheme[key]);
    }
  }

  set(key, value) {
    this[key] = value;
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    this.applyTheme();
  }
}

function applyTheme(theme='dark') {
  let selectedTheme = theme === "light" ? lightTheme : darkTheme;
  selectedTheme["--team-color"]
  for (let key in selectedTheme) {
    document.documentElement.style.setProperty(key, selectedTheme[key]);
  }
}

const lightTheme = {
  "--bg-color-1": "#eee",
  "--bg-color-2": "#bcd",
  "--bg-color-3": "#ddd",
  "--bg-color-hl": "#999",
  "--border-color": "#999",
  "--border-color-hl": "#444",
  "--text-color-1": "#000",
  "--sel-color-1": "#6b3",
  "--sel-color-2": "#6af",
  "--sel-text-color": "#000",
  "--team-color": "#6b3",
  //...strokeColors,
};

const darkTheme = {
  "--bg-color-1": "#000",
  "--bg-color-2": "#111",
  "--bg-color-3": "#222",
  "--bg-color-hl": "#444",
  "--border-color": "#444",
  "--border-color-hl": "#aaa",
  "--text-color-1": "#fff",
  "--sel-color-1": "#6b3",
  "--sel-color-2": "#888",
  "--sel-text-color": "#000",
  "--team-color": "#6b3",
  //...strokeColors,
};

export default User;
export { applyTheme, lightTheme, darkTheme };