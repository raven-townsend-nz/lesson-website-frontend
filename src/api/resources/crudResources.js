import axiosInstance from '../axios-instance'

const getResource = function (name) {
    return axiosInstance.get('/resources/' + name)
        .then(res => res);
};


const setResource = function (name, value) {
    return axiosInstance.patch('/resources/' + name, {value: value})
        .then(res => res);
}


export default {
    getResource,
    setResource
}