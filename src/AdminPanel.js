import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import AddProduct from './AddProduct';
import ManageThemes from './ManageThemes';
import ManagePlugins from './ManagePlugins';

function AdminPanel() {
    return (
        <Router>
            <div>
                <h2>Admin Panel</h2>
                <nav>
                    <Link to="/add-product">Add Product</Link> | 
                    <Link to="/manage-themes">Manage Themes</Link> | 
                    <Link to="/manage-plugins">Manage Plugins</Link>
                </nav>
                <Routes>
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/manage-themes" element={<ManageThemes />} />
                    <Route path="/manage-plugins" element={<ManagePlugins />} />
                </Routes>
            </div>
        </Router>
    );
}

export default AdminPanel;
