export function uploadFiles({ accept = '.hy3,.HY3,.cl2,.CL2,.sd3,.SD3,.csv,.CSV', multiple = false } = {}) {
  return new Promise((resolve, reject) => {
    const fileInput = document.getElementById('fileInput');
    fileInput.value = null;
    fileInput.type = 'file';
    fileInput.accept = accept; // Set accepted file types
    fileInput.multiple = multiple; // Allow multiple files if specified

    fileInput.onchange = (event) => {
      const files = event.target.files;

      if (files.length > 0) {
        const fileReaders = [];

        // Process each file and store the promises in an array
        for (let i = 0; i < files.length; i++) {
          fileReaders.push(new Promise((resolveFile, rejectFile) => {
            const reader = new FileReader();
            const file = files[i];

            reader.onload = () => {
              resolveFile({
                name: file.name,
                contents: reader.result,
              });
            };

            reader.onerror = () => {
              rejectFile('Error reading file');
            };

            reader.readAsText(file);
          }));
        }

        // Resolve with an array of file contents if multiple, or a single file content
        if (multiple) {
          Promise.all(fileReaders)
            .then(fileContentsArray => resolve(fileContentsArray))
            .catch(error => reject(error));
        } else {
          fileReaders[0]
            .then(fileContent => resolve(fileContent))
            .catch(error => reject(error));
        }
      } else {
        resolve(multiple ? [] : null); // Resolve with an empty array or null based on mode
      }
    };

    fileInput.click(); // Programmatically trigger the file input dialog
  });
}
