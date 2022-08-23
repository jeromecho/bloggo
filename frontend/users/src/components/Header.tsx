import React, { useContext } from 'react';
import BUTTERFLY from '../img/butterfly.png';
import MOON from '../img/moon_and_stars.png';
import SUN from '../img/sun-icon-8582.png';
import ReactSwitch from 'react-switch';
import { ThemeContext } from '../App';

export interface HeaderProps {

}

const Header: React.FunctionComponent<HeaderProps> = ({

}) => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <header>
            <div>
                <div className='left'>
                    <img src={BUTTERFLY} />
                    <h2>BLOGGO</h2>
                </div>
                <div className='right'>
                    <div className='switch-container'>
                        <img src={MOON} />
                        <ReactSwitch 
                            onChange={toggleTheme}
                            checked={theme === 'dark'}
                            handleDiameter={20}
                            height={20}
                            offColor='#301414'
                            onColor='#6C6F93'
                            offHandleColor='#FFF8FA'
                            onHandleColor='#27D796'
                            width={50}
                        />
                        <img src={SUN} />
                    </div>
                </div>
            </div>
        </header>
    );
}

export { Header };
