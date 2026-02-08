import React, { useState, useEffect } from 'react';
import './ProjectList.css';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setProjects([
            { id: 1, name: 'Project 1', status: 'active' },
            { id: 2, name: 'Project 2', status: 'planning' }
        ]);
        setLoading(false);
    }, []);

    if (loading) return <div className='project-list'><p>Loading...</p></div>;

    return (
        <div className='project-list'>
            <h1>Projects</h1>
            <div className='projects-grid'>
                {projects.map(p => (
                    <div key={p.id} className='project-card'>
                        <h3>{p.name}</h3>
                        <p>Status: {p.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectList;