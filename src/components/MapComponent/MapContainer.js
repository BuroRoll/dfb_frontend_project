import React, {useEffect, useState} from 'react'
import {GoogleMap, InfoWindow, LoadScript, Marker} from '@react-google-maps/api';
import $api from "../../api/api_setting";
import black_heart from "../../static/img/black_heart.svg";
import red_heart from '../../static/img/red_heart.svg'
import Balloon from "../Balloon/Balloon";
import store from "../../data/store";

const containerStyle = {
    width: '100%',
    height: '90vh'
};


const MapComponent = () => {
    const token = localStorage.getItem('token')
    const ApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    const [userLocation, setUserLocation] = useState({})
    const [readyToUseItems, setReadyToUseItems] = useState([])
    const [needServiceItems, setNeedServiceItems] = useState([])
    const [activeMarker, setActiveMarker] = useState(null)

    useEffect(() => {
        store.subscribe(() => {
            setActiveMarker(store.getState().counter.value.payload)
        })
    }, [])

    const handleActiveMarker = (marker) => {
        if (marker === activeMarker) {
            return;
        }
        setActiveMarker(marker);
    };

    const onMapClick = () => {
        setActiveMarker(null)
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const {latitude, longitude} = position.coords;
                setUserLocation({lat: latitude, lng: longitude})
            },
        );
    }, [])

    useEffect(() => {
        if (!token) {
            $api.get('/public_api/get_available_defibrillators')
                .then(res => {
                    setReadyToUseItems(res.data)
                })
        } else {
            $api.get('/api/defibrillator_list/need_service')
                .then(res => {
                    setNeedServiceItems(res.data)
                })
        }
    }, [])

    if (token) {
        const icon = {url: black_heart, scaledSize: {width: 32, height: 32}};
        return (
            <LoadScript
                googleMapsApiKey={ApiKey}
            >
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={userLocation}
                    zoom={14}
                    onClick={onMapClick}
                >
                    {needServiceItems.map(item => (
                        <Marker
                            icon={icon}
                            key={item.id}
                            position={{lat: Number(item.lat_coordinate), lng: Number(item.long_coordinate)}}
                            onClick={() => handleActiveMarker(item.id)}
                        >
                            {(activeMarker === item.id) ? (
                                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                    <Balloon id={item.id}/>
                                </InfoWindow>
                            ) : null}
                        </Marker>
                    ))}
                </GoogleMap>
            </LoadScript>
        )
    } else {
        const icon = {url: red_heart, scaledSize: {width: 32, height: 32}};
        return (
            <LoadScript googleMapsApiKey={ApiKey}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={userLocation}
                    zoom={14}
                    onClick={onMapClick}
                >
                    {readyToUseItems.map(item => (
                        <Marker
                            icon={icon}
                            key={item.id}
                            position={{lat: Number(item.lat_coordinate), lng: Number(item.long_coordinate)}}
                            onClick={() => handleActiveMarker(item.id)}
                        >
                            {(activeMarker === item.id) ? (
                                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                    <Balloon id={item.id}/>
                                </InfoWindow>
                            ) : null}
                        </Marker>
                    ))}
                < /GoogleMap>
            </LoadScript>
        )
    }
}

export default MapComponent