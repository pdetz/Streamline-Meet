<script>
  import { uploadFiles } from "@data/uploadFiles";

  export let accept = '.hy3,.HY3,.cl2,.CL2,.sd3,.SD3'; // Allow specifying accepted file types
  export let multiple = true; // Enable multiple file selection
  export let onFilesSelected; // Function to handle the selected files
  export let className = 'sb tool';

  async function handleUpload() {
    try {
      const files = await uploadFiles({ accept, multiple });
      if (onFilesSelected && files) {
        onFilesSelected(files); // Pass the files to the provided handler
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }
</script>

<button class={className} on:click={handleUpload}>
  <slot>Upload Files</slot>
</button>
