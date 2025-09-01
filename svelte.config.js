import adapter from "@sveltejs/adapter-vercel";
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: adapter(),
    alias: {
      "@streamline": path.resolve("src/streamline"),
      "@better-meet": path.resolve("src/better-meet"),
      "@live": path.resolve("src/better-meet/live"),
      "@data": path.resolve("src/shared/data"),
      "@models": path.resolve("src/shared/models"),
      '@meets': path.resolve('src/streamline/components/meets'),
      "@shared": path.resolve("src/shared"),
      "@files": path.resolve("src/shared/data/files"),
      "@src": path.resolve("src"),
      '@logo': path.resolve('src/logo'),
      '@styles': path.resolve('src/styles'),
      '@roster': path.resolve('src/streamline/components/roster'),
      '@coms': path.resolve('src/streamline/Coms'),
    },
  },
};