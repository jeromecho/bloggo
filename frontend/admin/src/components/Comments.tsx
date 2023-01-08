import React from 'react';
import USERICON from '../img/usericon.png';

export interface CommentsProps {
    comments: CommentsType; 
}

export interface Comment { 
    _id: string;
    author: string;
    date_made: string;
    email: string;
    content: string;
}

export interface CommentsType extends Array<Comment> {};

const Comments: React.FunctionComponent<CommentsProps> = ({
    comments,
}) => {

    return (
        <>
            {comments.map((comment, index) => (
                <div className='comment' key={index}>
                    <div className='left'>
                        <img alt='user icon' src={USERICON} />
                    </div>
                    <div className='right'>
                        <h4>{comment.author}</h4>
                        <div className='date-email'>
                            <p>{comment.date_made}</p>
                            <p>{comment.email}</p>
                        </div>
                        <p className='content'>{comment.content}</p>
                    </div>
                </div>
            ))}
        </>
    );
}

export { Comments };
