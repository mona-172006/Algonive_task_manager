let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

taskForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const dueDate = document.getElementById('due-date').value;

  const task = {
    id: Date.now(),
    title,
    description,
    dueDate,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filter = 'all') {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (filter === 'complete') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.innerHTML = `
      <strong>${task.title}</strong><br>
      ${task.description}<br>
      Due: ${task.dueDate}<br>
      <button onclick="toggleComplete(${task.id})">${task.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;

    if (isNearDeadline(task.dueDate) && !task.completed) {
      li.style.borderLeft = '5px solid red';
    }

    taskList.appendChild(li);
  });
}

function toggleComplete(id) {
  tasks = tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function filterTasks(status) {
  renderTasks(status);
}

function isNearDeadline(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = (due - now) / (1000 * 60 * 60 * 24);
  return diff <= 1 && diff >= 0;
}

// Initial render
renderTasks();
