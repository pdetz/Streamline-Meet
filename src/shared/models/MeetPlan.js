import File from '@files/File';
import { userStore } from '@src/stores';
import { get } from 'svelte/store';
import { upsertParseObjectByProps } from '@src/shared/data/ParseHelpers';

class MeetPlan {
    constructor(meetPlan) {
        this.objectId = meetPlan.objectId || null;

        this.team = get(userStore).team;
        this.teamId = meetPlan.teamId || this.team.objectId;
        this.meet = meetPlan.meet || this.team.findMeetById(meetPlan.meetId);
        this.meetId = meetPlan.meetId || this.meet.objectId;

        this.swimmerPlans = new Map(); // Initialize an empty Map for swimmers
        this.planningFile = File.normalizeFiles(meetPlan.planningFile);// || null;

        console.log("MeetPlan constructor: ", this);
        console.log("MeetPlan meet: ", this.meet);


        // Populate swimmers map if swimmers exist
        if (meetPlan.swimmerPlans) {
            for (const swimmerPlan of meetPlan.swimmerPlans) {
                if (!swimmerPlan.key) continue;
                swimmerPlan.key = swimmerPlan.key.toLowerCase(); // Ensure the key is lowercase for consistency
                const currentSwimmerPlan = {
                    swimmer: this.meet.findSwimmerByKey(swimmerPlan),
                    status: swimmerPlan.status || 'Unconfirmed',
                    ageGroups: swimmerPlan.ageGroups ? swimmerPlan.ageGroups.map(ag => this.meet.ageGroups[ag]) : [],
                    notes: swimmerPlan.notes || ''
                }
                this.swimmerPlans.set(swimmerPlan.key, currentSwimmerPlan); // Ensure swimmer includes the key
            }
        }
    }

    getSwimmerStatus(swimmer) {
        const swimmerPlan = this.swimmerPlans.get(swimmer.key);
        return swimmerPlan ? swimmerPlan.status : 'Unconfirmed';
    }

    getSwimmerAgeGroup(swimmer) {
        const swimmerPlan = this.swimmerPlans.get(swimmer.key);
        return swimmerPlan ? swimmerPlan.ageGroups[0] : false;
    }

    getSwimmerPlan(swimmer) {
        return this.swimmerPlans.get(swimmer.key) || 
        {
            swimmer: swimmer,
            status: 'Unconfirmed',
            ageGroups: [],
            notes: ''
        };
    }

    removeSwimmerPlan(swimmer) {
        this.swimmerPlans.delete(swimmer.key);
    }

    exportToParse() {
        console.log("MeetPlan exportToParse: ", this);
        return {
            objectId: this.objectId,
            meetId: this.meetId,
            teamId: this.teamId,
            swimmerPlans: this.exportSwimmerPlans(),
            planningFile: {name: this.planningFile[0].name,
                            contents: this.planningFile[0].contents}
        };
    }

    exportSwimmerPlans() {
        return Array.from(this.swimmerPlans.values()).map(plan => ({
            key: plan.swimmer.key,
            status: plan.status,
            ageGroups: plan.ageGroups ? plan.ageGroups.map(ag => ag.index) : [],
            notes: plan.notes
        })) // Convert Map to array
    }

    async updatePlanningFile() {
        this.planningFile[0] = File.writeEntriesToFile(this.meet, this.meet.teams, 'planning');

        if (this.objectId) {
            await upsertParseObjectByProps(
                'MeetPlan', 
                { objectId: this.objectId },
                { planningFile: {name: this.planningFile[0].name,
                    contents: this.planningFile[0].contents} });
        } else {
            await this.createNewParseMeetPlan();
        }
    }

    async updateSwimmerPlans() {
        if (this.objectId) {
            await upsertParseObjectByProps(
                'MeetPlan', 
                { objectId: this.objectId },
                { swimmerPlans: this.exportSwimmerPlans() });
        } else {
            await this.createNewParseMeetPlan();
        }
    }

    async updateSwimmerPlan(swimmer, plan={}, save=false) {
        const existingPlan = this.swimmerPlans.get(swimmer.key) || { status: 'Unconfirmed' }; // Get the existing plan if it exists
        const mergedPlan = { ...existingPlan, ...plan, swimmer }; // Merge existing and new plans

        this.swimmerPlans.set(swimmer.key, mergedPlan); // Update the Map with the merged plan
        
        if (save === false) return;
        //console.log('Updating swimmer plan', swimmer.display, plan);

        if (this.objectId) {
            await upsertParseObjectByProps(
                'MeetPlan', 
                { objectId: this.objectId },
                { swimmerPlans: this.exportSwimmerPlans() });
        } else {
            await this.createNewParseMeetPlan();
        }
    }

    async createNewParseMeetPlan() {
        const exportPlan = this.exportToParse();
        const newParseMeetPlan = await upsertParseObjectByProps(
            'MeetPlan', 
            { meetId: this.meetId, teamId: this.teamId },
            exportPlan);
        this.objectId = newParseMeetPlan.objectId;
    }

}

export default MeetPlan;