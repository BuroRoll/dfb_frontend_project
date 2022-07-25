import ready_to_use_icon from '../../static/img/ready_to_use_icon.svg'
import need_service_icon from '../../static/img/need_service_icon.svg'
import location_icon from '../../static/img/location_icon.svg'
import battery_status_icon from '../../static/img/battery_status_icon.svg'
import electrodes_status_icon from '../../static/img/electrodes_status_icon.svg'
import last_service_date_icon from '../../static/img/last_service_date_icon.svg'
import './card.css'
import {useEffect, useState} from "react";
import API from '../../api/api_setting'
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";


const Balloon = (props) => {
    const [defibrillator, setDefibrillator] = useState({})
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem('token')

    useEffect(() => {
        const defId = props.id
        if (token) {
            API.get(`/api/get_defibrillator/${defId}`)
                .then(res => {
                    const def = res.data;
                    setDefibrillator(def);
                    setLoading(false)
                })
        } else {
            API.get(`/public_api/get_defibrillator/${defId}`)
                .then(res => {
                    const def = res.data;
                    setDefibrillator(def)
                    setLoading(false)
                })
        }

    }, [])
    if (Object.keys(defibrillator).length === 0) {
        return <LoadingSpinner/>
    } else if (token || defibrillator.status === 'need_service') {
        let electrodes_status = ""
        let battery_status = ""
        if (defibrillator.electrodes_status == 1) {
            electrodes_status = "исправны"
        } else {
            electrodes_status = "неисправны"
        }
        if (defibrillator.battery_status == 1) {
            battery_status = "исправна"
        } else {
            battery_status = "неисправна"
        }
        return (
            <div>
                <div className='card_title'>{defibrillator.defibrillator_name}</div>
                <div className='card_element_block'>
                    <div className='card_element'><img src={need_service_icon} className='card_element_icon'/>
                        <div className='text_container'>Требуется обслуживание</div>
                    </div>
                    <div className='card_element'>
                        <img src={location_icon} className='card_element_icon'/>
                        <div className='text_container'>{defibrillator.location}</div>
                    </div>
                    <div className='card_element'><img src={battery_status_icon} className='card_element_icon'/>
                        <div className='text_container'>Состояние батареи: {battery_status}</div>
                    </div>
                    <div className='card_element'><img src={electrodes_status_icon} className='card_element_icon'/>
                        <div className='text_container'>Состояние электродов: {electrodes_status}</div>
                    </div>
                    <div className='card_element'><img src={last_service_date_icon} className='card_element_icon'/>
                        <div className='text_container'>Последнее обслуживание: {defibrillator.last_service_date}</div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <div className='card_title'>{defibrillator.defibrillator_name}</div>
                <div className='card_element_block'>
                    <div className='card_element'><img src={ready_to_use_icon} className='card_element_icon'/>
                        <div className='text_container'>Готов к использованию</div>
                    </div>
                    <div className='card_element'><img src={location_icon} className='card_element_icon'/>
                        <div className='text_container'>{defibrillator.location}</div>
                    </div>
                </div>
            </div>
        );
    }

}
export default Balloon