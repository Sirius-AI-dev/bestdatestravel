import { Task } from "@/types";
// Import the Task interface definition.
import { userStore, taskStore } from "@/store";
// Import the parserTabStore for accessing and managing the parser tab information.

// Define the interface for options when creating a parser tab.
interface CreateParserTabOptions {
  tab_id?: number;
  task_id?: string;
  is_active: boolean
}

// Async function to create a new parser tab or activate one of previously opened
export const createParserTab = async (options: CreateParserTabOptions) => {

  // Read the assigned user ID
  const user_id = (await userStore.getValue()).id;
  // Read list of existing tasks
  let localTasks: Task[] = await taskStore.getValue();

  // declare found window_id and tab_id
  let tabId;
  let windowId;
  let checkTabId;

  // tab_id is specified => set to checkTabId for further checking
  if (options && options.tab_id) {

    checkTabId = options.tab_id;
  
  // tab_id is not specified => try to find an empty tab_id to use for the task
  } else {

    const foundSlot = localTasks.find(localTasks => localTasks.id === (options.task_id || "0"));
    
    if (foundSlot && foundSlot.tab_id !== 0) {
      checkTabId = foundSlot.tab_id;
    }
  }

  // Tab ID is found => check if the tab exists
  if (checkTabId) {

    // Tab exists => response with found_tab_id
    try {
      await browser.tabs.get(checkTabId);

      tabId = checkTabId;
      
    // User has closed the tab
    } catch (error) {
      
    }
  }

  // Tab not found
  if (!tabId) {

    // Check if list of tasks is not empty => read the window_id from the first task
    if (localTasks && localTasks.length > 0) {

      // Read the window ID for price tracking
      windowId = localTasks[0].window_id;

      if (windowId && windowId !== 0) {
        
        // Check if the window exists
        try {
          const window = await browser.windows.get(windowId);
        } catch (error) {
            windowId = null;
        }
      }
    }

    // Window not found => create a new window
    if (windowId === null || !windowId) {

      // Create a new window, without focus on it
      const newWindow = await browser.windows.create({
        type: 'normal',
        state: 'normal',
        focused: options.is_active,
        url: browser.runtime.getURL(`/starttab.html#${user_id}`)
      });

      windowId = newWindow.id;

      // Store the windowId and the first tabId
      if (newWindow.tabs && newWindow.tabs.length > 0) {
        const initialTab = newWindow.tabs[0]; // The first tab
        tabId = initialTab.id;

        // store the windowId
        if (localTasks && localTasks.length > 0) {
          localTasks[0].window_id = windowId;
          localTasks[0].tab_id = tabId;
        } else {
          localTasks = [{id: "0", window_id: windowId, tab_id: tabId}];
        }
      }

    // Create a new tab to run Forceflow workflows
    } else {

      const NewTab = await browser.tabs.create({
        windowId: windowId,
        active: options.is_active,
        url: browser.runtime.getURL(`/emptytab.html`)
      });

      tabId = NewTab.id;
    }
  }

  // Update list of tasks
  const updateIndex = localTasks.findIndex(localTasks => localTasks.id === (options.task_id || "0"));
  if (updateIndex) {

    localTasks[updateIndex] = {
      ...localTasks[updateIndex], 
      tab_id: tabId
    }
  }
  
  // Store updated list of tasks
  await taskStore.setValue(localTasks);

  // Response with the active tab_id
  return tabId;
};