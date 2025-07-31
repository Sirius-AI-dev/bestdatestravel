import { Task } from "@/types";
// Import the Task interface definition.
import { taskStore } from "@/store";
// Import the taskStore for managing tasks in persistent storage.
import {
  createParserTab
} from "./parserTab";
// Import utility functions related to the parser tab.
import { updateTasks } from "./api";
// Import API functions.

// Async function to handle a new task
export const handleNewTasks = async (task_id: string, newTasks: Task[]) => {

  // Get the current list of tasks from the task store.
  const localTasks: Task[] = await taskStore.getValue();

  // Initialize an array to hold tasks that have been changed or are new.
  let expandedTasks: Task[] = [];
  let changedTasks: Task[] = [];

  // Initialize the flag to update tasks[] array
  let updateFlag = 1;

  // Object with a task updates
  let updatedTask:Task = {};

  // Object with the actual task
  let taskToRun:Task = {};
  // Select tabId to run the task
  let tabId;

  // UNIX timestamp to store
  const currentUnixTimestamp = Math.floor(Date.now() / 1000);


  // Amount of tabs is different from the extension settings => adjust
  if (newTasks.length > 0 && localTasks.length !== newTasks[0].max_tabs && newTasks[0].max_tabs !== null) {

    const max_tabs = newTasks[0].max_tabs || 1;

    for (let i = 0; i < max_tabs; i++) {

      if (localTasks.length > i) {

        updatedTask = localTasks[i];
      
      } else {

        updatedTask = {
          id: "0",
          window_id: 0,
          tab_id: 0,
          last_active: 0,
          max_tabs: max_tabs
        };

      };
      
      expandedTasks.push(updatedTask);

    }

  } else {

    expandedTasks = localTasks;

  };


  // Iterate through the existing array of tasks received.
  expandedTasks.forEach((localTask) => {

    // no tasks to add / update => reset "id" value for the localTasks[task_id]
    if (newTasks.length == 0 && task_id !== "0" && localTask.id === task_id) {

      updatedTask = {
        ...localTask, 
        id: "0"
      };

    }
    // task is changed => set a new task ID
    else if (newTasks.length > 0 && localTask.id === task_id && updateFlag === 1) {
      
      // the task is assigned
      updateFlag = 0;
      
      // set task parameters
      updatedTask = {
        ...localTask, 
        id: newTasks[0].id, 
        url: newTasks[0].url,
        step_pause: newTasks[0].step_pause,
        last_active: currentUnixTimestamp
      };

      // read tab_id to use for the task
      taskToRun = updatedTask;
    
    // keep task as-is
    } else {

      updatedTask = localTask;

    }

    // Add the (potentially updated) local task to the list of changed tasks.
    changedTasks.push(updatedTask);
  });

  // Logical block: Save the updated list of tasks (including new and modified ones) back to the task store.
  await taskStore.setValue(changedTasks);


  // Run the task
  if (Object.keys(taskToRun).length > 0) {

    // Select tab ID to open the task URL
    tabId = await createParserTab({
      tab_id: taskToRun.tab_id,
      task_id: taskToRun.id,
      is_active: false
    });

    // Open the URL
    try {
      await browser.tabs.update(tabId!, {url: taskToRun.url});
    } catch (error) {
      console.warn("Error opening URL: ", error);
    }

    // Wait for taskToRun.step_pause milliseconds
    await new Promise(resolve => setTimeout(resolve, taskToRun.step_pause));

    if (tabId) {
      const [result] = await browser.scripting.executeScript({
        target: { tabId: tabId },
        function: () => {
          // This function runs in the context of the target webpage
          return document.documentElement.outerHTML;
        },
        world: "ISOLATED" // "ISOLATED" (default) is enough for simple HTML reading
      });

      if (result && result.result) {
        
        // Update tasks with the parsed data.
        await updateTasks({
          id: taskToRun.id || "0",
          html: result.result as string
        });

      } else {
        console.warn(`[${tabId}] Could not retrieve HTML content.`);
      }
    }
  }

  // Return the array of tasks that were either new or had their period updated.
  return changedTasks;
};
