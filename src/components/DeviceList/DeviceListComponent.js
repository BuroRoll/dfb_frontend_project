import React, {useEffect, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import {useDispatch} from 'react-redux'
import {increment} from '../../data/MarkerStore'
import name_icon from '../../static/img/name_icon.svg'
import 'rodal/lib/rodal.css';
import $api from "../../api/api_setting";
import location_icon from "../../static/img/location_icon.svg";

const DeviceListComponent = ({onClose}) => {
    const [needServiceItems, setNeedServiceItems] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        $api.get('/api/defibrillator_list/need_service')
            .then(res => {
                setNeedServiceItems(res.data)
            })
    }, [])

    const onDeviceClick = (id) => {
        dispatch(increment(id))
        onClose()
    }

    return (
        <div style={{height: '100%', overflow: 'auto', marginTop: '15px'}}>
            <List
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    '& ul': {padding: 0},
                }}
                subheader={<li/>}
            >
                {['Требуют обслуживания'].map((sectionId) => (
                    <li key={`${sectionId}`}>
                        <ul>
                            <ListSubheader style={{color: '#FF0000'}}>{`${sectionId}`}</ListSubheader>
                            {needServiceItems.map((item) => (
                                <ListItem key={`${item.id}`} onClick={() => onDeviceClick(item.id)}>
                                    <div className={'def_list'}>
                                        <div className={"def_name"}>
                                            <img src={name_icon} className={'card_element_icon'}/>
                                            <div>{item.defibrillator_name}</div>
                                        </div>
                                        <div className={"location"}>
                                            <img src={location_icon} className={'card_element_icon'}/>
                                            <div className='text_container'>{item.location}</div>
                                        </div>
                                    </div>
                                </ListItem>
                            ))}
                        </ul>
                    </li>
                ))}
            </List>
        </div>
    )
}

export default DeviceListComponent