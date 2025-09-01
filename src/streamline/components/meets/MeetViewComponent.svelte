<script>
    import { meetViewStore, selectedMeetStore } from "@src/stores";
    import MeetViewTemplate from "./MeetViewTemplate.svelte";
    import Attendance from "./planning/Attendance.svelte";
    import LineUps from "./documents/LineUps.svelte";
    import Results from "./documents/Results.svelte";
    import Entries from "./documents/Entries.svelte";
    import Participants from "./documents/Participants.svelte";
    import EntriesReport from "./documents/EntriesReport.svelte";

    $: meetViewType = $meetViewStore.viewType;
    $: meetViewProps = $meetViewStore.props;
    
    let MeetViewComponent;

    $: switch (meetViewType) {
        case "planning":
        case "entries":
        case "results":
            MeetViewComponent = MeetViewTemplate;
            break;
        case 'Attendance':
            MeetViewComponent = Attendance;
            break;
        case "Line Ups":
            MeetViewComponent = LineUps;
            break;
        case "Results":
            MeetViewComponent = Results;
            break;
        case "Entries":
            MeetViewComponent = Entries;
            break;
        case "Entries Report":
            MeetViewComponent = EntriesReport;
            break;
        case "Participants":
            MeetViewComponent = Participants; // Assuming Participants uses the same component as Entries
            break;
        case "Heat Sheet":
            MeetViewComponent = MeetHeatSheet;
            break;
        default:
            MeetViewComponent = null;
    }
</script>

<svelte:component this={MeetViewComponent} {...meetViewProps} />