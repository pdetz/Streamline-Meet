<script>
    let { children } = $props();
    import '@styles/main.css';
    import '@styles/buttons.css';
    import '@styles/documents.css';
    import '@styles/print.css';
    import '@styles/table-list.css';
    import '@styles/td-widths.css';
    import '@styles/colors.css';
    import initializeParse from '@data/initializeParse';

    initializeParse();
</script>

{@render children() }