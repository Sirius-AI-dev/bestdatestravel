import { User } from "@/types";
// Import the User type definition.

// Define and export the userStore using the storage API.
// This store is used to persistently store an User object in local storage.
export const userStore = storage.defineItem<User>("local:user", {
  // Provide a fallback value (an empty object) if the stored value is not found or is invalid.
  fallback: {},
});
