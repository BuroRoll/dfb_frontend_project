import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './MarkerStore'

export default configureStore({
    reducer: {
        counter: counterReducer,
    },
})