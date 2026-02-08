import React, { useState, useEffect } from 'react';
import './TaskBoard.css';

const TaskBoard = () => {
 const [tasks, setTasks] = useState([]);
 const [filter, setFilter] = useState('all');

 useEffect(() => {
 setTasks([
 { id: 1, title: 'Task 1', status: 'todo', priority: 'high' },
 { id: 2, title: 'Task 2', status: 'in-progress', priority: 'medium' }
 ]);
 }, []);

 return (
 <div className='task-board'>
 <h1>Task Board</h1>
 <div className='kanban-board'>
 <div className='column'>
 <h3>To Do</h3>
 {tasks.filter(t => t.status === 'todo').map(t => (
 <div key={t.id} className='task-card'>
 <h4>{t.title}</h4>
 <span className={`priority-${t.priority}`}>{t.priority}</span>
 </div>
 ))}
 </div>
 <div className='column'>
 <h3>In Progress</h3>
 {tasks.filter(t => t.status === 'in-progress').map(t => (
 <div key={t.id} className='task-card'>
 <h4>{t.title}</h4>
 <span className={`priority-${t.priority}`}>{t.priority}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
};

export default TaskBoard;