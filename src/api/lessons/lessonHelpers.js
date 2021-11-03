/**
 * lessonHelpers.js
 *
 * API for helping the lesson management
 */
import axiosInstance from '../axios-instance'

const getAllLessonsDropdownItems = function () {
    return axiosInstance.get('/lessons/allLessonsDropdownItems')
        .then(res => res);
};

const getFile = function (fileId) {
    return axiosInstance.get(`/storage/${fileId}`)
        .then(res => res);
};

const getFileNames = function (lessonId) {
    return axiosInstance.get(`/lessons/${lessonId}/files`)
        .then(res => res);
}

export default {
    getAllLessonsDropdownItems,
    getFile,
    getFileNames,
}