import { useEffect } from 'react';
import { useAppSelector } from './customHooks';
import type { UserData } from '../store/authSlice';

export const useAuth = () => {
    const userData = useAppSelector((state) => state.loginSliceReducer.userData);
    const isLoading = useAppSelector((state) => state.loginSliceReducer.isLoading);
    const error = useAppSelector((state) => state.loginSliceReducer.error);

    const isAuthenticated = Object.keys(userData).length > 0 && !!userData.user;

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const savedUserData = localStorage.getItem('userData');
        
        if (token && savedUserData && !isAuthenticated) {
            try {
                const parsedUserData: UserData = JSON.parse(savedUserData);
                console.log(parsedUserData);
            } catch (error) {
                console.error('Error parsing saved user data:', error);
                localStorage.removeItem('userData');
                localStorage.removeItem('authToken');
            }
        }
    }, [isAuthenticated]);

    return {
        userData,
        isLoading,
        error,
        isAuthenticated
    };
}; 