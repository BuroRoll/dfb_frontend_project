import React, {useState} from 'react';
import {Navigate} from 'react-router-dom';
import './login.css';
import useToken from "../../data/useToken";
import Header from "../Header/Header";
import logoUrl from "../../static/img/logo.svg";
import $api from "../../api/api_setting";

const Login = () => {
    const [login, setLogin] = useState();
    const [password, setPassword] = useState();
    const {token, setToken} = useToken();
    const [error, setError] = useState(null);

    const handleSubmit = async e => {
        e.preventDefault();
        loginUser({
            login,
            password
        });
    }

    const loginUser = (credentials) => {
        $api.post('/auth/login', credentials)
            .then(res => {
                if (res.status === 200) {
                    setToken(res.data)
                }
            })
            .catch(err => {
                console.log(err)
                setError(err.response.data.error)
            })
    }

    if (token) {
        return (
            <Navigate to="/"/>
        )
    } else {
        return (
            <div>
                <Header/>
                <div className="login-wrapper">
                    <div><img src={logoUrl} alt="logo"/></div>
                    <div style={{textAlign: "center"}}>Вход для сотрудников сервиса</div>
                    <div>
                        <form onSubmit={handleSubmit} className="login_form">
                            <div>
                                <label>
                                    <input className="login_inputs" type="text" placeholder="Логин"
                                           onChange={e => setLogin(e.target.value)}/>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input className="login_inputs" type="password" placeholder="Пароль"
                                           onChange={e => setPassword(e.target.value)}/>
                                </label>
                            </div>
                            {error ?
                                <div className="error_element"><div>{error}</div></div> : <div/>
                            }
                            <button className="login_btn" type="submit">Войти</button>
                        </form>
                    </div>

                </div>
            </div>
        )
    }
}

export default Login