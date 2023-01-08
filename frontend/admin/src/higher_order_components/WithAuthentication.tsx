import React, { useContext, useState, useEffect } from 'react';
import { AuthenticationContext } from '../App';
import { Navigate } from 'react-router-dom';

export interface WithAuthenticationProps {
    children: JSX.Element,
}

const WithAuthentication: React.FunctionComponent<WithAuthenticationProps> = ({
    children
}) => {

    const [ isOkayToRedirect, setIsOkayToRedirect ] = useState<boolean|null>(null);
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthenticationContext);

    useEffect(() => {
        if (isAuthenticated !== null) { 
            setIsOkayToRedirect(true);
        }
        if (localStorage.isAuthenticated) {
            setIsAuthenticated(!!localStorage.getItem('isAuthenticated'));
        } else {
            setIsAuthenticated(false);
        }
    }, [])

    return (
        <>
            {
                isAuthenticated ? 
                children : 
                (
                    isOkayToRedirect ? 
                    <Navigate to='/login' /> :
                    children
                )
            }
        </>
    );
}

export { WithAuthentication };
