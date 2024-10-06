import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        popup: "popup.html",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "assets/[name].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            const packageName = id
              .split("node_modules/")[1] 
              .split("/")[0] 
              .toString();

            return `vendor/${packageName}`;
          }
        },
      },
    },
    outDir: "dist",
    chunkSizeWarningLimit: 200,
  },
});
