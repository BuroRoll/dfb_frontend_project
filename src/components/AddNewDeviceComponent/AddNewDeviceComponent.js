import React, {useEffect, useState} from "react";
import $api from "../../api/api_setting";
import {toast} from "react-toastify";

const AddNewDeviceComponent = ({onClose, new_device_id}) => {
    const [deviceName, setDeviceName] = useState();
    const [location, setLocation] = useState();
    const [userLocation, setUserLocation] = useState({})

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const {latitude, longitude} = position.coords;
                setUserLocation({lat: latitude, lng: longitude})
            },
        );
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        addDevice()
    }


    const addDevice = () => {
        if (userLocation !== {}) {
            $api.post('/api/add_defibrillator', {
                device_id: new_device_id,
                defibrillator_name: deviceName,
                location: location,
                lat_coordinate: userLocation.lat,
                long_coordinate: userLocation.lng
            })
                .then(res => {
                    console.log(res.data)
                    onClose()
                    toast.info('Устройство успешно добавлено', {
                        position: "bottom-center",
                        autoClose: 7000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setDeviceName('')
                    setLocation('')
                })
        }
    }

    return (
        <>
            <div className="login-wrapper">
                <div style={{textAlign: "center"}}>Добавление нового устройства</div>
                <div>
                    <form onSubmit={handleSubmit} className="login_form">
                        <div>
                            <label>
                                <input className="login_inputs" type="text" placeholder="Название устройства"
                                       onChange={e => setDeviceName(e.target.value)}/>
                            </label>
                        </div>
                        <div>
                            <label>
                                <input className="login_inputs" type="text" placeholder="Месторасположение"
                                       onChange={e => setLocation(e.target.value)}/>
                            </label>
                        </div>
                        <button className="login_btn" type="submit">Сохранить</button>
                    </form>
                </div>

            </div>
        </>
    )
}

export default AddNewDeviceComponent