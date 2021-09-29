/**
 * crudUsers.js
 *
 * API for handling user CRUD
 */
import axiosInstance from '../axios-instance'

/**
 * Get a specific user
 * @param userId the user's ID
 * @returns {Promise<any>}
 */
const getUser = function (userId) {
    return axiosInstance.get(`/users/${userId}`)
        .then(res => res);
}

/**
 * Get all users
 * @returns {Promise<any>}
 */
const getAllUsers = function () {
    return axiosInstance.get(`/users`)
        .then(res => res);
}


/**
 * PATCH request to /users/:id to edit a user's details
 * @param userId the ID of the user
 * @param payload the request body
 * @returns {Promise<any>}
 */
const editUser = function (userId, payload) {
    return axiosInstance.patch('/users/' + userId, payload)
        .then(res => res);
}


/**
 * DELETE request to /users/:id to delete a user
 * @param userId
 * @returns {Promise<any>}
 */
const deleteUser = function (userId) {
    return axiosInstance.delete('/users/' + userId)
        .then(res => res);
};


export default {
    getUser,
    getAllUsers,
    editUser,
    deleteUser,
};
