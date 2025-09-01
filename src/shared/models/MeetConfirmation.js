import { assignProperties } from "./assignProperties";
import { Swim } from "./Swim";

class MeetConfirmation {
  constructor(meetConfirmationData) {
    assignProperties(this, meetConfirmationData,
        {
        notes: '',
        strokes: [],
        attending: null
      }
    );
    this.swimmerKey = this.nombre + this.apellido + this.age;
    this.swimmerKey = this.swimmerKey.toLowerCase();
  }

  integrate(team) {
    this.swimmer = team.findSwimmerByKey({key: this.swimmerKey});
    this.meet = team.findMeetById(this.meetId);
    const meetPlan = this.meet.getMeetPlan();
    if (!this.swimmer) {
      console.warn(`Swimmer not found for MeetConfirmation: ${this.swimmerKey}`);
      return;
    }
    //if (meetPlan.getSwimmerStatus(this.swimmer) !== 'Unconfirmed') return;
    if (this.attending) {
        meetPlan.updateSwimmerPlan(this.swimmer, {
            status: 'Present',
            notes: this.notes
        });
        //console.log(meetPlan.getSwimmerPlan(this.swimmer));
    } else if (this.attending === false) {
        meetPlan.updateSwimmerPlan(this.swimmer, {
            status: 'Absent',
            notes: this.notes
    });
    }
    this.swimmer.upsertMeetConfirmation(this);
  }

  enterEvents(eventsMeet=null) {
    const meet = eventsMeet || this.meet;
    if (!this.swimmer || !meet) {
      console.warn("MeetConfirmation cannot enter events: missing swimmer or meet");
      return;
    }
    if (!this.strokes || this.strokes.length === 0) {
      return;
    }

    const events = meet.swimmerBag(this.swimmer).eventIndices
      .map(ei => meet.events[ei])
      .filter(event => this.strokes.includes(event.stroke.abbr));

    if (events.length === 0) return;

    let thisMeetEvents;

    if (eventsMeet === null) {
      thisMeetEvents = events;
    } else {
      thisMeetEvents = events.map(event => {
        return this.meet.events.find(e => e.stroke.abbr === event.stroke.abbr && e.distance === event.distance && e.ageGroup.swimmerBelongs(this.swimmer));
      });
    }

    thisMeetEvents.forEach(event => {
      const existingSwim = this.swimmer.planning
        .find(swim => swim.event.stroke.abbr === event.stroke.abbr && swim.meet.objectId === this.meet.objectId);
      if (!existingSwim) {
        this.swimmer.newEventEntry(event);
      }
    });
    console.log("Events entered for swimmer:", this.swimmerKey, events);
  }

}

export default MeetConfirmation;