import { BrowserRouter as Router, Routes, Route, Link as RouterDOMLink } from 'react-router-dom';
import React, { createContext, useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Post } from './pages/Post';

export interface AppProps {

}

export type ThemeContextType = {
    theme: string; 
    toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>(
    {
        theme: 'default',
        toggleTheme: () => {},
    }
);

const App: React.FunctionComponent<AppProps> = ({

}) => {
    const [ theme, setTheme ] = useState<string>('dark');
    const toggleTheme = () => {
        setTheme(curr => (curr === 'light' ? 'dark' : 'light'));
    };

    const setBounceBackground = () => {
        const root = document.querySelector('html');
        if (root) {
            root.style.background = (theme === 'light' ? '#F6F6F6' : '#1A1C23')
        }
    };
    useEffect(() => {
        setBounceBackground();
    });

    return (
        <Router>
            <ThemeContext.Provider value={{theme, toggleTheme}} >
                <div id={theme}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/:postID' element={<Post />} />
                    </Routes>
                </div>
            </ThemeContext.Provider >
        </Router>
    );
}

export { App };

