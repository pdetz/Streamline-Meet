import adapter from "@sveltejs/adapter-vercel";
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: adapter(),
    alias: {
      "@src": path.resolve("src"),
      "@live": path.resolve("src/live"),
      "@data": path.resolve("src/shared/data"),
      "@models": path.resolve("src/shared/models"),
      "@shared": path.resolve("src/shared"),
      "@files": path.resolve("src/shared/data/files"),
      '@styles': path.resolve('src/styles'),
    },
  },
};