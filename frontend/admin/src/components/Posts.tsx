import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';

export interface PostsProps {

}

const Posts: React.FunctionComponent<PostsProps> = ({

}) => {
    const [posts, setPosts] = useState([{
        name: 'Not Connected to Server',
        date_made: '2022-09-09',
        author: {
            name: 'Tim',
        },
        _id: 'default id',
    }]);

    useEffect(() => {
        axios.get('http://localhost:5500/posts/published_posts')
            .then(res => {
                // * axios ALREADY serves data as js object, no need to parse 
                //   JSON to JS
                let retrievedPosts = JSON.parse(JSON.stringify(res.data), (key, value) => {
                    if (key === 'date_made') {
                        return value.split('T')[0]
                    } else { 
                        return value; 
                    }
                })
                setPosts(retrievedPosts);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    console.log(posts);

    if (posts.length) { 
        return (

        <div className='posts'>
            {posts.map(post => {
                if (post.name.length > 20) { 
                    post.name = post.name.slice(0, 20) + '...';
                }

                return (
                    <div className='post'>
                        <div className='left'>
                            <h4>{post.name}</h4>
                            <p>{post.date_made}</p>
                            <p>{post.author.name}</p>
                        </div>
                        <div className='right'>
                            <Link to={post._id}>View Post</Link>
                        </div>
                    </div>
                );
            })}
        </div>
        );
    } else {
        return (
            <div className='posts'>
            </div>
        );
    }
}

export { Posts };
