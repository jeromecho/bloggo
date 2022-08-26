import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';


export interface UpdatePostProps {

}

const UpdatePost: React.FunctionComponent<UpdatePostProps> = ({

}) => {

    return (
    <>
        <Header />
        <main className='dashboard'>
            <div className='blur' />
            <div className='spacer' />
            <div>
                <div className='hero-content'>
                    <h1>UPDATEPOST</h1>
                </div>
                <div className='posts-content'>
                </div>
            </div>
            <div className='spacer' />
            <div className='blur' />
        </main>
        <Footer />
    </>
    );
}

export { UpdatePost };
