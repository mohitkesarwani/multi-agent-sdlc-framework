import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className='navbar'>
            <Link to='/dashboard'>Dashboard</Link>
            <Link to='/projects'>Projects</Link>
            <Link to='/tasks'>Tasks</Link>
            <button>Logout</button>
        </nav>
    );
};

export default Navbar;