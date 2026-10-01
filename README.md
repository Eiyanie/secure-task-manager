# Secure Dynamic Task Manager

## How to run
The JavaScript uses ES modules, so open the project through a local server
(not by double-clicking index.html):
- VS Code: right-click `index.html` > **Open with Live Server**, or
- Terminal: `python -m http.server 8000` then open http://localhost:8000

## Module organization
| File | Role |
| --- | --- |
| `js/data.js` | Constants, sample-task array, button definitions, task-ID generator |
| `js/utils.js` | Helpers: `isBlank`, `normalizeText`, `createElementWithClass`, `countByState` |
| `js/display.js` | DOM references and screen updates: `showMessage`, `clearMessage`, `renderCounts` |
| `js/app.js` | Main module: all required task functions, one delegated click listener |

## JavaScript concepts used
- **Arrays / array methods:** `SAMPLE_TASKS`, `TASK_BUTTONS`; `map`, `filter`, `find`, `forEach`, `Array.from`
- **Objects:** `TASK_STATES`, `elements`, and the `TASK_ACTIONS` map of button class to function
- **Callbacks:** action functions passed through `TASK_ACTIONS`, arrow functions in `forEach` / `map` / `find`
- **Destructuring:** `{ target }`, `{ className, label }`, `{ dataset }`, `{ total, pending, completed }`
- **Closure:** `createIdGenerator()` for unique `task-N` IDs

## Security
All task text is assigned with `textContent`; elements are built with `createElement()`.
No HTML-string injection, `document.write`, or inline event attributes are used.

## Test results
All items in the lab's Testing Requirements passed (empty start, add, blank validation,
`<img src=x onerror=alert(1)>` shown as text, complete/uncomplete, edit/save, remove,
sample tasks, delegation on new tasks).
