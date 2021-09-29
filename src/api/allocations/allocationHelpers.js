/**
 * allocationHelpers.js
 *
 * API for helping allocation management
 */
import axiosInstance from '../axios-instance'

const getAllocationFiles = function (allocationId) {
    return axiosInstance.get(`/allocations/${allocationId}/files`)
        .then(res => res);
}

export default {
    getAllocationFiles,
}