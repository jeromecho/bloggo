import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Posts } from '../components/Posts';
import EYE from '../img/eye.png';

export interface HomeProps {

}

const Home: React.FunctionComponent<HomeProps> = ({

}) => {

    return (
        <>
            <Header />
            <main className='home'>
                <div className='blur' />
                <div className='spacer' />
                <div>
                    <div className='hero-content'>
                        <h1>Stories & Adventures</h1>
                        <p>Hear of Jerome's latest thoughts
                            and adventures on his personal
                        blog</p>
                    </div>
                    <div className='posts-content'>
                        <div>
                            <h3>All Posts</h3>
                            <hr />
                        </div>
                        <Posts /> 
                    </div>
                </div>
                <div className='spacer' />
                <div className='blur' />
            </main>
            <Footer />
        </>
    );
}

export { Home };
