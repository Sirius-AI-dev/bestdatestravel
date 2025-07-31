import { makeRequest } from "./index";
// Import the makeRequest function from the API index file.

// Async function to send an initial request to the backend.
// This is likely used for initial setup or registration of the extension instance.
export const initRequest = async () => {
  // Prepare the payload for the initial request.
  const payload = {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // Include the user's timezone information.
    browser_language: navigator.language,
    // Include the user's browser language.
  };

  // Make the API request with the prepared payload.
  await makeRequest('/user/add', payload);
};
