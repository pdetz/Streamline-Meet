function exportContent(files) {

    files.forEach( file => {

        let content; let fileName;

        //[fileName, content] = file;

        // Create a Blob object from the content
        const blob = new Blob([file.contents], { type: 'text/plain' });

        // Create a URL for the Blob object
        const url = URL.createObjectURL(blob);

        // Create a hidden anchor element
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = file.name;

        // Append the anchor to the document
        document.body.appendChild(a);

        // Trigger a click event on the anchor element
        a.click();

        // Remove the anchor from the document
        document.body.removeChild(a);

        // Revoke the URL to release the memory
        URL.revokeObjectURL(url);
    });

}

export default exportContent;