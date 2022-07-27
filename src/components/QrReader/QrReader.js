import React from 'react';
import {QrReader} from 'react-qr-reader';
import isObject from 'is-plain-obj';
import $api from "../../api/api_setting";

import 'react-toastify/dist/ReactToastify.css';
import {toast} from "react-toastify";

const styles = {
    reader: {
        textAlign: 'center',
        margin: '30px auto',
        maxWidth: 400,
        width: '100%',
    },
};

const QrReaderComponent = ({status, onClose, openAddNewDeviceModal}) => {
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
        openAddNewDeviceModal(device_id)
    }

    const changeDeviceStatus = (device_id) => {
        $api.put(`/api/service_device/${device_id}`)
            .then(res => {
                const old_status = statusToString(res.data.old_status)
                const new_status = statusToString(res.data.new_status)
                const notification = `Статус устройства изменён с "${old_status}" на "${new_status}"`
                toast.info(notification, {
                    position: "bottom-center",
                    autoClose: 7000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                });
            })
    }

    const statusToString = (status) => {
        switch (status) {
            case 'service':
                return 'сервис'
            case 'need_service':
                return 'необходимо обслуживание'
            case 'ready_to_use':
                return 'готово к использованию'
        }
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
