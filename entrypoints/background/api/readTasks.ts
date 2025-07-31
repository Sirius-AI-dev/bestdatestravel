import { Task } from "@/types";
// Import the Task interface definition.
import { userStore, taskStore } from "@/store";
// Import the userStore for managing tasks in persistent storage.
import { makeRequest } from "./index";
// Import the makeRequest function from the API index file.

// Async function to read tasks from the backend API.
export const readTasks = async () => {

  // List of actual tasks[]
  let localTasks: Task[] = await taskStore.getValue();

  // Task slot to update
  let foundSlot;

  // UNIX timestamp of expired tasks (no updates more than 5 minutes)
  const expiredUnixTimestamp = Math.floor(Date.now() / 1000) - 300;
  

  // No tasks => add a new task, with tab_id = 0
  if (!localTasks || localTasks.length == 0) {

    localTasks = [{id: "0", window_id: 0, tab_id: 0}];

    await taskStore.setValue(localTasks);

  }

  // Check if there is an expired task
  foundSlot = localTasks.find(task => (task.id !== "0" && task.last_active && task.last_active < expiredUnixTimestamp));

  // Find a slot with empty task_id
  if (!foundSlot) {
    foundSlot = localTasks.find(task => task.id === "0");
  }

  // The slot is found => read a task for the slot
  if (foundSlot) {

    // Prepare the payload for the request to read tasks.
    const payload = {
      user_id: (await userStore.getValue()).id,
      // Include the user's ID
      id: foundSlot.id
      // No task ID to read
    };

    // Make the API request with the prepared payload and return the result.
    return await makeRequest('/task/read', payload);
  }
};
