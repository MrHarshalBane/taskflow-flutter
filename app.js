// TaskFlow Web Engine (Matching Flutter task.dart, json_service.dart, and home_screen.dart)

const DEFAULT_TASKS = [
  {
    "id": 1,
    "title": "Learn Flutter",
    "description": "Complete Flutter widgets and state management",
    "category": "Learning",
    "priority": "High",
    "completed": false
  },
  {
    "id": 2,
    "title": "Build Portfolio",
    "description": "Upload projects on GitHub",
    "category": "Career",
    "priority": "Medium",
    "completed": true
  },
  {
    "id": 3,
    "title": "Implement Local JSON Storage",
    "description": "Store and load persistent tasks seamlessly in TaskFlow",
    "category": "Work",
    "priority": "High",
    "completed": true
  },
  {
    "id": 4,
    "title": "Evening Run & Exercise",
    "description": "30 mins cardio workout in the park",
    "category": "Health",
    "priority": "Low",
    "completed": false
  }
];

const CATEGORY_ICONS = {
  Work: '💼',
  Learning: '📚',
  Personal: '🏠',
  Career: '🚀',
  Health: '❤️'
};

let tasks = [];
let activeStatusFilter = 'all'; // 'all', 'pending', 'completed'
let activeCategoryFilter = 'all';
let activePriorityFilter = 'all';
let searchQuery = '';
let activeDetailTask = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Splash Screen Transition
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    splash.classList.add('fade-out');
    document.getElementById('app-layout').style.display = 'block';
    setTimeout(() => splash.remove(), 500);
  }, 1000);

  // Set today's date
  const now = new Date();
  document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });

  // Load Tasks
  loadTasksFromStorage();

  // Load Saved Theme
  const savedTheme = localStorage.getItem('tf_theme') || 'dark';
  setTheme(savedTheme);

  // Event Listeners
  initEventListeners();
  renderApp();
});

function initEventListeners() {
  // Theme Toggle
  document.getElementById('btn-theme-toggle').addEventListener('click', toggleTheme);

  // FAB Add Task
  document.getElementById('fab-add-task').addEventListener('click', () => openTaskModal());

  // Search Input
  const searchInput = document.getElementById('input-search');
  const clearSearchBtn = document.getElementById('btn-clear-search');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
    renderTasksList();
  });
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    renderTasksList();
  });

  // Status Filter Pills
  document.querySelectorAll('#filter-status-group .pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filter-status-group .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStatusFilter = btn.dataset.filter;
      renderTasksList();
    });
  });

  // Category & Priority Dropdowns
  document.getElementById('filter-category').addEventListener('change', (e) => {
    activeCategoryFilter = e.target.value;
    renderTasksList();
  });
  document.getElementById('filter-priority').addEventListener('change', (e) => {
    activePriorityFilter = e.target.value;
    renderTasksList();
  });

  // Task Form Submit
  document.getElementById('task-form').addEventListener('submit', handleTaskFormSubmit);

  // Settings & Storage Modal
  document.getElementById('btn-open-settings').addEventListener('click', openSettingsModal);
  document.getElementById('btn-export-json').addEventListener('click', exportTasksJson);
  document.getElementById('btn-import-json-trigger').addEventListener('click', () => {
    document.getElementById('json-file-input').click();
  });
  document.getElementById('json-file-input').addEventListener('change', handleImportJson);
  document.getElementById('btn-reset-tasks').addEventListener('click', handleResetTasks);

  // Details Modal Actions
  document.getElementById('btn-edit-from-details').addEventListener('click', () => {
    if (activeDetailTask) {
      closeDetailsModal();
      openTaskModal(activeDetailTask);
    }
  });
  document.getElementById('btn-delete-from-details').addEventListener('click', () => {
    if (activeDetailTask) {
      deleteTask(activeDetailTask.id);
      closeDetailsModal();
    }
  });
}

// Storage Operations
function loadTasksFromStorage() {
  const local = localStorage.getItem('tf_tasks');
  if (local) {
    try {
      tasks = JSON.parse(local);
    } catch (_) {
      tasks = [...DEFAULT_TASKS];
    }
  } else {
    tasks = [...DEFAULT_TASKS];
    saveTasksToStorage();
  }
}

function saveTasksToStorage() {
  localStorage.setItem('tf_tasks', JSON.stringify(tasks));
}

// Theme
function toggleTheme() {
  const isDark = document.body.classList.contains('dark-theme');
  setTheme(isDark ? 'light' : 'dark');
}

function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    document.getElementById('theme-icon').className = 'fa-solid fa-moon';
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    document.getElementById('theme-icon').className = 'fa-solid fa-sun';
  }
  localStorage.setItem('tf_theme', theme);
}

// Quick Metric Filters
function setQuickFilter(status) {
  activeStatusFilter = status;
  document.querySelectorAll('#filter-status-group .pill-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === status);
  });
  renderTasksList();
}

// Render Core App
function renderApp() {
  renderMetrics();
  renderTasksList();
}

function renderMetrics() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById('metric-total').textContent = total;
  document.getElementById('metric-pending').textContent = pending;
  document.getElementById('metric-completed').textContent = completed;
}

function renderTasksList() {
  const listEl = document.getElementById('tasks-list');
  const countPill = document.getElementById('filtered-count');

  const filtered = tasks.filter(task => {
    // Status filter
    if (activeStatusFilter === 'pending' && task.completed) return false;
    if (activeStatusFilter === 'completed' && !task.completed) return false;

    // Category filter
    if (activeCategoryFilter !== 'all' && task.category !== activeCategoryFilter) return false;

    // Priority filter
    if (activePriorityFilter !== 'all' && task.priority !== activePriorityFilter) return false;

    // Search query
    if (searchQuery) {
      const matchTitle = (task.title || '').toLowerCase().includes(searchQuery);
      const matchDesc = (task.description || '').toLowerCase().includes(searchQuery);
      const matchCat = (task.category || '').toLowerCase().includes(searchQuery);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    return true;
  });

  countPill.textContent = `${filtered.length} task${filtered.length === 1 ? '' : 's'}`;

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-folder-open"></i></div>
        <h4>No Tasks Found</h4>
        <p>No tasks match the active filter criteria.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map(task => {
    const catIcon = CATEGORY_ICONS[task.category] || '📌';
    const isChecked = task.completed ? 'checked' : '';
    const isCompletedCls = task.completed ? 'completed' : '';

    return `
      <div class="task-card ${isCompletedCls}" id="task-card-${task.id}">
        <div class="task-checkbox-wrap" onclick="toggleTaskCompletion(${task.id})">
          <div class="custom-checkbox ${isChecked}">
            ${task.completed ? '<i class="fa-solid fa-check"></i>' : ''}
          </div>
        </div>

        <div class="task-info" onclick="openDetailsModal(${task.id})">
          <h4 class="task-title">${escapeHtml(task.title)}</h4>
          ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ''}
          <div class="task-meta-tags">
            <span class="tag-category">${catIcon} ${task.category}</span>
            <span class="tag-priority ${task.priority}">${task.priority} Priority</span>
          </div>
        </div>

        <div class="task-actions">
          <button class="task-btn" onclick="openTaskModal(getTaskById(${task.id}))" title="Edit Task">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="task-btn delete" onclick="deleteTask(${task.id})" title="Delete Task">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function getTaskById(id) {
  return tasks.find(t => t.id === id);
}

// Task CRUD
function toggleTaskCompletion(id) {
  const task = getTaskById(id);
  if (task) {
    task.completed = !task.completed;
    saveTasksToStorage();
    renderApp();
    showToast(task.completed ? '✓ Task marked completed' : '↩ Task marked pending');
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasksToStorage();
  renderApp();
  showToast('🗑 Task deleted');
}

function openTaskModal(existingTask = null) {
  const modal = document.getElementById('task-modal');
  const titleEl = document.getElementById('modal-title');
  const idField = document.getElementById('task-id-field');
  const titleInput = document.getElementById('task-title-input');
  const descInput = document.getElementById('task-desc-input');
  const catSelect = document.getElementById('task-category-select');
  const prioSelect = document.getElementById('task-priority-select');

  if (existingTask) {
    titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Task';
    idField.value = existingTask.id;
    titleInput.value = existingTask.title;
    descInput.value = existingTask.description || '';
    catSelect.value = existingTask.category;
    prioSelect.value = existingTask.priority;
  } else {
    titleEl.innerHTML = '<i class="fa-solid fa-circle-plus"></i> New Task';
    idField.value = '';
    titleInput.value = '';
    descInput.value = '';
    catSelect.value = 'Learning';
    prioSelect.value = 'Medium';
  }

  modal.classList.remove('hidden');
  titleInput.focus();
}

function closeTaskModal() {
  document.getElementById('task-modal').classList.add('hidden');
}

function handleTaskFormSubmit(e) {
  e.preventDefault();
  const idVal = document.getElementById('task-id-field').value;
  const title = document.getElementById('task-title-input').value.trim();
  const description = document.getElementById('task-desc-input').value.trim();
  const category = document.getElementById('task-category-select').value;
  const priority = document.getElementById('task-priority-select').value;

  if (!title) return;

  if (idVal) {
    // Edit existing
    const existing = getTaskById(parseInt(idVal));
    if (existing) {
      existing.title = title;
      existing.description = description;
      existing.category = category;
      existing.priority = priority;
      showToast('✏️ Task updated successfully');
    }
  } else {
    // Add new
    const newTask = {
      id: Date.now(),
      title,
      description,
      category,
      priority,
      completed: false
    };
    tasks.unshift(newTask);
    showToast('✨ New task created');
  }

  saveTasksToStorage();
  closeTaskModal();
  renderApp();
}

// Details Modal
function openDetailsModal(id) {
  const task = getTaskById(id);
  if (!task) return;
  activeDetailTask = task;

  const catIcon = CATEGORY_ICONS[task.category] || '📌';
  const bodyEl = document.getElementById('details-body');
  bodyEl.innerHTML = `
    <div style="margin-bottom:1rem;">
      <span class="tag-priority ${task.priority}" style="margin-bottom:0.5rem;">${task.priority} Priority</span>
      <h2 style="font-family:'Outfit';font-size:1.35rem;margin:0.4rem 0;">${escapeHtml(task.title)}</h2>
      <span class="tag-category">${catIcon} ${task.category}</span>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid var(--md-sys-color-outline);border-radius:10px;padding:1rem;margin-bottom:1.25rem;">
      <p style="font-size:0.9rem;line-height:1.6;color:var(--md-sys-color-on-surface);white-space:pre-wrap;">${escapeHtml(task.description || 'No additional notes provided.')}</p>
    </div>
    <div style="font-size:0.8rem;color:var(--md-sys-color-on-surface-variant);">
      Status: <b>${task.completed ? '✅ Completed' : '⏳ Pending'}</b> • ID: #${task.id}
    </div>
  `;

  document.getElementById('details-modal').classList.remove('hidden');
}

function closeDetailsModal() {
  document.getElementById('details-modal').classList.add('hidden');
  activeDetailTask = null;
}

// Settings Modal & JSON Import / Export
function openSettingsModal() {
  document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettingsModal() {
  document.getElementById('settings-modal').classList.add('hidden');
}

function exportTasksJson() {
  const jsonStr = JSON.stringify(tasks, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Exported tasks.json');
}

function handleImportJson(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (Array.isArray(parsed)) {
        tasks = parsed;
        saveTasksToStorage();
        renderApp();
        closeSettingsModal();
        showToast(`🎉 Imported ${tasks.length} tasks!`);
      } else {
        alert('Invalid JSON: Must be an array of task objects.');
      }
    } catch (err) {
      alert('Error parsing JSON file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function handleResetTasks() {
  if (confirm('Reset to default Flutter tasks.json data?')) {
    tasks = [...DEFAULT_TASKS];
    saveTasksToStorage();
    renderApp();
    closeSettingsModal();
    showToast('🔄 Reset to default tasks');
  }
}

// Toast
function showToast(msg) {
  const toast = document.getElementById('toast-message');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

function escapeHtml(str) {
  return (str || '').replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
