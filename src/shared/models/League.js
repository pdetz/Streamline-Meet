import { assignProperties } from "./assignProperties";

class League {
  constructor(leagueData) {
    assignProperties(this, leagueData);
  }

  // Optionally, you can add methods for the League class here
}

export default League;