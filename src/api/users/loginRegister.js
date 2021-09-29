/**
 * loginRegister.js
 *
 * API for handling user login and logout sessions
 *
 * Note: {withCredentials: true} is needed in the config of a axiosInstance request
 * if you want to send the JSESSIONID cookie back the the server.
 */
import axiosInstance from '../axios-instance'


/**
 * POST request to /login
 *
 * @param payload @param payload contains all the required data in order to login
 *
 * @returns {Promise<number>} the user id and token
 */
const login = function (payload) {
    return axiosInstance.post('/users/login', payload)
                        .then(res => res);
};

/**
 * Function to send a POST request to /users to register a new account
 *
 * @param payload payload contains all the required data in order to create a new user
 *
 * @return {Promise<number>} the user id and token
 */
const register = function (payload) {
    return axiosInstance.post('/users/register', payload)
                        .then(res => res);
};

/**
 * Function to send a POST request to /logout to logout a user
 *
 * @return {Promise<number>} the user id and token
 */
const logoutUser = function () {
    return axiosInstance.post("/users/logout", "", )
                 .then(res => res);
};

/**
 * Used to determine if a user is authenticated.
 * If 401 is returned the user should not have access to the page
 * they're trying to access.
 *
 * @returns @returns {Promise<boolean>}
 */
const isLoggedIn = function () {
    return axiosInstance.get("/users/loginCheck")
        .then(res => res);
};

export default {
    login,
    register,
    logoutUser,
    isLoggedIn
};
