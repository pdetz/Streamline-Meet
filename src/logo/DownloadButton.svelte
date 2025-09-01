<script>
    export let svg='';
    export let filename = 'streamline.svg'; // Default filename

    function downloadSvg() {
        const svgString = `<?xml version="1.0" encoding="UTF-8"?>
            <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`
            + svg;

        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const a = document.createElement('a');

        a.download = filename;
        a.href = URL.createObjectURL(blob);

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }
</script>

<button class='sb tool' on:click={downloadSvg}>
    Download svg file
</button>

<style>
</style>