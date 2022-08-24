import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import axios from 'axios';

export interface CommentFormProps {
    onSubmit: (formData: CommentFormData) => void;
}

export interface CommentFormData {
    author: string; 
    email: string;
    content: string; 
    date_made: string;
}

const CommentForm: React.FunctionComponent<CommentFormProps> = ({
    onSubmit
}) => {
    const { postID } = useParams();

    const [author, setAuthor] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [content, setContent] = useState<string>('');
    let dateMade: string; 

    const onCommentFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dateMade = DateTime.now().toISO().split('T')[0];
        onSubmit({
            author, 
            email, 
            content, 
            date_made: dateMade,
        });
    };

    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthor(e.currentTarget.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // ? textarea is of type HTMLInputElement? 
        setContent(e.currentTarget.value);
    };

    return (
            <form onSubmit={onCommentFormSubmit} > 
                <h3>Post a Comment</h3>
                <div className='form-field'>
                    <label htmlFor='author'>Name</label><br/>
                    <input
                        id='author'
                        name='author'
                        value={author} 
                        onChange={handleAuthorChange} 
                        placeholder='David Silver'
                        required={true}
                    />
                </div>
                <div className='form-field'>
                    <label htmlFor='email'>Email</label><br/>
                    <input 
                        id='email'
                        value={email} 
                        onChange={handleEmailChange}
                        placeholder='david@deepmind.uk'
                        required={true}
                    />
                </div>
                <div className='form-field'>
                    <label htmlFor='content'>Message</label><br />
                    <textarea
                        id='content'
                        name='content'
                        value={content}
                        onChange={handleContentChange} 
                        placeholder='Great work with reinforcement learning!'
                        required={true}
                    />
                </div>
                <div className='button-container'>
                    <button type='submit'>Send</button>
                </div>
            </form>
    );
}

export { CommentForm };
