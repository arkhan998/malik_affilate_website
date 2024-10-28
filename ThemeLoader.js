import React, { useState } from 'react';
import './themes/lightTheme.css';
import './themes/darkTheme.css';

function ThemeLoader() {
    const [theme, setTheme] = useState('lightTheme');

    const changeTheme = (themeName) => {
        setTheme(themeName);
        document.body.className = themeName;
    };

    return (
        <div>
            <button onClick={() => changeTheme('lightTheme')}>Light Theme</button>
            <button onClick={() => changeTheme('darkTheme')}>Dark Theme</button>
        </div>
    );
}

export default ThemeLoader;
