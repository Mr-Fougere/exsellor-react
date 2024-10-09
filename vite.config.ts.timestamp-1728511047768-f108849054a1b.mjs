// vite.config.ts
import react from "file:///C:/Users/alexa/Documents/Projets/2024/exsellor-react/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///C:/Users/alexa/Documents/Projets/2024/exsellor-react/node_modules/vite/dist/node/index.js";
import { nodePolyfills } from "file:///C:/Users/alexa/Documents/Projets/2024/exsellor-react/node_modules/vite-plugin-node-polyfills/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        popup: "popup.html"
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "assets/[name].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            const packageName = id.split("node_modules/")[1].split("/")[0].toString();
            return `vendor/${packageName}`;
          }
        }
      }
    },
    outDir: "dist",
    chunkSizeWarningLimit: 200
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbGV4YVxcXFxEb2N1bWVudHNcXFxcUHJvamV0c1xcXFwyMDI0XFxcXGV4c2VsbG9yLXJlYWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbGV4YVxcXFxEb2N1bWVudHNcXFxcUHJvamV0c1xcXFwyMDI0XFxcXGV4c2VsbG9yLXJlYWN0XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbGV4YS9Eb2N1bWVudHMvUHJvamV0cy8yMDI0L2V4c2VsbG9yLXJlYWN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IG5vZGVQb2x5ZmlsbHMgfSBmcm9tIFwidml0ZS1wbHVnaW4tbm9kZS1wb2x5ZmlsbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIG5vZGVQb2x5ZmlsbHMoKV0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogXCJpbmRleC5odG1sXCIsXG4gICAgICAgIHBvcHVwOiBcInBvcHVwLmh0bWxcIixcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6IFwiW25hbWVdLmpzXCIsXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiBcIltuYW1lXS5qc1wiLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogXCJhc3NldHMvW25hbWVdLltleHRdXCIsXG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlc1wiKSkge1xuICAgICAgICAgICAgY29uc3QgcGFja2FnZU5hbWUgPSBpZFxuICAgICAgICAgICAgICAuc3BsaXQoXCJub2RlX21vZHVsZXMvXCIpWzFdIFxuICAgICAgICAgICAgICAuc3BsaXQoXCIvXCIpWzBdIFxuICAgICAgICAgICAgICAudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgcmV0dXJuIGB2ZW5kb3IvJHtwYWNrYWdlTmFtZX1gO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBvdXREaXI6IFwiZGlzdFwiLFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMjAwLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRWLE9BQU8sV0FBVztBQUM5VyxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLHFCQUFxQjtBQUU5QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUFBLEVBQ2xDLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE1BQU07QUFBQSxRQUNOLE9BQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixhQUFhLElBQUk7QUFDZixjQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0Isa0JBQU0sY0FBYyxHQUNqQixNQUFNLGVBQWUsRUFBRSxDQUFDLEVBQ3hCLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFDWixTQUFTO0FBRVosbUJBQU8sVUFBVSxXQUFXO0FBQUEsVUFDOUI7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxJQUNSLHVCQUF1QjtBQUFBLEVBQ3pCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
