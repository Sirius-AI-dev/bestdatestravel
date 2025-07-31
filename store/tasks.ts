import { Task } from "@/types";
// Import the Task type definition.

// Define and export the taskStore using the storage API.
// This store is used to persistently store an array of Task objects in local storage.
export const taskStore = storage.defineItem<Task[]>("local:tasks", {
  // Provide a fallback value (an empty array) if the stored value is not found or is invalid.
  fallback: [],
});
