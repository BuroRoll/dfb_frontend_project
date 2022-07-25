// key = AIzaSyDiqAGii_tNY8xeQFbT6CFab56gr7hgRVU
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import {Component, useEffect, useState} from "react";

import red_heart from '../../static/img/red_heart.svg'
import black_heart from '../../static/img/black_heart.svg'
import $api, {API_URL} from "../../api/api_setting";
import './card.css'

import Baloon from "../Balloon/Balloon";

export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            ready_to_use_items: [],
            need_service_items: [],
            token: localStorage.getItem('token'),
        };
    }

    componentDidMount(props) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const {latitude, longitude} = position.coords;
                this.setState({
                    userLocation: {lat: latitude, lng: longitude},
                    loading: false
                });
            },
            () => {
                this.setState({loading: false});
            }
        );
    }

    UNSAFE_componentWillMount() {
        // const token = localStorage.getItem('token')
        if (!this.state.token) {
            fetch(API_URL + "/public_api/get_available_defibrillators")
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            ready_to_use_items: result
                        })
                    },
                )
        } else {
            fetch(API_URL + "/api/defibrillator_list/need_service", {
                // fetch('http://127.0.0.1:5000/api/defibrillator_list/need_service', {
                method: 'GET',
                headers: new Headers({
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }),
            }).then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            need_service_items: result
                        })
                        console.log(result)
                    },
                );
        }

    }

    onMarkerClick = (props, marker, e) => {
        return this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    onInfoWindowClose = () =>
        this.setState({
            activeMarker: null,
            showingInfoWindow: false
        });

    onMapClicked = () => {
        if (this.state.showingInfoWindow)
            this.setState({
                activeMarker: null,
                showingInfoWindow: false
            });
    };


    render = () => {
        const {
            ready_to_use_items,
            need_service_items,
            userLocation
        } = this.state;

        if (!this.state.token) {
            const icon = {url: red_heart, scaledSize: {width: 32, height: 32}};
            return (
                <>
                    <Map google={this.props.google} zoom={14}
                         style={{height: "90vh", width: "100%"}}
                         center={userLocation}
                         onClick={this.onMapClicked}
                         onReady={this.mapReady}>
                        {ready_to_use_items.map(item => (
                            <Marker
                                icon={icon}
                                key={item.id}
                                title={item.defibrillator_name}
                                id={item.id}
                                position={{lat: item.lat_coordinate, lng: item.long_coordinate}}
                                name={item.defibrillator_name}
                                onClick={this.onMarkerClick}
                                location={item.location}
                            />
                        ))}

                        <InfoWindow
                            marker={this.state.activeMarker}
                            onClose={this.onInfoWindowClose}
                            visible={this.state.showingInfoWindow}>
                            <div className='card_container'>
                                {/*<Balloon def_name={this.state.selectedPlace.name} status="ready_to_use"*/}
                                {/*        location={this.state.selectedPlace.location}/>*/}
                                <Baloon def_name={this.state.selectedPlace.name} status="ready_to_use"
                                        location={this.state.selectedPlace.location}/>
                            </div>
                        </InfoWindow>
                    </Map>
                </>
            );
        } else {
            const icon = {url: black_heart, scaledSize: {width: 32, height: 32}};
            return (
                <>
                    <Map google={this.props.google} zoom={14}
                         style={{height: "90vh", width: "100%"}}
                         center={userLocation}
                         onClick={this.onMapClicked}
                         onReady={this.mapReady}>
                        {need_service_items.map(item => (
                            <Marker
                                icon={icon}
                                key={item.id}
                                title={item.defibrillator_name}
                                id={item.id}
                                position={{lat: item.lat_coordinate, lng: item.long_coordinate}}
                                name={item.defibrillator_name}
                                onClick={this.onMarkerClick}
                                location={item.location}
                                battery_status={item.battery_status}
                                electrodes_status={item.electrodes_status}
                                last_service_date={item.last_service_date}
                            />
                        ))}
                        <InfoWindow
                            marker={this.state.activeMarker}
                            onClose={this.onInfoWindowClose}
                            visible={this.state.showingInfoWindow}>
                            <div className='card_container'>
                                <Baloon def_name={this.state.selectedPlace.name} status="need_service"
                                        location={this.state.selectedPlace.location}
                                        battery_status={this.state.selectedPlace.battery_status}
                                        electrodes_status={this.state.selectedPlace.electrodes_status}
                                        last_service_date={this.state.selectedPlace.last_service_date}/>
                                {/*<Balloon def_id={this.state.selectedPlace.id} status="need_service"/>*/}
                            </div>
                        </InfoWindow>
                    </Map>
                </>
            );
        }
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyDiqAGii_tNY8xeQFbT6CFab56gr7hgRVU"
})(MapContainer)

