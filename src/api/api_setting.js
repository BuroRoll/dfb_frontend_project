import axios from "axios";

export let API_URL = 'https://buroroll.cf'

let $api = axios.create({
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
        if (localStorage.getItem('token')) {
            config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
            return config
        }else{
            return config
        }
    },
    (error) => {
        return Promise.reject(error);
    }
)


// $api.interceptors.response.use((config) => {
//     return config
// }, (error => {
//     let originalRequest = error.config
//     if (error.response.status === 401 && error.config && !error.config._isRetry) {
//         originalRequest._isRetry = true
//         try {
//             let r = axios.get(`${API_URL}/refresh-token`, {withCredentials: true})
//             localStorage.setItem('token', r.data.token)
//             return $api.request(originalRequest)
//         }
//         catch (e) {
//             // authStore.logout()
//         }
//     }
//     throw error
// }))

export default $api
