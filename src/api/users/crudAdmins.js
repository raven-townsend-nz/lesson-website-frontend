/**
 * crudUsers.js
 *
 * API for handling user CRUD
 */
import axiosInstance from '../axios-instance'


/**
 * Upgrades a user to admin status - admin only
 * @param userId
 * @returns {Promise<any>}
 */
const upgradeUser = function (userId) {
    return axiosInstance.post(`/admin/${userId}`, "")
        .then(res => res);
}


/**
 * Downgrades an admin to user status - DGAA only
 * @param userId
 * @returns {Promise<any>}
 */
const downgradeUser = function (userId) {
    return axiosInstance.delete(`/admin/${userId}`)
        .then(res => res);
}


export default {
    upgradeUser,
    downgradeUser
};
