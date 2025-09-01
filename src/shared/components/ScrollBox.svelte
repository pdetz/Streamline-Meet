<script>
    export let height = '100%'; // User can override this prop
    export let width = '100%';  // Default width to 100% if not provided
    export let cssClass = ''; // Optional CSS class for additional styling
</script>

<div class={"scrollbox " + cssClass} style="height: {height}; width: {width};">
        <slot />
</div>

<style>
    /* Scrollbox styling */
    .scrollbox {
        overflow-y: auto; /* Allow vertical scrolling */
        overflow-x: auto; /* Allow horizontal scrolling when necessary */
        height: 100%; /* Fallback for older browsers */
    }

    /* Hide scrollbars initially in WebKit browsers */
    .scrollbox::-webkit-scrollbar {
        width: 0.5rem; /* Initially hide vertical scrollbar */
        height: 0.5rem; /* Initially hide horizontal scrollbar */
        background-color: transparent;
    }

    /* Show the scrollbars on hover */
    .scrollbox:hover::-webkit-scrollbar-thumb {
        background-color: var(--bg-color-hl);
    }

    /* Customize scrollbar thumb */
    .scrollbox::-webkit-scrollbar-thumb {
        background-color: transparent; /* Set color and opacity for the thumb */
        border-radius: 0.3rem; /* Rounded corners for the scrollbar thumb */
    }

    /* Customize scrollbar track */
    .scrollbox::-webkit-scrollbar-track {
        background-color: transparent; /* Keep track background transparent */
    }

    /* Style the corner between vertical and horizontal scrollbars */
    .scrollbox::-webkit-scrollbar-corner {
        background-color: transparent; /* Hide the white rectangle in the corner */
    }

    /* Browser-specific styling for Firefox */
    @-moz-document url-prefix() {
        .scrollbox {
            scrollbar-width: thin; /* Use thin scrollbar in Firefox */
        }
    }
</style>
