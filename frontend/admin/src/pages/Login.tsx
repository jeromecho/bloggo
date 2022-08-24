import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';

export interface LoginProps {

}

const Login: React.FunctionComponent<LoginProps> = ({

}) => {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO
    };

    return (
        <>
            <Header />
            <main className='Login'>
                <div className='blur' />
                <div className='spacer' />
                <div>
                    <div className='login-signup'>
                        <h1>Login</h1>
                        <form onSubmit={handleSubmit}>
                            <div className='form-field'>
                                <label htmlFor='username'>Username</label><br />
                                <input
                                    id='username'
                                    name='username' 
                                    type='text'
                                    required={true}
                                /> 
                            </div>
                            <div className='form-field'>
                                <label htmlFor='password'>Password</label><br />
                                <input 
                                    id='password'
                                    name='password'
                                    type='password'
                                    required={true}
                                /> 
                            </div>
                            <div className='buttons-container'>
                                <button type='submit'>Log in</button>
                                <p>Not a user?
                                    <Link to='/signup'>Sign up</Link>
                                </p>
                            </div>
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
