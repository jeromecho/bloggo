import React, { useContext, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import { MessageContext } from '../App';
import axios from 'axios';
export interface SignupProps {

}

const Signup: React.FunctionComponent<SignupProps> = ({

}) => {
    const { message, setMessage } = useContext(MessageContext);
    const [ name, setName ] = useState<string>('');
    const [ username, setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_SERVER_URL}/users/signup`,
            { name, username, password })
            .then(res => {
                console.log(res.data);
                setMessage(res.data);
            })
            .catch(err => {
                console.error(err);
                setMessage(err.toString());
            })
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
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
                        <h1>Sign up</h1>
                        <form onSubmit={handleSubmit}>
                            <div className='spacer' /> 
                            <div className='form-field'>
                                <label htmlFor='name'>Name</label><br />
                                <input
                                    id='name'
                                    name='name' 
                                    type='text'
                                    value={name}
                                    onChange={handleNameChange}
                                    required={true}
                                /> 
                            </div>
                            <div className='form-field'>
                                <label htmlFor='username'>Username</label><br />
                                <input
                                    id='username'
                                    name='username' 
                                    type='text'
                                    value={username}
                                    onChange={handleUsernameChange}
                                    required={true}
                                /> 
                            </div>
                            <div className='form-field'>
                                <label htmlFor='password'>Password</label><br />
                                <input 
                                    id='password'
                                    name='password'
                                    type='password'
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required={true}
                                /> 
                            </div>
                            <div className='buttons-container'>
                                <button type='submit'>Sign up</button>
                                <p>Already a user?
                                    <Link to='/login'> Log in</Link>
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
        </>    );
}

export { Signup };
