import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import axios, { AxiosRequestConfig } from 'axios';
import { ApiUrlContext } from '../App';

export interface LoginProps {

}

const Login: React.FunctionComponent<LoginProps> = ({

}) => {

    const [ username, setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');
    const [ message, setMessage ] = useState<string>('');


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('/users/login/', {
            username,
            password
        })
            .then(res => {
                localStorage.setItem('token', res.data);
                setMessage(res.data);
            })
            .catch(err => {
                console.error(err);
                setMessage(err);
            });
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.currentTarget.value);
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
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
