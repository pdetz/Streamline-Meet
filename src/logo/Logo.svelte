<script>
    import S from '@logo/shapes.js';
    import LogoControls from './LogoControls.svelte';
    import ColorPicker from '@streamline/components/meets/documents/tools/ColorPicker.svelte';
    import DownloadButton from './DownloadButton.svelte';
    import SaveLogo from './SaveLogo.svelte';
    import { onMount } from 'svelte';
    import { loadParseObjects } from '@data/LoadParseObjects';

    let blues = ['#02c', '#04f', '#26f', '#48f', '#6af', '#adf', '#cef'];
    let selectedColors = [blues[5], blues[4], blues[1]];
    let dim = 300;
    
    let dimensions = {
        h: { text: 'Height:',        val: 60 },
        //tw: { text: 'Taper Width:',  val: 15 },
        w: { text: 'Width:',         val: 30 },
        g: { text: 'Gap Width:',val: 5 },
        //tg: { text: 'Taper Gap:',    val: 5 },
        r1: { text: 'Radius 1:',     val: 32 },
        k1: { text: 'Outer Curve:',  val: 12 },
        r2: { text: 'Radius 2:',     val: 80 },
        k2: { text: 'Inner Curve:',  val: 36 },
        s: { text: 'Slant:',         val: 12 },
    };

    let logos = [];
    onMount(async () => {
        logos = await loadParseObjects('Logo');
    });

    function extractDimensions(dimsWithLabels) {
        const extracted = {};
        for (const key in dimsWithLabels) {
            extracted[key] = dimsWithLabels[key].val;
        }
        return extracted;
    }

    let logo = new S({...extractDimensions(dimensions), colors: selectedColors});

    function updateShape(updatedProp) {
        //console.log("updateShape received:", updatedProp);

        const propKey = Object.keys(updatedProp)[0];
        const newValue = Object.values(updatedProp)[0];

        dimensions = {
            ...dimensions,
            [propKey]: {
                ...dimensions[propKey],
                val: newValue
            }
        };

        logo = new S(extractDimensions(dimensions));
    }

    function loadLogo(logoData) {
        //console.log("Loading logo:", logoData);
        dimensions = {
            h: { text: 'Height:',        val: logoData.h },
            w: { text: 'Width:',         val: logoData.w },
            g: { text: 'Gap Width:',     val: logoData.g },
            r1: { text: 'Radius 1:',     val: logoData.r1 },
            k1: { text: 'Outer Curve:',  val: logoData.k1 },
            r2: { text: 'Radius 2:',     val: logoData.r2 },
            k2: { text: 'Inner Curve:',  val: logoData.k2 },
            s: { text: 'Slant:',         val: logoData.s }
        };
        selectedColors = [...logoData.colors];
        updateShape({ colors: selectedColors });
    }
</script>

<div class='logos'>
    <div class='nav'>
        <DownloadButton
            svg={logo.svg(dim, dim)}
            filename='streamline.svg'
        />
        <SaveLogo
            dimensions={extractDimensions(dimensions)}
            selectedColors={selectedColors}
        />
    </div>
    <div class='logo-colors'>
        {#each logos as logo}
            <button class='logo' on:click={() => {loadLogo(logo);}}>
                {@html logo.svg(200, 200)}
            </button>
        {/each}
    </div>
    <div class='logo-colors'>
        <div class="logo">
            {@html logo.svg(dim, dim)}
        </div>
        <div class='logo colors'>
            {#each selectedColors as color, index}
                <input type='text' value={color} on:input={e => {
                    selectedColors[index] = e.target.value;
                    updateShape({ colors: selectedColors });
                }} />
            {/each}
            <input type='text' bind:value={dim} />
        </div>
    </div>
    <div class='logo'>
        <LogoControls
            dimensions={dimensions}
            updateShape={updateShape}
        />
</div>
</div>

<style>
    div.logos {
        padding: 1em;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 1em;
    }
    div.logo-colors {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        gap: 1em;
    }
    div.logo.colors {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 3em;
    }
    div.logo-colors input {
        width: 5em;
        height: 2em;
        border-radius: 0.3em;
        border: 1px solid #aaa;
        padding: 0.5em;
        font-size: 1.2em;
        background-color: #000;
        color: #fff;
    }

    button.logo {
        padding: 1em;
        border: 1px solid #fff;
        border-radius: 0.3em;
    }

</style>