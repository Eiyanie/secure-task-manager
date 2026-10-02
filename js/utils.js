// utils.js — small reusable helper functions

export const normalizeText = (text) => text.trim();

export const isBlank = (text) => normalizeText(text) === "";

// Counts task elements whose data-state matches the given state
export const countByState = (items, state) =>
  items.filter(({ dataset }) => dataset.state === state).length;
