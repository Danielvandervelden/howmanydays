import { defineConfig } from "vite";

export default defineConfig({
    root: ".",
    publicDir: "public",
    build: {
        outDir: "dist",
        sourcemap: true,
    },
    server: {
        open: true,
    },
    base: "./",
});
