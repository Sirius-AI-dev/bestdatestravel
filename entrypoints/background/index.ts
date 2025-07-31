import { userStore, taskStore } from "@/store";
// Import stores for user and tasks.
import { initRequest, readTasks, makeRequest } from "./api";
// Import API functions.
import {
  createParserTab
} from "./parserTab";
// Import utility functions related to the parser tab.

// Define intervals for reading and checking tasks, with different values for debug mode.
const READ_TASKS_INTERVAL_IN_MINUTES = 2.0;

// Define the background script entry point using WXT's defineBackground.
export default defineBackground(() => {

  // browser's onInstalled event => Initialize the extension after installation
  chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    await init();
  });
  
  // browser's onStartup event => Run alarms
  chrome.runtime.onStartup.addListener(
    restore
  );
  
  // browser's onConnect event => Run alarms
  chrome.runtime.onConnect.addListener(
    restore
  );

  // Add a listener for browser alarms.
  browser.alarms.onAlarm.addListener(async (alarm) => {

    // Handle alarms
    switch (alarm.name) {
      case "read-tasks": {
        console.log("reading tasks");

        // Read tasks from the API and handle potential errors.
        try {
          await readTasks();
        } catch (error) {
          console.error("Error while reading tasks: ", error);
        }
        break;
      }
    }
  });

  // Add a listener for messages received from other parts of the extension (e.g. content scripts).
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Define an async function to handle the message.
    (async () => {
      // Handle different message types.
      switch (message.type) {
        case "makeRequest": {
          // Make an API request using the provided payload and send the result.
          try {
            const result = await makeRequest(message.apiPath, message.payload);
            sendResponse(result);
          } catch (error) {
            console.error("Error executing makeRequest: ", error);
            sendResponse(error);
          }
          break;
        }
      }
    })();
    return true; // Indicate that the response will be sent asynchronously.
  });
});

// Async function to initialize the background script.
const init = async () => {
  // Create alarms for reading and checking tasks.
  browser.alarms.create("read-tasks", {
    periodInMinutes: READ_TASKS_INTERVAL_IN_MINUTES,
  });

  await initRequest();

  createParserTab({is_active: true});
};

// Restore the background alarms
const restore = () => {
  // Create alarms for reading and checking tasks.
  browser.alarms.create("read-tasks", {
    periodInMinutes: READ_TASKS_INTERVAL_IN_MINUTES,
  });
};