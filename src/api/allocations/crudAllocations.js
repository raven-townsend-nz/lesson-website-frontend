/**
 * crudAllocations.js
 *
 * API for handling lesson allocation CRUD
 */
import axiosInstance from '../axios-instance'

const postAllocation = function (payload, confirm) {
    if (confirm) {
        return axiosInstance.post('/allocations', payload, {params: {confirm: confirm}})
            .then(res => res);
    } else {
        return axiosInstance.post('/allocations', payload)
            .then(res => res);
    }
};

const getUserAllocations = function (userId, showPast) {
    return axiosInstance.get(`/users/${userId}/allocations/`, {params: {showPast: showPast}})
        .then(res => res);
};


const getOneAllocation = function (allocationId) {
    return axiosInstance.get(`/allocations/${allocationId}`)
        .then(res => res);
}

const getAllAllocations = function (showPast) {
    return axiosInstance.get(`/allocations`, {params: {showPast}})
        .then(res => res);
};

const deleteAllocation = function (allocationId) {
    return axiosInstance.delete(`/allocations/${allocationId}`)
        .then(res => res);
}

const updateAllocation = function (allocationId, payload, confirm) {
    if (confirm) {
        return axiosInstance.patch(`/allocations/${allocationId}`, payload, {params: {confirm: confirm}})
            .then(res => res);
    } else {
        return axiosInstance.patch(`/allocations/${allocationId}`, payload)
            .then(res => res);
    }
}

const updateState = function (allocationId, state) {
    return axiosInstance.patch(`allocations/${allocationId}/state`, {state: state})
        .then(res => res);
}

const updateFeedback = function (allocationId, feedback) {
    return axiosInstance.patch(`allocations/${allocationId}/feedback`, {feedback: feedback})
        .then(res => res);
}


export default {
    postAllocation,
    getUserAllocations,
    getOneAllocation,
    getAllAllocations,
    deleteAllocation,
    updateAllocation,
    updateState,
    updateFeedback
}