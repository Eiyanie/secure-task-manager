// display.js — DOM references and screen updates

export const elements = {
  taskInput: document.getElementById("taskInput"),
  addTaskBtn: document.getElementById("addTaskBtn"),
  loadSamplesBtn: document.getElementById("loadSamplesBtn"),
  taskList: document.getElementById("taskList"),
  taskMessage: document.getElementById("taskMessage"),
  totalCount: document.getElementById("totalCount"),
  pendingCount: document.getElementById("pendingCount"),
  completedCount: document.getElementById("completedCount")
};

export const showMessage = (text) => {
  elements.taskMessage.textContent = text;
};

export const clearMessage = () => showMessage("");

// Destructures the counts object and writes each value to the summary
export function renderCounts({ total, pending, completed }) {
  elements.totalCount.textContent = total;
  elements.pendingCount.textContent = pending;
  elements.completedCount.textContent = completed;
}
