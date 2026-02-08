import React from 'react';
import './Navbar.css';
const Navbar = ({ user, onLogout }) => {
    return (
        <nav className='navbar'>
            <div className='nav-brand'>
                <h2>SDLC Framework</h2>
            </div>
            <div className='nav-links'>
                <a href='/dashboard'>Dashboard</a>
                <a href='/projects'>Projects</a>
                <a href='/tasks'>Tasks</a>
            </div>
            <div className='nav-user'>
                <span>{user?.username}</span>
                <button onClick={onLogout}>Logout</button>
            </div>
        </nav>
    );
};
export default Navbar;