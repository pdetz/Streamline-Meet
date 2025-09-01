import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert'; // Import the plugin

export default defineConfig({
  plugins: [
    sveltekit(),
    mkcert() // Add mkcert to your plugins array
  ],
  server: {
    https: true, // Enable HTTPS for the dev server
    host: true, // Optional: Allows access from other devices on your network
    // If your Parse Server is running on a different port/origin,
    // you might want to proxy requests from your Svelte app:
    // proxy: {
    //   '/parse': { // Example: If your Parse Server API is at /parse
    //     target: 'https://localhost:1337', // The URL where your Parse Server is running
    //     changeOrigin: true, // Needed for virtual hosting
    //     secure: false, // Important: Allows self-signed certs for local backend
    //     ws: true, // For WebSockets, if you use Live Queries
    //   },
    // },
  },
});