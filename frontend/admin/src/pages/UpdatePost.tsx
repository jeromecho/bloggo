import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Editor } from '@tinymce/tinymce-react';
import { DateTime } from 'luxon';
import axios, { AxiosRequestConfig } from 'axios';
import { Comment, Post, ApiUrlContext, MessageContext } from '../App';
import USERICON from '../img/usericon.png';
import TRASHCAN from '../img/trashcan.png';

export interface UpdatePostProps {

}

const UpdatePost: React.FunctionComponent<UpdatePostProps> = ({

}) => {
    const navigate = useNavigate();
    const { postID } = useParams();
    const apiUrl = useContext(ApiUrlContext);
    const editorRef = useRef<any>(null);
    const { message, setMessage } = useContext(MessageContext);
    const [ name, setName ] = useState<string>('');
    const [ isPublished, setIsPublished ] = useState<boolean>(false);
    const [ post, setPost ] = useState<Post>({
        _id: 'NOT CONNECTED',
        name: 'NOT CONNECTED',
        date_made: 'NOT CONNECTED',
        is_published: false,
        content: 'NOT CONNECTED',
        author: {
            _id: 'NOT CONNECTED',
            name: 'NOT CONNECTED',
            password: 'NOT CONNECTED',
            username: 'NOT CONNECTED',
        },
        comments: [],
    });
    const [ comments, setComments ] = useState<Comment[]>([
        {
            _id: 'NOT CONNECTED TO SERVER',
            author: 'NOT CONNECTED TO SERVER',
            email: 'NOT CONNECTED TO SERVER',
            date_made: 'NOT CONNECTED TO SERVER',
            content: 'NOT CONNECTED TO SERVER',
        }
    ]);

    useEffect(() => {
        getUpdatedPost();
    }, []);

    const getUpdatedPost = () => {
        axios.get(`/posts/${postID}`)
            .then(res => {
                setPost(res.data);
                setName(res.data.name);
            })
            .catch(err => {
                setMessage(err.toString());
            });
    };

    const getContent = (): string => {
        if (editorRef.current) { 
            const len = editorRef.current.getContent().length; 
            return editorRef.current.getContent().slice(3, len - 4);
        } else {
            return '';
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
    };

    const handleIsPublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const bool = e.currentTarget.value === 'true' ? true : false;
        setIsPublished(bool);
    };

    axios.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            const { origin } = new URL(config.url!, apiUrl);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        axios.put(`/posts/${postID}`, {
            name, 
            is_published: isPublished, 
            content: getContent(), 
        }).then(res => {
            setMessage(res.data);
            navigate('/dashboard');
        }).catch(err => {
            setMessage(err.toString());
        });
    };

    const handleDeleteClick = (e: React.MouseEvent<HTMLImageElement>) => {
        axios.delete(`/posts/${postID}/comments/${e.currentTarget.id}`)
            .then(res => {
                setMessage(res.data);
                getUpdatedPost();
            })
            .catch(err => {
                setMessage(err.data.toString());
            });
    };

    return (
        <>
        <Header />
        <main className='update'>
            <div className='blur' />
            <div className='spacer' />
            <div>
                <div className='hero-content'>
                    <h1>Update Post</h1>
                    <hr />
                </div>
                <form className='form-content' onSubmit={handleSubmit}>
                    <fieldset className='form-field'>
                        <label htmlFor='name'>Title</label>
                        <input
                            type='text' 
                            name='name'
                            id='name'
                            onChange={handleNameChange}
                            placeholder='Why I stopped eating meat'
                            value={name}
                            required={true}
                        />
                    </fieldset>
                    <fieldset className='form-field'>
                        <legend>Post Options</legend>
                        <div className='radios-container'>
                            <div className='radio'>
                                <input
                                    type='radio' 
                                    name='is_published'
                                    onChange={handleIsPublishedChange}
                                    value='false'
                                    defaultChecked={!post.is_published}
                                    id='draft'
                                    required={true}
                                />
                                <label htmlFor='draft'>Draft</label>
                            </div>
                            <div className='radio'>
                                <input
                                    type='radio' 
                                    name='is_published'
                                    defaultChecked={post.is_published}
                                    onChange={handleIsPublishedChange}
                                    value='true'
                                    id='publish'
                                />
                                <label htmlFor='publish'>Publish</label>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className='form-field'>
                        <label htmlFor='content'>Content</label>
                        <Editor
                            apiKey={process.env.REACT_APP_TINY_API_KEY}
                            ref={editorRef}
                            onInit={(evt, editor) => {
                                if (editorRef.current) {
                                    editorRef.current = editor
                                }
                            }}
                            initialValue={`<p>${post.content}</p>`}
                            init={{
                                height: 500,
                                    menubar: false,
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar: 'undo redo | formatselect | ' +
                                    'bold italic backcolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help',
                                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                            }}
                        />
                </fieldset>
                <fieldset className='form-field comments'>
                    {
                        post.comments.map(comment => (
                            <div className='comment'>
                                <div className='left'>
                                    <img src={USERICON} alt='user icon' />
                                </div>
                                <div className='right'>
                                    <div className='spacer' />
                                    <div className='top'>
                                        <div className='left'>
                                            <h4>{comment.author}</h4>
                                            <p>{comment.date_made.split('T')[0]}</p>
                                        </div>
                                        <div className='right'>
                                            <img
                                                onClick={handleDeleteClick} 
                                                src={TRASHCAN}
                                                id={comment._id}
                                                alt='trashcan' />
                                        </div>
                                    </div>
                                    <div className='bottom'>
                                        <p>{comment.content}</p>
                                    </div>
                                    <div className='spacer' />
                                </div>
                            </div>
                        ))
                    }
                </fieldset>
                <button type='submit'>Post</button>
                </form>
            </div>
            <div className='spacer' />
            <div className='blur' />
        </main>
        <Footer />
    </>
    );
}

export { UpdatePost };
