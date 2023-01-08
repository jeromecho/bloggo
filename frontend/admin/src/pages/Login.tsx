import React, { useState, useContext } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosRequestConfig } from 'axios';
import { ApiUrlContext, AuthenticationContext, MessageContext } from '../App';

export interface LoginProps {

}

const Login: React.FunctionComponent<LoginProps> = ({

}) => {

    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthenticationContext);

    const { message, setMessage } = useContext(MessageContext);

    const [ username, setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_SERVER_URL}/users/login/`, {
            username,
            password
        })
            .then(res => {
                setMessage('Logged in');
                setIsAuthenticated(true);

                localStorage.setItem('token', res.data);
                localStorage.setItem('isAuthenticated', 'true');

                setTimeout(logoutUser, (1 * 60 * 60 * 1000));
                redirectToDashboard();
            })
            .catch(err => {
                console.error(err);
                setMessage(err.toString());
            });
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.currentTarget.value);
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    };

    const redirectToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <>
            <Header />
            <main className='loginsignup'>
                <div className='blur' />
                <div className='spacer' />
                <div>
                    <div className='login-signup'>
                        <h1>Log in</h1>
                        <form onSubmit={handleSubmit}>
                            <div className='spacer' />
                            <div className='form-field'>
                                <label htmlFor='username'>Username</label><br />
                                <input
                                    id='username'
                                    name='username' 
                                    onChange={handleUsernameChange}
                                    type='text'
                                    required={true}
                                /> 
                            </div>
                            <div className='form-field'>
                                <label htmlFor='password'>Password</label><br />
                                <input 
                                    id='password'
                                    name='password'
                                    onChange={handlePasswordChange}
                                    type='password'
                                    required={true}
                                /> 
                            </div>
                            <div className='buttons-container'>
                                <button type='submit'>Log in</button>
                                <p>Not a user?
                                    <Link to='/signup'> Sign up</Link>
                                </p>
                            </div>
                            <div className='spacer' />
                        </form> 
                    </div>
                </div>
                <div className='spacer' />
                <div className='blur' />
            </main>
            <Footer />
        </>
    );
}

export { Login };
