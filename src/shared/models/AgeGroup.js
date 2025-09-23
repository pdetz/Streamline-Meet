class AgeGroup {
  constructor(props) {
    this.ages = [...props.ages];
    this.gender = props.gender;
    this.eventIndices = props.eventIndices || [];
    this.index = props.index || 0;

    /*
    this.ageString = this.ages[0] === 0
      ? (this.ages[1] === 109 ? "Open" : `${this.ages[1]}&U`)
      : this.ages.join('-');
    this.name = props.genders[this.gender] + ' ' + this.ageString */;
    this.name = ageGroupName(this, props.genders);
  }

  contains(ag) {
    // Check if this age group is a subset of the given age group (ag)
    return this.gender === ag.gender && this.ages[0] <= ag.ages[0] && this.ages[1] >= ag.ages[1];
  }

  isEqualTo(ag) {
    // Check if this age group is equal to the given age group (ag)
    return this.gender === ag.gender && this.isSameAgeAs(ag);
  }

  isSameAgeAs(ag) {
    //console.log(ag);
    // Check if this age group has the same age range as the given age group (ag)
    return this.ages[0] === ag.ages[0] && this.ages[1] === ag.ages[1];
  }

  swimmerBelongs(swimmer) {
    if (swimmer.age > this.ages[1] || swimmer.age < this.ages[0]) return false;
    if (this.gender === 'X') return true;
    return this.gender === swimmer.gender;
  }

  addSwimmer(swimmer) {
    // Only add the swimmer if not already in the array (based on key)
    if (!this.swimmers.find(s => s.key === swimmer.key)) {
      this.swimmers.push(swimmer);
    }
  }

  addSwimmers(swimmers) {
    for (const swimmer of swimmers) {
      this.addSwimmer(swimmer);
    }
  }

  findSwimmerByKey(swimmer) {
    return this.swimmers.find(s => s.key === swimmer.key);
  }

  removeSwimmer(swimmer) {
    // Filter out the swimmer based on key
    this.swimmers = this.swimmers.filter(s => s.key !== swimmer.key);
  }

  hasEvents() {
    return this.eventIndices.length > 0;
  }
}

function ageGroupName(ageGroup, genderNames) {
  let ageString = '';
  if (ageGroup.ages[0] === ageGroup.ages[1]) {
    ageString = ageGroup.ages[0] + ' y.o.'; 
  } else {
    ageString = ageGroup.ages[0] === 0
      ? (ageGroup.ages[1] === 109 ? "Open" : `${ageGroup.ages[1]}&U`)
      : (ageGroup.ages[1] === 109 ? `${ageGroup.ages[0]}&O` : ageGroup.ages.join('-'));
  }
  return genderNames[ageGroup.gender] + ' ' + ageString;
}

export default AgeGroup;
export { ageGroupName };