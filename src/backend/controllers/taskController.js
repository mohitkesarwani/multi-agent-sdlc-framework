// taskController.js

// Sample in-memory task storage
let tasks = [];
let currentId = 1;

/**
 * Create a new task
 * @param {string} title - The title of the task
 * @param {string} description - The task description
 * @returns {object} - The created task
 */
function createTask(title, description) {
    const task = { id: currentId++, title, description, status: 'Pending' };
    tasks.push(task);
    return task;
}

/**
 * Get all tasks with optional filtering and sorting
 * @param {object} filters - An object containing filtering criteria
 * @param {string} sortBy - The property to sort by (e.g., 'title', 'status')
 * @returns {array} - Array of tasks
 */
function getTasks(filters = {}, sortBy) {
    let filteredTasks = tasks;
    // Apply filters
    if (filters.status) {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }
    // Sort tasks
    if (sortBy) {
        filteredTasks = filteredTasks.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    }
    return filteredTasks;
}

/**
 * Get a task by its ID
 * @param {number} id - The ID of the task
 * @returns {object|null} - The task if found, otherwise null
 */
function getTaskById(id) {
    return tasks.find(task => task.id === id) || null;
}

/**
 * Update an existing task
 * @param {number} id - The ID of the task
 * @param {object} updates - An object containing the updates
 * @returns {object|null} - The updated task if found, otherwise null
 */
function updateTask(id, updates) {
    const task = getTaskById(id);
    if (!task) return null;
    Object.assign(task, updates);
    return task;
}

/**
 * Delete a task by its ID
 * @param {number} id - The ID of the task to delete
 * @returns {boolean} - True if the task was deleted, otherwise false
 */
function deleteTask(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

/**
 * Assign a task to a user
 * @param {number} id - The ID of the task
 * @param {string} user - The user to assign the task to
 * @returns {object|null} - The updated task if found, otherwise null
 */
function assignTask(id, user) {
    const task = getTaskById(id);
    if (!task) return null;
    task.assignedTo = user;
    return task;
}

/**
 * Update the status of a task
 * @param {number} id - The ID of the task
 * @param {string} status - The new status
 * @returns {object|null} - The updated task if found, otherwise null
 */
function updateTaskStatus(id, status) {
    return updateTask(id, { status });
}

/**
 * Get tasks by iteration
 * @param {number} iteration - The iteration number
 * @returns {array} - Array of tasks for a specific iteration
 */
function getTasksByIteration(iteration) {
    return tasks.filter(task => task.iteration === iteration);
}

/**
 * Get tasks by project
 * @param {string} project - The project name
 * @returns {array} - Array of tasks for a specific project
 */
function getTasksByProject(project) {
    return tasks.filter(task => task.project === project);
}

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, assignTask, updateTaskStatus, getTasksByIteration, getTasksByProject };