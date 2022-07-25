import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        return tokenString
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        localStorage.setItem('token', userToken.token);
        localStorage.setItem('refresh_token', userToken.refresh_token);
        localStorage.setItem('user_login', userToken.login);
        localStorage.setItem('user_first_name', userToken.first_name);
        localStorage.setItem('user_second_name', userToken.second_name);
        setToken(userToken.token);
    };

    return {
        setToken: saveToken,
        token: token
    }
}