import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useContext(UserContext);

    if (!user || user.role !== requiredRole) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;