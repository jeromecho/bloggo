import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link as RouterDOMLink, 
    Navigate, 
} from 'react-router-dom';
import React, { createContext, useRef, useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { AllPosts } from './pages/AllPosts';
import { DeleteConfirm } from './pages/DeleteConfirm';
import { CreatePost } from './pages/CreatePost';
import { UpdatePost } from './pages/UpdatePost';
import { NotFound } from './pages/NotFound';
import { WithAuthentication } from './higher_order_components/WithAuthentication';

export interface AppProps {

}

export type Author = {
    _id: string;
    name: string;
    password: string;
    username: string;
}

export type Comment = {
    _id: string;
    author: string;
    email: string;
    date_made: string;
    content: string;
}

export type Post = { 
    _id: string;
    name: string;
    date_made: string;
    is_published: boolean;
    content: string;
    author: Author;
    comments: Array<Comment>;
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

export const ApiUrlContext = createContext<string>(`${process.env.REACT_APP_SERVER_URL}`);

export type AuthenticationContextType = {
    isAuthenticated: boolean | null;
    setIsAuthenticated: (bool: boolean) => void;
};

export const AuthenticationContext = createContext<AuthenticationContextType>({
    isAuthenticated: false, 
    setIsAuthenticated: (bool) => {},
});

export type MessageContextType = {
    message: string | null;
    setMessage: (msg: string) => void;
};

export const MessageContext = createContext<MessageContextType>({
    message: null,
    setMessage: (msg) => {},
});

const App: React.FunctionComponent<AppProps> = ({

}) => {
    const messageContainer = useRef<null | HTMLDivElement>(null);
    const [ isAuthenticated, setIsAuthenticated ] = useState<boolean | null>(null);
    const [ message, setMessage ] = useState<null | string>(null);
    const [ theme, setTheme ] = useState<string>('dark');
    const toggleTheme = () => {
        setTheme(curr => (curr === 'light' ? 'dark' : 'light'));
    };

    const setBounceBackground = () => {
        const root = document.querySelector('html');
        if (root) {
            root.style.background = (theme === 'light' ? '#F6F6F6' : '#1A1C23');
        }
    };

    useEffect(() => {
        setBounceBackground();
        if (localStorage.isAuthenticated) {
            setIsAuthenticated(!!localStorage.getItem('isAuthenticated'));
        }
        if (message) {
            displayMessage();
        }
    });

    const displayMessage = () => {
        if (messageContainer.current) {
            messageContainer.current.classList.add('active');
            setTimeout(() => {
                if (messageContainer.current) {
                    messageContainer.current.classList.remove('active');
                }
            }, (3 * 1000));
            setTimeout(() => {
                setMessage('');
            }, (3.5 * 1000));
        }
    };


    return (
        <Router basename='/bloggo-admin'>
            <ThemeContext.Provider value={{theme, toggleTheme}} >
                <AuthenticationContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
                    <MessageContext.Provider value={{message, setMessage}} >
                        <div id={theme}>
                            <Routes>
                                <Route path='/login' element={<Login />} />
                                <Route path='/signup' element={<Signup />} />
                                <Route path='/dashboard' element={
                                        <WithAuthentication>
                                            <Dashboard />
                                        </WithAuthentication>
                                } />
                                <Route path='/posts' element={<AllPosts />} />
                                <Route
                                    path='/posts/:postID/delete' 
                                    element={
                                        <WithAuthentication>
                                            <DeleteConfirm /> 
                                        </WithAuthentication>
                                    }
                                />
                                <Route path='/posts/create' element={
                                        <WithAuthentication>
                                            <CreatePost /> 
                                        </WithAuthentication>
                                }
                                />
                                <Route
                                    path='/posts/:postID/update'
                                    element={
                                        <WithAuthentication>
                                            <UpdatePost /> 
                                        </WithAuthentication>
                                    }
                                />
                                <Route path='/' element={<Navigate to='/login' />} />
                                <Route 
                                    path='*'
                                    element={<NotFound />}
                                />
                            </Routes>
                            <div ref={messageContainer} className='message'>
                                <p>{
                                    (message) ? 
                                    ((message.length > 15) ?
                                    message.slice(0, 15) + ' ...' : 
                                        message) :
                                        ''
                                }</p>

                        </div>
                    </div>
                </MessageContext.Provider >
            </AuthenticationContext.Provider>
        </ThemeContext.Provider >
    </Router>
);
}

export { App };

