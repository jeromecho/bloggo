import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export interface NotFoundProps {

}

const NotFound: React.FunctionComponent<NotFoundProps> = ({

}) => {

    return (
        <>
        <Header />
            <main className='notfound'>
                <div className='blur' />
                <div className='spacer' />
                <div>
                    <div className='notfound'>
                        <h1>NOT FOUND</h1>
                    </div>
                </div>
                <div className='spacer' />
                <div className='blur' />
            </main>
        <Footer />
        </>
    );
}

export { NotFound };
