import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link as RouterDOMLink, 
    Navigate, 
} from 'react-router-dom';
import React, { createContext, useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { AllPosts } from './pages/AllPosts';
import { DeleteConfirm } from './pages/DeleteConfirm';
import { CreatePost } from './pages/CreatePost';
import { UpdatePost } from './pages/UpdatePost';

export interface AppProps {

}

export type Author = {
    _id: string;
    name: string;
    password: string;
    username: string;
}

export type Post = { 
    _id: string;
    name: string;
    date_made: string;
    is_published: boolean;
    content: string;
    author: Author;
    comments: Array<string>;
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

export const ApiUrlContext = createContext<string>('http://localhost:5500');

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
                        <Route path='/' element={<Navigate to='/login' />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/posts' element={<AllPosts />} />
                        <Route
                            path='/posts/:postID/delete' 
                            element={<DeleteConfirm />}
                        />
                        <Route path='/posts/create' element={<CreatePost />} />
                        <Route
                            path='/posts/:postID/update'
                            element={<UpdatePost />}
                        />
                    </Routes>
                </div>
            </ThemeContext.Provider >
        </Router>
    );
}

export { App };

