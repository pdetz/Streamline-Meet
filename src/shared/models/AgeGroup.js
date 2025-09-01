class AgeGroup {
  constructor(props) {
    this.ages = [...props.ages];
    this.gender = props.gender;
    this.eventIndices = props.eventIndices || [];
    this.index = props.index || 0;

    // Use ternary operators directly in the constructor
    this.ageString = this.ages[0] === 0
      ? (this.ages[1] === 109 ? "Open" : `${this.ages[1]}&U`)
      : this.ages.join('-');
    this.name = props.genders[this.gender] + ' ' + this.ageString
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

export default AgeGroup;