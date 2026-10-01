// Secure Dynamic Task Manager
// All task content is built with createElement() and textContent only.

const EMPTY_MESSAGE = "Task cannot be empty";
const SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
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
  let id;
  do {
    taskCounter += 1;
    id = "task-" + taskCounter;
  } while (taskList.querySelector('[data-task-id="' + id + '"]'));
  return id;
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
  li.dataset.state = "pending";

  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = taskText;

  const completeBtn = document.createElement("button");
  completeBtn.classList.add("complete-btn");
  completeBtn.textContent = "Complete";

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "Remove";

  li.append(span, completeBtn, editBtn, removeBtn);
  return li;
}

function addTask(taskText) {
  const text = taskText.trim();
  if (text === "") {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const taskItem = createTaskElement(text, generateTaskId());
  taskList.appendChild(taskItem);
  taskInput.value = "";
  clearMessage();
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
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

  const newText = editInput.value.trim();
  if (newText === "") {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const newSpan = document.createElement("span");
  newSpan.classList.add("task-text");
  newSpan.textContent = newText;

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
  const total = taskList.querySelectorAll(".task-item").length;
  const pending = taskList.querySelectorAll('.task-item[data-state="pending"]').length;
  const completed = taskList.querySelectorAll('.task-item[data-state="completed"]').length;

  totalCount.textContent = total;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}

// Single delegated click handler for all task-level actions
function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");
  if (!taskItem || !taskList.contains(taskItem)) return;

  if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

// Build all samples in a DocumentFragment, append once
function loadSampleTasks() {
  const fragment = document.createDocumentFragment();
  SAMPLE_TASKS.forEach(function (text) {
    fragment.appendChild(createTaskElement(text, generateTaskId()));
  });
  taskList.appendChild(fragment);
  clearMessage();
  updateTaskCounts();
}

// Event wiring: exactly one click listener on #taskList
taskList.addEventListener("click", handleTaskListClick);

addTaskBtn.addEventListener("click", function () {
  addTask(taskInput.value);
});

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") addTask(taskInput.value);
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

updateTaskCounts();
