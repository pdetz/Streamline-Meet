<script>
    import ScrollBox from "@shared/components/ScrollBox.svelte";
    import { MY_TEAM, pointsStore, selectedMeetStore, triggerRefresh } from "@src/stores";
    import AttendanceTable from "./AttendanceTable.svelte";
    import { upsertParseObjectByProps } from "@data/ParseHelpers";
    import { emailListStore } from "@src/stores";
    import { sendMeetEmail } from "@streamline/Coms/sendMeetEmail";

    // Reactive declarations for existing data
    $: meet = $selectedMeetStore;
    $: team = $MY_TEAM;
    $: swimmers = team ? team.swimmers : [];
    $: emailList = $emailListStore;


    async function generateMeetConfirmations() {
        swimmers.forEach(async (swimmer) => {
            let isAllowed = true;
            let numberOfEvents = 3;
            let disallowedStrokes = [];
            if (meet.connectedMeet) {
                disallowedStrokes = swimmer.swimsByMeet(meet.connectedMeet, 'planning')
                    //.filter(swim => swim.result < 9990)
                    .map(swim => swim.stroke.abbr);
                if (disallowedStrokes.length > 1) {
                    numberOfEvents = 0;
                }
            }
            await upsertParseObjectByProps('MeetConfirmation', 
            {
                meetId: meet.objectId,
                teamId: $MY_TEAM.objectId,
                nombre: swimmer.nombre,
                apellido: swimmer.apellido,
            },
            {
                meetId: meet.objectId,
                teamId: $MY_TEAM.objectId,
                apellido: swimmer.apellido,
                nombre: swimmer.nombre,
                preferredName: swimmer.preferredName,
                age: swimmer.age,
                disallowedStrokes,
                isAllowed,
                numberOfEvents,
                date: meet.startDate,
                warmups: meet.arrivalTime,
                pool: meet.pool,
                address: meet.address,
                mapLink: meet.mapLink
            });
        });
        alert('Meet confirmations generated for all swimmers.');
    }
    async function emailParents() {
        let parents = [];
        for (const swimmer of emailList) {
            if (!swimmer.getMeetConfirmation(meet.objectId)) continue;
            for (const parent of swimmer.parents) {
                if (!parents.find(p => p.nombre === parent.nombre && p.apellido === parent.apellido)) {
                    parents.push(parent);
                }
            }
        }
        console.log('Parents to email:', parents);
        for (const parent of parents) {
            let swimmersForParent = emailList
                .filter(swimmer => swimmer.parents.find(p => p.nombre === parent.nombre && p.apellido === parent.apellido));
            //await sendMeetEmail(swimmersForParent, parent, meet);
            await sendMeetEmail(swimmersForParent, parent, meet);
        };
    }

    let emailAddresses = new Set();
    $: if (emailList.length > 0) {
        emailAddresses = new Set();
        emailList.forEach(swimmer => {
        swimmer.parents.forEach(parent => {
            if (parent.email) {
                emailAddresses.add(parent.email);
            }
        });
    });
}
function enterSwimmers() {
    swimmers.forEach(swimmer => {
        const mc = swimmer.getMeetConfirmation(meet.objectId);
        if (mc && mc.attending) mc.enterEvents(team.meets[0]);
    });
    triggerRefresh(pointsStore);
}

function copyEmails() {
    const emails = Array.from(emailAddresses).join(', ');
    navigator.clipboard.writeText(emails)
        .then(() => {
            console.log('Emails copied to clipboard:', emails);
            alert('Emails copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy emails:', err);
            alert('Failed to copy emails. Please try again.');
        });
}

 async function sendSMS() {
    let smsStatus = '';

        try {
            const response = await fetch('http://localhost:4001/api/send-sms', { // Changed endpoint to /send-sms
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // --- THIS IS THE CRUCIAL CHANGE: Send data in the body ---
                body: JSON.stringify({
                    recipientPhone: "+13012378070",
                    message: "Message from Coach Patrick"
                })
                // --------------------------------------------------------
            });
            const data = await response.json();

            if (response.ok) {
                smsStatus = `SMS Sent! Message ID: ${data.messageId || 'N/A'}`;
                console.log('Backend response:', data);
            } else {
                smsStatus = `Failed: ${data.message || 'Unknown error'}`;
                console.error('Backend error:', data);
            }
        } catch (error) {
            smsStatus = 'Network error or server unreachable.';
            console.error('Frontend fetch error:', error);
        }
    }
</script>

<div class='attendance-swim-ups'>
    <div class='title'>
        {meet.name} - Attendance
    </div>
    <div class='two-column'>
        <div class='column'>
            <ScrollBox height='calc(100% - 2.5rem)'>
                <div class='attendance'>
                    <AttendanceTable {meet} {swimmers} />
                </div>
            </ScrollBox>
        </div>
        <div class='column'>
            <ScrollBox height='calc(100% - 2.5rem)'>
                <div class='coms'>
                    <!--
                    <button class='sb tool' on:click={generateMeetConfirmations}>
                        Generate Meet Confirmations
                    </button>
                    -->
                    <button class='sb tool' on:click={emailParents}>
                        Send Emails to {emailList.length} Swimmers
                    </button>
                    <button class='sb tool' on:click={enterSwimmers}>
                        Enter Swimmers Into Events
                    </button>
                    <button class='sb tool' on:click={sendSMS}>
                        Send SMS
                    </button>
                    <button class='sb tool' on:click={copyEmails}>
                        Copy Emails
                    </button>
                    {#each emailAddresses as email}
                        <div class='email'>
                            {email}
                        </div>
                    {/each}

                </div>
            </ScrollBox>
        </div>
    </div>
</div>

<style>
    div.two-column {
        display: flex;
        gap: 1rem;
        flex-direction: row;
        justify-content: space-between;
        font-size: 0.8rem;
        height: calc(100% - 1.5rem);
    }
    .column {
        background-color: var(--bg-color-1);
        padding: 0.5rem;
        font-size: 0.8rem;
        height: calc(100% - 1rem);
    }

    .attendance {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .title {
        width: 100%;
        text-align: center;
        margin-bottom: 1rem;
    }
    div.coms {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>