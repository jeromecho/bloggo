import React, { useState, useEffect, useContext } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import THUMBTACK from '../img/thumbtack_white.png';
import COMMENT from '../img/comment_white.png';
import ADD from '../img/add.png';
import EYE from '../img/eye.png';
import TRASHCAN from '../img/trashcan.png';
import UPDATE from '../img/update_symbol.png';
import { ApiUrlContext } from '../App';
import { Link } from 'react-router-dom';
import axios, { AxiosRequestConfig } from 'axios';
import { Post } from '../App';

export interface DashboardProps {

}

const Dashboard: React.FunctionComponent<DashboardProps> = ({

}) => {

    const [ postNumber, setPostNumber ] = useState<number>(0);
    const [ commentNumber, setCommentNumber ] = useState<number>(0);

    // Origin - protocol + hostname + port
    const apiUrl = useContext(ApiUrlContext);

    axios.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            // defines backend API origin
            const re = /.*:5500/;
            const origin = re.exec(config.url!)![0];
            const allowedOrigins = [apiUrl];
            if (allowedOrigins.includes(origin)) {
                // only allow authorizaiton header to be set for allowed 
                // origins - i.e., DON'T send JWT token to unallowed origins
                const token = localStorage.getItem('token');
                config.headers!.authorization = `Bearer ${token}`;
            }
            return config;
        }, 
        error => {
            // if error with intercpeting, throw error to propagate to 
            // axios.VERB, which can then be caught
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/posts`)
            .then(res => {
                const posts = res.data;
                setPostNumber(posts.length);

                let commentNumber = 0;
                posts.forEach((post: Post) => {
                    post.comments.forEach(comment => {
                        commentNumber++;
                    });
                });
                setCommentNumber(commentNumber);
            })
    }, []);


    return (
        <>
            <Header />
            <main className='dashboard'>
                <div className='blur' />
                <div className='spacer' />
                <div>
                    <div className='hero-content'>
                        <h1>Dashboard</h1>
                        <div className='dashboard'>
                            <div className='spacer' />
                            <div className='top'>
                                <h3>At a Glance</h3>
                                <hr/>
                            </div>
                            <div className='middle'>
                                <div className='left'>
                                    <img src={THUMBTACK} alt='thumbtack' />
                                    <img src={COMMENT} alt='comment' />
                                </div>
                                <div className='right'>
                                    <p>{postNumber} Posts</p>
                                    <p>{commentNumber} Comments</p>
                                </div>
                            </div>
                            <div className='bottom'>
                                <p>Running Bloggo v1.0.0</p>
                            </div>
                            <div className='spacer' />
                        </div>
                    </div>
                    <div className='actions-content'>
                        <h2>Actions</h2>
                        <hr />
                        <div className='actions'> 
                            <div className='action'>
                                <div className='img-container'>
                                    <img src={EYE} alt='eye' />
                                </div>
                                <Link to='/posts'>View all posts</Link>
                                <p></p>
                            </div>
                            <div className='action'>
                                <div className='img-container'>
                                    <img src={ADD} alt='add' />
                                </div>
                                <Link to='/posts/create'>Add a post</Link>
                            </div>
                            <div className='action'>
                                <div className='img-container'>
                                    <img src={TRASHCAN} alt='trashcan' />
                                </div>
                                <Link to='/posts'>Delete a post</Link>
                            </div>
                            <div className='action'>
                                <div className='img-container'>
                                    <img src={UPDATE} alt='update icon' />
                                </div>
                                <Link to='/posts'>Update a post</Link>
                            </div>
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

export { Dashboard };
