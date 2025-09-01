import { STROKES, GENDERS } from '@models/LeagueData';
import AgeGroup from '@models/AgeGroup';

export class EventsTemplate {
  constructor(template) {
    this.ageGroups = [];
    this.events = [];
    this.genders = template.genders || GENDERS;
    this.strokes = template.strokes || STROKES;

    // First pass: Build initial ageGroups and event indices
    template.events.forEach((event, eventIndex) => {
      const stroke = this.strokes[event.stroke];
      let currentAgeGroup;
      if (stroke.relay) {
        event.legs = event.legs.map(leg => {
          return { distance: leg.distance, stroke: this.strokes[leg.stroke] };
        });
        currentAgeGroup = new AgeGroup({...event, genders: this.genders});
        event.swimmers.forEach(swimmer => this.addIndividualAG({ ...swimmer }));
      } else {
        currentAgeGroup = this.addIndividualAG({...event});
        currentAgeGroup.eventIndices.push(eventIndex);
      }
      this.events.push({ ...event, stroke, ageGroup: currentAgeGroup });
    });


    // Second pass: Merge event indices from larger age groups (supersets) to smaller ones (subsets)
    this.ageGroups.forEach(subsetAG => {
      this.ageGroups.forEach(supersetAG => {
        if (supersetAG.contains(subsetAG) && supersetAG !== subsetAG) {
          subsetAG.eventIndices.push(
            ...supersetAG.eventIndices.filter(index => !subsetAG.eventIndices.includes(index))
          );
        }
      });
    });    

    this.ageGroups.forEach(subsetAG => {
      subsetAG.eventIndices.sort((a, b) => a - b);
    });
  
    this.ageGroups.sort((a, b) => {
        if (a.ages[1] === b.ages[1]) return b.ages[0] - a.ages[0];
        return a.ages[1] - b.ages[1];
    });
  }

  addIndividualAG(props) { // Add an age group to the template
    let currentAgeGroup = this.ageGroups.find(ag => ag.isEqualTo(props));
    if (!currentAgeGroup) {
      currentAgeGroup = new AgeGroup({ ...props, genders: this.genders });
      this.ageGroups.push(currentAgeGroup);
    }
    return currentAgeGroup;
  }
}