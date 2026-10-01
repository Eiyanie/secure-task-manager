// utils.js — small reusable helper functions

export const normalizeText = (text) => text.trim();

export const isBlank = (text) => normalizeText(text) === "";

// Creates an element with one class; text is assigned only through textContent
export function createElementWithClass(tagName, className, text = "") {
  const element = document.createElement(tagName);
  element.classList.add(className);
  if (text) {
    element.textContent = text;
  }
  return element;
}

// Counts task elements whose data-state matches the given state
export const countByState = (items, state) =>
  items.filter(({ dataset }) => dataset.state === state).length;
