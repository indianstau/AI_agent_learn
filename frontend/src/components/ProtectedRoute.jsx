import React from 'react';
import { Redirect, Route } from 'react-router-dom';

function ProtectedRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => {
                const user = localStorage.getItem('authUser');
                return user ? <Component {...props} /> : <Redirect to="/" />;
            }}
        />
    );
}

export default ProtectedRoute;
