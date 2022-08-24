import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CommentForm } from '../components/CommentForm';
import { Comments } from '../components/Comments';
import axios from 'axios';
import { CommentFormData } from '../components/CommentForm';
import { CommentsType } from '../components/Comments';

export interface PostProps {

}

const Post: React.FunctionComponent<PostProps> = ({

}) => {

    const { postID } = useParams<string>();
    const [ post, setPost ] = useState({
        name: "Not connected to server", 
        date_made: "2022/09/08", 
        content: "Not connected to server", 
        author: {
            name: "Nobody",
        }, 
    });
    const [message, setMessage] = useState<string|null>(null);
    const [ comments, setComments ] = useState<CommentsType>([{
        _id: "Not connected to server",
        author: 'Not connected to server',
        date_made: '2095-09-08',
        email: 'Not connected to server',
        content: 'Not connected to server',
    }]);

    useEffect(() => {
        axios.all([
            axios.get(
                `http://localhost:5500/posts/published_posts/${postID}
                `), 
            axios.get(
                `http://localhost:5500/posts/published_posts/${postID}/comments`
            )
        ]).then(axios.spread((postDetailRes, commentsRes) => {
            const post = JSON.stringify(postDetailRes.data);
            const revivedPost = JSON.parse(post, (key, value) => {
                if (key === 'date_made') {
                    return value.split('T')[0];
                } else {
                    return value;
                }
            });
            setPost(revivedPost);

            const comments: CommentsType = commentsRes.data;  
            const revivedComments: CommentsType = comments.map(comment => ({
                ...comment,
                date_made: comment.date_made.split('T')[0],
            }));
            setComments(revivedComments);
        })).catch(err => {
            console.error(err);
        });
    }, []);
            
    const handleSubmit = (formData: CommentFormData) => {
        axios.all([
            axios.post(`
            http://localhost:5500/posts/published_posts/${postID}/comments
        `, formData),
            axios.get(
                `http://localhost:5500/posts/published_posts/${postID}/comments`
            )
        ]).then(axios.spread((postRes, getRes) => {
            setMessage(postRes.data);
            const comments: CommentsType = getRes.data;  
            const revivedComments: CommentsType = comments.map(comment => ({
                ...comment,
                date_made: comment.date_made.split('T')[0],
            }));
            setComments(revivedComments);
        })).catch(err => {
            console.error(err);
        });
    };

    return (
        <>
            <Header />
            <main className='post'>
                <div className='blur' />
                <div className='spacer' />
                <div>
                    <div className='hero-content'>
                        <h1>{post.name}</h1>
                        <p className='date'>{post.date_made}</p>
                        <p className='author'>{`by ${post.author.name}`}</p>
                    </div>
                    <div className='post-detail'>
                        <hr />
                        <p className='post-content'>{post.content}</p>
                        <hr />
                    </div>
                    <div className='comments-content'> 
                        <h2>Comments</h2>
                        <CommentForm onSubmit={handleSubmit} />
                        <Comments comments={comments} />
                    </div>
                </div>
                <div className='spacer' />
                <div className='blur' />
            </main>
            <Footer />
        </> 
    );
}

export { Post };
