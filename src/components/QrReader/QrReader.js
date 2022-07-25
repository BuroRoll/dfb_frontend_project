import React from 'react';
import {QrReader} from 'react-qr-reader';
import isObject from 'is-plain-obj';
import $api from "../../api/api_setting";

const styles = {
    reader: {
        textAlign: 'center',
        margin: '30px auto',
        maxWidth: 400,
        width: '100%',
    },
};

class QR extends React.Component {
    state = {
        delay: 300,
        result: null,
        status: 'idle',
    }

    handleScan = (data) => {
        if (data) {
            try {
                let d = JSON.parse(data?.text)
                if (isObject(d)) {
                    if (d['device_id']) {
                        this.handleDevice(d['device_id'])
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }
    };

    handleDevice = (device_id) => {
        $api.get(`/api/check_device/${device_id}`)
            .then(res => {
                if (res.status === 204) {
                    this.addNewDevice(device_id)
                } else if (res.status === 200) {
                    this.changeDeviceStatus(device_id)
                }
            })
    }

    addNewDevice = (device_id) => {
        $api.post('/api/add_defibrillator', {
            device_id: device_id,
            defibrillator_name: 'Test Name 1',
            location: 'Test location 1',
            lat_coordinate: '56.787320',
            long_coordinate: '60.523076'
        })
            .then(res => {
                console.log(res.data)
            })
    }

    changeDeviceStatus = (device_id) => {
        $api.put(`/api/service_device/${device_id}`)
            .then(res => {
                console.log(res)
            })
    }


    handleError = (err) => {
        console.log("error ", err);
    };

    render() {
        const isOpen = this.props.status
        const {result, status} = this.state;
        const output = {};

        if (isOpen) {
            output.reader = (
                <div style={styles.reader}>
                    <QrReader
                        delay={this.state.delay}
                        onError={this.handleError}
                        onResult={this.handleScan}
                        style={{width: '100%'}}
                    />
                </div>
            );
        }

        return (
            <div>
                <h1>Сканирование QR-Кода</h1>
                <div style={styles.qrcode}>
                    {output.reader}
                    {output.result}
                </div>
            </div>
        );
    }
}

export default QR
