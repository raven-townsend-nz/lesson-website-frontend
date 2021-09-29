import axiosInstance from '../axios-instance'

const sendResetEmail = function (email) {
    return axiosInstance.post('/send-reset', {"email": email})
        .then(res => res);
};

const verifyToken = function (payload) {
    return axiosInstance.post('/verify-reset-token', payload)
        .then(res => res);
};

const updatePassword = function (payload) {
    return axiosInstance.patch('/reset-password', payload)
        .then(res => res);
};

export default {
    sendResetEmail,
    verifyToken,
    updatePassword
}