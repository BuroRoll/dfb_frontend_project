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

const QrReaderComponent = ({status, onClose}) => {
    const isOpen = status
    const output = {};

    const handleError = (err) => {
        console.log("error ", err);
    }

    const handleScan = (data) => {
        if (data) {
            try {
                let d = JSON.parse(data?.text)
                if (isObject(d)) {
                    if (d['device_id']) {
                        onClose()
                        handleDevice(d['device_id'])
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    const handleDevice = (device_id) => {
        $api.get(`/api/check_device/${device_id}`)
            .then(res => {
                if (res.status === 204) {
                    addNewDevice(device_id)
                } else if (res.status === 200) {
                    changeDeviceStatus(device_id)
                }
            })
    }

    const addNewDevice = (device_id) => {
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

    const changeDeviceStatus = (device_id) => {
        $api.put(`/api/service_device/${device_id}`)
            .then(res => {
                console.log(res)
            })
    }

    if (isOpen) {
        output.reader = (
            <div style={styles.reader}>
                <QrReader
                    delay={300}
                    onError={handleError}
                    onResult={handleScan}
                    style={{width: '100%'}}
                    constraints={{facingMode: 'environment'}}
                    // constraints={{facingMode: 'user'}}
                />
            </div>
        );
    }
    return (
        <div>
            <h1>Сканирование QR-Кода</h1>
            <div>
                {output.reader}
            </div>
        </div>
    );
}

export default QrReaderComponent
