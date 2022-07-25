import {createSlice} from '@reduxjs/toolkit'

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: -1,
    },
    reducers: {
        increment: (state, value) => {
            state.value = value
        },
    },
})

export const {increment} = counterSlice.actions

export default counterSlice.reducer