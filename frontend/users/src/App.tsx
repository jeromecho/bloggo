import { BrowserRouter as Router, Routes, Route, Link as RouterDOMLink } from 'react-router-dom';
import React, { createContext, useState } from 'react';
import { Home } from './pages/Home';
import { Post } from './pages/Post';

export interface AppProps {

}

export type ThemeContextType = {
    theme: string; 
    toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

const App: React.FunctionComponent<AppProps> = ({

}) => {

    const [ theme, setTheme ] = useState<string>('light');

    const toggleTheme = () => {
        setTheme(curr => (curr === 'light' ? 'dark' : 'light'));
    };

    return (
        <Router>
            <ThemeContext.Provider value={{theme, toggleTheme}} >
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/:postID' element={<Post />} />
                </Routes>
            </ThemeContext.Provider >
        </Router>
    );
}

export { App };

