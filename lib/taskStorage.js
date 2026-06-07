import fs from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, '../data');
const tasksFile = resolve(dataDir, 'tasks.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(tasksFile);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(tasksFile, '[]', 'utf8');
      return;
    }

    console.error('Failed to ensure tasks data file:', error);
    throw error;
  }
}

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime() || 0;
    const bTime = new Date(b.createdAt).getTime() || 0;
    return bTime - aTime;
  });
}

async function readTasks() {
  try {
    await ensureDataFile();
    const fileContents = await fs.readFile(tasksFile, 'utf8');
    const tasks = JSON.parse(fileContents || '[]');
    return Array.isArray(tasks) ? sortTasks(tasks) : [];
  } catch (error) {
    console.error('Failed to read tasks:', error);
    return [];
  }
}

async function writeTasks(tasks) {
  try {
    await ensureDataFile();
    await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), 'utf8');
    return sortTasks(tasks);
  } catch (error) {
    console.error('Failed to write tasks:', error);
    return [];
  }
}

export async function getTasks() {
  return readTasks();
}

export async function saveTasks(tasks) {
  return writeTasks(tasks);
}

export async function getTaskById(id) {
  const tasks = await readTasks();
  return tasks.find((task) => String(task.id) === String(id)) ?? null;
}

export async function createTask(task) {
  const tasks = await readTasks();
  const newTask = {
    id: randomUUID(),
    title: task.title ?? '',
    description: task.description ?? '',
    dueDate: task.dueDate ?? null,
    completed: false,
    createdAt: Date.now(),
  };
  const nextTasks = [newTask, ...tasks];
  await writeTasks(nextTasks);
  return newTask;
}

export async function updateTask(id, updates) {
  const tasks = await readTasks();
  let updatedTask = null;

  const nextTasks = tasks.map((task) => {
    if (String(task.id) !== String(id)) return task;
    updatedTask = { ...task, ...updates };
    return updatedTask;
  });

  if (!updatedTask) return null;

  await writeTasks(nextTasks);
  return updatedTask;
}

export async function deleteTask(id) {
  const tasks = await readTasks();
  const nextTasks = tasks.filter((task) => String(task.id) !== String(id));
  if (nextTasks.length === tasks.length) return null;
  await writeTasks(nextTasks);
  return true;
}

export async function toggleTask(id) {
  const tasks = await readTasks();
  let toggledTask = null;

  const nextTasks = tasks.map((task) => {
    if (String(task.id) !== String(id)) return task;
    toggledTask = { ...task, completed: !Boolean(task.completed) };
    return toggledTask;
  });

  if (!toggledTask) return null;

  await writeTasks(nextTasks);
  return toggledTask;
}
