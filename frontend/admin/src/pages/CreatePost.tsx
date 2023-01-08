import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Editor } from '@tinymce/tinymce-react';
import { DateTime } from 'luxon';
import axios, { AxiosRequestConfig } from 'axios';
import { ApiUrlContext, MessageContext } from '../App';

export interface CreatePostProps {

}

const CreatePost: React.FunctionComponent<CreatePostProps> = ({

}) => {
    // use type any, since Editor is provided by a 3rd party library w out 
    // types nicely defined
    const navigate = useNavigate();
    const apiUrl = useContext(ApiUrlContext);
    const editorRef = useRef<any>(null);
    const { message, setMessage } = useContext(MessageContext);
    const [ name, setName ] = useState<string>('');
    const [ isPublished, setIsPublished ] = useState<boolean>(false);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const date_made = DateTime.now().toISO().split('T')[0];

        axios.post(`${process.env.REACT_APP_SERVER_URL}/posts`, {
            name, 
            date_made,
            is_published: isPublished, 
            content: getContent(), 
        }).then(res => {
            setMessage(res.data);
            navigate('/dashboard');
        }).catch(err => {
            setMessage(err.toString());
        });
    };

    return (
        <>
        <Header />
        <div>ASJDASJDJHASBDJASBDJHASBDJASH</div>
        <main className='create'>
            <div className='blur' />
            <div className='spacer' />
            <div>
                <div className='hero-content'>
                    <h1>Create Post</h1>
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
                                    defaultChecked={true}
                                    id='draft'
                                    required={true}
                                />
                                <label htmlFor='draft'>Draft</label>
                            </div>
                            <div className='radio'>
                                <input
                                    type='radio' 
                                    name='is_published'
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
                            initialValue={"<p>Write something!</p>"}
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

export { CreatePost };
