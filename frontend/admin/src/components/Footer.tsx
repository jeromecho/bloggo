import React from 'react';

export interface FooterProps {

}

const Footer: React.FunctionComponent<FooterProps> = ({

}) => {

    return (
        <footer>
            <div id='footer-content-container'>
                <p>Made with love by Cho Industries &nbsp;&nbsp; -  &nbsp;&nbsp; ©2022</p>
            </div>
        </footer>
    );
}

export { Footer };
