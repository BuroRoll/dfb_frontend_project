import React, {useState} from 'react';
import './Header.css';
import logoUrl from '../../static/img/logo.svg';
import logout_icon from '../../static/img/logout_icon.svg'
import {Outlet, Link} from "react-router-dom";
import {useMediaQuery} from 'react-responsive'
import Rodal from 'rodal';

import 'rodal/lib/rodal.css';
import {
    MDBContainer,
    MDBCollapse,
    MDBNavbar,
    MDBNavbarToggler,
    MDBIcon,
} from 'mdb-react-ui-kit';


import useToken from "../../data/useToken";
import QrReaderComponent from "../QrReader/QrReader";
import DeviceListComponent from "../DeviceList/DeviceListComponent";


const Header = () => {
    const [isScannerOpen, setScannerOpen] = useState(false);
    const [isDefListOpen, setOpenList] = useState(false)

    const {token, setToken} = useToken();
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})
    const [showNavExternal3, setShowNavExternal3] = useState(false);

    const logout = () => {
        console.log("logout!")
        localStorage.clear();
        window.location.href = '/';
    }

    const hide_scanner = () => {
        setScannerOpen(false)
    }

    const hide_dfb_list = () => {
        setOpenList(false)
    }

    if (!token) { //Неавторизованный пользователь
        return (
            <div className="header">
                <Link to="/"><img src={logoUrl} alt="logo"/></Link>
                <div><Link to="/login" style={{color: '#000000'}}>Войти</Link></div>
                <Outlet/>
            </div>
        )

    } else if (isTabletOrMobile) { // Мобильная версия авторизованного пользователя
        return (
            <div>
                <MDBNavbar className="header">
                    <MDBContainer fluid>
                        <Link to="/"><img src={logoUrl} alt="logo"/></Link>
                        <div className="menu_block">
                            <div onClick={() => setShowNavExternal3(!showNavExternal3)}>
                                {localStorage.getItem("user_first_name")} {localStorage.getItem("user_second_name")}
                            </div>
                            <MDBNavbarToggler
                                className='ms-auto'
                                type='button'
                                data-target='#navbarToggleExternalContent'
                                aria-controls='navbarToggleExternalContent'
                                aria-expanded='false'
                                aria-label='Toggle navigation'
                                onClick={() => setShowNavExternal3(!showNavExternal3)}
                            >
                                <MDBIcon icon='bars' fas/>
                            </MDBNavbarToggler>
                        </div>

                    </MDBContainer>
                </MDBNavbar>
                <MDBCollapse show={showNavExternal3}>
                    <div className='menu_element'>
                        <div className="menu_button" onClick={() => setScannerOpen(true)}>
                            Сканировать QR-код
                        </div>
                        <div className="menu_button" onClick={() => setOpenList(true)}>
                            Список дефибрилляторов
                        </div>
                        <div className="menu_button" onClick={logout}>Выйти</div>
                    </div>
                </MDBCollapse>

                <Rodal visible={isScannerOpen} onClose={hide_scanner} height={45} width={95} measure={"%"}>
                    <div>
                        <QrReaderComponent status={isScannerOpen} onClose={hide_scanner}/>
                    </div>
                </Rodal>
                <Rodal visible={isDefListOpen} onClose={hide_dfb_list} height={75} width={95} measure={"%"}>
                    <DeviceListComponent onClose={hide_dfb_list}/>
                </Rodal>
            </div>
        )
    } else { // Десктопная версия авторизованного пользователя
        return (
            <div className="header">
                <Link to="/"><img src={logoUrl} alt="logo"/></Link>
                <div className="desktop_buttons">
                    <div>{localStorage.getItem("user_first_name")} {localStorage.getItem("user_second_name")}</div>
                    <div onClick={logout}><img src={logout_icon} alt="logo"/></div>
                </div>
            </div>
        )
    }
}

export default Header;