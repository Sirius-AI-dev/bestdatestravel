// Define the interface for a User.
export interface User {
  id?: string; // User ID
}

// Define the interface for a Task.
export interface Task {
  id?: string; // A unique identifier for the task ("0" = no task for the tab)
  window_id?: number; // window ID the task is parsing
  tab_id?: number; // tab ID the task is parsing (0 = no tasks)
  url?: string; // The URL associated with the task
  step_pause? : number; // Pause in msec to wait for the page rendering
  last_active?: number; // last active UNIX timestamp
  max_tabs?: number; // amount of tabs for parsing
}