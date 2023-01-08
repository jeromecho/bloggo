import React, { useState, useEffect, useContext } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ApiUrlContext, Post } from '../App';
import axios, { AxiosRequestConfig } from 'axios';
import { Link } from 'react-router-dom';

export interface AllPostsProps {

};

const AllPosts: React.FunctionComponent<AllPostsProps> = ({

}) => {
     
    const [ posts, setPosts ] = useState<Post[]>([
        {
            _id: 'Not connected to server',
            name: 'Not connected to server',
            date_made: 'Not connected to server',
            is_published: false,
            content: 'Not connected to server',
            author: {
                _id: 'Not connected to server',
                name: 'Not connected to server',
                username: 'Not connected to server',
                password: 'Not connected to server',
            },
            comments: [],
        }
    ]);
        
    const apiUrl = useContext(ApiUrlContext);

    axios.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            const re = /.*:5500/;
            const origin = re.exec(config.url!)![0];
            const allowedOrigins = [apiUrl];
            if (allowedOrigins.includes(origin)) {
                const token = localStorage.getItem('token');
                config.headers!.authorization = `Bearer ${token}`;
            }
            console.log(config);
            return config;
        }, 
        error => {
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/posts`)
            .then(res => {
                console.log(res.data);
                setPosts(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    return (
         <>
        <Header />
        <main className='allposts'>
            <div className='blur' />
            <div className='spacer' />
            <div>
                <div className='posts-content'>
                    <h1>My Posts</h1>
                    <hr />
                    <div className='posts'>
                        {posts.map(post => (
                            <div className='post' key={post._id}>
                                <div className='left'>
                                    <h2>{post.name.slice(0, 16)}...</h2>
                                    <div className='date-author'>
                                        <p>{post.date_made.split('T')[0]}</p>
                                        <p>{post.author.name}</p>
                                    </div>
                                    <p>{post.is_published ?
                                        'PUBLISHED' :
                                        'DRAFT'
                                    }</p>
                                </div>
                                <div className='right'>
                                    {post.is_published ?
                                    <a href={`${process.env.REACT_APP_USER_SITE_URL}/
                                        ${post._id}`}>
                                            View
                                        </a> :
                                        <a style={{opacity: "0.6"}}
                                            href={`${process.env.REACT_APP_ADMIN_SITE_URL}
                                                /posts`}>
                                            View
                                        </a>
                                    }
                                    <Link to={`/posts/${post._id}/update`}>
                                        Update 
                                    </Link>
                                    <Link to={`/posts/${post._id}/delete`}>
                                        Delete 
                                    </Link>
                                </div>
                            </div>
                        )) }
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

export { AllPosts };
