import { Task } from "@/types";
// Import necessary types: Folder, Locale, and Task.
import axios from "axios";
// Import the axios library for making HTTP requests.
import { handleNewTasks } from "../tasks";
// Import the handleNewTasks function from the tasks module.
import { userStore } from "@/store";
// Import the userStore for managing tasks in persistent storage.

// Define the interface for the structure of the data expected in the successful response.
interface RequestData {
  id?: string; // Assigned task ID
  user_id?: string; //User ID
  html?: string; // HTML content
  timezone?: string; // time zone
  browser_language?: string; // browser language
}

// Define the interface for the structure of the data expected in the successful response.
interface ResponseData {
  tasks?: Task[]; // An array of Task objects.
  user_id?: string; // Assigned user ID
}

// Async function to make a request to the backend API.
// Takes a RequestData object as input and returns a Promise resolving to ResponseData or an object with an error.
export const makeRequest = async (apiPath: string, requestBody: RequestData): Promise<ResponseData | { error: unknown }> => {
  // Use a try-catch block to handle potential errors during the request.
  try {
    // Get the API URL from environment variables.
    const apiUrl = import.meta.env.WXT_API_URL + apiPath;

    // Make a POST request to the API URL using axios.
    // Specify the expected response data structure.
    const response = await axios.post<ResponseData>(apiUrl, requestBody);

    // Destructure the response data to get user_id and tasks[]
    const { user_id, tasks } = response.data;

    // New user_id is assigned => store this value
    if (user_id) {
      await userStore.setValue({id: user_id});
    }

    // New details for the task ID are received => process the details
    if (tasks) {
      const taskId = (requestBody && requestBody.id != null) ? requestBody.id : '0';
      await handleNewTasks(taskId, tasks);
    }

    //  Return the data received in the response.
    return response.data;

  } catch (error: unknown) {
    // Catch any errors that occurred during the try block.
    // If the error is an instance of Error, throw a new error with the original message.
    if (error instanceof Error) {
      throw new Error(error?.message);
    } else {
      // If the error is not an Error instance, throw a generic error message.
      throw new Error("makeRequest error");
    }
  }
};
