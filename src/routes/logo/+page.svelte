<script>
    import Logo from '@logo/Logo.svelte';

</script>

<div class='flex-container'>
<img src="/streamline.svg" alt="Logo" class="logo" />
<div class='title'>
    Individual Event Entries
</div>
</div>

<style>
    .flex-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }
    .logo {
        width: 600px;
        height: 600px;
        display: block;
        margin: 0 auto;
    }

    .title {
        text-align: center;
        font-size: 6rem;
        color: #6af;
        margin-top: 1rem;
    }
</style>