import { makeRequest } from "./index";
// Import the makeRequest function from the API index file.
import { userStore } from "@/store";
// Import the userStore for managing tasks in persistent storage.

// Define the interface for task response details, essentially a key-value pair with arbitrary values.
export interface TaskResponseData {
  [key: string]: any;
  // Allows any string key with any value.
}

// Define the interface for the properties required to update tasks.
interface UpdateTasksProps {
  id: string;
  // The unique identifier of the task to be updated.
  html?: string;
  // The updated HTML content related to the task.
}

// Async function to update tasks on the backend API.
// Takes an object containing the updated html and the task id.
export const updateTasks = async (task_data: UpdateTasksProps) => {

  // Prepare the payload for the request to update tasks.
  const payload = {
    user_id: (await userStore.getValue()).id,
    // Include the user's ID
    id: task_data.id,
    // task ID to update
    html: task_data.html,
    // html content to process
  };

  // Make the API request with the prepared payload.
  await makeRequest('/task/update', payload);

};
