/**
 * Clarity — Task Manager
 * script.js
 *
 * Features:
 *  - Add / delete / complete tasks
 *  - Filter: All / Active / Done
 *  - Task counter (active tasks)
 *  - Clear completed
 *  - Persist to localStorage
 *  - Animated add / remove transitions
 */

/* ── State ─────────────────────────────────────────────────── */

/** @type {{ id: string, text: string, done: boolean, createdAt: number }[]} */
let tasks = [];

/** @type {'all'|'active'|'done'} */
let currentFilter = 'all';

/* ── DOM References ─────────────────────────────────────────── */
const taskInput   = document.getElementById('taskInput');
const addBtn      = document.getElementById('addBtn');
const taskList    = document.getElementById('taskList');
const emptyState  = document.getElementById('emptyState');
const counterNum  = document.getElementById('counterNum');
const footerCount = document.getElementById('footerCount');
const clearBtn    = document.getElementById('clearBtn');
const tabs        = document.querySelectorAll('.tab');

/* ── Bootstrap ──────────────────────────────────────────────── */
(function init() {
  loadFromStorage();
  render();
  bindEvents();
})();

/* ── Event Binding ──────────────────────────────────────────── */
function bindEvents() {
  // Add via button
  addBtn.addEventListener('click', handleAdd);

  // Add via Enter key
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAdd();
  });

  // Filter tabs
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      currentFilter = tab.dataset.filter;
      tabs.forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      render();
    });
  });

  // Clear completed tasks
  clearBtn.addEventListener('click', handleClearCompleted);
}

/* ── Handlers ────────────────────────────────────────────────── */

/** Add a new task from the input field. */
function handleAdd() {
  const raw = taskInput.value.trim();
  if (!raw) {
    // Shake the input if empty
    shakeInput();
    return;
  }
  addTask(raw);
  taskInput.value = '';
  taskInput.focus();
}

/** Toggle a task's done state. */
function handleToggle(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, done: !t.done } : t
  );
  saveToStorage();
  render();
}

/** Animate-then-remove a task by ID. */
function handleDelete(id, listItemEl) {
  // Play exit animation before removing from state
  listItemEl.classList.add('removing');
  listItemEl.addEventListener('transitionend', () => {
    tasks = tasks.filter((t) => t.id !== id);
    saveToStorage();
    render();
  }, { once: true });
}

/** Remove all completed tasks. */
function handleClearCompleted() {
  // Animate each done item out before clearing
  const doneItems = taskList.querySelectorAll('.task-item.done');
  if (doneItems.length === 0) return;

  let count = doneItems.length;
  doneItems.forEach((el) => {
    el.classList.add('removing');
    el.addEventListener('transitionend', () => {
      count -= 1;
      if (count === 0) {
        tasks = tasks.filter((t) => !t.done);
        saveToStorage();
        render();
      }
    }, { once: true });
  });
}

/* ── Core Data Ops ───────────────────────────────────────────── */

/**
 * Create and prepend a new task.
 * @param {string} text
 */
function addTask(text) {
  const newTask = {
    id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    text,
    done: false,
    createdAt: Date.now(),
  };
  // Prepend so newest is at top
  tasks = [newTask, ...tasks];
  saveToStorage();
  render();
}

/* ── Render ──────────────────────────────────────────────────── */

/** Re-render the visible task list based on current filter. */
function render() {
  const filtered = getFiltered();

  // Clear the list
  taskList.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
    filtered.forEach((task, idx) => {
      const li = createTaskElement(task, idx);
      taskList.appendChild(li);
    });
  }

  updateCounters();
}

/**
 * Build a task list item element.
 * @param {{ id: string, text: string, done: boolean }} task
 * @param {number} index – used to stagger animation delays
 * @returns {HTMLLIElement}
 */
function createTaskElement(task, index) {
  const li = document.createElement('li');
  li.className = `task-item${task.done ? ' done' : ''}`;
  li.setAttribute('role', 'listitem');
  li.setAttribute('data-id', task.id);
  // Stagger entry animation
  li.style.animationDelay = `${Math.min(index * 40, 320)}ms`;

  // ── Checkbox ──
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-check';
  checkbox.checked = task.done;
  checkbox.setAttribute('aria-label', `Mark "${task.text}" as ${task.done ? 'incomplete' : 'complete'}`);
  checkbox.addEventListener('change', () => handleToggle(task.id));

  // ── Text ──
  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = task.text;

  // ── Delete button ──
  const delBtn = document.createElement('button');
  delBtn.className = 'task-del';
  delBtn.setAttribute('aria-label', `Delete "${task.text}"`);
  delBtn.innerHTML = '&#x2715;'; // ✕
  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleDelete(task.id, li);
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(delBtn);

  return li;
}

/* ── Counters ────────────────────────────────────────────────── */

/** Update the header badge and footer text. */
function updateCounters() {
  const total  = tasks.length;
  const active = tasks.filter((t) => !t.done).length;
  const done   = tasks.filter((t) => t.done).length;

  counterNum.textContent = active;

  const plural = (n, w) => `${n} ${w}${n !== 1 ? 's' : ''}`;
  footerCount.textContent =
    `${plural(total, 'task')} · ${plural(done, 'completed')}`;

  // Dim clear button when nothing to clear
  clearBtn.style.opacity = done > 0 ? '1' : '0.35';
  clearBtn.style.pointerEvents = done > 0 ? 'auto' : 'none';
}

/* ── Filter Helper ───────────────────────────────────────────── */

/**
 * Return tasks matching the current filter.
 * @returns {typeof tasks}
 */
function getFiltered() {
  switch (currentFilter) {
    case 'active': return tasks.filter((t) => !t.done);
    case 'done':   return tasks.filter((t) => t.done);
    default:       return tasks;
  }
}

/* ── Micro-interaction ──────────────────────────────────────── */

/** Visually shake the input wrapper when the user tries to add an empty task. */
function shakeInput() {
  const wrapper = taskInput.closest('.input-wrapper');
  wrapper.style.animation = 'none';
  void wrapper.offsetWidth; // reflow
  wrapper.style.animation = 'shakeInput 0.35s ease';
  wrapper.addEventListener('animationend', () => {
    wrapper.style.animation = '';
  }, { once: true });
}

// Inject shake keyframes dynamically (avoids cluttering CSS with this edge-case)
(function injectShakeKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shakeInput {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(5px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(3px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ── localStorage ────────────────────────────────────────────── */

const STORAGE_KEY = 'clarity_tasks_v1';

/** Persist tasks array to localStorage. */
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.warn('Clarity: Could not save to localStorage.', err);
  }
}

/** Load tasks from localStorage (gracefully handles corrupt data). */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) tasks = parsed;
  } catch (err) {
    console.warn('Clarity: Could not load from localStorage.', err);
  }
}
