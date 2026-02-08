import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({ projects: 0, tasks: 0, completed: 0 });

    useEffect(() => {
        setStats({ projects: 5, tasks: 20, completed: 10 });
    }, []);

    return (
        <div className='dashboard'>
            <h1>Dashboard</h1>
            <div className='stats-grid'>
                <div className='stat-card'>
                    <h3>Total Projects</h3>
                    <p>{stats.projects}</p>
                </div>
                <div className='stat-card'>
                    <h3>Total Tasks</h3>
                    <p>{stats.tasks}</p>
                </div>
                <div className='stat-card'>
                    <h3>Completed Tasks</h3>
                    <p>{stats.completed}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;