// Import CSS so Vite can process it
import './style.css';
import posthog from 'posthog-js';

// Ініціалізація PostHog (Крок 1)
posthog.init('phc_u7MNHDuatKukA76Ccay3xbq4GeJV9aaMdTJ9EKq47ygG', {
  api_host: 'https://eu.posthog.com',
  person_profiles: 'identified_only'
});

// Перевірка Feature Flag (Крок 5)
posthog.onFeatureFlags(() => {
  if (posthog.isFeatureEnabled('show-urgent-filter')) {
    document.getElementById('urgent-btn').style.display = 'inline-block';
  }
});

// 1. Виведення змінної оточення
const envStatusElement = document.getElementById('env-status');
const appStatus = import.meta.env.VITE_APP_STATUS || 'Unknown';
envStatusElement.textContent = `Mode: ${appStatus}`;

// Додаємо візуальний клас залежно від режиму
if (appStatus === 'Production') {
  envStatusElement.classList.add('prod-mode');
} else {
  envStatusElement.classList.add('dev-mode');
}

// 2. Логіка завдань (LocalStorage)
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Отримуємо завдання з LocalStorage або створюємо порожній масив
let tasks = JSON.parse(localStorage.getItem('unidone_tasks')) || [];

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task.title;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveAndRender();
      
      // PostHog event: task deleted (Крок 2)
      posthog.capture('task_deleted', {
        reason: 'user_action'
      });
    };
    
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

function saveAndRender() {
  localStorage.setItem('unidone_tasks', JSON.stringify(tasks));
  renderTasks();
}

addTaskBtn.addEventListener('click', () => {
  const title = taskInput.value.trim();
  if (title) {
    tasks.push({ title });
    taskInput.value = '';
    saveAndRender();
    
    // PostHog event: task created (Крок 2)
    posthog.capture('task_created', {
      priority: 'high',
      category: 'work',
      is_authenticated: true
    });
  }
});

// Ініціалізація
renderTasks();
