/**
 * StorageUtil provides controlled access to localstorge variables used
 * for storing the application state.
 */

import api from '../api/api';
import events from './events';

const CURRENT_USER_ID = "currentUserId";
const CURRENT_USER_TOKEN = "currentUserToken";
const DGAA = 'lesson.plans@17squadronatc.com';


/**
 * Reloads the user details cache. This should be called when a making a POST or PUT
 * request to ensure that the cache is in sync.
 * @param {int} userId
 * @param {string} userToken
 * @param userDetails
 */
function setUser(userId, userToken, userDetails) {
    localStorage.setItem(CURRENT_USER_ID, userId.toString());
    localStorage.setItem(CURRENT_USER_TOKEN, userToken);
    localStorage.setItem("userDetails", JSON.stringify(userDetails))
}

/**
 * Sends a request to the backend to get the latest user details of the current user. Useful if you think these details
 * may have changed
 */
function updateUser() {
    let userId = getUserId();
    let userToken = getToken();
    api.crudUsers.getUser(userId)
        .then((res) => {
            setUser(userId, userToken, res.data)
            triggerUpdatedDetailsEvent();
        }).catch(err => {console.error(err)});
}

/**
 * Return a JSON of all the user details
 * @returns {any}
 */
function getUserDetails() {
    return JSON.parse(localStorage.getItem("userDetails"))
}

/**
 * Gets the currently logged in user's ID.
 * @returns {int} The ID of the currently logged in user.
 */
function getUserId() {
    return parseInt(localStorage.getItem(CURRENT_USER_ID));
}

/**
 * Gets the currently logged in user's token.
 * @returns {string} The ID of the currently logged in user.
 */
function getToken() {
    return localStorage.getItem(CURRENT_USER_TOKEN);
}

/**
 * Deletes the current user ID from local storage
 */
function logoutUser() {
    localStorage.clear();
}

/**
 * Whether or not there is a user ID saved in local storage.
 * @returns {boolean}
 */
function isLoggedIn() {
    let userId = localStorage.getItem(CURRENT_USER_ID);
    let userToken = localStorage.getItem(CURRENT_USER_TOKEN);
    return userId !== null && userToken !== null;
}

/**
 * Returns true if the user is an admin
 */
function isAdmin() {
    let details = getUserDetails();
    return details.isAdmin === true;
}

/**
 * Triggers UPDATED_USER_DETAILS_EVENT event to notify to update fields that rely
 * on user details cache.
 */
function triggerUpdatedDetailsEvent() {
    if (isLoggedIn()) {
        const event = new Event(events.USER_UPDATED);
        window.dispatchEvent(event);
    }
}

// Exports functions that will be visible outside the module.
export default {
    setUser,
    updateUser,
    getUserId,
    getToken,
    getUserDetails,
    logoutUser,
    isLoggedIn,
    isAdmin,
    DGAA
};
