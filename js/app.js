// app.js — main module: task logic and event wiring
// Safe DOM only: createElement() + textContent. No HTML-string injection.

import {
  EMPTY_MESSAGE,
  TASK_STATES,
  SAMPLE_TASKS,
  TASK_BUTTONS,
  generateTaskId
} from "./data.js";
import { isBlank, normalizeText, countByState } from "./utils.js";
import { elements, showMessage, clearMessage, renderCounts } from "./display.js";

const { taskInput, addTaskBtn, loadSamplesBtn, taskList } = elements;

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

  const taskItem = createTaskElement(normalizeText(taskText), generateTaskId());
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
  newSpan.textContent = normalizeText(editInput.value);
  editInput.replaceWith(newSpan);
  editBtn.textContent = "Edit";
  clearMessage();
}

// The Edit button acts as Edit or Save depending on the current state
function toggleTaskEdit(taskItem) {
  if (taskItem.querySelector(".edit-input")) {
    saveTaskEdit(taskItem);
  } else {
    beginTaskEdit(taskItem);
  }
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

// Counts are always calculated from the current DOM
function updateTaskCounts() {
  const items = Array.from(taskList.querySelectorAll(".task-item"));
  renderCounts({
    total: items.length,
    pending: countByState(items, TASK_STATES.PENDING),
    completed: countByState(items, TASK_STATES.COMPLETED)
  });
}

// Object mapping a button class to its callback
const TASK_ACTIONS = {
  "complete-btn": toggleTaskComplete,
  "edit-btn": toggleTaskEdit,
  "remove-btn": removeTask
};

// Single delegated click handler for all task-level actions
function handleTaskListClick(event) {
  const taskItem = event.target.closest(".task-item");
  if (!taskItem) return;

  const actionClass = Object.keys(TASK_ACTIONS).find((className) =>
    event.target.matches("." + className)
  );
  if (actionClass) {
    TASK_ACTIONS[actionClass](taskItem);
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
taskInput.addEventListener("keydown", ({ key }) => {
  if (key === "Enter") addTask(taskInput.value);
});
loadSamplesBtn.addEventListener("click", loadSampleTasks);

updateTaskCounts();
