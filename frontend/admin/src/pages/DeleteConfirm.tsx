import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import WARNINGCIRCLE from '../img/warningcircle.png';
import axios, { AxiosRequestConfig } from 'axios';
import { ApiUrlContext, MessageContext, Post } from '../App';

export interface DeleteConfirmProps {

}

const DeleteConfirm: React.FunctionComponent<DeleteConfirmProps> = ({

}) => {
    const navigate = useNavigate();
    const apiUrl = useContext(ApiUrlContext);
    const { message, setMessage } = useContext(MessageContext);
    const [ post, setPost ] = useState<Post>({
        _id: 'NOT CONNECTED TO SERVER',        
        name: 'NOT CONNECTED TO SERVER',
        date_made: 'NOT CONNECTED TO SERVER',
        is_published: false,
        content: 'NOT CONNECTED TO SERVER',
        author: {
            _id: 'NOT CONNECTED TO SERVER',
            name: 'NOT CONNECTED TO SERVER',
            password: 'NOT CONNECTED TO SERVER',
            username: 'NOT CONNECTED TO SERVER',
        },
        comments: [],
    });
    const { postID } = useParams();

    axios.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            const re = /.*:5500/;
            const origin = re.exec(config.url!)![0];
            const allowedOrigins = [apiUrl];
            if (allowedOrigins.includes(origin)) {
                const token = localStorage.getItem('token');
                config.headers!.authorization = `Bearer ${token}`;
            }
            return config;
        }, 
        error => {
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/posts/${postID}`)
            .then(res => {
                setPost(res.data);
            })
            .catch(err => {
                console.error(err);
                setMessage(err.toString());
            });
    }, []);

    const handleClick = () => {
        axios.delete(`${process.env.REACT_APP_SERVER_URL}/posts/${postID}`)
            .then(res => {
                setMessage(res.data);
                navigate('/dashboard');
            })
            .catch(err => {
                setMessage(err.toString());
            })
    };

    return (
    <>
        <Header />
        <main className='delete'>
            <div className='blur' />
            <div className='spacer' />
            <div>
                <div className='delete'>
                    <h1>Confirm Delete</h1>
                    <div className='delete-container'>
                        <img src={WARNINGCIRCLE} alt='warning circle' />
                        <p>
                            Are you sure you want to delete '{post.name}'?
                        </p>
                        <p>
                            This action cannot be undone.
                        </p>
                        <button
                            type='button'
                            onClick={handleClick}
                        >
                            Delete
                        </button>
                        <Link to='/posts'>Go back</Link>
                    </div>
                </div>
            </div>
            <div className='spacer' />
            <div className='blur' />
        </main>
        <Footer />
    </>
    );
}

export { DeleteConfirm };
