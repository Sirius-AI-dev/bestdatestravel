import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
// Define the configuration for the WXT extension build.
export default defineConfig({
  // Specify the modules to be used, in this case, the React module.
  modules: ["@wxt-dev/module-react"],// This is where you configure Vite options
  outDir: 'best_dates_travel', // folder with the extension build
  outDirTemplate: 'chrome', // folder with the extension build
  // Define the extension manifest properties.
  manifest: {
    // Set the name of the extension.
    name: "Best Dates Travel",
    // Define the permissions required by the extension.
    permissions: ["storage", "alarms", "tabs", "activeTab", "scripting"],
    // Configure the browser action (the extension icon in the toolbar).
    action: {},
    // Define host permissions to allow the extension to interact with specified URLs.
    host_permissions: [
      "https://api.sirius-dev.com/*",
      "https://*.booking.com/*"
    ],
    optional_host_permissions: ["https://*/*"]
  },
});
