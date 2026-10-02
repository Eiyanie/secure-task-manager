// Secure Dynamic Task Manager
// All task content is built with createElement() and textContent only.

const EMPTY_MESSAGE = "Task cannot be empty";
const TASK_STATES = { PENDING: "pending", COMPLETED: "completed" };
const SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];
const TASK_BUTTONS = [
  { className: "complete-btn", label: "Complete" },
  { className: "edit-btn", label: "Edit" },
  { className: "remove-btn", label: "Remove" }
];

// Cached DOM references
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let taskCounter = 0;

// Generate a unique ID beginning with "task-"
function generateTaskId() {
  taskCounter += 1;
  return `task-${taskCounter}`;
}

function isBlank(text) {
  return text.trim() === "";
}

function showMessage(text) {
  taskMessage.textContent = text;
}

function clearMessage() {
  taskMessage.textContent = "";
}

// Build one task <li>; does NOT attach it to #taskList
function createTaskElement(taskText, taskId) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.dataset.taskId = taskId;
  li.dataset.state = TASK_STATES.PENDING;

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = taskText;

  const buttons = TASK_BUTTONS.map(({ className, label }) => {
    const button = document.createElement("button");
    button.classList.add(className);
    button.textContent = label;
    return button;
  });

  li.append(textSpan, ...buttons);
  return li;
}

function addTask(taskText) {
  if (isBlank(taskText)) {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const taskItem = createTaskElement(taskText.trim(), generateTaskId());
  taskList.appendChild(taskItem);
  taskInput.value = "";
  clearMessage();
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? TASK_STATES.COMPLETED : TASK_STATES.PENDING;
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  const editBtn = taskItem.querySelector(".edit-btn");
  if (!textSpan) return;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = textSpan.textContent;

  textSpan.replaceWith(editInput);
  editBtn.textContent = "Save";
  editInput.focus();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  const editBtn = taskItem.querySelector(".edit-btn");
  if (!editInput) return;

  if (isBlank(editInput.value)) {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const newSpan = document.createElement("span");
  newSpan.classList.add("task-text");
  newSpan.textContent = editInput.value.trim();

  editInput.replaceWith(newSpan);
  editBtn.textContent = "Edit";
  clearMessage();
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

// Counts are always calculated from the current DOM
function updateTaskCounts() {
  const items = Array.from(taskList.querySelectorAll(".task-item"));
  const countByState = (state) =>
    items.filter(({ dataset }) => dataset.state === state).length;

  totalCount.textContent = items.length;
  pendingCount.textContent = countByState(TASK_STATES.PENDING);
  completedCount.textContent = countByState(TASK_STATES.COMPLETED);
}

// Single delegated click handler for all task-level actions
function handleTaskListClick(event) {
  const taskItem = event.target.closest(".task-item");
  if (!taskItem) return;

  if (event.target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (event.target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (event.target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

// Build all samples in a DocumentFragment, append once
function loadSampleTasks() {
  const fragment = document.createDocumentFragment();
  SAMPLE_TASKS.forEach((text) => {
    fragment.appendChild(createTaskElement(text, generateTaskId()));
  });
  taskList.appendChild(fragment);
  clearMessage();
  updateTaskCounts();
}

// Event wiring: exactly one click listener on #taskList
taskList.addEventListener("click", handleTaskListClick);
addTaskBtn.addEventListener("click", () => addTask(taskInput.value));
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask(taskInput.value);
});
loadSamplesBtn.addEventListener("click", loadSampleTasks);

updateTaskCounts();
