// data.js — constants and data definitions (no DOM access)

export const EMPTY_MESSAGE = "Task cannot be empty";

// Object used instead of repeating the strings "pending" / "completed"
export const TASK_STATES = {
  PENDING: "pending",
  COMPLETED: "completed"
};

// Array of the three required sample tasks
export const SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];

// Array of objects describing the buttons every task receives
export const TASK_BUTTONS = [
  { className: "complete-btn", label: "Complete" },
  { className: "edit-btn", label: "Edit" },
  { className: "remove-btn", label: "Remove" }
];

// Returns a function that produces a new unique ID each time (closure)
export function createIdGenerator(prefix) {
  let counter = 0;
  return function () {
    counter += 1;
    return `${prefix}${counter}`;
  };
}

export const generateTaskId = createIdGenerator("task-");
